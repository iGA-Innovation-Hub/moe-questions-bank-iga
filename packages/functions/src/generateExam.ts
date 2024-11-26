import {
  BedrockRuntimeClient,
  ConverseCommand,
} from "@aws-sdk/client-bedrock-runtime";
import { APIGatewayProxyEvent } from "aws-lambda";

const client = new BedrockRuntimeClient({ region: "us-east-1" });

const modelId = "anthropic.claude-3-5-sonnet-20240620-v1:0";

export async function generate(event: APIGatewayProxyEvent) {
  let data;

  //Handle empty body
  if (!event.body) {
    return {
      statusCode: 404,
      body: JSON.stringify({ error: true }),
    };
  }

  data = JSON.parse(event.body);
  console.log(event.body);

  //Retrieve the data
  const class_level = data.class;
  const subject = data.subject;
  const question_types = data.question_types;
  const duration = data.duration;
  const total_mark = data.total_mark;

  //Format the question types list
  let question_types_str = "";
  if (question_types) {
    for (let i = 0; i < question_types.length; i++) {
      question_types_str += question_types[i];
      if (i !== question_types.length - 1) {
        question_types_str += ", ";
      }
    }
  }

  //relevant_info is to be retrieved from the analyzed data
  const relevant_info = "";

  try {
    const prompt = `
      As a school exam generator and create an ${subject} exam for grade ${class_level} students. 

      These are the types of questions to include: ${question_types_str}. Make sure to include all of them.

      The exam duration should not exceed ${duration} hour.

      The exam should have a total mark of ${total_mark} that should be distributed over the entire exam according to each question's weight.

      Structure the exam appropriately where each question is correctly labeled and has its mark beside it.

      Take to consideration this relevant information: ${relevant_info}

      Make sure to return only the exam and nothing else.
    `;

    const conversation = [
      {
        role: "user",
        content: [{ text: prompt }],
      },
    ];

    const command = new ConverseCommand({
      modelId,
      messages: conversation,
      inferenceConfig: { maxTokens: 512, temperature: 0.5, topP: 0.9 },
    });

    const response = await client.send(command);

    // Extract and print the response text.
    const responseText = response.output.message.content[0].text;

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question: responseText,
        built_prompt: prompt,
      }),
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Error generating question: " + error.message,
      }),
    };
  }
}
