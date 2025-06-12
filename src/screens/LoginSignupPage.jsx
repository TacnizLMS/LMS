import React, { useState } from "react";
import "../styling/LoginSignupPage.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const LoginSignupPage = () => {
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const decodeJwt = () => {
    const jwt = sessionStorage.getItem("jwt");
    if (jwt) {
      const payload = JSON.parse(atob(jwt.split(".")[1]));
      console.log("JWT Payload:", payload);
    } else {
      console.log("No JWT found in sessionStorage.");
    }
  };

  const navigate = useNavigate();

  const handleSignIn = async () => {
    const email = document
      .querySelector('input[placeholder="Email"]')
      .value.trim();
    const password = document
      .querySelector('input[placeholder="Password"]')
      .value.trim();

    // Reset errors
    setEmailError("");
    setPasswordError("");

    let valid = true;

    if (!email) {
      setEmailError("Email is required");
      valid = false;
    }

    if (!password) {
      setPasswordError("Password is required");
      valid = false;
    }

    if (!valid) return;

    try {
      const response = await fetch("http://localhost:8080/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("Response:", data);
      /*            
email: "umeshagodawela@gmail.com"
fullName: "Umesha Godawela"
lastName: "Godawela"
mobile: "0707445923"
password: "123456"
role: "User"
*/
      if (data.status) {
sessionStorage.setItem("jwt", `Bearer ${data.jwt}`); // includes Bearer prefix

  const payload = JSON.parse(atob(data.jwt.split(".")[1]));

          sessionStorage.setItem("fullName", payload.email); // Store name
  sessionStorage.setItem("role", payload.roles); // Store role
  
  sessionStorage.setItem("userId", payload.id);

  console.log("User Role:", payload.roles);

        console.log("Login message:", data.message);
        decodeJwt();
        if (data.message === "Login success" && data.jwt !== null) {
          navigate("/dashboard");
        }
      } else {
        alert("Login failed please try again.");
        console.error("Login failed:", data.message);
      }
    } catch (error) {
      console.error("Error during sign-in:", error);
      setPasswordError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="container">
      <div className="login-section">
        <h2>Welcome Back !!</h2>
        <p className="tagline">“Read, Return, Repeat”</p>
        <p>Please enter your credentials to log in</p>

        <div className="input-group">
          <input type="text" placeholder="Email" />
          {emailError && <p className="error-text">{emailError}</p>}
        </div>

        <div className="input-group">
          <input type="password" placeholder="Password" />
          {passwordError && <p className="error-text">{passwordError}</p>}
        </div>

        <Link to="/forgot-password" className="forgot-password">
          Forgot password?
        </Link>

        <center>
          <button className="sign-in" onClick={handleSignIn}>
            SIGN IN
          </button>
        </center>
      </div>

      <div className="signup-section">
        <div className="logo"></div>
        <h1>ReadSphere</h1>
        <p className="library">LIBRARY</p>
        <p className="signInMoto">New to our platform? Sign Up now.</p>
        <Link to="/signUp">
          <button className="sign-up">SIGN UP</button>
        </Link>
      </div>
    </div>
  );
};

export default LoginSignupPage;
