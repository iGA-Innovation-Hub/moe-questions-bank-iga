import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { APIGatewayProxyEvent } from "aws-lambda";
import { randomUUID } from "crypto";

const client = new DynamoDBClient({});

const dynamo = DynamoDBDocumentClient.from(client);

export async function disapprove(event: APIGatewayProxyEvent) {
  const examsTableName = process.env.EXAMS_TABLE_NAME;
  const datasetTableName = process.env.DATASET_TABLE_NAME;
  console.log("Table Name: " + process.env.EXAMS_TABLE_NAME);
  console.log("Dataset Table Name: " + datasetTableName);

  let body;
  let statusCode = 200;
  const headers = {
    "Content-Type": "application/json",
  };

  try {
    let requestJSON = JSON.parse(event.body);

    await dynamo.send(
      new UpdateCommand({
        TableName: examsTableName,
        Key: {
          examID: requestJSON.examID, // Primary key to find the item
        },
        UpdateExpression:
          "SET examState = :examState, approverMsg = :approverMsg", // Update only examState
        ExpressionAttributeValues: {
          ":examState": "disapproved",
          ":approverMsg": requestJSON.approverMsg,
        },
      })
    );


    await dynamo.send(
      new PutCommand({
        TableName: datasetTableName,
        Item: {
          examID: randomUUID(),
          examContent: requestJSON.examContent,
          examState: "approved",
          approverMsg: requestJSON.approverMsg,
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
