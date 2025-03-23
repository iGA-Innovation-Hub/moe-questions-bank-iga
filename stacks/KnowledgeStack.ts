import { StackContext} from "sst/constructs";
import s3 from "aws-cdk-lib/aws-s3";

export function KnowledgeBaseStack({ stack }: StackContext) {
  // Step 1: Create an S3 bucket for document storage
  const bucket = new s3.Bucket(stack, "KnowledgeBaseBucket", {
    cors: [
      {
        maxAge: 86400, // 1 day in seconds
        allowedOrigins: ["*"], // Allow all origins; refine as needed for security
        allowedHeaders: ["*"],
        allowedMethods: [s3.HttpMethods.GET, s3.HttpMethods.PUT, s3.HttpMethods.POST, s3.HttpMethods.DELETE],
      },
    ],
    encryption: s3.BucketEncryption.S3_MANAGED,
    publicReadAccess: false,
  });

  // Step 2: Output the bucket name for reference after deployment
  stack.addOutputs({
    KnowledgeBaseBucketName: bucket.bucketName,
    KnowledgeBaseBucketArn: bucket.bucketArn,  // Export the ARN
  });

  // Step 3: (Optional) Return the bucket for reuse in other stacks
  return { bucket };
}