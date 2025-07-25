import React, { useState } from "react";
import "../styling/SignUp.css";
import { Link, useNavigate } from "react-router-dom";
import {
  showSuccess,
  showError,
  confirmDialog,
  showInfo,
} from "../utils/alertUtil"; 

const SignUp = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    mobile: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "User" // Default role
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState(""); // NEW for showing server errors
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required.";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required.";
    if (!formData.mobile.trim()) newErrors.mobile = "Contact number is required.";
    if (!formData.email.trim()) newErrors.email = "Email is required.";
    if (!formData.password.trim()) newErrors.password = "Password is required.";
    if (!formData.confirmPassword.trim()) newErrors.confirmPassword = "Confirm password is required.";
    if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError(""); // Clear previous server error

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return; // on't submit if errors exist
    }

    const { firstName, lastName, mobile, email, password, confirmPassword, role } = formData;
    if (password !== confirmPassword) {
      return;
    }


    const dataToSend = {
      fullName: `${firstName} ${lastName}`,
      lastName,
      mobile,
      email,
      password,
      role
    };

    setIsLoading(true); // Start loading

    try {
      console.log(dataToSend);
      const response = await fetch("https://libraymanagementsystem-production.up.railway.app/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(dataToSend)
      });
      await showInfo("Email verification link has been sent to your email address. Please verify your email before logging in.");
      if (response.ok) {
        console.log("Sign-up successful");
        navigate("/");
      } else {
        console.error("Sign-up failed");
        setServerError("Something went wrong. Please try again later."); // Set server error
      }
    } catch (error) {
      console.error("Error:", error);
      setServerError("Something went wrong. Please try again later."); // Catch block
    } finally {
      setIsLoading(false); // End loading
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    setErrors({
      ...errors,
      [name]: ""
    });
    setServerError(""); // Clear server error if user starts editing
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

        {/* Show server error if any */}
        {serverError && <div className="server-error">{serverError}</div>}

        <form className="form" onSubmit={handleSubmit}>
          <div className="rowdropdown">
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="role-select"
              disabled={isLoading}
            >
              <option value="User">User</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          <div className="row">
            <div className="input-group">
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                disabled={isLoading}
              />
              {errors.firstName && <div className="error-text">{errors.firstName}</div>}
            </div>

            <div className="input-group">
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                disabled={isLoading}
              />
              {errors.lastName && <div className="error-text">{errors.lastName}</div>}
            </div>
          </div>

          <div className="row">
            <div className="input-group">
              <input
                type="text"
                name="mobile"
                placeholder="Contact No"
                value={formData.mobile}
                onChange={handleChange}
                disabled={isLoading}
              />
              {errors.mobile && <div className="error-text">{errors.mobile}</div>}
            </div>

            <div className="input-group">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
              />
              {errors.email && <div className="error-text">{errors.email}</div>}
            </div>
          </div>

          <div className="row">
            <div className="input-group">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
              />
              {errors.password && <div className="error-text">{errors.password}</div>}
            </div>

            <div className="input-group">
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={isLoading}
              />
              {errors.confirmPassword && <div className="error-text">{errors.confirmPassword}</div>}
            </div>
          </div>

          <button 
            type="submit" 
            className="signup-btn"
            disabled={isLoading}
            style={{
              opacity: isLoading ? 0.5 : 1,
              cursor: isLoading ? 'not-allowed' : 'pointer'
            }}
          >
            {isLoading ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <div className="spinner"></div>
                Signing Up...
              </div>
            ) : (
              'SIGN UP'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
