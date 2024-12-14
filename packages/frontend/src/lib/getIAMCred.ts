import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";
import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";

// Returns IAM credentials for the current user
export default async function getAwsCredentials(userToken: string) {
  const region = import.meta.env.VITE_REGION;
  const identityPoolId = import.meta.env.VITE_IDENTITY_POOL_ID;
  const userPoolId = import.meta.env.VITE_USER_POOL_ID;

  const authenticator = `cognito-idp.${region}.amazonaws.com/${userPoolId}`;

  // Create a Cognito Identity client
  const identityClient = new CognitoIdentityClient({ region });

  // Use the fromCognitoIdentityPool credential provider
  const credentialsProvider = fromCognitoIdentityPool({
    //@ts-ignore
    client: identityClient,
    identityPoolId,
    logins: {
      [authenticator]: userToken,
    },
  });

  try {
    // Retrieve credentials
    const credentials = await credentialsProvider();
    return credentials;
  } catch (error) {
    console.error("Failed to retrieve AWS credentials:", error);
    throw error;
  }
}
