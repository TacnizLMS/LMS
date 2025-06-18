import React from "react";
import Sidebar from "../../components/sideBar";
import AppBar from "../../components/appBar";
import "../../styling/dashboard.css";
import CustomCard from "../../components/customeCard";
import { FaBookOpen, FaUser, FaLeaf } from "react-icons/fa";
import CustomInfoCard from "../../components/customInfoCard";

const DashboardAdmin = () => {
  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-contentd">
        <AppBar />
        <div className="dashboard-body">
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              padding: "20px",
            }}
          >
            <CustomInfoCard
              icon={<FaUser />}
              title=""
              subtitle="Total User Based"
              to="/catalog"
            />
            <CustomInfoCard
              icon={<FaBookOpen />}
              title=""
              subtitle="Total Book count"
              to="/books-admin"
            />
            <CustomInfoCard
              icon={<FaLeaf />}
              title=""
              subtitle="Total Catalog count"
              to="/catalog-admin"
            />
          </div>
          <center>
            <div className="logo"></div>
            <h1>ReadSphere</h1>
            <p className="library">LIBRARY</p>
          </center>
          <center>
            <div style={{ padding: "50px" }}>
              <CustomCard label="~ ReadSphere Team">
                <p>
                  "Embarking on the journey of reading cultivates personal
                  growth, paving the way to excellence and the enrichment of
                  character."
                </p>
              </CustomCard>
            </div>
          </center>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;
