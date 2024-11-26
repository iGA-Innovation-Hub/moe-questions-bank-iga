import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";
import { APIGatewayProxyEvent } from "aws-lambda";


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

    const invokeModel = async (
      full_prompt,
      modelId = "amazon.titan-text-premier-v1:0"
    ) => {
      // Create a new Bedrock Runtime client instance.
      const client = new BedrockRuntimeClient({ region: "us-east-1" });

      // Prepare the payload for the model.
      const payload = {
        inputText: full_prompt,
        textGenerationConfig: {
          maxTokenCount: 3072,
          stopSequences: [],
          temperature: 0,
          topP: 1,
        },
      };

      // Invoke the model with the payload and wait for the response.
      const command = new InvokeModelCommand({
        contentType: "application/json",
        body: JSON.stringify(payload),
        modelId,
      });
      const apiResponse = await client.send(command);

      // Decode and return the response.
      const decodedResponseBody = new TextDecoder().decode(apiResponse.body);
      const responseBody = JSON.parse(decodedResponseBody);
      return responseBody.results[0].outputText;
    };

    const model_response = await invokeModel(prompt)

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question: model_response,
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
