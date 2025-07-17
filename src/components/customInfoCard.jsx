import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styling/customCardInfo.css';

const CustomInfoCard = ({ icon, title, subtitle, to, details }) => {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);

  const handleClick = () => {
    if (title === 'Expiring Catalog' && details) {
      setShowPopup(true); // Show modal
    } else if (to) {
      navigate(to); // Navigate if not Expiring Catalog
    }
  };

  const handleClose = (e) => {
    e.stopPropagation();
    setShowPopup(false);
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
    <>
      <div
        className="info-card clickable-card"
        onClick={handleClick}
        style={{ position: 'relative' }}
      >
        <div className="info-card-line" />
        <div className="info-card-icon-container">{icon}</div>
        <div className="info-card-text">
          <h3 style={{ fontSize: '1.5rem' }}>{title}</h3>
          {subtitle && <p style={{ fontSize: '1rem' }}>{subtitle}</p>}
        </div>
      </div>

      {/* Modal for Expiring Catalog */}
      {showPopup && (
        <div className="popup-overlay" onClick={handleClose}>
          <div className="dashboard-popup-content" onClick={(e) => e.stopPropagation()}>
            <h2 style={{ marginBottom: '15px' }}>Recently Expiring Catalog Details</h2>
            <p><strong>ID:</strong> {details?.id || 'N/A'}</p>
            <p><strong>Books:</strong> {catalogTitles || 'N/A'}</p>
            <p><strong>Borrowed on:</strong> {borrowDate || 'N/A'}</p>
            <p><strong>Expires on:</strong> {expiredDate || 'N/A'}</p>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
              <button onClick={handleClose}>Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CustomInfoCard;
