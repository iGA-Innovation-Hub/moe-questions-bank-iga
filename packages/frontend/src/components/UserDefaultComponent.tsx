import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../lib/contextLib";

const DefaultRouting: React.FC = () => {
  const { userRole } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    switch (userRole) {
      case "Admin":
        navigate("/dashboard");
        break;
      case "User":
        navigate("/dashboard");
        break;
      default:
        navigate("/login");
        break;
    }
  }, [userRole, navigate]); // Ensure dependency array includes all dependencies

  return null; // This component does not render any UI
};

export default DefaultRouting;
