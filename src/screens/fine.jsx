import React, { useEffect, useState } from "react";
import "../styling/book.css";
import Sidebar from "../components/sideBar";
import AppBar from "../components/appBar";

const FinePage = () => {


  return (
    <div className="library-page">
      <Sidebar />
      <div className="main-contentb">
        <AppBar />
        <br />
        <div>
          <button onClick={() => {}}>
            Cart ()
          </button>
          <div style={{ marginTop: "20px" }}></div>
        </div>        
      </div>
    </div>
  );
};

export default FinePage;
