import React, { useState } from 'react';
import { FaCog } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';
import '../styling/settings.css'; 

const Settings = ({ onClose }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleConfirm = () => {
    // Add validation and submit logic here
    console.log({ currentPassword, newPassword, confirmPassword });
  };

  return (
    <div className="change-credentials-container">
      <div className="headerSetting">
        <div className="icon-box">
          <FaCog size={28} />
        </div>
        <h2>Change Credentials</h2>
        <button className="close-btn" onClick={onClose}>
          <IoClose size={24} />
        </button>
      </div>

      <hr className="gold-line" />

      <div className="formSetting">
        <div className="form-rowSetting">
          <label>Enter Current Password</label>
          <input
            type="password"
            placeholder="Enter Current Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </div>

        <div className="form-rowSetting">
          <label>Enter New Password</label>
          <input
            type="password"
            placeholder="Enter New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>

        <div className="form-rowSetting">
          <label>Confirm New Password</label>
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
      </div>

      <div className="action-buttons">
        <button className="cancel-btn" onClick={onClose}>
          CANCEL
        </button>
        <button className="confirm-btn" onClick={handleConfirm}>
          CONFIRM
        </button>
      </div>
    </div>
  );
};

export default Settings;
