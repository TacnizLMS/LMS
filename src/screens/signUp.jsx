import React from "react";
import "../styling/SignUp.css";
import { Link } from "react-router-dom";

const SignUp = () => {
  return (
    <div className="signup-container">
      {/* Left Section */}
      <div className="leftsection">
      <center> <div className="logo"></div></center>
        <h2>ReadSphere <span>LIBRARY</span></h2>
        <p>Already have an account? Sign in now.</p>
       <Link to="/"> <button className="signin-btn">SIGN IN</button></Link>
      </div>

      {/* Right Section */}
      <div className="right-section">
        <h2>Sign Up</h2>
        <p className="subtitle">"Read, Return, Repeat"</p>
        <p>Please provide your information to sign up.</p>

        <div className="form">
          <div className="row">
            <input type="text" placeholder="First Name" />
            <input type="text" placeholder="Last Name" />
          </div>
          <div className="row">
            <input type="text" placeholder="Contact No" />
            <input type="email" placeholder="Email" />
          </div>
          <div className="row">
            <input type="text" placeholder="Username" />
            <input type="password" placeholder="Password" />
          </div>
         <Link to="/"><button className="signup-btn">SIGN UP</button></Link> 
        </div>
      </div>
    </div>
  );
};

export default SignUp;
