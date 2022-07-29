import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";

// Assets
import "../src/assets/stylesheet/output.css";
import "../src/assets/stylesheet/style.css";

// Pages
import Login from "./Pages/Login.jsx";
import Dashboard from './Pages/Dashboard';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard/>} />
        <Route path="/login" element={<Login/>} />
      </Routes>
    </Router>
  </React.StrictMode>
);