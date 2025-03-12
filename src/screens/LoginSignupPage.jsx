import React from 'react';
import '../styling/LoginSignupPage.css';

const LoginSignupPage = () => {
    return (
        <div className="container">
            <div className="login-section">
                <h2>Welcome Back !!</h2>
                <p className="tagline">“Read, Return, Repeat”</p>
                <p>Please enter your credentials to log in</p>
                <input type="text" placeholder="Username" />
                <input type="password" placeholder="Password" />
                <a href="#" className="forgot-password">Forgot password?</a>
                <center><button className="sign-in">SIGN IN</button></center>
            </div>
            <div className="signup-section">
                <div className="logo"></div>
                <h1>ReadSphere</h1>
                <p className="library">LIBRARY</p>
                <p>New to our platform? Sign Up now.</p>
                <button className="sign-up">SIGN UP</button>
            </div>
        </div>
    );
};

export default LoginSignupPage;
