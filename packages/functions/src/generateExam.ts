import {
  SageMakerRuntimeClient,
  InvokeEndpointCommand,
} from "@aws-sdk/client-sagemaker-runtime";
import { APIGatewayProxyEvent } from "aws-lambda";

const sagemakerClient = new SageMakerRuntimeClient();

const ENDPOINT_NAME =
  "huggingface-pytorch-tgi-inference-2024-11-14-14-11-02-393"; // Replace with actual endpoint name

export async function generate(event: APIGatewayProxyEvent) {

  let data;

  if (!event.body) {
    return {
      statusCode: 404,
      body: JSON.stringify({ error: true }),
    };
  }

  data = JSON.parse(event.body);
  //====> Code to copy to another function start here
  const class_level = data.class;
  const subject = data.subject;
  const question_types = data.question_types;
  const duration = data.duration;

  let question_types_str = "";
  if (question_types) {
    for (let i = 0; i < question_types.length; i++) {
      question_types_str += question_types[i];
      if (i !== question_types.length - 1) {
        question_types_str += ", ";
      }
    }
  }

  const relevant_info = "";

  try {
    //relevant_info is to be retrieved from the analyzed data from the s3 bucket

    const prompt = `
      Act as a school exam generator and create an ${subject} exam for grade ${class_level} students. 
      Make sure to include different types of questions and a minimum of 5 questions.

      These are the types of questions to include: ${question_types_str}. Make sure to include all of them.

      The exam duration should not exceed ${duration} hour.

      Take to consideration this relevant information: ${relevant_info}
    `;

    //====> Code to copy to another function ends here

    // Generate question using SageMaker endpoint
    const response = await sagemakerClient.send(
      new InvokeEndpointCommand({
        EndpointName: ENDPOINT_NAME,
        ContentType: "application/json",
        Body: JSON.stringify({ inputs: prompt }),
      })
    );

    const result = JSON.parse(Buffer.from(response.Body).toString());
    const generatedQuestion = result[0].generated_text;

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question: generatedQuestion,
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
};
