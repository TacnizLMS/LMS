import React from 'react';
import '../styling/OTPVerificationPage.css';
import { Link } from 'react-router-dom';


const OTPVerificationPage = () => {
    return (
        <div className="otp-verification-container">
            <div className="leftpanel">
                <div className="form-section">
                  <Link to="/forgot-password">  <button className="back-buttonOtp">BACK</button></Link>
                   <center> <div className="logo"></div></center>
                    <h2>Check your Mailbox</h2>
                    <p>Please enter the OTP to proceed</p>
                    <input 
                        type="text" 
                        className="inputfield" 
                        placeholder="OTP"
                    />
                    <Link to="/forgot-password"><button className="verify-button">VERIFY</button></Link>
                </div>
            </div>
            <div className="rightpanel">
            <center> <div className="logo"></div></center>
                <h1>ReadSphere</h1>
                <h3>LIBRARY</h3>
                <p className='moto'>"Innovative Library Management at Your Fingertips"</p>
            </div>
        </div>
    );
};

export default OTPVerificationPage;
