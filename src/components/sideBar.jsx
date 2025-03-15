import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styling/Sidebar.css"; 
import { FaBook, FaUser, FaHome, FaMoneyBill, FaSignOutAlt, FaLeaf } from "react-icons/fa";
import { FaBars, FaTimes } from "react-icons/fa";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  const menuItems = [
    { name: "Dashboard", icon: <FaHome />, path: "/" },
    { name: "Catalog", icon: <FaLeaf />, path: "/catalog" },
    { name: "Books", icon: <FaBook />, path: "/books" },
    { name: "Users", icon: <FaUser />, path: "/users" },
    { name: "Fine", icon: <FaMoneyBill />, path: "/fine" },
  ];

  return (
    <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
      {/* Logo section */}
      <div className={`logo ${isOpen ? "open" : "closed"}`}></div>
      <div className="logo1">
        <h2 className={isOpen ? "show" : "hide"}>ReadSphere</h2>
      </div>

      {/* Menu Items */}
      <nav className="menu-items">
        {menuItems.map((item, index) => (
          <Link key={index} to={item.path} className="menu-item">
            {item.icon}
            <span className={isOpen ? "show" : "hide"}>{item.name}</span>
          </Link>
        ))}
      </nav>

      {/* Log Out button */}
      <div className="logout-btn">
        <Link to="/logout" className="menu-item">
          <FaSignOutAlt />
          <span className={isOpen ? "show" : "hide"}>Log Out</span>
        </Link>
      </div>

      {/* Toggle button */}
      <button className="toggle-btn" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>
    </div>
  );
};

export default Sidebar;
