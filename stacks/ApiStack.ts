import { Api, StackContext, use, Topic } from "sst/constructs";
import { CacheHeaderBehavior, CachePolicy } from "aws-cdk-lib/aws-cloudfront";
import { Duration } from "aws-cdk-lib/core";
import { MyStack } from "./OpenSearchStack"; // Import the OpenSearch stack

export function ApiStack({ stack }: StackContext) {
  const { collectionEndpoint } = use(MyStack); // Retrieve the OpenSearch endpoint

  const topic = new Topic(stack, "Report");

  // Create the HTTP API
  const api = new Api(stack, "Api", {
    defaults: {
      authorizer: "iam",
    },
    routes: {
      // Existing routes
      "POST /generate": {
        function: {
          handler: "packages/functions/src/generateExam.generate",
          runtime: "nodejs20.x",
          timeout: "180 seconds",
          permissions: ["bedrock"],
        },
      },

      "POST /feedback": {
        function: {
          handler: "packages/functions/src/feedback.handler",
          runtime: "nodejs20.x",
          timeout: "180 seconds",
          environment: {
            TOPIC_ARN: topic.topicArn,
          },
          permissions: ["sns"],
        },
      },

      // New route for creating an OpenSearch index
      "POST /create-index": {
        function: {
          handler: "packages/functions/src/create-index.handler",
          runtime: "nodejs20.x",
          timeout: "60 seconds",
          environment: {
            OPENSEARCH_ENDPOINT: collectionEndpoint, // Use the dynamic endpoint
          },
          permissions: [
            "aoss:CreateIndex", 
            "aoss:DescribeIndex", 
            "aoss:ListIndices",  // Optional: If you want to list indices
          ],
        },
      },
    },
  });

  // Cache policy for CloudFront as reverse proxy
  const apiCachePolicy = new CachePolicy(stack, "CachePolicy", {
    minTtl: Duration.seconds(0),
    defaultTtl: Duration.seconds(0),
    headerBehavior: CacheHeaderBehavior.allowList(
      "Accept",
      "Authorization",
      "Content-Type",
      "Referer"
    ),
  });

  return { api, apiCachePolicy };
}
