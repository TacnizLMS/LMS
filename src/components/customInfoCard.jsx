import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styling/customCardInfo.css';

const CustomInfoCard = ({ icon, title, subtitle, to, details }) => {
  const navigate = useNavigate();
  const [showTooltip, setShowTooltip] = useState(false);

  const handleClick = () => {
    if (to) {
      navigate(to);
    }
  };

  const handleMouseEnter = () => {
    if (title === 'Expiring Catalog' && details) {
      setShowTooltip(true);
    }
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  // Extract details for tooltip
  const catalogBooks = details?.catalogBooks?.map(entry => entry.book?.title).filter(Boolean) || [];
  const catalogTitles = catalogBooks.join(', ');

  const expiredDate = details?.expiredDate
    ? new Date(details.expiredDate).toLocaleDateString()
    : '';
  const borrowDate = details?.borrowDate
    ? new Date(details.borrowDate).toLocaleDateString()
    : '';

  return (
    <div
      className="info-card clickable-card"
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ position: 'relative' }}
    >
      <div className="info-card-line" />
      <div className="info-card-icon-container">
        {icon}
      </div>
      <div className="info-card-text">
        <h3 style={{ fontSize: '1.5rem' }}>{title}</h3>
        {subtitle && <p style={{ fontSize: '1rem' }}>{subtitle}</p>}
      </div>
      {showTooltip && (
        <div className="info-card-tooltip">
          <p style={{ fontSize: '0.6rem', textAlign: 'left' }}>Books: {catalogTitles}</p>
          <p style={{ fontSize: '0.6rem', textAlign: 'left' }}>Borrowed on: {borrowDate}</p>
          <p style={{ fontSize: '0.6rem', textAlign: 'left' }}>Expires on: {expiredDate}</p>
        </div>
      )}
    </div>
  );
};

export default CustomInfoCard;
