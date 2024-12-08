import { SSTConfig } from "sst";
import { FrontendStack } from "./stacks/FrontendStack";
import { DBStack } from "./stacks/DBStack";
import { ApiStack } from "./stacks/ApiStack";
import { ImageBuilderForCodeCatalyst } from "./stacks/devops/ImageBuilderForCodeCatalyst";
import { OIDCForGitHubCI } from "./stacks/devops/OIDCForGitHubCI";
import { AuthStack } from "./stacks/AuthStack";
import { KnowledgeBaseStack } from "./stacks/KnowledgeStack";  
import { MyStack } from "./stacks/OpenSearchStack";       

export default {
  config(_input) {
    return {
      name: "moe-questions-bank",
      region: "us-east-1",
      // Add the account ID dynamically here
      context: {
        account: process.env.AWS_ACCOUNT_ID || "" // You can also use app.account directly if it's available
      },
    };
  },
  stacks(app) {
    // Remove all resources when non-prod stages are removed
    if (app.stage !== "prod") {
      app.setDefaultRemovalPolicy("destroy");
    }

    if (app.stage == 'devops-coca') {
      app.stack(ImageBuilderForCodeCatalyst);
    } else if (app.stage == 'devops-gh') {
      app.stack(OIDCForGitHubCI);
    } else {
      app.stack(DBStack).stack(ApiStack).stack(AuthStack).stack(KnowledgeBaseStack).stack(MyStack).stack(FrontendStack);
    }
  }
} satisfies SSTConfig;
