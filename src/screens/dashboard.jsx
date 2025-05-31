import React from "react";
import Sidebar from "../components/sideBar";
import AppBar from "../components/appBar";
import "../styling/dashboard.css";
import CustomCard from "../components/customeCard";
import { FaBookOpen } from "react-icons/fa";
import CustomInfoCard from "../components/customInfoCard";
import { GiReturnArrow,GiWhiteBook  } from "react-icons/gi";

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-contentd">
        <AppBar username="Chamod Weerasinghe" role="User" />
        <div className="dashboard-body">
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              padding: "20px",
            }}
          >
            <CustomInfoCard
              icon={<FaBookOpen />}
              title="Your Borrowed Book List"
              to="/borrowed-books"
            />
            <CustomInfoCard
              icon={<GiReturnArrow />}
              title="Your Returned Book List"
              to="/borrowed-books"
            />
            <CustomInfoCard
              icon={<GiWhiteBook  />}
              title="Book Name : The Great Gatsby"
                subtitle="Time Remaining : 2 Days"
              to="/borrowed-books"
            />
          </div>
          <center>
            <div className="logo"></div>
            <h1>ReadSphere</h1>
            <p className="library">LIBRARY</p>
          </center>
        <center> <div style={{ padding: "50px" }}>
            <CustomCard label="~ ReadSphere Team">
              <p>
                "Embarking on the journey of reading cultivates personal growth,
                paving the way to excellence and the enrichment of character."
              </p>
            </CustomCard>
          </div>
          </center> 
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
