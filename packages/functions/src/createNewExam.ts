import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { APIGatewayProxyEvent } from "aws-lambda";
import { v4 as uuidv4 } from "uuid";
import {
  BedrockRuntimeClient,
  ConverseCommand,
} from "@aws-sdk/client-bedrock-runtime";

const client = new DynamoDBClient({});

const dynamo = DynamoDBDocumentClient.from(client);

const bedrockClient = new BedrockRuntimeClient({ region: "us-east-1" });

const modelId = "anthropic.claude-3-5-sonnet-20240620-v1:0";

export async function createExam(event: APIGatewayProxyEvent) {
  const tableName = process.env.TABLE_NAME;
  console.log("Table Name: " + process.env.TABLE_NAME);

  //Handle empty body
  if (!event.body) {
    return {
      statusCode: 404,
      body: JSON.stringify({ error: true }),
    };
  }

  let data = JSON.parse(event.body);

  let body;
  let statusCode = 200;
  const headers = {
    "Content-Type": "application/json",
  };

  let prompt = "";
  const relevant_info = "";

  if (data.like_previous_exams) {
    prompt = `
        Act as a school exam generator and create an exam for ENG102 students. The exam should have the following structure:

        Listening Section (Total: 10 marks)
          Generate Listening script put it at appendix
          Question 1: A True or False question worth 5 marks.
          Question 2: A Match the Statements question worth 5 marks.

        Reading Section (Total: 20 marks)
          Part 1:
            provide an article.
            Include two sub-questions:
              a. Match the paragraphs with headings (5 marks).
              b. Short questions and answers (5 marks).
          Part 2:
            provide another article.
            Include two sub-questions:
              a. True or False (5 marks).
              b. Match words with their definitions (5 marks).

          Writing Section (Total: 20 marks)
            Question 1: A writing task worth 10 marks.
            Question 2: Another writing task worth 10 marks.

          The total duration of the exam should not exceed 2 hours.
          Take to consideration this relevant information: ${relevant_info}
      `;
  } else {
    prompt = `
        Act as a school exam generator and create an exam for grade ${data.class} ${data.subject} students. 
        The exam should have only the following :   
      `;
    // Dynamically build the prompt for each question type
    Object.entries(data.question_types).forEach(([type, count]) => {
      if (count > 0) {
        prompt += `include ${count} ${type} question${count > 1 ? "s" : ""}, `;
      }
    });
    prompt += `
        The total duration of the exam should not exceed ${data.duration} hours with total ${data.total_mark} marks.
        Take to consideration this relevant information: ${relevant_info}
      `;
  }

  try {
    const conversation = [
      {
        role: "user",
        content: [{ text: prompt }],
      },
    ];

    const command = new ConverseCommand({
      modelId,
      messages: conversation,
      inferenceConfig: { maxTokens: 1200, temperature: 0.5, topP: 0.9 },
    });

    const response = await bedrockClient.send(command);

    // Extract and print the response text.
    const responseText = response.output.message.content[0].text;

      console.log(responseText)
      console.log(
        "ResponseText size:",
        Buffer.byteLength(responseText, "utf-8")
      );


    const uuid = uuidv4();
      if (responseText) {
          await dynamo.send(
              new PutCommand({
                  TableName: tableName,
                  Item: {
                      examID: uuid,
                      examState: "building",
                      examClass: data.class,
                      examSubject: data.subject,
                      examSemester: data.semester,
                      examDuration: data.duration,
                      examMark: data.total_mark,
                      examContent: responseText,
                      createdBy: data.created_by,
                      creationDate: data.creation_date,
                      contributers: data.contributers,
                      numOfRegenerations: 0,
                  },
              })
          );
      }

    body = { exam_id: uuid };
  } catch (error: any) {
    statusCode = 400;
    body = error.message;
  } finally {
    body = JSON.stringify(body);
  }

  return {
    statusCode,
    body,
    headers,
  };
}
