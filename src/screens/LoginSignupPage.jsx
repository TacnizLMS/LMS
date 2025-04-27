import React from 'react';
import '../styling/LoginSignupPage.css';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const LoginSignupPage = () => {
    const decodeJwt=() => {
        const jwt = sessionStorage.getItem('jwt');
        if (jwt) {
            const payload = JSON.parse(atob(jwt.split('.')[1]));
            console.log('JWT Payload:', payload);
        } else {
            console.log('No JWT found in sessionStorage.');
        }
    }
    const navigate = useNavigate();
    const handleSignIn = async () => {
        const email = document.querySelector('input[placeholder="Email"]').value;
        const password = document.querySelector('input[placeholder="Password"]').value;

        try {
            const response = await fetch('http://localhost:8080/auth/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            console.log('Response:', data);

            if (data.status) {
                sessionStorage.setItem('jwt', data.jwt);
                console.log('Login message:', data.message);
                decodeJwt();
                if(data.message === "Login success" && data.jwt !== null) {
                    navigate('/dashboard');
                }
                // Redirect or perform additional actions here
            } else {
                alert("Login failed please try again.");
                console.error('Login failed:', data.message);
            }
        } catch (error) {
            console.error('Error during sign-in:', error);
            console.log('error:', error.message);
        }
    };

    return (
        <div className="container">
            <div className="login-section">
                <h2>Welcome Back !!</h2>
                <p className="tagline">“Read, Return, Repeat”</p>
                <p>Please enter your credentials to log in</p>
                <input type="text" placeholder="Email" />
                <input type="password" placeholder="Password" />
                <Link to="/forgot-password" className="forgot-password">Forgot password?</Link>
                <center><button className="sign-in" onClick={handleSignIn}>SIGN IN</button></center>
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
