// pages/UsersAdmin.js
import React, { useState, useEffect } from "react";
import UserTableAdmin from "../../components/userTableAdmin";
import Sidebar from "../../components/sideBar";
import AppBar from "../../components/appBar";
import "../../styling/userPageAdmin.css";
import { fetchUsers, deleteUser } from "../../services/userService";

const UsersPageAdmin = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load users when component mounts
  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const userData = await fetchUsers();
      setUsers(userData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Handle edit user
  const handleEditUser = (user) => {
    console.log("Edit user:", user);
    // TODO: Implement edit functionality
    // You can open a modal or navigate to an edit page
    // Example: setSelectedUser(user); setShowEditModal(true);
  };

  // Handle delete user
  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(userId);
        // Remove user from local state
        setUsers(users.filter((user) => (user.id || user._id) !== userId));
        alert("User deleted successfully");
      } catch (err) {
        alert("Error deleting user: " + err.message);
      }
    }
  };

  // Handle add user
  const handleAddUser = () => {
    console.log("Add new user");
    // TODO: Implement add user functionality
    // You can open a modal or navigate to an add user page
    // Example: setShowAddModal(true);
  };

  return (
    <div className="admin-layout">
      <Sidebar />

      <div className="main-content">
        <AppBar />

        <div className="content-wrapper" style={{ padding: "20px" }}>
          <div
            className="page-header"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <button
              onClick={handleAddUser}
              style={{
                backgroundColor: "#8b6c2f",
                color: "white",
                border: "none",
                padding: "10px 20px",
                borderRadius: "5px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "bold",
              }}
            >
              + Add User
            </button>

            <p
              style={{
                textAlign: "right",
                backgroundColor: "#8b6c2f",
                color: "white",
                border: "none",
                padding: "10px 20px",
                borderRadius: "5px",
                fontSize: "14px",
                fontWeight: "bold",
              }}
            >
              Total Users: {users.length}
            </p>
          </div>

          {loading && (
            <div style={{ textAlign: "center", padding: "20px" }}>
              <p>Loading users...</p>
            </div>
          )}

          {error && (
            <div
              style={{
                textAlign: "center",
                padding: "20px",
                color: "red",
                backgroundColor: "#ffebee",
                borderRadius: "5px",
                marginBottom: "20px",
              }}
            >
              <p>Error: {error}</p>
              <button
                onClick={loadUsers}
                style={{
                  marginTop: "10px",
                  padding: "8px 16px",
                  backgroundColor: "#8B4513",
                  color: "white",
                  border: "none",
                  borderRadius: "3px",
                  cursor: "pointer",
                }}
              >
                Retry
              </button>
            </div>
          )}

          {!loading && !error && (
            <>
              <UserTableAdmin
                users={users}
                onEditUser={handleEditUser}
                onDeleteUser={handleDeleteUser}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UsersPageAdmin;
