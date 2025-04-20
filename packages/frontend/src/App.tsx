import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/LoginPage";
import ExamForm from "./pages/ExamForm";
import { AppContext, AppContextType } from "./lib/contextLib";
import "@aws-amplify/ui-react/styles.css";
import AuthRoute from "./components/AuthRoute";
import { InitialForm } from "./pages/InitialForm";
import AlreadyAuthRoute from "./components/AlreadyAuthRoute";
import GeneratorRoute from "./components/generatorRoutes";
import ApproverRoute from "./components/ApproverRoute";
import ExamApproval from "./pages/ExamApproval";
import NotFound from "./pages/NotFound";
import ViewExam from "./pages/ViewExam";
import {
  AlertProvider,
  Notification,
  ConfirmAction,
} from "./components/AlertComponent";
import UploadPage from "./pages/UploadPage";
import DefaultRouting from "./components/UserDefaultComponent";
import AudioScriptForm from "./pages/AudioPage";
import { getCookie, setCookie } from "./lib/cookies";

// ✅ Amplify setup
import { Amplify, Auth } from "aws-amplify";

Amplify.configure({
  Auth: {
    region: import.meta.env.VITE_REGION,
    userPoolId: import.meta.env.VITE_USER_POOL_ID,
    userPoolWebClientId: import.meta.env.VITE_USER_POOL_CLIENT_ID,
    identityPoolId: import.meta.env.VITE_IDENTITY_POOL_ID,
  },
});

const App: React.FC = () => {
  const [isAuthenticated, setAuthenticated] = useState<boolean>(
    getCookie("isAuthenticated") === "true"
  );
  const [userRole, setUserRole] = useState<string>(getCookie("userRole") || "");

  // 🔁 Check session & detect group
  useEffect(() => {
    async function detectUserGroup() {
      try {
        const session = await Auth.currentSession();
        const idToken = session.getIdToken();
        const groups = idToken.payload["cognito:groups"] || [];

        if (groups.includes("Admins")) {
          setUserRole("admin");
        } else if (groups.includes("Users")) {
          setUserRole("user");
        } else {
          setUserRole("unknown");
        }

        setAuthenticated(true);
      } catch (e) {
        console.log("User not authenticated:", e);
        setAuthenticated(false);
        setUserRole("");
      }
    }

    detectUserGroup();
  }, []);

  // Persist auth state in cookies
  useEffect(() => {
    setCookie("isAuthenticated", String(isAuthenticated), 1);
    setCookie("userRole", userRole, 1);
  }, [isAuthenticated, userRole]);

  const appContextValue: AppContextType = {
    isAuthenticated,
    userHasAuthenticated: setAuthenticated,
    userRole,
    updateUserRole: setUserRole,
  };

  return (
    <AppContext.Provider value={appContextValue}>
      <AlertProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route
              path="/login"
              element={
                <AlreadyAuthRoute>
                  <Login />
                </AlreadyAuthRoute>
              }
            />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <AuthRoute>
                  <Dashboard />
                </AuthRoute>
              }
            >
              {/* Nested Routes */}
              <Route index element={<div></div>} />
              <Route
                path="examForm"
                element={
                  <GeneratorRoute>
                    <InitialForm />
                  </GeneratorRoute>
                }
              />
              <Route
                path="upload"
                element={
                  <GeneratorRoute>
                    <UploadPage />
                  </GeneratorRoute>
                }
              />
              <Route path="examForm/:id" element={<ExamForm />} />
              <Route path="viewExam/:id" element={<ViewExam />} />
              <Route
                path="audiopPage"
                element={
                  <GeneratorRoute>
                    <AudioScriptForm />
                  </GeneratorRoute>
                }
              />
              <Route
                path="approveExam"
                element={
                  <ApproverRoute>
                    <ExamApproval />
                  </ApproverRoute>
                }
              />
            </Route>

            {/* Default redirect */}
            <Route path="/" element={<DefaultRouting />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
        <Notification />
        <ConfirmAction />
      </AlertProvider>
    </AppContext.Provider>
  );
};

export default App;
