import { APIGatewayProxyEvent } from "aws-lambda";

const { DynamoDBDocument } = require("@aws-sdk/lib-dynamodb");
const { DynamoDB } = require("@aws-sdk/client-dynamodb");

const dynamodb = DynamoDBDocument.from(new DynamoDB());

export async function getExams(event: APIGatewayProxyEvent) {
  const tableName = process.env.TABLE_NAME;
  console.log("Table Name: " + process.env.TABLE_NAME);

  let body;
  let statusCode = 200;
  const headers = {
    "Content-Type": "application/json",
  };

  try {
    console.log(event.queryStringParameters);
    const queryParams = event.queryStringParameters || {};
    const examState = queryParams.state;
    console.log(examState);

      const params = {
        TableName: tableName,
        IndexName: "examStateIndex",
        KeyConditionExpression: "examState = :state",
        ExpressionAttributeValues: {
          ":state": examState,
        },
      };
      
    body = await dynamodb.query(params);
    console.log(body);
  } catch (error) {
    console.error("Error querying exams:", error);
    statusCode = 400;
  } finally {
    body = JSON.stringify(body.Items);
  }

  return {
    statusCode,
    body,
    headers,
  };
}
