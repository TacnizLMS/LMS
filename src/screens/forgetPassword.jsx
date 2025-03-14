import React from 'react';
import '../styling/forgetPassword.css';
import { Link } from 'react-router-dom';

// const navigateTonext = () => {
//   <Link to="/forgot-password"></Link>
// }
const ForgotPassword = () => {
  return (
    <div className="forgot-password-container">
      <div className="left-panel">
        <div className="logo-section">
          <center><div className="logo"></div></center>
          <h1>ReadSphere</h1>
          <p className='library'>LIBRARY</p>
          <blockquote>"Read, Return, Repeat"</blockquote>
        </div>
      </div>

      <div className="right-panel">
       <Link to="/"> <button className="back-button">BACK</button> </Link>
        <div className="form-section">
          <h2>Forgot Password</h2>
          <p>Please enter your username</p>
          <input type="text" placeholder="Username" className="input-field" />
          <Link to="/otpPage"><button className="reset-button">RESET PASSWORD</button></Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;