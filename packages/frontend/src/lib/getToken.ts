import {
  CognitoUserPool,
} from "amazon-cognito-identity-js";

//Returns the current logged in user tokens
export function getUserToken(currentUser:any) {
  return new Promise((resolve, reject) => {
    currentUser.getSession((err:any, session:any) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(session.getIdToken().getJwtToken());
    });
  });
}

//Returns the current logged in user
export default function getCurrentUser() {
  const userPool = new CognitoUserPool({
    UserPoolId: import.meta.env.VITE_USER_POOL_ID,
    ClientId: import.meta.env.VITE_USER_POOL_CLIENT_ID,
  });

  return userPool.getCurrentUser();
}
