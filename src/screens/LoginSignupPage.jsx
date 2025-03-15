import React from 'react';
import '../styling/LoginSignupPage.css';
import { Link } from 'react-router-dom';

const LoginSignupPage = () => {
    return (
        <div className="container">
            <div className="login-section">
                <h2>Welcome Back !!</h2>
                <p className="tagline">“Read, Return, Repeat”</p>
                <p>Please enter your credentials to log in</p>
                <input type="text" placeholder="Username" />
                <input type="password" placeholder="Password" />
                <Link to="/forgot-password" className="forgot-password">Forgot password?</Link>
                <center><button className="sign-in">SIGN IN</button></center>
            </div>
            <div className="signup-section">
                <div className="logo"></div>
                <h1>ReadSphere</h1>
                <p className="library">LIBRARY</p>
                <p>New to our platform? Sign Up now.</p>
               <Link to="/signUp"><button className="sign-up">SIGN UP</button></Link> 
            </div>
        </div>
    );
};

export default LoginSignupPage;
