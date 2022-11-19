import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ReactSession } from "react-client-session";
import "tw-elements";
// Assets
import "../src/assets/stylesheet/output.css";
import "../src/assets/stylesheet/style.css";

// Pages
import Login from "./Pages/Login.jsx";
import Dashboard from "./Pages/Layout/Dashboard.jsx";
import AdminLogin from "./Pages/AdminLogin.jsx";
import AdminDashboard from "./Pages/Layout/AdminLayout.jsx";
import CompanyDashboard from "./Pages/Layout/CompanyLayout.jsx";
import UpdateJob from "./Pages/CompanyDashboard/UpdateJob.jsx";
import JobDetails from "./Pages/CompanyDashboard/JobDetails";
import XIDashboard from "./Pages/Layout/XILayout";
import SuperXIDashboard from "./Pages/Layout/SuperXILayout";
import Dialer from './dialer';
import ResetPassword from "./Components/Login/ForgotPassword";
import SetProfile from "./Pages/UserDashboard/SetProfile";
import InterviewPanel from "./Pages/InterviewPanel";
import InterviewerPanel from "./Pages/InterviewerPanel";
import Initial from "./Pages/Initial";
import TestPage from "./Pages/TestPage";

const root = ReactDOM.createRoot(document.getElementById("root"));
ReactSession.setStoreType("sessionStorage");
root.render(
  <React.StrictMode>
    <Router>
      <Routes>

        <Route path="/" element={<Initial/>} />
        <Route path="/testpage" element={<TestPage/>} />

        <Route path="/dialer" element={<Dialer />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Login />} />
        <Route path="/resetPassword/" element={<ResetPassword />} />
        <Route path="/resetPassword/:id" element={<ResetPassword />} />
        <Route path="/setProfile/:id" element={<SetProfile />} />

        <Route path="/user" element={<Dashboard />} />
        <Route path="/user/:component" element={<Dashboard />} />
        <Route path="/user/:component/:id" element={<Dashboard />} />

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/:component" element={<AdminDashboard />} />
        <Route path="/admin/:component/:id" element={<AdminDashboard />} />

        <Route path="/company" element={<CompanyDashboard />} />
        <Route path="/company/:component" element={<CompanyDashboard />} />
        <Route path="/company/:component/:id" element={<CompanyDashboard />} />

        <Route path="/XI" element={<XIDashboard />} />
        <Route path="/XI/:component" element={<XIDashboard />} />
        <Route path="/XI/:component/:id" element={<XIDashboard />} />

        <Route path="/superXI" element={<SuperXIDashboard />} />
        <Route path="/superXI/:component" element={<SuperXIDashboard />} />

        <Route path="/interview/:id" element={<InterviewPanel />} />
        <Route path="/interviewer/:id" element={<InterviewerPanel />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
