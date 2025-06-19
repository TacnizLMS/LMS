import React, { useState } from 'react';
import { FaCog } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';
import '../styling/settings.css'; 
import { changePassword, getCurrentUserEmail } from '../services/apiServiceFile'; 

const Settings = ({ onClose }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleConfirm = async () => {
    // Reset previous messages
    setError('');
    setSuccess('');

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters long');
      return;
    }

    try {
      setIsLoading(true);
      
      // Get user email using the new function
      const userEmail = getCurrentUserEmail();
      
      console.log('Debug - Email retrieval:', userEmail);
      console.log('Debug - localStorage userEmail:', localStorage.getItem('userEmail'));
      console.log('Debug - sessionStorage userEmail:', sessionStorage.getItem('userEmail'));
      console.log('Debug - sessionStorage JWT:', sessionStorage.getItem('jwt'));
      
      console.log('Attempting to change password for email:', userEmail);

      if (!userEmail) {
        setError('User email not found. Please log in again.');
        return;
      }

      const result = await changePassword(userEmail, currentPassword, newPassword);
      
      console.log('Password change result:', result);

      // Check the response format: { jwt: null, message: "Password changed successfully.", status: true }
      if (result.status === true) {
        setSuccess(result.message || 'Password changed successfully!');
        
        // Clear form
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        
        // Optionally close the modal after a delay
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        setError(result.message || 'Failed to change password');
      }
      
    } catch (error) {
      console.error('Password change error:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
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

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="formSetting">
        <div className="form-rowSetting">
          <label>Enter Current Password</label>
          <input
            type="password"
            placeholder="Enter Current Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div className="form-rowSetting">
          <label>Enter New Password</label>
          <input
            type="password"
            placeholder="Enter New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div className="form-rowSetting">
          <label>Confirm New Password</label>
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="action-buttons">
        <button className="cancel-btn" onClick={onClose}>
          CANCEL
        </button>
        <button className="confirm-btn" onClick={handleConfirm} disabled={isLoading}>
          CONFIRM
        </button>
      </div>
    </div>
  );
};

export default Settings;