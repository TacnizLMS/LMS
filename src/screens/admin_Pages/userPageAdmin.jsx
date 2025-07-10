// pages/UsersAdmin.js
import React, { useState, useEffect, useCallback } from "react";
import UserTableAdmin from "../../components/userTableAdmin";
import Sidebar from "../../components/sideBar";
import AppBar from "../../components/appBar";
import "../../styling/userPageAdmin.css";
import { fetchUsers, deleteUser, addUser } from "../../services/userService";

const UsersPageAdmin = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({
    email: "",
    password: "",
    fullName: "",
    mobile: "",
    role: "USER"
  });

  // Function to store user count in secure storage
  const storeUserCount = (totalUsers) => {
    try {
      const userCountData = {
        totalCount: totalUsers,
        totalUsers: totalUsers,
        lastUpdated: new Date().toISOString(),
        timestamp: Date.now()
      };

      // Store in both sessionStorage (more secure) and localStorage (fallback)
      sessionStorage.setItem("userCount", JSON.stringify(userCountData));
      localStorage.setItem("userCount", JSON.stringify(userCountData));
      
      console.log("User count stored successfully:", totalUsers);
    } catch (error) {
      console.error("Error storing user count:", error);
    }
  };

  // Load users when component mounts
  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const userData = await fetchUsers();
      setUsers(userData);
      
      // Store the user count after successful fetch
      storeUserCount(userData.length);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

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
        const updatedUsers = users.filter((user) => (user.id || user._id) !== userId);
        setUsers(updatedUsers);
        
        // Update stored user count after deletion
        storeUserCount(updatedUsers.length);
        
        alert("User deleted successfully");
      } catch (err) {
        alert("Error deleting user: " + err.message);
      }
    }
  };

  // Handle add user
  const handleAddUser = () => {
    setShowAddModal(true);
  };

  // Handle save new user
  const handleSaveUser = async () => {
    try {
      const userData = await addUser(newUser);
      const updatedUsers = [...users, userData];
      setUsers(updatedUsers);
      
      // Update stored user count after addition
      storeUserCount(updatedUsers.length);
      
      setShowAddModal(false);
      setNewUser({
        email: "",
        password: "",
        fullName: "",
        mobile: "",
        role: ""
      });
      alert("User added successfully");
    } catch (err) {
      alert("Error adding user: " + err.message);
    }
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

        {/* Add User Modal */}
        {showAddModal && (
          <div className="modal-overlayBook">
            <div className="modal-contentBook">
              <h2>Add New User</h2>
              <label>
                Full Name:{" "}
                <input
                  value={newUser.fullName}
                  onChange={(e) =>
                    setNewUser({ ...newUser, fullName: e.target.value })
                  }
                />
              </label>
              <label>
                Email:{" "}
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser({ ...newUser, email: e.target.value })
                  }
                />
              </label>
              <label>
                Password:{" "}
                <input
                  type="password"
                  value={newUser.password}
                  onChange={(e) =>
                    setNewUser({ ...newUser, password: e.target.value })
                  }
                />
              </label>
              <label>
                Mobile:{" "}
                <input
                  value={newUser.mobile}
                  onChange={(e) =>
                    setNewUser({ ...newUser, mobile: e.target.value })
                  }
                />
              </label>
              <div className="form-field">
                <label>
                  Role:
                  <br />
                  <select
                    value={newUser.role}
                    onChange={(e) =>
                      setNewUser({ ...newUser, role: e.target.value })
                    }
                  >
                    <option value="USER">User</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </label>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "20px",
                }}
              >
                <button onClick={() => setShowAddModal(false)}>Cancel</button>
                <button onClick={handleSaveUser} style={{ marginLeft: "auto" }}>
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersPageAdmin;