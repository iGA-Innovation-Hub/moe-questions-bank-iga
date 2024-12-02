import { StackContext, Bucket } from "sst/constructs";

export function KnowledgeBaseStack({ stack }: StackContext) {
  // Step 1: Create an S3 bucket for document storage
  const bucket = new Bucket(stack, "KnowledgeBaseBucket", {
    cors: [
      {
        maxAge: "1 day",
        allowedOrigins: ["*"], // Allow all origins; refine as needed for security
        allowedHeaders: ["*"],
        allowedMethods: ["GET", "PUT", "POST", "DELETE"],
      },
    ],
  });

  // Step 2: Output the bucket name for reference after deployment
  stack.addOutputs({
    KnowledgeBaseBucketName: bucket.bucketName,
  });

  // Step 3: (Optional) Return the bucket for reuse in other stacks
  return { bucket };
}