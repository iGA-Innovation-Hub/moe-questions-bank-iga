// import React, { useState } from "react"; //useState to let the program remember info.
// import DashboardIcon from "../assets/exam.png";
// import ExamForm from "./ExamForm";
// import FeedbackForm from "./FeedbackForm";
// import HistoryPage from "./HistoryPage";
// import { signOut } from "aws-amplify/auth";
// import { useNavigate } from "react-router-dom";
// import { useAppContext } from "../lib/contextLib";

// // interface is set of rules that tells the  program what kind of "shape" an object should have.
// interface DashboardProps {
//   signOut?: () => void; //Every Dashboard component have a signOut function as a property (signout button) , ?: means that this prop is optional. It’s okay if you don’t pass it.
// }

// const Dashboard: React.FC<DashboardProps> = ({}) => {
//   const navigate = useNavigate();
//   const { userHasAuthenticated } = useAppContext();
//   const [activePage, setActivePage] = useState("home"); //activePage: This is a variable that stores the current page

//   //Handles user logout event
//   async function handleSignOut() {
//     await signOut();
//     userHasAuthenticated(false);
//     navigate("/login");
//   }

//   //change the main content based on the activePage
//   const renderContent = () => {
//     switch (activePage) {
//       case "generateExam":

//         return <ExamForm />;

//       case "seeExams":
//         return <HistoryPage />;
//       case "feedback":
//         return <FeedbackForm />;
//       default:
//         return (
//           <div
//             style={{
//               display: "flex",
//               gap: "2rem",
//               flexWrap: "wrap",
//               justifyContent: "center",
//               alignItems: "center",
//               padding: "2rem",
//             }}
//           >
//             <div
//               onClick={() => setActivePage("generateExam")}
//               style={{
//                 width: "200px",
//                 height: "200px",
//                 backgroundColor: "#4b4b4b",
//                 color: "beige",
//                 display: "flex",
//                 justifyContent: "center",
//                 alignItems: "center",
//                 borderRadius: "16px",
//                 fontSize: "18px",
//                 fontFamily: "Cursive",
//                 textAlign: "center",
//                 cursor: "pointer",
//               }}
//             >
//               Generate Exam
//             </div>
//             <div
//               onClick={() => setActivePage("seeExams")}
//               style={{
//                 width: "200px",
//                 height: "200px",
//                 backgroundColor: "#4b4b4b",
//                 color: "beige",
//                 display: "flex",
//                 justifyContent: "center",
//                 alignItems: "center",
//                 borderRadius: "16px",
//                 fontSize: "18px",
//                 fontFamily: "Cursive",
//                 textAlign: "center",
//                 cursor: "pointer",
//               }}
//             >
//               See Generated Exams
//             </div>
//             <div
//               onClick={() => setActivePage("feedback")}
//               style={{
//                 width: "200px",
//                 height: "200px",
//                 backgroundColor: "#4b4b4b",
//                 color: "beige",
//                 display: "flex",
//                 justifyContent: "center",
//                 alignItems: "center",
//                 borderRadius: "16px",
//                 fontSize: "18px",
//                 fontFamily: "Cursive",
//                 textAlign: "center",
//                 cursor: "pointer",
//               }}
//             >
//               Report Problem
//             </div>
//           </div>
//         );
//     }
//   };

//   return (
//     <div
//       style={{
//         display: "flex",
//         height: "100vh",
//         width: "100vw",
//         margin: 0,
//         padding: 0,
//         backgroundColor: "white",
//         overflow: "hidden",
//       }}
//     >
//       <div
//         style={{
//           width: "300px",
//           backgroundColor: "#d3d3d3",
//           display: "flex",
//           flexDirection: "column",
//           justifyContent: "space-between",
//           padding: "1rem",
//         }}
//       >
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//             marginBottom: "1rem",
//           }}
//         >
//           <img
//             src={DashboardIcon}
//             alt="Dashboard Icon"
//             style={{ width: "100px", height: "100px" }}
//           />
//         </div>
//         <div>
//           <button
//             onClick={() => setActivePage("home")}
//             style={{
//               backgroundColor: "#4b4b4b",
//               color: "beige",
//               padding: "1rem",
//               marginBottom: "1rem",
//               width: "100%",
//               border: "none",
//               borderRadius: "4px",
//               fontSize: "16px",
//               cursor: "pointer",
//             }}
//           >
//             Home
//           </button>
//           <button
//             onClick={() => setActivePage("generateExam")} //update the activePage to "generateExam"
//             style={{
//               backgroundColor: "#4b4b4b",
//               color: "beige",
//               padding: "1rem",
//               marginBottom: "1rem",
//               width: "100%",
//               border: "none",
//               borderRadius: "4px",
//               fontSize: "16px",
//               cursor: "pointer",
//             }}
//           >
//             Generate Exam
//           </button>
//           <button
//             onClick={() => setActivePage("seeExams")}
//             style={{
//               backgroundColor: "#4b4b4b",
//               color: "beige",
//               padding: "1rem",
//               marginBottom: "1rem",
//               width: "100%",
//               border: "none",
//               borderRadius: "4px",
//               fontSize: "16px",
//               cursor: "pointer",
//             }}
//           >
//             See Generated Exams
//           </button>
//           <button
//             onClick={() => setActivePage("feedback")}
//             style={{
//               backgroundColor: "#4b4b4b",
//               color: "beige",
//               padding: "1rem",
//               marginBottom: "1rem",
//               width: "100%",
//               border: "none",
//               borderRadius: "4px",
//               fontSize: "16px",
//               cursor: "pointer",
//             }}
//           >
//             Report Problem
//           </button>
//         </div>
//         <button
//           onClick={handleSignOut}
//           style={{
//             backgroundColor: "#4b4b4b",
//             color: "beige",
//             padding: "1rem",
//             width: "100%",
//             border: "none",
//             borderRadius: "4px",
//             fontSize: "16px",
//             cursor: "pointer",
//           }}
//         >
//           Sign-out
//         </button>
//       </div>

