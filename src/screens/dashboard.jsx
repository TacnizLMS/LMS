import React from "react";
import Sidebar from "../components/sideBar";
import AppBar from "../components/appBar";
import "../styling/dashboard.css";
import CustomCard from "../components/customeCard";
import { FaBookOpen } from "react-icons/fa";
import CustomInfoCard from "../components/customInfoCard";
 import { GiReturnArrow,GiWhiteBook  } from "react-icons/gi";
import { getRecentlyExpiringCatalog } from "../services/catalogService";

const Dashboard = () => {

  const [recentCatalog, setRecentCatalog] = React.useState(null);
  const [remainingDays, setRemainingDays] = React.useState(null);

  React.useEffect(() => {
    async function fetchCatalog() {
      try {
        const catalog = await getRecentlyExpiringCatalog();
        setRecentCatalog(catalog);
        const expiredDate = new Date(catalog?.expiredDate);
        const today = new Date();
        const diffTime = expiredDate - today;
        const remainingDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        setRemainingDays(remainingDays);
        // You can use remainingDays as needed, e.g. set it in state
      } catch (error) {
        setRecentCatalog(null);
      }
    }
    fetchCatalog();
  }, []);

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
              icon={<FaBookOpen />}
              title="Your Borrowed Book List"
              to="/catalog"
            />
            <CustomInfoCard
              icon={<GiReturnArrow />}
              title="Your Returned Book List"
              to="/catalog?tab=completed"
            />
            <CustomInfoCard
              icon={<GiWhiteBook />}
              title="Expiring Catalog"
              subtitle={
                recentCatalog
                  ? `${remainingDays} Days Remaining`
                  : "No expiring catalog"
              }
              details={recentCatalog}
              
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
