import { StackContext, Function, use } from "sst/constructs";
import { BedrockKnowledgeBase } from "bedrock-agents-cdk";
import * as iam from "aws-cdk-lib/aws-iam";

export function BedrockKbLambdaStack({ stack }: StackContext) {
  // Use the existing S3 bucket by its ARN
  const s3BucketArn = "arn:aws:s3:::mahmood-alalwan-moe-quest-knowledgebasebucketbb918-8oxoi9dkea1c";

  // Use outputs from OpenSearchStack
  const collectionName = "collection-mahmood-alalwan";
  const collectionArn = "arn:aws:aoss:us-east-1:248189920021:collection/zen4r3cguvvahlwnvvo6";

  const bedrockKbRole = new iam.Role(stack, "bedrock-kb-role", {
    roleName: `AmazonBedrockExecutionRoleForKnowledgeBase_bkb-${stack.stage}`,
    description: "IAM role to create a Bedrock Knowledge Base",
    assumedBy: new iam.ServicePrincipal("bedrock.amazonaws.com", {
      conditions: {
        StringEquals: { "aws:SourceAccount": stack.account },
        ArnLike: { "aws:SourceArn": `arn:aws:bedrock:us-east-1:${stack.account}:knowledge-base/*` },
      },
    }),
    managedPolicies: [
      new iam.ManagedPolicy(stack, "bedrock-kb-invoke", {
        statements: [
          new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            actions: ["bedrock:InvokeModel"],
            resources: [
              "arn:aws:bedrock:us-east-1::foundation-model/amazon.titan-embed-text-v1",
            ],
          }),
        ],
      }),
      new iam.ManagedPolicy(stack, "bedrock-kb-s3-managed-policy", {
        statements: [
          new iam.PolicyStatement({
            sid: "S3ListBucketStatement",
            effect: iam.Effect.ALLOW,
            actions: ["s3:ListBucket"],
            resources: [s3BucketArn],
          }),
          new iam.PolicyStatement({
            sid: "S3GetObjectStatement",
            effect: iam.Effect.ALLOW,
            actions: ["s3:GetObject"],
            resources: [`${s3BucketArn}`],
          }),
        ],
      }),
      new iam.ManagedPolicy(stack, "bedrock-kb-opensearch-policy", {
        statements: [
          new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            actions: [
              "aoss:CreateDocument",
              "aoss:ReadDocument",
              "aoss:UpdateDocument",
              "aoss:DeleteDocument",
              "aoss:APIAccessAll",
            ],
            resources: [`${collectionArn}`],
          }),
        ],
      }),
    ],
  });

  const bedrockKb = new BedrockKnowledgeBase(stack, "bedrock-knowledge-base", {
    name: `bedrock-kb-${stack.stage}`,
    roleArn: bedrockKbRole.roleArn,
    storageConfiguration: {
      opensearchServerlessConfiguration: {
        collectionArn: collectionArn,
        vectorIndexName: "embeddings",
        fieldMapping: {
          textField: "textField",
          metadataField: "metadataField",
          vectorField: "vectorField",
        },
      },
      type: "OPENSEARCH_SERVERLESS",
    },
    dataSource: {
      dataSourceConfiguration: {
        s3Configuration: {
          bucketArn: s3BucketArn,
        },
      },
    },
  });

  stack.addOutputs({
    KnowledgeBaseId: bedrockKb.knowledgeBaseId,
    DataSourceId: bedrockKb.dataSourceId,
    S3BucketName: "mahmood-alalwan-moe-quest-knowledgebasebucketbb918-8oxoi9dkea1c",
  });
}
