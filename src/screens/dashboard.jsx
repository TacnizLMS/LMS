import React from 'react';
import Sidebar from '../components/sideBar';
import AppBar from '../components/appBar';
import '../styling/dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <AppBar username="Chamod Weerasinghe" role="User" />
        <div className="dashboard-body">
          {/* Put your page content here */}
          <h1>Welcome to the Dashboard</h1>
          <p>This is your main content area.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
