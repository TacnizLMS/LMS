import React, { useEffect, useState } from 'react';
import { FaCog } from 'react-icons/fa';
import { IoMdPerson } from "react-icons/io";
import '../styling/appBar.css';
import Settings from '../screens/settings'; 

const AppBar = ({ username = "John Doe", role = "Admin" }) => {
  const [dateTime, setDateTime] = useState(new Date());
  const [showSettings, setShowSettings] = useState(false); // state to control modal visibility

  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCloseModal = () => {
    setShowSettings(false);
  };

  return (
    <>
      <div className="app-bar">
        <div className="app-bar-left">
          <IoMdPerson className="icon user-icon" />
          <div className="user-info">
            <div className="username">{username}</div>
            <div className="role">{role}</div>
          </div>
        </div>
        <div className="app-bar-right">
          <div className="datetime">
            {dateTime.toLocaleDateString()} | {dateTime.toLocaleTimeString()}
          </div>
          <FaCog
            className="icon settings-icon"
            onClick={() => setShowSettings(true)} // show settings modal
            style={{ cursor: 'pointer' }}
          />
        </div>
      </div>

      {showSettings && (
        <div className="modal-overlay " onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}> {/* prevent closing when clicking inside modal */}
            <Settings onClose={handleCloseModal} />
          </div>
        </div>
      )}
    </>
  );
};

export default AppBar;
