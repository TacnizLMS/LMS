import React from 'react';

const Homepage = () => {
    const getStart = () => {
        // Logic to navigate to the next step or page
        console.log("Get Started clicked!");
        console.log("jwt_taken: " + sessionStorage.getItem("jwt"));
        //print decoded jwt
        const jwt = sessionStorage.getItem("jwt");
        if (jwt) {
            const payload = JSON.parse(atob(jwt.split('.')[1]));
            console.log("Decoded JWT Payload:", payload);
        } else {
            console.log("No JWT found in sessionStorage.");
        }

    };
    return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
            <h1>Welcome to the LMS</h1>
            <p>Your one-stop solution for learning management.</p>
            <button 
                style={{
                    padding: '10px 20px',
                    fontSize: '16px',
                    backgroundColor: '#007BFF',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                }}
                onClick={() => getStart()}
            >
                Get Started
            </button>
        </div>
    );
};

export default Homepage;