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

const root = ReactDOM.createRoot(document.getElementById('root'));
ReactSession.setStoreType("sessionStorage");
root.render(
  
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/login" element={<Login/>} />
        <Route path="/user" element={<Dashboard/>} />
        <Route path="/user/:component" element={<Dashboard/>}/>
        <Route path="/admin/login" element={<AdminLogin/>}/>
        <Route path="/admin" element={<AdminDashboard/>}/>
        <Route path="/admin/:component" element={<AdminDashboard/>}/>
        <Route path="/company" element={<CompanyDashboard/>}/>
        <Route path="/company/:component" element={<CompanyDashboard/>}/>
        <Route path="/company/:component/:id" element={<CompanyDashboard/>}/>
      </Routes>
    </Router>
  </React.StrictMode>
);