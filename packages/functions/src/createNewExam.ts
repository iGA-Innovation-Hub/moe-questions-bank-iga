import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { APIGatewayProxyEvent } from "aws-lambda";
import { v4 as uuidv4 } from "uuid";

const client = new DynamoDBClient({});

const dynamo = DynamoDBDocumentClient.from(client);

export async function createExam(event: APIGatewayProxyEvent) {
  const tableName = process.env.TABLE_NAME;
  console.log("Table Name: " + process.env.TABLE_NAME);

  let body;
  let statusCode = 200;
  const headers = {
    "Content-Type": "application/json",
  };

  try {
    let requestJSON = JSON.parse(event.body);

    const uuid = uuidv4();

    await dynamo.send(
      new PutCommand({
        TableName: tableName,
        Item: {
          examID: uuid,
          examState: "building",
          examClass: requestJSON.class,
          examSubject: requestJSON.subject,
          examSemester: requestJSON.semester,
          createdBy: requestJSON.created_by,
          creationDate: requestJSON.creation_date,
          contributers: requestJSON.contributers,
          examContent: "",
          numOfRegenerations: 0,
        },
      })
    );
      
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
