import React from "react";
import { Navigate } from "react-router-dom";
import { useAppContext } from "../lib/contextLib";

//Component to protect the routes (Allow only authenticated users)
const GenAppRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { userRole } = useAppContext();

  // Wait for `userRole` to initialize
  if (userRole === undefined) {
    return null; // or a loading spinner if needed
  }

  if (userRole !== "Admin" && userRole !== "User") {
    return <Navigate to="/" replace />;
  }

  // Render the children if genrator role
  return <>{children}</>;
};

export default GenAppRoute;
