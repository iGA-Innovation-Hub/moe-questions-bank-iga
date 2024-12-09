import S3 from "aws-sdk/clients/s3";
import { randomUUID } from "crypto";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

const s3 = new S3({
  apiVersion: "2006-03-01",
  region: process.env.AWS_REGION,
  signatureVersion: "v4",
});

export async function getSignedUrl(event: APIGatewayProxyEvent) {
  try {
    const queryParams = event.queryStringParameters || {};
    const fileType = queryParams.fileType; // MIME type
    const extension = queryParams.extension;
    if (!extension || !fileType) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "File extension is required" }),
      };
    }

    const Key = `${randomUUID()}.${extension}`;

    console.log(queryParams);

    const s3Params = {
      Bucket: process.env.BUCKET_NAME,
      Key,
      Expires: 60, // URL expiration time in seconds
      ContentType: fileType,
    };

    const uploadUrl = await s3.getSignedUrlPromise("putObject", s3Params);

    return {
      statusCode: 200,
      body: JSON.stringify({ uploadUrl, key: Key }),
    };
  } catch (error) {
    console.error("Error generating signed URL:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to generate signed URL" }),
    };
  }
}
