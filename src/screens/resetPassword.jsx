import React from 'react';
import '../styling/forgetPassword.css';
import { Link } from 'react-router-dom';


const ResetPassword = () => {
  return (
    <div className="forgot-password-container">
      <div className="left-panel">
        <div className="logo-section">
          <center><div className="logo"></div></center>
          <h1>ReadSphere</h1>
          <p className='library'>LIBRARY</p>
          <blockquote>"Innovative Library Management at Your Fingertips"</blockquote>
        </div>
      </div>

      <div className="right-panel">
       <Link to="/otpPage"> <button className="back-button">BACK</button> </Link>
        <div className="form-section">
          <h2>Reset Password</h2>
          <p>Please enter your new password</p>
          <input type="text" placeholder="New Password" className="input-field" />
          <input type="text" placeholder="Confirm Password" className="input-field" />

          <Link to="/reset-password"><button className="reset-button">RESET PASSWORD</button></Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;