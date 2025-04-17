import React, { useEffect, useState } from 'react';
import { FaUserCircle, FaCog } from 'react-icons/fa';
import '../styling/appBar.css'; 
import { IoMdPerson } from "react-icons/io";


const AppBar = ({ username = "John Doe", role = "Admin" }) => {
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="app-bar">
      <div className="app-bar-left">
        <IoMdPerson  className="icon user-icon" />
        <div className="user-info">
          <div className="username">{username}</div>
          <div className="role">{role}</div>
        </div>
      </div>
      <div className="app-bar-right">
        <div className="datetime">
          {dateTime.toLocaleDateString()} | {dateTime.toLocaleTimeString()}
        </div>
        <FaCog className="icon settings-icon" />
      </div>
    </div>
  );
};

export default AppBar;
