import React, { useState } from "react";
import "../styling/SignUp.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    mobile: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { firstName, lastName, mobile, email, password, confirmPassword } = formData;
    // Perform validation checks here (e.g., check if passwords match)
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    // Prepare data to send to the server
    const dataToSend = {
      fullName : `${firstName} ${lastName}`,
      lastName,
      mobile,
      email,
      password
    };
    try {
      //print dataToSend
      console.log(dataToSend);
      const response = await fetch("http://localhost:8080/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(dataToSend)
      });
      if (response.ok) {
        // Handle successful sign-up (e.g., redirect to login page)
        console.log("Sign-up successful");
        navigate("/");
      } else {
        // Handle errors
        console.error("Sign-up failed");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };


  return (
    <div className="signup-container">
      {/* Left Section */}
      <div className="leftsection">
        <center><div className="logo"></div></center>
        <h2>ReadSphere <span>LIBRARY</span></h2>
        <p>Already have an account? Sign in now.</p>
        <Link to="/"><button className="signin-btn">SIGN IN</button></Link>
      </div>

      {/* Right Section */}
      <div className="right-section">
        <h2>Sign Up</h2>
        <p className="subtitle">"Read, Return, Repeat"</p>
        <p>Please provide your information to sign up.</p>

        <form className="form" onSubmit={handleSubmit}>
          <div className="row">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
            />
          </div>
          <div className="row">
            <input
              type="text"
              name="mobile"
              placeholder="Contact No"
              value={formData.mobile}
              onChange={handleChange}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="row">
          <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
            <input
              type="Confirm Password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="signup-btn">SIGN UP</button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
