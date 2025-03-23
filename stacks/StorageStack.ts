import { Bucket, StackContext } from "sst/constructs";
import s3 from "aws-cdk-lib/aws-s3";

export function StorageStack({ stack }: StackContext) {
  // Create the S3 bucket and set up notifications
  //const materialsBucket = new Bucket(stack, "MaterialsBucket", {});
  const materialsBucket = new Bucket(stack, "MaterialsBucket", {
      cdk: {
        bucket: new s3.Bucket(stack, "MaterialsBucketBucket", {
          encryption: s3.BucketEncryption.S3_MANAGED,
          publicReadAccess: false,
      })
      }
    })
    
  // Outputs
  stack.addOutputs({
    BucketName: materialsBucket.bucketName,
  });

  return { materialsBucket };
}
