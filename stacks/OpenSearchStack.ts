import { StackContext, Function } from "sst/constructs"; // Import necessary constructs from SST
import { CfnAccessPolicy, CfnCollection, CfnSecurityPolicy } from "aws-cdk-lib/aws-opensearchserverless";
import * as iam from "aws-cdk-lib/aws-iam"; // Import IAM module for managing access
import { Aws } from "aws-cdk-lib"; // Import AWS class to access account and region info
import { Construct } from "constructs"; // Import Construct to define resources
import * as path from "path"; // Import path module for managing file paths

// OpenSearch Construct for creating a collection and necessary policies
export function OpenSearchConstruct(scope: Construct, executorRole: iam.Role) {
  const accountId = Aws.ACCOUNT_ID; // Dynamically retrieve AWS account ID

  // Create the OpenSearch Serverless Collection
  const collection = new CfnCollection(scope, "MySearchCollection", {
    name: "m-collection",
    type: "VECTORSEARCH",
  });

  // Create a security policy for encryption
  const encPolicy = new CfnSecurityPolicy(scope, "MySecurityPolicy", {
    name: "my-collection-policy",
    policy:
      '{"Rules":[{"ResourceType":"collection","Resource":["collection/m-collection"]}],"AWSOwnedKey":true}',
    type: "encryption",
  });
  collection.addDependency(encPolicy);

  // Public access policy for the collection
  const netPolicy = new CfnSecurityPolicy(scope, "ProductNetworkPolicy", {
    name: "my-network-policy",
    policy: JSON.stringify([
      {
        Rules: [
          {
            ResourceType: "collection",
            Resource: ["collection/m-collection"],
          },
          {
            ResourceType: "dashboard",
            Resource: ["collection/m-collection"],
          },
        ],
        AllowFromPublic: true,
      },
    ]),
    type: "network",
  });
  collection.addDependency(netPolicy);

  // Data access policy for collection management
  const dataAccessPolicy = new CfnAccessPolicy(scope, "MyCfnAccessPolicy", {
    name: "my-data-access-policy",
    type: "data",
    policy: JSON.stringify([
      {
        Rules: [
          {
            Resource: ["collection/m-collection"],
            Permission: [
              "aoss:CreateCollectionItems",
              "aoss:DeleteCollectionItems",
              "aoss:UpdateCollectionItems",
              "aoss:DescribeCollectionItems",
            ],
            ResourceType: "collection",
          },
          {
            Resource: ["index/m-collection/*"],
            Permission: [
              "aoss:CreateIndex",
              "aoss:DeleteIndex",
              "aoss:UpdateIndex",
              "aoss:DescribeIndex",
              "aoss:ReadDocument",
              "aoss:WriteDocument",
            ],
            ResourceType: "index",
          },
        ],
        Principal: [
          `arn:aws:iam::${accountId}:role/aoss-lambda-api-executor-role`, // Correct ARN with accountId
          executorRole.roleArn, // Use executorRole ARN
        ],
      },
    ]),
  });
  collection.addDependency(dataAccessPolicy);

  // Return the collection endpoint
  return collection.attrCollectionEndpoint;
}

// MyStack function to set up the IAM role, OpenSearch collection, and Lambda function
export function MyStack({ stack }: StackContext) {
  // Create the IAM role for Lambda execution
  const executorRole = new iam.Role(stack, "ExecutorRole", {
    assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
    managedPolicies: [
      iam.ManagedPolicy.fromAwsManagedPolicyName("service-role/AWSLambdaBasicExecutionRole"),
    ],
  });

  // Add permissions to the executorRole for interacting with OpenSearch Serverless
  executorRole.addToPolicy(
    new iam.PolicyStatement({
      actions: [
        "aoss:CreateIndex",
        "aoss:DescribeCollection", // Optional, for describing the collection
      ],
      resources: [
        `arn:aws:aoss:${stack.region}:${stack.account}:collection/m-collection`, // Reference the collection
        `arn:aws:aoss:${stack.region}:${stack.account}:index/m-collection/*`, // Reference any index inside the collection
      ],
    })
  );

  // Create the OpenSearch resources and get the collection endpoint
  const collectionEndpoint = OpenSearchConstruct(stack, executorRole);

  // Define the Lambda function to create the vector index
  const createIndexLambda = new Function(stack, "CreateIndexLambda", {
    handler: "packages/functions/src/create-index.handler", // Path to the handler inside your Lambda code
    environment: {
      COLLECTION_NAME: "m-collection", // Pass the collection name as an environment variable
      OPENSEARCH_ENDPOINT: collectionEndpoint, // Dynamically pass the OpenSearch endpoint
      REGION: stack.region, // Pass the AWS region as an environment variable
    },
    permissions: ["aoss:CreateIndex", "aoss:DescribeCollection"], // Grant necessary permissions for index creation
  });

  // Export the Lambda function ARN and collection endpoint for reference
  stack.addOutputs({
    CreateIndexLambdaArn: createIndexLambda.functionArn,
    OpenSearchEndpoint: collectionEndpoint, // Output the OpenSearch endpoint
  });

  return { collectionEndpoint };
}
