import React from "react";
import { Navigate } from "react-router-dom";
import { useAppContext } from "../lib/contextLib";


//Component to protect the routes (Allow only authenticated users)
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated } = useAppContext();

  if (!isAuthenticated) {
      // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }
    

  // Render the children if authenticated
  return <>{children}</>;
};

export default ProtectedRoute;
