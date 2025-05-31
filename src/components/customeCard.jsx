import React from 'react';
import '../styling/customCard.css';


const CustomCard = ({ children, label }) => {
  return (
    <div className="custom-card">
      {children}
      <div className="card-bottom-right">
        <span className="card-label">{label}</span>
      </div>
      <div className="card-line"></div>

    </div>
  );
};

export default CustomCard;
