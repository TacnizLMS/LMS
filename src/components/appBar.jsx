import React, { useEffect, useState } from 'react';
import { FaCog } from 'react-icons/fa';
import { IoMdPerson } from "react-icons/io";
import '../styling/appBar.css';
import Settings from '../screens/settings'; 

const AppBar = () => {
    // Default values
    const DEFAULT_NAME = "Guest";
    const DEFAULT_ROLE = "User";

    // Helper function to safely get sessionStorage values
    const getSessionItem = (key, defaultValue) => {
        const value = sessionStorage.getItem(key);
        return value !== null && value !== undefined && value !== "undefined" && value !== "null" 
            ? value 
            : defaultValue;
    };

    // Read user info from sessionStorage or use defaults
    const fullName = getSessionItem("fullName", DEFAULT_NAME);
    const role = getSessionItem("role", DEFAULT_ROLE);

    const [dateTime, setDateTime] = useState(new Date());
    const [showSettings, setShowSettings] = useState(false);

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
                        <div className="username">{fullName}</div>
                        <div className="role">{role}</div>
                    </div>
                </div>
                <div className="app-bar-right">
                    <div className="datetime">
                        {dateTime.toLocaleDateString()} | {dateTime.toLocaleTimeString()}
                    </div>
                    <FaCog
                        className="icon settings-icon"
                        onClick={() => setShowSettings(true)}
                        style={{ cursor: 'pointer' }}
                    />
                </div>
            </div>

            {showSettings && (
                <div className="modal-overlay" onClick={handleCloseModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <Settings onClose={handleCloseModal} />
                    </div>
                </div>
            )}
        </>
    );
};

export default AppBar;