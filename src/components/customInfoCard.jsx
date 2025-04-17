import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styling/customCardInfo.css';

const CustomInfoCard = ({ icon, title, subtitle, to }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) {
      navigate(to);
    }
  };

  return (
    <div className="info-card clickable-card" onClick={handleClick}>
      <div className="info-card-line" />
      <div className="info-card-icon-container">
        {icon}
      </div>
      <div className="info-card-text">
        <h3>{title}</h3>
        {subtitle && <p>{subtitle}</p>}
      </div>
    </div>
  );
};

export default CustomInfoCard;
