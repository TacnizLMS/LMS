import { useState } from 'react';
import '../styling/LogoutPopup.css';

const LogoutPopup = () => {
  const [showPopup, setShowPopup] = useState(true);

const handleLogout = () => {
    console.log("Logging out...");
    setShowPopup(false);
    window.location.href = '/';
};

  const handleCancel = () => {
    setShowPopup(false);
    window.location.href = '/';

  };

  return (
    showPopup && (
      <div className="popup-overlay">
        <div className="popup-content">
        <center> <div className="logo"></div></center>

          <h2 className="popup-title">ReadSphere</h2>
          <p className="popup-message">Are you going to logout?</p>
          <div className="popup-buttons">
            <button
              className="buttoncancel"
              onClick={handleCancel}
            >
             <center>No</center> 
            </button>
            <button
              className="button-logout"
              onClick={handleLogout}
            >
              Yes
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default LogoutPopup;
