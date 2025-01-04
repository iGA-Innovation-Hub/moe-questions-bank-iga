import React, { useState, useEffect } from "react";// Background image
import { signOut } from "aws-amplify/auth";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../lib/contextLib";
import { NavLink, Outlet } from "react-router-dom";
import invokeApig from "../lib/callAPI.ts";
import { deleteCookie } from "../lib/cookies.ts";
import { useAlert } from "../components/AlertComponent.tsx";
import Report from "../components/Report.tsx";
import ExamsListLoader from "../components/ExamsListLoader.tsx";
import { MdOutlineReport } from "react-icons/md";
import { IoMdLogOut } from "react-icons/io";
import { RiHomeLine } from "react-icons/ri";
import PieChart from "../components/PieChart.tsx";
import { ImArrowUp } from "react-icons/im";
import "../styles/dashButtons.css"
import DashLoader from "../components/DashLoader.tsx";
import ExamSelector from "../components/ExamSelector.tsx";

interface UserDashboardProps {}

const Dashboard: React.FC<UserDashboardProps> = () => {
  const navigate = useNavigate();
  const { userHasAuthenticated } = useAppContext();
  const { userRole } = useAppContext();
  const [activePage, setActivePage] = useState<string>(
    window.location.pathname
  );
  const [approved, setApproved] = useState(0);
  const [disapproved, setDisapproved] = useState(0);
  const [building, setBuilding] = useState(0);
  const [pending, setPending] = useState(0);
  const [totalExams, setTotalExams] = useState(0);
  const [approvalRate, setApprovalRate] = useState(0);
  const [gettingExams, setGettingExams] = useState(true);
  const [gettingExamsError, setGetExamsError] = useState("");
  const [loadingExamCount, setLoadingExamCount] = useState(true);
  const [exams, setExams] = useState([]);
  const [examsType, setExamsType] = useState(
    userRole === "User" ? "building" : "pending"
  );
  const [filterValue, setFilterValue] = useState(
    userRole === "User" ? "building" : "pending"
  );

  const [isReportOpen, setIsReportOpen] = useState(false);

  const openReport = () => setIsReportOpen(true);
  const closeReport = () => setIsReportOpen(false);

  const { showAlert } = useAlert();

  // Fetch initial data
  const fetchInitialData = async () => {
    try {
      //@ts-ignore
      const response = await invokeApig({
        path: `/getExamHistory`,
        method: "GET",
        queryParams: {
          state: filterValue,
        },
      });

      if (!response || Object.keys(response).length === 0) {
        console.log(response);
        setGetExamsError("No exams found");
        return;
      }

      // Store the retrieved exams in the state
      setExams(response);

      console.log("Initial Data Loaded:", response);
    } catch (err: any) {
      console.error("Error fetching initial data:", err);
      showAlert({
        type: "failure",
        message: "Error Fetching Data",
      });
    } finally {
      setGettingExams(false); // Mark loading as complete
    }
  };

  async function getExams(value:string) {
    setExams([]);
    setGettingExams(true);
    if (value === "disapproved") { 
      setExamsType("Rejected");
    } else {

      setExamsType(value);
    }
    console.log(value);
    try {
      //@ts-ignore
      const response = await invokeApig({
        path: `/getExamHistory`, // Adjust path as needed
        method: "GET",
        queryParams: {
          state: value,
        },
      });

      if (!response || Object.keys(response).length === 0) {
        console.log(response);
        return;
      }

      setGetExamsError("");

      // Store the retrieved exams in the state
      if (response.length === 0) { 
        setGetExamsError("No exams found")
        setExams([]);
      } else {
        setExams(response);
      }
      

      console.log("Initial Data Loaded:", response);
    } catch (err: any) {
      console.error("Error fetching exams:", err);
      showAlert({
        type: "failure",
        message: "Error fetching exams",
      });
    } finally {
      setGettingExams(false); // Mark loading as complete
    }
  }


  useEffect(() => {
    // Add a timeout before fetching data
    const timer = setTimeout(() => {
      fetchInitialData();
    }, 1000);

    // Cleanup the timeout if the component unmounts
    return () => clearTimeout(timer);
  }, []);

  setTimeout(() => {
    setActivePage(window.location.pathname);
  }, 500);

  useEffect(() => {
    async function fetchExamCount() {
      if (!approved && !pending && !disapproved && !building) {
        setLoadingExamCount(true);
      }
      try {
        // @ts-ignore
        const response = await invokeApig({
          path: `/getExamCount`,
          method: "GET",
          queryParams: {
            state: filterValue,
          },
        });

        setApproved(response ? response.approved : 0);
        setDisapproved(response ? response.disapproved : 0);
        setBuilding(response ? response.building : 0);
        setPending(response ? response.pending : 0);
        setTotalExams(
          response
            ? response.approved +
                response.disapproved +
                response.building +
                response.pending
            : 0
        );

        setApprovalRate(
          response
            ? Math.round(
                (response.approved /
                  (response.approved +
                    response.disapproved +
                    response.building +
                    response.pending)) *
                  100
              )
            : 0
        );
      } catch (err) {
        setApproved(0);
        setDisapproved(0);
        setBuilding(0);
        setPending(0);
        setTotalExams(0);

        console.error("Error fetching exam count:", err);
        showAlert({
          type: "failure",
          message: "Error fetching data",
        })
      } finally {
        setLoadingExamCount(false);
      }
    }

    fetchExamCount();
  }, [filterValue]); // Dependency array ensures fetchExamCount is only called when `filterValue` changes

  async function handleSignOut() {
    showAlert({
      type: "confirm",
      message: "Are you sure you want to sign out?",
      action: async () => {
        await signOut();
        deleteCookie("isAuthenticated");
        deleteCookie("userRole");
        userHasAuthenticated(false);
        navigate("/login");
      },
    });
  }

  const examData = [
    {
      label: "Building",
      value: building,
      color: "#007aff",
      details: "Currently being worked on",
    },
    {
      label: "Pending",
      value: pending,
      color: "rgba(255, 140, 0, 0.9)",
      details: "Pending review and approval",
    },
    {
      label: "Approved",
      value: approved,
      color: "#34c759",
      details: "Reviewed and approved",
    },
    {
      label: "Rejected",
      value: disapproved,
      color: "#ff2d55",
      details: "Reviewed and rejected",
    },
  ];

  const dashButtons = [
    {
      label: "Generate Exam",
      link: "/dashboard/examForm",
      page: "generateExam",
    },
    {
      label: "Upload Material",
      link: "/dashboard/upload",
      page: "uploadMaterial",
    },
    { label: "Generate Audio", link: "/dashboard/audiopPage", page: "audio" },
  ];

  const pieData = [{ value: building, color: "#007aff" },
    { value: pending, color: "rgba(255, 140, 0, 0.9)" },
    { value: approved, color: "#34c759" },
    { value: disapproved, color: "#ff2d55" },
  ];

  return (
    <div
      style={{
        height: "auto",
        width: "100%",
        margin: 0,
        padding: 0,
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          position: "fixed", // Makes the header fixed
          top: 0, // Positions the header at the top of the viewport
          left: 0, // Aligns the header to the left of the viewport
          width: "100%", // Spans the full width of the viewport
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0.5rem 2rem",
          backgroundColor: "rgb(12, 84, 125)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <NavLink
            to="/dashboard"
            style={{
              color: "white",
              padding: "0.5rem 1rem",
              borderRadius: "20px",
              fontSize: "20px",
              cursor: "pointer",
              textDecoration: "none",
              transition: "transform 0.3s, box-shadow 0.3s",
              border: "none",
            }}
            onClick={() => setActivePage("/dashboard")}
          >
            Home
            <RiHomeLine
              style={{
                fontSize: "16px",
                marginLeft: "0.5rem",
                marginBottom: "-0.15rem",
              }}
            />
          </NavLink>
        </div>

        <div>
          <NavLink
            to="#"
            onClick={openReport}
            style={{
              color: "white",
              padding: "0.5rem 1rem",
              borderRadius: "20px",
              fontSize: "20px",

              cursor: "pointer",
              textDecoration: "none",
              transition: "transform 0.3s, box-shadow 0.3s",
              border: "none",
            }}
          >
            Report
            <MdOutlineReport
              style={{
                fontSize: "16px",
                marginLeft: "0.5rem",
                marginBottom: "-0.15rem",
              }}
            />
          </NavLink>
          {isReportOpen && <Report onClose={closeReport} />}

          <NavLink
            to="#"
            onClick={handleSignOut}
            style={{
              color: "white",
              padding: "0.5rem 1rem",
              borderRadius: "20px",
              fontSize: "20px",

              cursor: "pointer",
              textDecoration: "none",
              transition: "transform 0.3s, box-shadow 0.3s",
              border: "none",
            }}
          >
            Sign-out
            <IoMdLogOut
              style={{
                fontSize: "16px",
                marginLeft: "0.5rem",
                marginBottom: "-0.15rem",
              }}
            />
          </NavLink>
        </div>
      </div>

      <div
        style={{
          padding: "2rem",
          backgroundColor: "#ffffff",
          margin: "0 auto",
          width: "100%",
          boxShadow: "none",
          outline: "none",
          height: "100%",
          marginTop: "2rem",
        }}
      >
        {activePage === "/dashboard" && (
          <div
            style={{
              padding: "2rem",
              maxWidth: "70%",
              minWidth: "70%",
              margin: "0 auto",
            }}
          >
            <h2
              style={{
                fontFamily: "Arial, sans-serif",
                color: "rgb(12, 84, 125)",
                fontSize: "24px",
                fontWeight: "700",
                marginTop: "0rem",
              }}
            >
              Dashboard
            </h2>
            <div
              style={{
                marginBottom: "2rem",
                borderWidth: "1px",
                borderColor: "rgb(185, 184, 184)",
                borderStyle: "solid",
                borderRadius: "20px",
                padding: "1rem 1rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <div style={{ width: "25%" }}>
                  <PieChart data={pieData} size={100} />
                </div>
                <div
                  style={{
                    fontSize: "20px",
                    color: "gray",
                    marginTop: "0",
                    fontWeight: "600",
                    width: "25%",
                  }}
                >
                  Total exams <br />
                  {totalExams}
                </div>
                <div
                  style={{
                    fontSize: "20px",
                    color: "gray",
                    marginTop: "0",
                    fontWeight: "600",
                  }}
                >
                  Approval rate{" "}
                  <ImArrowUp
                    style={{
                      fontSize: "20px",
                      marginLeft: "0.1rem",
                      marginBottom: "-0.15rem",
                    }}
                  />
                  <br />
                  {approvalRate}%
                </div>

                <div style={{ marginLeft: "auto", marginRight: "1rem" }}>
                  {loadingExamCount && <DashLoader />}
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "2rem",
                  flexWrap: "nowrap",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                {examData.map((item, index) => (
                  <div
                    key={index}
                    style={{
                      color: item.color,
                      display: "flex",
                      flexDirection: "column",
                      fontSize: "12px",
                      fontWeight: "500",
                      marginTop: "0.5rem",
                      marginBottom: "0.5rem",
                      width: "25%",
                      borderRight:
                        index === examData.length - 1
                          ? "none"
                          : "1px solid #ccc",
                    }}
                  >
                    <span
                      style={{
                        fontWeight: "600",
                        fontSize: "14px",
                        color: "rgba(3, 40, 61, 1)",
                        fontFamily: "Arial, sans-serif",
                        letterSpacing: "0.8px",
                      }}
                    >
                      {item.label} <br />
                      <p
                        style={{
                          fontSize: "12px",
                          color: "gray",
                          marginTop: "0",
                        }}
                      >
                        {item.details}
                      </p>
                    </span>
                    <span
                      style={{
                        fontWeight: "bold",
                        fontSize: "38px",
                        paddingBottom: "1px",
                        borderBottomColor: item.color,
                        borderBottomStyle: "solid",
                        borderBottomWidth: "2px",
                        width: "50px",
                        textAlign: "center",
                      }}
                    >
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {userRole === "User" && (
              <div
                style={{
                  display: "flex",
                  width: "100%",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "2rem",
                }}
              >
                {dashButtons.map((item, index) => (
                  <NavLink
                    className={"dashButton"}
                    to={item.link}
                    onClick={() => setActivePage(item.page)}
                    style={{
                      textDecoration: "none",
                      width: "30%",
                      borderRadius: "20px",
                    }}
                    key={index}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        width: "100%",
                        height: "80px",
                        backgroundColor: "#ffffff",
                        color: "rgb(12, 84, 125)",
                        borderRadius: "20px",
                        fontSize: "20px",
                        fontWeight: "600",
                        textAlign: "center",
                        cursor: "pointer",
                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                        transition: "transform 0.2s ease, box-shadow 0.2s ease",
                        borderWidth: "1px",
                        borderColor: "rgb(185, 184, 184)",
                        borderStyle: "solid",
                      }}
                    >
                      <span style={{ textAlign: "center", width: "100%" }}>
                        {item.label}
                      </span>
                    </div>
                  </NavLink>
                ))}
              </div>
            )}

            <div
              style={{
                marginTop: "2rem",
                width: "100%",
                padding: "1rem",
                backgroundColor: "#ffffff",
                borderRadius: "20px",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                borderWidth: "1px",
                borderColor: "rgb(185, 184, 184)",
                borderStyle: "solid",
              }}
            >
              <ExamSelector
                filterValue={filterValue}
                setFilterValue={setFilterValue}
                getExams={getExams}
                userRole={userRole}
              />

              <h3 style={{ marginBottom: "1.5rem", color: "rgb(12, 84, 125)" }}>
                {examsType.toUpperCase()} EXAMS
              </h3>

              {gettingExams && <ExamsListLoader />}

              {!gettingExams && !gettingExamsError && (
                <div
                  style={{
                    marginTop: "0.2rem",
                    width: "100%",
                    padding: "1rem",
                    backgroundColor: "#fafafa",
                    borderRadius: "20px",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                    maxHeight: "500px",
                    overflowY: "auto",
                  }}
                >
                  {exams.map((exam) => (
                    <div
                      //@ts-ignore
                      key={exam.examID}
                      //@ts-ignore
                      onClick={() =>
                        //@ts-ignore
                        navigate(`/dashboard/viewExam/${exam.examID}`)
                      } // Redirect to the exam form page
                      style={{
                        marginBottom: "1rem",
                        padding: "1rem",
                        backgroundColor: "#fff",
                        borderRadius: "20px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        cursor: "pointer",
                        transition: "background-color 0.3s ease",
                        border: "1px solid rgba(0, 0, 0, 0.05)",
                        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "#f9f9f9")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "#fff")
                      }
                    >
                     

                      {/* Creator */}
                      <div style={{ flex: 1, marginRight: "1rem" }}>
                        <p
                          style={{
                            margin: 0,
                            fontSize: "12px",
                            color: "#777",
                          }}
                        >
                          Creator
                        </p>
                        <p
                          style={{
                            margin: 0,
                            fontSize: "14px",
                            color: "#333",
                            fontWeight: "bold",
                          }}
                        >
                          {/*@ts-ignore*/}
                          {exam.createdBy}
                        </p>
                      </div>

                      {/* Date */}
                      <div style={{ flex: 1, marginRight: "1rem" }}>
                        <p
                          style={{
                            margin: 0,
                            fontSize: "12px",
                            color: "#777",
                          }}
                        >
                          Date
                        </p>
                        <p
                          style={{
                            margin: 0,
                            fontSize: "14px",
                            color: "#333",
                            fontWeight: "bold",
                          }}
                        >
                          {/*@ts-ignore*/}
                          {exam.creationDate}
                        </p>
                      </div>

                      {/* Subject */}
                      <div style={{ flex: 1, marginRight: "1rem" }}>
                        <p
                          style={{
                            margin: 0,
                            fontSize: "12px",
                            color: "#777",
                          }}
                        >
                          Subject
                        </p>
                        <p
                          style={{
                            margin: 0,
                            fontSize: "14px",
                            color: "#333",
                            fontWeight: "bold",
                          }}
                        >
                          {/*@ts-ignore*/}
                          {exam.examSubject}
                        </p>
                      </div>

                      {/* Class */}
                      <div style={{ flex: 1, marginRight: "1rem" }}>
                        <p
                          style={{
                            margin: 0,
                            fontSize: "12px",
                            color: "#777",
                          }}
                        >
                          Class
                        </p>
                        <p
                          style={{
                            margin: 0,
                            fontSize: "14px",
                            color: "#333",
                            fontWeight: "bold",
                          }}
                        >
                          {/*@ts-ignore*/}
                          {exam.examClass}
                        </p>
                      </div>

                      {/* Semester */}
                      <div style={{ flex: 1 }}>
                        <p
                          style={{
                            margin: 0,
                            fontSize: "12px",
                            color: "#777",
                          }}
                        >
                          Semester
                        </p>
                        <p
                          style={{
                            margin: 0,
                            fontSize: "14px",
                            color: "#333",
                            fontWeight: "bold",
                          }}
                        >
                          {/*@ts-ignore*/}
                          {exam.examSemester}
                        </p>
                      </div>
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
                    borderRadius: "20px",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                    color: "red",
                  }}
                >
                  {gettingExamsError}
                </div>
              )}
            </div>
          </div>
        )}
        {activePage !== "/dashboard" && <Outlet />}
      </div>
    </div>
  );
};

export default Dashboard;
