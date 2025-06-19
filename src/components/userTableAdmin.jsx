// components/UserTableAdmin.js
import React from "react";

const UserTableAdmin = ({ users, onEditUser, onDeleteUser }) => {
  // Helper function to safely render values
  const safeRender = (value) => {
    if (value === null || value === undefined) {
      return 'N/A';
    }
    if (typeof value === 'object') {
      // If it's an object, try to extract meaningful info or stringify it
      return value.name || value.title || JSON.stringify(value) || 'Unknown';
    }
    return String(value);
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    } catch (error) {
      return 'Invalid Date';
    }
  };

  return (
    <div className="table-wrapper">
      <table className="user-table">
        <thead> 
          <tr>
            <th>User ID</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Mobile</th>
            <th>Registered Date</th>
            <th>Verification Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users && users.length > 0 ? (
            users.map((user) => (
              <tr key={user.id || user._id}>
                <td>{safeRender(user.id || user._id)}</td>
                <td>{safeRender(user.fullName)}</td>
                <td>{safeRender(user.email)}</td>
                <td>
                  <span
                    className={`availability-status ${
                      user.role === "Admin" || user.role === "ADMIN"
                        ? "admin-role"
                        : "user-role"
                    }`}
                  >
                    {safeRender(user.role)}
                  </span>
                </td>
                <td>{safeRender(user.mobile)}</td>
                <td>{formatDate(user.registeredDate)}</td>
                <td>
                  <span
                    className={`availability-status ${
                      user.verified === true
                        ? "available"
                        : "not-available"
                    }`}
                  >
                    {user.verified ? 'Verified' : 'Not Verified'}
                  </span>
                </td>
                <td>
                  <button
                    title="Edit"
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      marginRight: 8,
                      color: "black",
                    }}
                    onClick={() => onEditUser && onEditUser(user)}
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 20h9" />
                      <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
                    </svg>
                  </button>
                  <button
                    title="Delete"
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      marginRight: 8,
                      color: "black",
                    }}
                    onClick={() => onDeleteUser && onDeleteUser(user.id || user._id)}
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2 2h2a2 2 0 0 1 2 2v2" />
                      <line x1="10" y1="11" x2="10" y2="17" />
                      <line x1="14" y1="11" x2="14" y2="17" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" style={{ textAlign: "center" }}>
                No users found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserTableAdmin;