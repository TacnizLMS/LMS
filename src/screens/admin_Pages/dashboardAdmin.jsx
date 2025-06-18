import React from "react";
import Sidebar from "../../components/sideBar";
import AppBar from "../../components/appBar";
import "../../styling/dashboard.css";
import CustomCard from "../../components/customeCard";
import { FaBookOpen, FaUser, FaLeaf } from "react-icons/fa";
import CustomInfoCard from "../../components/customInfoCard";

const DashboardAdmin = () => {
   const getCatalogCount = () => {
  try {
    // Try sessionStorage first (more secure for current session)
    let catalogCountData = sessionStorage.getItem("catalogCount");
    
    // If not found in sessionStorage, try localStorage as fallback
    if (!catalogCountData) {
      catalogCountData = localStorage.getItem("catalogCount");
    }
    
    if (catalogCountData) {
      const parsedData = JSON.parse(catalogCountData);
      
      // Check if data is not too old (optional: 1 hour expiry)
      const oneHour = 60 * 60 * 1000; // 1 hour in milliseconds
      const now = Date.now();
      
      if (parsedData.timestamp && (now - parsedData.timestamp) < oneHour) {
        return {
          count: parsedData.totalCount,
          lastUpdated: parsedData.lastUpdated,
          isValid: true
        };
      } else {
        // Data is expired, return with invalid flag
        return {
          count: parsedData.totalCount,
          lastUpdated: parsedData.lastUpdated,
          isValid: false
        };
      }
    }
    
    return {
      count: 0,
      lastUpdated: null,
      isValid: false
    };
    
  } catch (error) {
    console.error("Error retrieving catalog count:", error);
    return {
      count: 0,
      lastUpdated: null,
      isValid: false
    };
  }
};

const getStoredBookCount = () => {
  try {
    // Try sessionStorage first
    let storedData = sessionStorage.getItem("bookCount");
    
    // If not found in sessionStorage, try localStorage
    if (!storedData) {
      storedData = localStorage.getItem("bookCount");
    }
    
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      return {
        totalCount: parsedData.totalCount || 0,
        totalBooks: parsedData.totalBooks || 0,
        lastUpdated: parsedData.lastUpdated,
        timestamp: parsedData.timestamp
      };
    }
    
    return {
      totalCount: 0,
      totalBooks: 0,
      lastUpdated: null,
      timestamp: null
    };
  } catch (error) {
    console.error("Error loading book count from storage:", error);
    return {
      totalCount: 0,
      totalBooks: 0,
      lastUpdated: null,
      timestamp: null
    };
  }
};

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
              title={`${getStoredBookCount().totalBooks} Books`}
              subtitle="Total Book count"
              to="/books-admin"
            />
            <CustomInfoCard
              icon={<FaLeaf />}
              title={`${getCatalogCount().count} Catalogs`}
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
