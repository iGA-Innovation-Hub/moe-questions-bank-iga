import { App, Fn } from "aws-cdk-lib";
import s3 from "aws-cdk-lib/aws-s3";
import {
  AllowedMethods,
  OriginProtocolPolicy,
  OriginSslPolicy,
  ViewerProtocolPolicy,
} from "aws-cdk-lib/aws-cloudfront";
import { HttpOrigin } from "aws-cdk-lib/aws-cloudfront-origins";

import { StaticSite, StackContext, use } from "sst/constructs";
import { ApiStack } from "./ApiStack";
import { AuthStack } from "./AuthStack";
import { StorageStack } from "./StorageStack";
import { FunctionsStack } from "./FunctionsStack";
export function FrontendStack({ stack, app }: StackContext) {

  const { api, apiCachePolicy } = use(ApiStack);
  const auth = use(AuthStack);
  const { materialsBucket } = use(StorageStack);
  const { createExamFunction } = use(FunctionsStack);
  
  // Deploy our React app
  const site = new StaticSite(stack, "ReactSite", {
    path: "packages/frontend",
    buildCommand: "npm run build",
    buildOutput: "dist",
    environment: {
      VITE_API_URL: api.url,
      VITE_REGION: app.region,
      VITE_USER_POOL_ID: auth.auth.userPoolId,
      VITE_USER_POOL_CLIENT_ID: auth.auth.userPoolClientId,
      VITE_IDENTITY_POOL_ID: auth.auth.cognitoIdentityPoolId || "",
      VITE_MATERIALS_BUCKET_NAME: materialsBucket.bucketName,
      VITE_CREATE_EXAM_FUNCTION_URL: `${site.url}/api/createNewExam`,    // I CHENGE IT FROM `${api.url}/createNewExam` || "", TO NEW ONE
    },
    cdk: {
      bucket: new s3.Bucket(stack, "StaticSite",{
        encryption: s3.BucketEncryption.S3_MANAGED,
        publicReadAccess: false,}),
      distribution: {
        additionalBehaviors: {
          "/api/*": {
            origin: new HttpOrigin(Fn.parseDomainName(api.url), {
              originSslProtocols: [OriginSslPolicy.TLS_V1_2],
              protocolPolicy: OriginProtocolPolicy.HTTPS_ONLY,
            }),
            viewerProtocolPolicy: ViewerProtocolPolicy.HTTPS_ONLY,
            cachePolicy: {
              cachePolicyId: apiCachePolicy.cachePolicyId,
            },
            allowedMethods: AllowedMethods.ALLOW_ALL,
            cachedMethods: AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
          },
        },
      },
    },
  });
  
  // Show the URLs in the output
  stack.addOutputs({
    SiteUrl: site.url,
    ApiEndpoint: api.url,
  });
}
