import React from "react";
import { useState } from "react";
import styled from "styled-components";
import invokeApig from "../lib/callAPI";
import { useAlert } from "./AlertComponent";

type ReportProps = {
  onClose: () => void; // Type for the onClose prop
};

const Report: React.FC<ReportProps> = ({ onClose }) => {
  //storing the input
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { showAlert } = useAlert();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); //prevents the page from refreshing

    if (!message) {
      return;
    }

    setLoading(true); // Start loading animation
    console.log(loading);

    //sending those data to lambda to take it to sagemaker...
    const payload = {
      message: message,
    };

    try {
      //send the form data to a server="lambda" and wait for lambda to respondz
      //@ts-ignore
      const response = await invokeApig({
        path: "/feedback",
        method: "POST",
        headers: {
          //tells the server the format of the data
          "Content-Type": "application/json",
        },
        body: payload,
      });

        showAlert({
          type: "success",
          message: "Problem Reported Successfully",
        });
      

      setMessage("");
    } catch (error) {
      console.error("Error", error);
      showAlert({
        type: "failure",
        message: "Error Reporting Problem",
      });
    } finally {
      setLoading(false); // Stop loading animation
    }
  };

  return (
    <StyledOverlay>
      <StyledWrapper>
        <div className="form-container">
          <div style={{ display: "flex" }}>
            <h3 style={{ margin: "0px", width: "60%", fontSize: "1.5rem" }}>
              Report Problem
            </h3>
            <div>
              <button className="close-btn" onClick={onClose}>
                ❌
              </button>
            </div>
          </div>

          <form className="form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="textarea">How Can We Help?</label>
              <textarea
                name="textarea"
                id="textarea"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your feedback here..."
                rows={10}
                cols={50}
                required
                defaultValue={""}
                maxLength={500}
              />
            </div>
            <button
              className="form-submit-btn"
              type="submit"
              disabled={loading || !message}
              style={{cursor: !message || loading ? "not-allowed" : "pointer"}}
            >
              {loading ? (
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span
                    style={{
                      width: "1rem",
                      height: "1rem",
                      border: "2px solid #000",
                      borderRadius: "50%",
                      borderTop: "2px solid transparent",
                      animation: "spin 1s linear infinite",
                    }}
                  />
                </span>
              ) : (
                "Submit"
              )}
            </button>
            <style>
              {`
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `}
            </style>
          </form>
        </div>
      </StyledWrapper>
    </StyledOverlay>
  );
};

const StyledOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7); /* Semi-transparent background */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const StyledWrapper = styled.div`
  position: relative;
  .form-container {
    width: 600px;
    background: rgba(3, 40, 61, 1);
    border: 2px solid transparent;
    padding: 32px 24px;
    font-size: 14px;
    font-family: inherit;
    color: white;
    display: flex;
    flex-direction: column;
    gap: 20px;
    box-sizing: border-box;
    border-radius: 16px;
    position: relative; /* Ensures close button can be positioned inside */
  }

  .close-btn {
    background: transparent;
    border: none;
    color: white;
    font-size: 15px;
    cursor: pointer;
    position: absolute;
    top: 10px;
    right: 8px; /* Aligns the button to the top-right corner */
  }

  .form-container button:active {
    scale: 0.95;
  }

  .form-container .form {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .form-container .form-group {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .form-container .form-group label {
    display: block;
    margin-bottom: 5px;
    color: #fff;
    font-weight: 500;
    font-size: 15px;
  }

  .form-container .form-group input {
    width: 100%;
    padding: 12px 16px;
    border-radius: 8px;
    color: #fff;
    font-family: inherit;
    background-color: transparent;
    border: 1px solid #414141;
  }

  .form-container .form-group textarea {
    width: 100%;
    padding: 8px 5px;
    border-radius: 8px;
    resize: none;
    color: #fff;
    height: 96px;
    border: 1px solid #414141;
    background-color: transparent;
    font-family: inherit;
  }

  .form-container .form-group textarea:focus {
    outline: none;
    border-color: #fff;
  }

  .form-container .form-submit-btn {
    display: flex;
    align-items: flex-start;
    justify-content: center;
    align-self: flex-start;
    font-family: inherit;
    color: #000;
    font-weight: 500;
    width: 20%;
    background: rgb(200, 199, 197);
    border: 1px solid #414141;
    padding: 8px 16px;
    font-size: inherit;
    gap: 8px;

    cursor: pointer;
    border-radius: 20px;
  }

  .form-container .form-submit-btn:hover {
    background: #fff;
  }

  /* Fade-in animation */
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: scale(0.95); /* Slight scale-in effect */
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
`;

export default Report;
