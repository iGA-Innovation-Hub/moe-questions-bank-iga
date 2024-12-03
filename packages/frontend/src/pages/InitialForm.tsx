import React, { useState, useEffect } from "react";
import invokeApig from "../lib/callAPI.ts";
import { getCurrentUserEmail } from "../lib/getToken.js";
import { getFormattedDateTime } from "../lib/getDateTime.js";
import { useNavigate } from "react-router-dom";

export function InitialForm() {
  const [grade, setGrade] = useState("Grade 10");
  const [subject, setSubject] = useState("ENG102");
  const [semester, setSemester] = useState("Second 2024/2025");
  const [duration, setDuration] = useState("2");
  const [totalMark, setMark] = useState("50");
  const [questionTypes, setQuestionTypes] = useState<string[]>([]);
  const [questionCounts, setQuestionCounts] = useState({
    MCQ: 0,
    Essay: 0,
    TrueFalse: 0,
    FillInTheBlank: 0,
    ShortAnswer: 0,
  });
  const [likePreviousExams, setLikePreviousExams] = useState(false);
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

        if (!grade || !subject || !semester || !duration || !totalMark) {
          console.log(grade, subject,semester,duration,totalMark)
        setErrorMsg("Please fill the form!");
        setLoading(false);
        return;
      }

      setErrorMsg("");
      const payload = {
        class: grade,
        subject: subject,
        semester: semester,
        duration: duration,
        total_mark: totalMark,
        question_types: questionCounts,
        like_previous_exams: likePreviousExams,
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
            padding: "2rem",
            borderRadius: "12px",
            boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
            fontFamily: "Arial, sans-serif",
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem", // Consistent spacing between elements
          }}
        >
          <div
            style={{
              width: "100%",
              display: "flex",
              flexWrap: "wrap", // Responsive behavior
              gap: "1.5rem",
            }}
          >
            <div style={{ width: "100%" }}>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  fontSize: "16px",
                  color: "#4b4b4b",
                  fontWeight: "bold",
                }}
              >
                <input
                  type="checkbox"
                  checked={likePreviousExams}
                  onChange={(e) => setLikePreviousExams(e.target.checked)}
                  style={{
                    marginRight: "0.5rem",
                  }}
                />
                Express Mode
              </label>
            </div>

            <label
              style={{
                flex: "1",
                minWidth: "200px",
                fontSize: "16px",
                color: "#4b4b4b",
                fontWeight: "bold",
              }}
            >
              Grade:
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                style={{
                  display: "block",
                  width: "100%",
                  marginTop: "0.5rem",
                  padding: "0.75rem",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                  fontSize: "14px",
                }}
              >
                <option value="Grade 10">Grade 10</option>
              </select>
            </label>
            <label
              style={{
                flex: "1",
                minWidth: "200px",
                fontSize: "16px",
                color: "#4b4b4b",
                fontWeight: "bold",
              }}
            >
              Semester:
              <select
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                style={{
                  display: "block",
                  width: "100%",
                  marginTop: "0.5rem",
                  padding: "0.75rem",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                  fontSize: "14px",
                }}
              >
                <option value="Second 2024/2025">Second 2024/2025</option>
              </select>
            </label>

            <label
              style={{
                flex: "1",
                minWidth: "200px",
                fontSize: "16px",
                color: "#4b4b4b",
                fontWeight: "bold",
              }}
            >
              Subject:
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                style={{
                  display: "block",
                  width: "100%",
                  marginTop: "0.5rem",
                  padding: "0.75rem",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                  fontSize: "14px",
                }}
              >
                <option value="ENG102">ENG102</option>
              </select>
            </label>
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "1.5rem",
            }}
          >
            <label
              style={{
                flex: "1",
                minWidth: "200px",
                fontSize: "16px",
                color: "#4b4b4b",
                fontWeight: "bold",
              }}
            >
              Duration:
              <input
                min={1}
                max={3}
                type="number"
                value={!likePreviousExams ? 2 : 1} // Use fixed value or user input
                onChange={(e) =>
                  likePreviousExams && setDuration(e.target.value)
                } // Allow edits only when unchecked
                disabled={!likePreviousExams} // Disable input when checkbox is selected
                style={{
                  display: "block",
                  width: "100%",
                  marginTop: "0.5rem",
                  padding: "0.75rem",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                  fontSize: "14px",
                }}
              />
            </label>

            <label
              style={{
                flex: "1",
                minWidth: "200px",
                fontSize: "16px",
                color: "#4b4b4b",
                fontWeight: "bold",
              }}
            >
              Total Mark:
              <input
                min={10}
                max={100}
                type="number"
                value={!likePreviousExams ? 50 : 10} // Use fixed value or user input
                onChange={(e) => likePreviousExams && setMark(e.target.value)} // Allow edits only when unchecked
                disabled={!likePreviousExams} // Disable input when checkbox is selected
                style={{
                  display: "block",
                  width: "100%",
                  marginTop: "0.5rem",
                  padding: "0.75rem",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                  fontSize: "14px",
                }}
              />
            </label>
          </div>

          {/* Conditional Rendering */}
          {likePreviousExams && (
            <fieldset
              style={{
                padding: "1rem",
                border: "1px solid #ccc",
                borderRadius: "8px",
              }}
            >
              <legend
                style={{
                  fontSize: "16px",
                  fontWeight: "bold",
                  color: "#4b4b4b",
                }}
              >
                Question Types
              </legend>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
                {/* Question Type Inputs */}
                {[
                  "MCQ",
                  "Essay",
                  "TrueFalse",
                  "FillInTheBlank",
                  "ShortAnswer",
                ].map((type) => (
                  <label
                    key={type}
                    style={{
                      fontSize: "14px",
                      color: "#333",
                      fontWeight: "normal",
                    }}
                  >
                    {type}:
                    <input
                      type="number"
                      min={0}
                      value={questionCounts[type] || 0}
                      onChange={(e) =>
                        setQuestionCounts((prev) => ({
                          ...prev,
                          [type]: Number(e.target.value),
                        }))
                      }
                      style={{
                        display: "block",
                        width: "100%",
                        marginTop: "0.5rem",
                        padding: "0.5rem",
                        borderRadius: "8px",
                        border: "1px solid #ccc",
                      }}
                    />
                  </label>
                ))}
              </div>
            </fieldset>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              alignSelf: "flex-end",
              backgroundColor: "#007BFF",
              color: "#fff",
              padding: "0.75rem 1.5rem",
              borderRadius: "8px",
              border: "none",
              fontSize: "16px",
              cursor: loading ? "not-allowed" : "pointer",
              fontWeight: "bold",
              transition: "background-color 0.3s ease",
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#0056b3")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#007BFF")}
          >
            {loading ? (
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
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
                ></span>
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

export default InitialForm;
