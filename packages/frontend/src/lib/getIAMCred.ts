import AWS from "aws-sdk";


//Returns IAM cred for the current user
export default function getAwsCredentials(userToken:any) {
  const authenticator = `cognito-idp.${
    import.meta.env.VITE_REGION
  }.amazonaws.com/${import.meta.env.VITE_USER_POOL_ID}`;

  AWS.config.update({ region: import.meta.env.VITE_REGION });

  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: import.meta.env.VITE_IDENTITY_POOL_ID,
    Logins: {
      [authenticator]: userToken,
    },
  });

  return (
    AWS.config.credentials as AWS.CognitoIdentityCredentials
  ).getPromise();

}
