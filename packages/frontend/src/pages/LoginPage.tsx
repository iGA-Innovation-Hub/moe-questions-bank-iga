import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";
import { signIn } from "aws-amplify/auth";
import { useAppContext } from "../lib/contextLib";
import { getCurrentUser } from "../lib/getToken";
import { signOut } from "aws-amplify/auth";
import { getUserAttributes } from "../lib/getUserAttributes";
import { setCookie, deleteCookie, getCookie } from "../lib/cookies";
import { IoMdLogIn } from "react-icons/io";
import { RiWindowsFill } from "react-icons/ri";
import LoginLoader from "../components/loginPageLoader";

export default function Login() {
  const [username, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { userHasAuthenticated, updateUserRole } = useAppContext();

  function validateForm() {
    return username.length > 0 && password.length > 0;
  }

  // Automatically sign out the user if they are already authenticated
  useEffect(() => {
    const handleSignOutIfAuthenticated = async () => {
      const currentUser = getCurrentUser();
      if (currentUser && getCookie("isAuthenticated")) {
        try {
          await signOut();
          userHasAuthenticated(false);
          // localStorage.removeItem("isAuthenticated");
          // localStorage.removeItem("userRole");
          deleteCookie("isAuthenticated");
          deleteCookie("userRole");
          console.log("User signed out");
        } catch (error) {
          console.error("Error during sign-out:", error);
        }
      }
    };

    handleSignOutIfAuthenticated();
  }, [userHasAuthenticated]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    try {
      await signIn({ username, password });


     const attributes: any = await getUserAttributes();
     console.log("User attributes: ", attributes);

     const role = attributes["nickname"]; // Fetch the nickname attribute
     console.log(`User nickname: ${role}`);

      // const role = userRole.role;
      // console.log(role);

      userHasAuthenticated(true);
      updateUserRole(role);

      // Persist state in localStorage
      // localStorage.setItem("isAuthenticated", "true");
      // localStorage.setItem("userRole", role);
      setCookie("isAuthenticated", "true", 1);
      setCookie("userRole", role, 1);

      navigate("/dashboard");
    } catch (error) {
      // Prints the full error
      console.error(error);
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert(String(error));
      }
    }
  }

  return (
    <div className="login-container">
      <div className="login-left">
        <div className="login-form">
          <div
          className="logo"
          ></div>
          <h2>Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <input
                type="email"
                placeholder="Email"
                value={username}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="input-group">
              <div className="password-field">
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            <div className="links">
              <a href="#">Forgot Password</a>
              <a href="#">Help Desk</a>
            </div>
            <button
              type="submit"
              className="login-button"
              style={{
                cursor:
                  !validateForm() || isLoading ? "not-allowed" : "pointer",
              }}
              disabled={!validateForm() || isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner"></span>
                </>
              ) : (
                "LOGIN"
              )}
              {!isLoading && (
                <IoMdLogIn
                  style={{
                    fontSize: "1rem",
                    marginLeft: "0.5rem",
                    marginBottom: "-0.15rem",
                  }}
                />
              )}
            </button>
          </form>
          <div className="student-teacher-login">
            <hr />

            <button className="school-login">
              {" "}
              <RiWindowsFill
                style={{
                  fontSize: "1rem",
                  marginRight: "0.5rem",
                  marginBottom: "-0.1rem",
                }}
              />{" "}
              School Account
            </button>
          </div>
        </div>
      </div>
      <div className="login-right">
        <div className="login-right-content">
          <div className="welcome-text">
            <h1>Welcome to ExGen</h1>
            <p>Modernizing Education Through Innovation And Technology</p>
            <LoginLoader />
          </div>
        </div>
      </div>
    </div>
  );
}
