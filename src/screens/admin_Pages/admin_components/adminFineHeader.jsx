import React from 'react';
import '../../../styling/adminFine.css';

const AdminFineHeader = ({
  users,
  totalRemainingFines,
  selectedUserId,
  onUserChange,
  selectedUserRemainingFine: selectedUserFineTotal
}) => {
  return (
    <div className="admin-fine-header">
      <div className="admin-fine-header-left">
        <div className="fine-select-user">
          <label htmlFor="userSelect">Select User:</label>
          <select
            id="userSelect"
            value={selectedUserId}
            onChange={(e) => onUserChange(e.target.value)}
          >
            <option value="">All Users</option>

            {users
              .filter((user) => user.role === "User").map((user) => (
                <option key={user._id} value={user._id}>
                  {user.fullName} ({user._id})
                </option>
              ))}
          </select>
        </div>

        {/* 🔸 Middle section - selected user's fine count */}
        {selectedUserId && (
          <div className="user-fine-count">
            <strong>Remaining Fine Count : </strong>
            <span className="fine-count-value">Rs: {selectedUserFineTotal.toFixed(2)}</span>
          </div>
        )}
      </div>

      <div className="fine-header-right">


        <div className="fine-total-amount">
          <strong>All Users Remaining Fines:</strong>
          <span className="fine-total-value">Rs. {totalRemainingFines.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default AdminFineHeader;
