import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, NavLink } from "react-router-dom";
import Home from "./pages/Home";
import Items from "./pages/Items";
import ReportItem from "./pages/ReportItem";
import ItemDetail from "./pages/ItemDetail";
import Claims from "./pages/Claims";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <div className="nav-brand">
            <span className="nav-icon">🎒</span>
            <Link to="/" className="nav-title">Campus Lost &amp; Found</Link>
          </div>
          <div className="nav-links">
            <NavLink to="/" end className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Home</NavLink>
            <NavLink to="/items?type=lost" className="nav-link">Lost Items</NavLink>
            <NavLink to="/items?type=found" className="nav-link">Found Items</NavLink>
            <NavLink to="/claims" className="nav-link">Claims</NavLink>
            <NavLink to="/report" className="nav-link btn-report">+ Report Item</NavLink>
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/items" element={<Items />} />
            <Route path="/items/:id" element={<ItemDetail />} />
            <Route path="/report" element={<ReportItem />} />
            <Route path="/claims" element={<Claims />} />
          </Routes>
        </main>

        <footer className="footer">
          <p>Campus Lost &amp; Found System · IT2234 Web Services &amp; Technology · 2024</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
