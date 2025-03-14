import React from 'react';
import '../styling/forgetPassword.css';

const ForgotPassword = () => {
  return (
    <div className="forgot-password-container">
      <div className="left-panel">
        <div className="logo-section">
          <center><div className="logo"></div></center>
          <h1>ReadSphere</h1>
          <p>LIBRARY</p>
          <blockquote>"Read, Return, Repeat"</blockquote>
        </div>
      </div>

      <div className="right-panel">
        <button className="back-button">BACK</button>
        <div className="form-section">
          <h2>Forgot Password</h2>
          <p>Please enter your username</p>
          <input type="text" placeholder="Username" className="input-field" />
          <button className="reset-button">RESET PASSWORD</button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;