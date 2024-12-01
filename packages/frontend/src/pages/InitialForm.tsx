import React, { useState, useEffect } from "react";
import invokeApig from "../lib/callAPI.ts";
import { getCurrentUserEmail } from "../lib/getToken.js";
import { getFormattedDateTime } from "../lib/getDateTime.js";
import { useNavigate } from "react-router-dom";

export function InitialForm() {
  const [grade, setGrade] = useState("");
  const [subject, setSubject] = useState("");
  const [semester, setSemester] = useState("");
  const [newExam, setNewExam] = useState(true); // Track which option is selected
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [gettingExams, setGettingExams] = useState(true);
  const [gettingExamsError, setGetExamsError] = useState("");
  const [exams, setExams] = useState([]);
  const navigate = useNavigate();

  // Fetch initial data
  const fetchInitialData = async () => {
    try {
      const response = await invokeApig({
        path: `/getBuildingExams`, // Adjust path as needed
        method: "GET",
      });

      if (!response || Object.keys(response).length === 0) {
        console.log(response);
        setGetExamsError("No exams found!");
        return;
      }

      // Store the retrieved exams in the state
      setExams(response);

      console.log("Initial Data Loaded:", response);
    } catch (err: any) {
      console.error("Error fetching initial data:", err);
    } finally {
      setGettingExams(false); // Mark loading as complete
    }
  };

  useEffect(() => {
    // Add a timeout before fetching data
    const timer = setTimeout(() => {
      fetchInitialData();
    }, 2000);

    // Cleanup the timeout if the component unmounts
    return () => clearTimeout(timer);
  }, []);

  const handleSelection = (isNewExam: boolean) => {
    setNewExam(isNewExam);
  };

  const handleInitialFormSubmition = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const currentUserEmail = await getCurrentUserEmail();
      console.log("Current User Email:", currentUserEmail);

      const createDate = getFormattedDateTime();

      if (!grade || !subject || !semester) {
        setErrorMsg("Please fill the form!");
        setLoading(false);
        return;
      }

      setErrorMsg("");
      const payload = {
        class: grade,
        subject: subject,
        semester: semester,
        created_by: currentUserEmail,
        creation_date: createDate,
        contributers: [currentUserEmail],
      };

      console.log(payload);

      const response = await invokeApig({
        path: "/createNewExam",
        method: "POST",
        body: payload,
      });

      console.log("API Response:", response);

      const examID = response.exam_id;
      navigate("/dashboard/examForm/" + examID);
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrorMsg("An error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        flex: 1,
        backgroundColor: "#f9f9f9",
        padding: "2rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        overflowY: "auto", // Enables vertical scrolling if needed
        height: "100vh", // Ensures the form fits the viewport
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

      {/* Buttons for selecting exam type */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "1rem",
          marginTop: "2rem",
          marginBottom: "2rem",
        }}
      >
        {/* Create New Exam Button */}
        <div
          onClick={() => handleSelection(true)}
          style={{
            padding: "1rem 2rem",
            borderRadius: "8px",
            cursor: "pointer",
            backgroundColor: newExam ? "#4b4b4b" : "transparent", // Green if selected
            color: newExam ? "#fff" : "#000", // White text if selected
            border: newExam ? "2px solid #4b4b4b" : "2px solid #ccc",
            fontWeight: newExam ? "bold" : "normal",
            transition: "background-color 0.3s ease, border 0.3s ease",
          }}
        >
          Create New Exam
        </div>

        {/* Use Existing Exam Button */}
        <div
          onClick={() => handleSelection(false)}
          style={{
            padding: "1rem 2rem",
            borderRadius: "8px",
            cursor: "pointer",
            backgroundColor: !newExam ? "#4b4b4b" : "transparent", // Green if selected
            color: !newExam ? "#fff" : "#000", // White text if selected
            border: !newExam ? "2px solid #4b4b4b" : "2px solid #ccc",
            fontWeight: !newExam ? "bold" : "normal",
            transition: "background-color 0.3s ease, border 0.3s ease",
          }}
        >
          Use Existing Exam
        </div>
      </div>

      <span>
        <p style={{ color: "red" }}>{errorMsg}</p>
      </span>
      {newExam && (
        <form
          onSubmit={handleInitialFormSubmition}
          style={{
            width: "100%",
            maxWidth: "800px",
            backgroundColor: "#fff",
            padding: "1rem",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            fontFamily: "Arial, sans-serif",
            gap: "1rem", // Space between inputs
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: "100%",
              display: "flex",
              gap: "1rem", // Space between inputs
              alignItems: "center",
            }}
          >
            <label
              style={{
                fontSize: "16px",
                color: "#4b4b4b",
                fontWeight: "bold",
                display: "flex",
                flexDirection: "column",
                flex: 1,
              }}
            >
              Grade:
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                  fontSize: "14px",
                  marginTop: "0.5rem",
                }}
              >
                <option value="">Select Grade</option>
                <option value="Grade 10">Secondary Grade 1</option>
                <option value="Grade 11">Secondary Grade 2</option>
                <option value="Grade 12">Secondary Grade 3</option>
              </select>
            </label>

            <label
              style={{
                fontSize: "16px",
                color: "#4b4b4b",
                fontWeight: "bold",
                display: "flex",
                flexDirection: "column",
                flex: 1,
              }}
            >
              Subject:
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                  fontSize: "14px",
                  marginTop: "0.5rem",
                }}
              >
                <option value="">Select Subject</option>
                <option value="English">ENG</option>
                <option value="Science">SCI</option>
                <option value="Math">MATH</option>
              </select>
            </label>

            <label
              style={{
                fontSize: "16px",
                color: "#4b4b4b",
                fontWeight: "bold",
                display: "flex",
                flexDirection: "column",
                flex: 1,
              }}
            >
              Semester:
              <select
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                  fontSize: "14px",
                  marginTop: "0.5rem",
                }}
              >
                <option value="">Select Semester</option>
                <option value="First 2024/2025">First 2024/2025</option>
                <option value="Second 2024/2025">Second 2024/2025</option>
              </select>
            </label>
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: "#007BFF",
              color: "#fff",
              padding: "0.5rem 1rem",
              borderRadius: "4px",
              border: "none",
              fontSize: "14px",
              cursor: "pointer",
              fontWeight: "bold",
              float: "right",
              marginTop: "1rem",
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
                Loading...
              </span>
            ) : (
              "Create"
            )}
          </button>
        </form>
      )}

      {!newExam && gettingExams && <div>Loading exams...</div>}

      {!newExam && !gettingExams && !gettingExamsError && exams.length > 0 && (
        <div
          style={{
            marginTop: "2rem",
            width: "100%",
            padding: "1rem",
            backgroundColor: "#fff",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          }}
        >
          <h3>Available Exams:</h3>
          {exams.map((exam) => (
            <div
              key={exam.examID}
              onClick={() => navigate(`/dashboard/examForm/${exam.examID}`)} // Redirect to the exam form page
              style={{
                marginBottom: "1rem",
                padding: "0.5rem",
                backgroundColor: "#f2f2f2",
                borderRadius: "8px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                cursor: "pointer",
                transition: "background-color 0.3s ease",
              }}
            >
              <p style={{ flex: 1, textAlign: "left" }}>
                Creator: {exam.createdBy}
              </p>
              <p style={{ flex: 1, textAlign: "left" }}>
                Date: {exam.creationDate}
              </p>
              <p style={{ flex: 1, textAlign: "left" }}>
                Subject: {exam.examSubject}
              </p>
              <p style={{ flex: 1, textAlign: "left" }}>
                Class: {exam.examClass}
              </p>
              <p style={{ flex: 1, textAlign: "left" }}>
                Semester: {exam.examSemester}
              </p>
            </div>
          ))}
        </div>
      )}

      {!gettingExams && gettingExamsError && (
        <div
          style={{
            marginTop: "2rem",
            padding: "1rem",
            backgroundColor: "#fff",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            color: "red",
          }}
        >
          {gettingExamsError}
        </div>
      )}

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
