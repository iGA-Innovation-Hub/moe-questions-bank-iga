import React, { useState, useEffect } from "react";
import MOELogo from "../assets/moe_LOGO.png"; // Ministry of Education logo
import HomeIcon from "../assets/home icon (1).png"; // Home icon
import BackgroundImage from "../assets/DALLE2024-12-2913.15.14-AvectorillustrationofanArabmansittingatadeskinamodernwell-litofficeworkingonacomputer.Thecomputerscreendisplaysaschoolexam-ezgif.com-webp-to-jpg-converter.jpg"; // Background image
import { signOut } from "aws-amplify/auth";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../lib/contextLib";
import { NavLink, Outlet } from "react-router-dom";
import invokeApig from "../lib/callAPI.ts";
import { deleteCookie } from "../lib/cookies.ts";
import { useAlert } from "../components/AlertComponent.tsx";
import Report from "../components/Report.tsx";
import ExamsListLoader from "../components/ExamsListLoader.tsx";
import { GrHomeRounded } from "react-icons/gr";
import { MdOutlineReport } from "react-icons/md";
import { IoMdLogOut } from "react-icons/io";
import { RiHomeLine } from "react-icons/ri";
import PieChart from "../components/PieChart.tsx";

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
  const [gettingExams, setGettingExams] = useState(true);
  const [gettingExamsError, setGetExamsError] = useState("");
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
        setGetExamsError("No exams found!");
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

  async function getExams() {
    setExams([]);
    setGettingExams(true);
    console.log(filterValue);
    try {
      //@ts-ignore
      const response = await invokeApig({
        path: `/getExamHistory`, // Adjust path as needed
        method: "GET",
        queryParams: {
          state: filterValue,
        },
      });

      if (!response || Object.keys(response).length === 0) {
        console.log(response);
        showAlert({
          type: "failure",
          message: "No exams found",
        });
        return;
      }

      setGetExamsError("");

      // Store the retrieved exams in the state
      setExams(response);
      setExamsType(filterValue);

      console.log("Initial Data Loaded:", response);
    } catch (err: any) {
      console.error("Error fetching exams:", err);
      showAlert({
        type: "failure",
        message: "Error Fetching Exams",
      });
    } finally {
      setGettingExams(false); // Mark loading as complete
    }
  }

  // Function to determine the color based on the examState
  function getColorForState(state: any) {
    const stateColors = {
      pending: "rgba(255, 140, 0, 0.9)", // Orange
      approved: "rgba(34, 139, 34, 0.9)", // Green
      disapproved: "rgba(255, 0, 0, 0.9)", // Red
      default: "rgba(105, 105, 105, 0.9)", // Gray for unknown states
    };

    //@ts-ignore
    return stateColors[state.toLowerCase()] || stateColors.default;
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
      } catch (err) {
        setApproved(0);
        setDisapproved(0);
        setBuilding(0);
        setPending(0);
        setTotalExams(0);

        console.error("Error fetching exam count:", err);
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

  const pieData = [{ value: 7, color: "#007aff" },
    { value: 12, color: "rgba(255, 140, 0, 0.9)" },
    { value: 2, color: "#34c759" },
    { value: 5, color: "#ff2d55" },
  ];

  return (
    <div
      style={{
        backgroundImage: `url(${BackgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        height: "100vh",
        width: "100vw",
        overflowY: "auto",
        margin: 0,
        padding: 0,
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0.5rem 2rem",
          backgroundColor: "rgba(3, 40, 61, 1)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <NavLink
            to="/dashboard"
            style={{
              color: "white",
              padding: "0.5rem 1rem",
              borderRadius: "20px",
              fontSize: "16px",
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
              fontSize: "16px",

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
              fontSize: "16px",

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
              <PieChart data={pieData} size={100} />
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
                      style={{fontSize:"12px", color:"gray", marginTop:"0"}}
                      >{ item.details}</p>
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
              <div>
                <span
                  style={{fontSize:"20px", color:"gray", marginTop:"0", fontWeight:"600"}}
                >
                  Total Exams <br />
                {totalExams}
                </span>
              </div>
            </div>

            {userRole === "User" && (
              <div
                style={{
                  display: "flex",
                  gap: "2rem",
                  flexWrap: "nowrap",
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: "2rem",
                }}
              >
                {dashButtons.map((item, index) => (
                  <NavLink
                    to={item.link}
                    onClick={() => setActivePage(item.page)}
                    style={{ textDecoration: "none" }}
                  >
                    <div
                      key={index}
                      style={{
                        width: "250px",
                        height: "200px",
                        backgroundColor: "white",
                        color: "#d32f2f",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: "16px",
                        fontSize: "18px",
                        fontWeight: "bold",
                        textAlign: "center",
                        cursor: "pointer",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                        transition: "transform 0.3s, box-shadow 0.3s",
                      }}
                      onMouseEnter={(e) => {
                        const card = e.currentTarget;
                        card.style.transform = "scale(1.05)";
                        card.style.boxShadow = "0 8px 15px rgba(0, 0, 0, 0.3)";
                      }}
                      onMouseLeave={(e) => {
                        const card = e.currentTarget;
                        card.style.transform = "scale(1)";
                        card.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
                      }}
                    >
                      <span
                        style={{
                          fontWeight: "bold",
                          fontSize: "28px",
                          marginBottom: "0.5rem",
                        }}
                      >
                        {item.label}
                      </span>
                    </div>
                  </NavLink>
                ))}
              </div>
            )}

            <div>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "1rem",
                  marginBottom: "2rem",
                  backgroundColor: "#fff",
                  padding: "1rem",
                  borderRadius: "8px",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  width: "100%",
                  maxWidth: "800px",
                }}
              >
                <div>
                  <label
                    style={{
                      fontSize: "14px",
                      fontWeight: "bold",
                      color: "#555",
                    }}
                  >
                    State:
                  </label>
                  <select
                    value={filterValue}
                    onChange={(e) => {
                      setFilterValue(e.target.value);
                      setTimeout(() => {
                        getExams();
                      }, 100);
                    }}
                    style={{
                      display: "block",
                      width: "200px",
                      padding: "0.6rem",
                      borderRadius: "4px",
                      border: "1px solid #ccc",
                      marginTop: "0.5rem",
                      fontSize: "14px",
                    }}
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="disapproved">Disapproved</option>
                    {userRole === "User" && (
                      <option value="building">Building</option>
                    )}
                  </select>
                </div>
              </div>

              {gettingExams && <ExamsListLoader />}

              {!gettingExams && !gettingExamsError && exams.length > 0 && (
                <div
                  style={{
                    marginTop: "2rem",
                    width: "100%",
                    padding: "1rem",
                    backgroundColor: "#fafafa",
                    borderRadius: "8px",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <h3 style={{ marginBottom: "1.5rem", color: "#333" }}>
                    {examsType.toUpperCase()} EXAMS:
                  </h3>
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
                        borderRadius: "8px",
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

                      {/* State */}
                      <div
                        style={{
                          flex: 1,
                          textAlign: "right",
                        }}
                      >
                        <p
                          style={{
                            marginTop: "14px",
                            textAlign: "center",
                            margin: 0,
                            fontSize: "14px",
                            fontWeight: "bold",
                            //@ts-ignore
                            color: getColorForState(exam.examState), // Dynamic color based on exam state
                          }}
                        >
                          {/*@ts-ignore*/}
                          {exam.examState.toUpperCase()}
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
                    borderRadius: "8px",
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
