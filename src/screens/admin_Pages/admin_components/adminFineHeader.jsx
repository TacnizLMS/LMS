import React from 'react';
import '../../../styling/adminFine.css';

const AdminFineHeader = ({ totalFines, unpaidFines, totalCatalogs }) => {
  const paidFines = totalFines - unpaidFines;
  const paymentRate = totalFines > 0 ? ((paidFines / totalFines) * 100).toFixed(1) : 0;

  return (
    <div className="admin-fine-header">
      <div className="admin-fine-stats">
        <div className="admin-fine-card total">
          <div className="admin-fine-card-content">
            <h4 className="admin-fine-title">Total System Fines</h4>
            <h3 className="admin-fine-amount">Rs. {totalFines.toFixed(2)}</h3>
            <p className="admin-fine-subtitle">{totalCatalogs} catalogs with fines</p>
          </div>
          <div className="admin-fine-icon total-icon">💰</div>
        </div>

        <div className="admin-fine-card unpaid">
          <div className="admin-fine-card-content">
            <h4 className="admin-fine-title">Outstanding Fines</h4>
            <h3 className="admin-fine-amount unpaid-amount">Rs. {unpaidFines.toFixed(2)}</h3>
            <p className="admin-fine-subtitle">Awaiting payment</p>
          </div>
          <div className="admin-fine-icon unpaid-icon">⚠️</div>
        </div>

        <div className="admin-fine-card paid">
          <div className="admin-fine-card-content">
            <h4 className="admin-fine-title">Collected Fines</h4>
            <h3 className="admin-fine-amount paid-amount">Rs. {paidFines.toFixed(2)}</h3>
            <p className="admin-fine-subtitle">{paymentRate}% collection rate</p>
          </div>
          <div className="admin-fine-icon paid-icon">✅</div>
        </div>

        <div className="admin-fine-card summary">
          <div className="admin-fine-card-content">
            <h4 className="admin-fine-title">Quick Actions</h4>
            <div className="admin-quick-actions">
              <button className="admin-action-btn export">Export Report</button>
              <button className="admin-action-btn notify">Send Reminders</button>
            </div>
          </div>
          <div className="admin-fine-icon summary-icon">📊</div>
        </div>
      </div>

      <div className="admin-fine-summary">
        <div className="collection-progress">
          <h5>Collection Progress</h5>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${paymentRate}%` }}
            ></div>
          </div>
          <span className="progress-text">{paymentRate}% collected</span>
        </div>
      </div>
    </div>
  );
};

export default AdminFineHeader;