//       <div
//         style={{
//           flex: 1,
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           backgroundColor: "#f9f9f9",
//         }}
//       >
//         {renderContent()}
//       </div>
//     </div>
//   );
// };

// export default Dashboard;


import React from "react";
import DashboardIcon from "../assets/exam.png";
import { NavLink, Outlet } from "react-router-dom";
import { signOut } from "aws-amplify/auth";
import { useAppContext } from "../lib/contextLib";

const Dashboard: React.FC = () => {
  const { userHasAuthenticated, updateUserRole } = useAppContext();

  // Handles user logout
  async function handleSignOut() {
    await signOut();
    userHasAuthenticated(false);
    updateUserRole("");
    // Remove state from localStorage
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userRole");
    window.location.href = "/login"; // Redirect after sign-out
  }

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        margin: 0,
        padding: 0,
        backgroundColor: "white",
        overflow: "hidden",
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          width: "300px",
          backgroundColor: "#d3d3d3",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "1rem",
        }}
      >
        {/* Dashboard Icon */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "1rem",
          }}
        >
          <img
            src={DashboardIcon}
            alt="Dashboard Icon"
            style={{ width: "100px", height: "100px" }}
          />
        </div>

        {/* Navigation Links */}
        <div>
          <NavLink
            to="/dashboard"
            end // Ensures this link is only active for the exact "/dashboard" path
            style={({ isActive }) => ({
              backgroundColor: isActive ? "#4b4b4b" : "transparent",
              color: isActive ? "beige" : "#4b4b4b",
              padding: "1rem",
              marginBottom: "1rem",
              width: "100%",
              display: "block",
              textAlign: "center",
              textDecoration: "none",
              borderRadius: "4px",
              fontSize: "16px",
            })}
          >
            Home
          </NavLink>
          <NavLink
            to="/dashboard/examForm"
            style={({ isActive }) => ({
              backgroundColor: isActive ? "#4b4b4b" : "transparent",
              color: isActive ? "beige" : "#4b4b4b",
              padding: "1rem",
              marginBottom: "1rem",
              width: "100%",
              display: "block",
              textAlign: "center",
              textDecoration: "none",
              borderRadius: "4px",
              fontSize: "16px",
            })}
          >
            Generate Exam
          </NavLink>
          <NavLink
            to="/dashboard/history"
            style={({ isActive }) => ({
              backgroundColor: isActive ? "#4b4b4b" : "transparent",
              color: isActive ? "beige" : "#4b4b4b",
              padding: "1rem",
              marginBottom: "1rem",
              width: "100%",
              display: "block",
              textAlign: "center",
              textDecoration: "none",
              borderRadius: "4px",
              fontSize: "16px",
            })}
          >
            See Generated Exams
          </NavLink>
          <NavLink
            to="/dashboard/feedback-form"
            style={({ isActive }) => ({
              backgroundColor: isActive ? "#4b4b4b" : "transparent",
              color: isActive ? "beige" : "#4b4b4b",
              padding: "1rem",
              marginBottom: "1rem",
              width: "100%",
              display: "block",
              textAlign: "center",
              textDecoration: "none",
              borderRadius: "4px",
              fontSize: "16px",
            })}
          >
            Report Problem
          </NavLink>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleSignOut}
          style={{
            backgroundColor: "#4b4b4b",
            color: "beige",
            padding: "1rem",
            width: "100%",
            border: "none",
            borderRadius: "4px",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          Sign-out
        </button>
      </div>

      {/* Main Content Area */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f9f9f9",
          padding: "2rem",
        }}
      >
        <Outlet /> {/* Render content for selected route */}
      </div>
    </div>
  );
};

export default Dashboard;


