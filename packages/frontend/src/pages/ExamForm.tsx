import React, { useState, useEffect } from "react";
import invokeApig from "../lib/callAPI.ts";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

//storing user input
const ExamForm: React.FC = () => {
  //store the input
  const [grade, setGrade] = useState("");
  const [subject, setSubject] = useState("");
  const [duration, setDuration] = useState("");
  const [totalMark, setMark] = useState("");
  const [semester, setSemester] = useState("");
  const [createdBy, setCreator] = useState("");
  const [creationDate, setDate] = useState("");
  const [contributers, setContributers] = useState("");
  const [responseResult, setResponseResult] = useState<string>(""); // State to store the API response
  const [loading, setLoading] = useState(false);
  const [loadingPage, setLoadingPage] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [feedback, setFeedback] = useState("");
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();


  // Fetch initial data
  const fetchInitialData = async () => {
    try {
      const response = await invokeApig({
        path: `/examForm/${id}`, // Adjust path as needed
        method: "GET",
      });

      if (!response || Object.keys(response).length === 0) {
        console.log(response)
        setErrorMsg("Error getting exam data!");
        return
      }

      console.log("Initial Data Loaded:", response);
      setGrade(response.examClass);
      setSubject(response.examSubject);
      setSemester(response.examSemester);
      setCreator(response.createdBy);
      setDate(response.creationDate);
      setContributers(String(response.contributers));

    } catch (err: any) {
      console.error("Error fetching initial data:", err);
    } finally {
      setLoadingPage(false); // Mark loading as complete
    }
  };

  useEffect(() => {
    // Add a timeout before fetching data
    const timer = setTimeout(() => {
      fetchInitialData();
    }, 2000); // 3000ms = 3 seconds delay

    // Cleanup the timeout if the component unmounts
    return () => clearTimeout(timer);
  }, [id]);


  const sendFeedback = async (e: React.MouseEvent) => {
   const payload = {
      examID: id,
      examContent: responseResult,
    };

    console.log(payload);
  };

  const sendForApproval = async (e: React.MouseEvent) => {
    alert("Sent for approval!")
  }

  const sendForEvaluation = async (e: React.MouseEvent) => {
    alert("Sent for evaluation!");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); //prevents the page from refreshing when submit the form cuse When you submit a form in React, the browser automatically reloads the page unless you stop it

    setLoading(true); // Start loading animation

    const payload = {
      class: grade,
      subject: subject,
      duration: duration,
      total_mark: totalMark,
    };

    console.log("Submitting exam data to the model:", payload);

    try {
      const response = await invokeApig({
        path: "/generate",
        method: "POST",
        body: payload,
      });

      console.log("API Response:", response);
      setResponseResult(response.question);
    } catch (error) {
      console.error("Error generating exam:", error);
      alert("Failed to generate exam. Please try again.");
      setResponseResult("Error generating exam. Please try again."); // Show error in the textarea
    } finally {
      setLoading(false); // Stop loading animation
    }
  };

  // Show loading state
  if (loadingPage) {
    return <div>Loading...</div>;
  }

   if (errorMsg) {
     return <div>{errorMsg}</div>;
   }


  return (
    <div
      style={{
        flex: 1,
        backgroundColor: "#f9f9f9",
        padding: "2rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        overflowY: "auto",
        height: "100vh",
      }}
    >
      <h2
        style={{
          fontFamily: "Georgia, serif",
          color: "#333",
          marginBottom: "1rem",
          fontSize: "28px",
        }}
      >
        Generate Exam
      </h2>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between", // Align buttons to opposite sides
          gap: "1rem", // Adds space between buttons
          width: "100%",
          maxWidth: "900px",
          padding: "1rem 0",
        }}
      >
        <button
          onClick={sendForApproval}
          style={{
            padding: "0.5rem 1rem", // Smaller padding for a smaller button
            backgroundColor: "#2196F3", // Blue color for 'Send For Approval'
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            fontSize: "14px", // Smaller font size
            fontWeight: "bold",
            cursor: "pointer",
            transition: "background-color 0.3s ease, transform 0.3s ease",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            width: "auto", // Auto width to fit text
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#1976D2")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#2196F3")}
          onMouseDown={(e) => (e.target.style.transform = "scale(0.98)")}
          onMouseUp={(e) => (e.target.style.transform = "scale(1)")}
        >
          Send For Approval
        </button>
        <button
          onClick={sendForEvaluation}
          style={{
            padding: "0.5rem 1rem", // Smaller padding for a smaller button
            backgroundColor: "#4CAF50", // Green color for 'Evaluate'
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            fontSize: "14px", // Smaller font size
            fontWeight: "bold",
            cursor: "pointer",
            transition: "background-color 0.3s ease, transform 0.3s ease",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            width: "auto", // Auto width to fit text
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#45a049")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#4CAF50")}
          onMouseDown={(e) => (e.target.style.transform = "scale(0.98)")}
          onMouseUp={(e) => (e.target.style.transform = "scale(1)")}
        >
          Send For Evaluation
        </button>
      </div>

      <div
        style={{
          width: "900px",
          fontSize: "14px",
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "1rem",
          padding: "1rem",
          backgroundColor: "#fff",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          color: "#333",
        }}
      >
        <div style={{ flex: 1, textAlign: "left", paddingRight: "1rem" }}>
          <strong>Creation Date:</strong> {creationDate}
        </div>
        <div style={{ flex: 1, textAlign: "center", paddingRight: "1rem" }}>
          <strong>Created By:</strong> {createdBy}
        </div>
        <div
          style={{
            flex: 1,
            textAlign: "right",
            overflowX: "auto", // Enables horizontal scrolling
            whiteSpace: "nowrap", // Prevents text wrapping
            paddingRight: "1rem",
          }}
        >
          <strong>Contributors: </strong>
          <div
            style={{
              display: "inline-block",
              maxWidth: "100%",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis", // Adds ellipsis when content overflows
            }}
          >
            {contributers}
          </div>
        </div>
      </div>

      {/* Top Horizontal Form */}
      <form style={{ width: "100%" }} onSubmit={handleSubmit}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            // width: "100%",
            maxWidth: "900px",
            marginBottom: "1rem",
            padding: "1rem",
            backgroundColor: "#fff",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            margin: "0 auto",
          }}
        >
          {/* Read-only fields */}
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <input
              type="text"
              value={grade}
              readOnly
              style={{
                width: "120px",
                padding: "0.5rem",
                borderRadius: "4px",
                border: "1px solid #ccc",
                fontSize: "14px",
                backgroundColor: "#f3f3f3",
              }}
            />
            <input
              type="text"
              value={subject}
              readOnly
              style={{
                width: "120px",
                padding: "0.5rem",
                borderRadius: "4px",
                border: "1px solid #ccc",
                fontSize: "14px",
                backgroundColor: "#f3f3f3",
              }}
            />
            <input
              type="text"
              value={semester}
              readOnly
              style={{
                width: "160px",
                padding: "0.5rem",
                borderRadius: "4px",
                border: "1px solid #ccc",
                fontSize: "14px",
                backgroundColor: "#f3f3f3",
              }}
            />
          </div>

          {/* Editable fields */}
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <input
              type="number"
              min={1}
              max={3}
              placeholder="Duration (hours)"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              required
              style={{
                width: "120px",
                padding: "0.5rem",
                borderRadius: "4px",
                border: "1px solid #ccc",
                fontSize: "14px",
              }}
            />
            <input
              type="number"
              min={10}
              max={100}
              placeholder="Total Marks"
              value={totalMark}
              onChange={(e) => setMark(e.target.value)}
              required
              style={{
                width: "100px",
                padding: "0.5rem",
                borderRadius: "4px",
                border: "1px solid #ccc",
                fontSize: "14px",
              }}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#4b4b4b",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              fontSize: "14px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
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
                    border: "2px solid #fff",
                    borderRadius: "50%",
                    borderTop: "2px solid transparent",
                    animation: "spin 1s linear infinite",
                  }}
                />
                generating
              </span>
            ) : (
              "Generate"
            )}
          </button>
        </div>
      </form>

      {/* Text Area for Generated Exam */}
      <div
        style={{
          marginTop: "1rem",
          width: "100%",
          maxWidth: "900px",
        }}
      >
        <textarea
          value={responseResult}
          readOnly
          style={{
            width: "100%",
            height: "400px",
            padding: "1rem",
            borderRadius: "8px",
            border: "1px solid #ccc",
            fontSize: "14px",
            resize: "none",
            backgroundColor: "#fff",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          }}
        />
      </div>

      <div
        style={{
          width: "100%",
          maxWidth: "900px",
          marginTop: "1.5rem",
          padding: "1rem",
          backgroundColor: "#fff",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <label
          style={{
            display: "block",
            fontSize: "14px",
            fontWeight: "bold",
            marginBottom: "0.5rem",
            color: "#333",
          }}
        >
          Feedback:
        </label>
        <input
          type="text"
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Provide feedback..."
          style={{
            width: "100%",
            padding: "0.75rem",
            borderRadius: "4px",
            border: "1px solid #ccc",
            fontSize: "14px",
            marginBottom: "1rem",
            boxSizing: "border-box", // ensures padding doesn't affect width
          }}
        />
        <button
          onClick={sendFeedback}
          disabled={loading}
          style={{
            padding: "0.75rem 1.5rem",
            backgroundColor: "#4b4b4b",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            fontSize: "14px",
            fontWeight: "bold",
            cursor: "pointer",
            width: "100%",
            boxSizing: "border-box", // ensures button width is consistent
            transition: "background-color 0.3s",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#333")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#4b4b4b")}
        >
          {loading ? "Regenerating..." : "Regenerate"}
        </button>
      </div>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );


}
  

export default ExamForm;
