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
import Dashboard from './Pages/Dashboard';
import AdminLogin from './Pages/AdminLogin';
import AdminDashboard from './Pages/AdminLayout';

const root = ReactDOM.createRoot(document.getElementById('root'));
ReactSession.setStoreType("sessionStorage");
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard/>} />
        <Route path="/:component" element={<Dashboard/>}/>
        <Route path="/login" element={<Login/>} />
        <Route path="/admin/login" element={<AdminLogin/>}/>
        <Route path="/admin" element={<AdminDashboard/>}/>
        <Route path="/admin/:component" element={<AdminDashboard/>}/>
      </Routes>
    </Router>
  </React.StrictMode>
);