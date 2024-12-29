import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { APIGatewayProxyEvent } from "aws-lambda";
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";

const client = new DynamoDBClient({});

const dynamo = DynamoDBDocumentClient.from(client);

const snsClient = new SNSClient({ region: process.env.AWS_REGION });

export async function sendForApproval(event: APIGatewayProxyEvent) {
  const tableName = process.env.TABLE_NAME;
  console.log("Table Name: " + process.env.TABLE_NAME);
  
  const topicArn = process.env.TOPIC_ARN;
  console.log("topicArn: " + topicArn);

  let body;
  let statusCode = 200;
  const headers = {
    "Content-Type": "application/json",
  };

  try {
    //@ts-ignore
    let requestJSON = JSON.parse(event.body);
    await snsClient.send(
      new PublishCommand({
        TopicArn: topicArn,
        Message: "There is an exam waiting for approval. Go to the system and check it.",
        Subject: "New Exam To Approve!",
        MessageAttributes: {
          role: {
            DataType: "String",
            StringValue: "admin",
          },
        },
      })
    );

    await dynamo.send(
      new UpdateCommand({
        TableName: tableName,
        Key: {
          examID: requestJSON.examID, // Primary key to find the item
        },
        UpdateExpression: "SET examState = :examState", // Update only examState
        ExpressionAttributeValues: {
          ":examState": "pending", // New value for examState
        },
      })
    );

    body = { exam_id: requestJSON.examID };
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
