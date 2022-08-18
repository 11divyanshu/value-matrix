import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import { ReactSession } from 'react-client-session';
import 'tw-elements';
// Assets
import "../src/assets/stylesheet/output.css";
import "../src/assets/stylesheet/style.css";

// Pages
import Login from "./Pages/Login.jsx";
import Dashboard from './Pages/Layout/Dashboard.jsx';
import AdminLogin from './Pages/AdminLogin.jsx';
import AdminDashboard from './Pages/Layout/AdminLayout.jsx';
import CompanyDashboard from './Pages/Layout/CompanyLayout.jsx';
import UpdateJob from './Pages/CompanyDashboard/UpdateJob.jsx';
import JobDetails from './Pages/CompanyDashboard/JobDetails';
import XIDashboard from './Pages/Layout/XILayout';
import ResetPassword from './Components/Login/ForgotPassword';

const root = ReactDOM.createRoot(document.getElementById('root'));
ReactSession.setStoreType("sessionStorage");
root.render(
  
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/login" element={<Login/>} />
        <Route path="/resetPassword/" element ={<ResetPassword/>}/>
        <Route path="/resetPassword/:id" element ={<ResetPassword/>}/>
        <Route path="/user" element={<Dashboard/>} />
        <Route path="/user/:component" element={<Dashboard/>}/>
        <Route path="/admin/login" element={<AdminLogin/>}/>
        <Route path="/admin" element={<AdminDashboard/>}/>
        <Route path="/admin/:component" element={<AdminDashboard/>}/>
        <Route path="/company" element={<CompanyDashboard/>}/>
        <Route path="/company/:component" element={<CompanyDashboard/>}/>
        <Route path="/company/:component/:id" element={<CompanyDashboard/>}/>
        <Route path="/XI" element={<XIDashboard/>}/>
        <Route path="/XI/:component" element={<XIDashboard/>}/>
        <Route path="/XI/:component/:id" element={<XIDashboard/>}/>
        
      </Routes>
    </Router>
  </React.StrictMode>
);