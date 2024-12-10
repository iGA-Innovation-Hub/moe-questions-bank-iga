import {
  DynamoDBClient
} from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { APIGatewayProxyEvent } from "aws-lambda";
import { v4 as uuidv4 } from "uuid";
import {
  BedrockRuntimeClient,
  ConverseCommand,
} from "@aws-sdk/client-bedrock-runtime";
import {
  BedrockAgentRuntimeClient,
  RetrieveCommand,
} from "@aws-sdk/client-bedrock-agent-runtime";
import { ENG102PROMPT } from "./prompts/Eng102";


const client = new DynamoDBClient({
  region: "us-east-1",
  maxAttempts: 5,
});

const dynamo = DynamoDBDocumentClient.from(client);

const bedrockClient = new BedrockRuntimeClient({ region: "us-east-1" });

const modelId = "anthropic.claude-3-5-sonnet-20240620-v1:0";

export async function createExam(event: APIGatewayProxyEvent) {
  if (!client || !dynamo) { 
    console.log("Error with dynamo")
  }
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
  
  const bedrockAgentClient = new BedrockAgentRuntimeClient({ region: "us-east-1" });
  let retrieveCommand = new RetrieveCommand({
    knowledgeBaseId: "EU3Z7J6SG6",
    retrievalConfiguration: {
      vectorSearchConfiguration: {
        numberOfResults: 10,
      },
    },
    retrievalQuery: {
      text: "ENG102 questions",
    },
  });

  if (!data.customize) {
    const relevant_info = (await bedrockAgentClient.send(retrieveCommand)).retrievalResults?.map(e => e.content?.text).join("\n").toString();
    prompt = ENG102PROMPT;
  } else {
    prompt = `
        Act as a school exam generator and create an exam for grade ${data.class} ${data.subject} students.
        The exam should have only the following :
      `;
    // Dynamically build the prompt for each question type
    Object.entries(data.question_types).forEach(([type, count]) => {
      //@ts-ignore
      if (count > 0) {
        //@ts-ignore
        prompt += `include ${count} ${type} question${count > 1 ? "s" : ""}, `;
      }
    });
    retrieveCommand.input.retrievalQuery = {
      text: `grade ${data.class} ${data.subject} questions ${Object.entries(data.question_types).map(([type, count]) => `${count} ${type}`).join(", ")}`,
    };
    // console.log(retrieveCommand);
    const relevant_info = (await bedrockAgentClient.send(retrieveCommand)).retrievalResults?.map(e => e.content?.text).join("\n").toString();
    prompt += `
        The total duration of the exam should not exceed ${data.duration} hours with total ${data.total_mark} marks.
        Take to consideration this relevant information from past exams: ${relevant_info}
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
      //@ts-ignore
      messages: conversation,
      inferenceConfig: { maxTokens: 1200, temperature: 0.5, topP: 0.9 },
    });

    console.log("Prompt built");

    const response = await bedrockClient.send(command);

    // Extract and print the response text.
    //@ts-ignore
    const responseText = response.output.message.content[0].text;

    console.log("Model done");
    //@ts-ignore
    console.log("ResponseText size:", Buffer.byteLength(responseText, "utf-8"));

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

    console.log("Put done")

    body = { exam_id: uuid };
  } catch (error: any) {
    statusCode = 400;
    body = error.message;
    console.log(error.message)
  } finally {
    body = JSON.stringify(body);
  }

  return {
    statusCode,
    body,
    headers,
  };
}
