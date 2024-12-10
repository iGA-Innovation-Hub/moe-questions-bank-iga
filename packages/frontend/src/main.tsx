// Import React, which is used to build user interfaces.
import React from 'react';
//tool that connects app to the web page
import ReactDOM from 'react-dom/client';
// Import the main App component that contains your application.
import App from './App';
import './index.css';
import { Amplify } from "aws-amplify";
import config from "./config.ts";

//Configuring Amplify
Amplify.configure({
  Auth: {
    Cognito: {
      // @ts-ignore
      region: config.cognito.REGION,
      userPoolId: config.cognito.USER_POOL_ID,
      identityPoolId: config.cognito.IDENTITY_POOL_ID,
      userPoolClientId: config.cognito.APP_CLIENT_ID,
      loginWith: {
        email: true,
      }, // Avoid errors caused by undefined `loginWith`
    },
  },
  API: {
    // @ts-ignore
    endpoints: [
      {
        name: "Api",
        endpoint: config.apiGateway.URL,
        region: config.apiGateway.REGION,
      },
    ],
  },
  Storage: {
    S3: {
      bucket: config.s3.BUCKET, // Your bucket name
      region: config.s3.REGION, // Bucket region
    },
  },
});

// console.log(Amplify.getConfig())


// Render the App component inside the HTML element with ID "root".
//This connects the React app (App component) to the <div id="root"> element in the index.html file.=Where on the webpage should I put my app
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
 