import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "../styling/Sidebar.css";
import {
  FaBook,
  FaUsers,
  FaHome,
  FaMoneyBill,
  FaSignOutAlt,
  FaLeaf,
  FaBars,
  FaTimes,
} from "react-icons/fa";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();

  //  // Get user role from localStorage 
  // const getUserRole = () => {
  //   return sessionStorage.getItem("role"); 
  // };

  // if (getUserRole()==="User") {
  //   return null; 
  // }

  const menuItems = [
    { name: "Dashboard", icon: <FaHome />, path: "/dashboard" },
    { name: "Catalog", icon: <FaLeaf />, path: "/catalog" },
    { name: "Books", icon: <FaBook />, path: "/books" },
    // To do: add user role based access control
    { name: "Fine", icon: <FaMoneyBill />, path: "/fine" },
    { name: "Admin Dashboard", icon: <FaHome />, path: "/admin-dashboard" },
    { name: "Catalog Admin", icon: <FaLeaf />, path: "/catalog-admin" },
    { name: "Books Admin", icon: <FaBook />, path: "/books-admin" },
        { name: "Users", icon: <FaUsers />, path: "/userPageAdmin" },


  ];

  return (
    <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
      <div className={`logo ${isOpen ? "open" : "closed"}`}></div>
      <div className="logo1">
        <h2 className={isOpen ? "show" : "hide"}>ReadSphere</h2>
      </div>

      <nav className="menu-items">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className={`menu-item ${location.pathname === item.path ? "selected" : ""}`}
          >
            {item.icon}
            <span className={isOpen ? "show" : "hide"}>{item.name}</span>
          </Link>
        ))}
      </nav>

      <div className="logout-btn">
        <Link
          to="/logout"
          className={`menu-item ${location.pathname === "/logout" ? "selected" : ""}`}
        >
          <FaSignOutAlt />
          <span className={isOpen ? "show" : "hide"}>Log Out</span>
        </Link>
      </div>

      <button className="toggle-btn" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>
    </div>
  );
};

export default Sidebar;
