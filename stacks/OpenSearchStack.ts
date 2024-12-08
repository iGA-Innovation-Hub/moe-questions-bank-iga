import { StackContext } from "sst/constructs"; // Correct import for StackContext
import { CfnAccessPolicy, CfnCollection, CfnSecurityPolicy } from "aws-cdk-lib/aws-opensearchserverless";
import * as iam from "aws-cdk-lib/aws-iam"; // Import IAM module
import { Aws } from "aws-cdk-lib"; // Import Aws class for retrieving account ID
import { Construct } from "constructs"; // Correct import for Construct

// OpenSearch Construct
export function OpenSearchConstruct(
  scope: Construct, // Correct scope type
  executorRole: iam.Role // Correct type for executorRole
) {
  const accountId = Aws.ACCOUNT_ID; // Dynamically retrieve the AWS account ID

  // Create the OpenSearch Serverless Collection
  const collection = new CfnCollection(scope, "MySearchCollection", {
    name: "my-collection",
    type: "SEARCH",
  });

  // Create a security policy for encryption
  const encPolicy = new CfnSecurityPolicy(scope, "MySecurityPolicy", {
    name: "my-collection-policy",
    policy:
      '{"Rules":[{"ResourceType":"collection","Resource":["collection/my-collection"]}],"AWSOwnedKey":true}',
    type: "encryption",
  });
  collection.addDependency(encPolicy);

  // Public access policy for the collection
  const netPolicy = new CfnSecurityPolicy(scope, "ProductNetworkPolicy", {
    name: "my-network-policy",
    policy: JSON.stringify([{
      Rules: [
        {
          ResourceType: "collection",
          Resource: ["collection/my-collection"],
        },
        {
          ResourceType: "dashboard",
          Resource: ["collection/my-collection"],
        },
      ],
      AllowFromPublic: true,
    }]),
    type: "network",
  });
  collection.addDependency(netPolicy);

  // Data access policy for collection management
  const dataAccessPolicy = new CfnAccessPolicy(scope, "MyCfnAccessPolicy", {
    name: "my-data-access-policy",
    type: "data",
    policy: JSON.stringify([{
      Rules: [
        {
          Resource: ["collection/my-collection"],
          Permission: [
            "aoss:CreateCollectionItems",
            "aoss:DeleteCollectionItems",
            "aoss:UpdateCollectionItems",
            "aoss:DescribeCollectionItems",
          ],
          ResourceType: "collection",
        },
        {
          Resource: ["index/my-collection/*"],
          Permission: [
            "aoss:CreateIndex",
            "aoss:DeleteIndex",
            "aoss:UpdateIndex",
            "aoss:DescribeIndex",
            "aoss:ReadDocument",
            "aoss:WriteDocument",
          ], // Modify based on your needs
          ResourceType: "index",
        },
      ],
      Principal: [
        `arn:aws:iam::${accountId}:role/aoss-lambda-api-executor-role`, // Correct ARN with accountId
        executorRole.roleArn, // Use executorRole ARN
      ],
    }]),
  });
  collection.addDependency(dataAccessPolicy);

  // Return the collection endpoint
  return collection.attrCollectionEndpoint;
}

// MyStack function
export function MyStack({ stack }: StackContext) {
  // Create the IAM role
  const executorRole = new iam.Role(stack, "ExecutorRole", {
    assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"), // Correct usage of IAM constructs
  });

  // Use OpenSearchConstruct in the stack
  OpenSearchConstruct(stack, executorRole);
}
