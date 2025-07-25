// pages/UsersAdmin.js
import React, { useState, useEffect, useCallback } from "react";
import UserTableAdmin from "../../components/userTableAdmin";
import Sidebar from "../../components/sideBar";
import AppBar from "../../components/appBar";
import "../../styling/userPageAdmin.css";
import { fetchUsers, deleteUser, addUser,updateUser } from "../../services/userService";
import { showSuccess, showError,confirmDialog} from "../../utils/alertUtil"; // Assuming you have a confirm dialog component

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
  const [selectedUser, setSelectedUser] = useState(null);
const [showEditModal, setShowEditModal] = useState(false);
  // Spinner state for Add and Update buttons
  const [isSaving, setIsSaving] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
const [isDeleting, setIsDeleting] = useState(false);


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
  setSelectedUser(user);
  setShowEditModal(true);
};


const handleUpdateUser = async () => {
  try {
    const updated = await updateUser(selectedUser.id || selectedUser._id, {
      fullName: selectedUser.fullName,
      mobile: selectedUser.mobile,
      email: selectedUser.email,
      role: selectedUser.role,
    });

    const updatedUsers = users.map((user) =>
      (user.id || user._id) === updated.id ? updated : user
    );
    setUsers(updatedUsers);

    setShowEditModal(false);
    setSelectedUser(null);
await showSuccess("User updated successfully");
  } catch (err) {
    await showError("Error updating user: " + err.message);}
};

  // Handle delete user
const handleDeleteUser = async (userId) => {
  if (await confirmDialog("Are you sure you want to delete this user?")) {
    setIsDeleting(true);

    let success = false;

    try {
      await deleteUser(userId);
      const updatedUsers = users.filter(
        (user) => (user.id || user._id) !== userId
      );
      setUsers(updatedUsers);
      storeUserCount(updatedUsers.length);

      success = true;
    } catch (err) {
      await showError("Error deleting user: " + err.message);
    } finally {
      setIsDeleting(false);
      console.log(">>> Spinner turned off");
    }

    if (success) {
      await showSuccess("User deleted successfully");
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
      await addUser(newUser);
      await loadUsers();
      
      setShowAddModal(false);
      setNewUser({
        email: "",
        password: "",
        fullName: "",
        mobile: "",
        role: ""
      });
      await showSuccess("User added successfully");
    } catch (err) {
      await showError("Error adding user: " + err.message);
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
                <button
                  onClick={() => setShowAddModal(false)}
                  disabled={isSaving}
                  style={{
                    backgroundColor: isSaving ? "grey" : "#8b6c2f",
                    color: "white",
                    border: "none",
                    padding: "10px 20px",
                    borderRadius: "5px",
                    cursor: isSaving ? "not-allowed" : "pointer",
                    fontSize: "14px",
                    fontWeight: "bold"
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    setIsSaving(true);
                    await handleSaveUser();
                    setIsSaving(false);
                  }}
                  style={{
                    marginLeft: "auto",
                    backgroundColor: isSaving ? "grey" : "#8b6c2f",
                    color: "white",
                    border: "none",
                    padding: "10px 20px",
                    borderRadius: "5px",
                    cursor: isSaving ? "not-allowed" : "pointer",
                    fontSize: "14px",
                    fontWeight: "bold"
                  }}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <span>
                      <span className="spinner" style={{
                        display: "inline-block",
                        width: "16px",
                        height: "16px",
                        border: "2px solid #fff",
                        borderTop: "2px solid #8b6c2f",
                        borderRadius: "50%",
                        animation: "spin 1s linear infinite",
                        marginRight: "8px",
                        verticalAlign: "middle"
                      }} />
                      Saving...
                    </span>
                  ) : (
                    "Save"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
        {showEditModal && selectedUser && (
          <div className="modal-overlayBook">
            <div className="modal-contentBook">
              <h2>Edit User</h2>
              <label>
                Full Name:{" "}
                <input
                  value={selectedUser.fullName}
                  onChange={(e) =>
                    setSelectedUser({ ...selectedUser, fullName: e.target.value })
                  }
                />
              </label>
              <label>
                Email:{" "}
                <input
                  type="email"
                  value={selectedUser.email}
                  onChange={(e) =>
                    setSelectedUser({ ...selectedUser, email: e.target.value })
                  }
                />
              </label>
              <label>
                Mobile:{" "}
                <input
                  value={selectedUser.mobile}
                  onChange={(e) =>
                    setSelectedUser({ ...selectedUser, mobile: e.target.value })
                  }
                />
              </label>
              <div className="form-field">
                <label>
                  Role:
                  <br />
                  <select
                    value={selectedUser.role}
                    onChange={(e) =>
                      setSelectedUser({ ...selectedUser, role: e.target.value })
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
                <button
                  onClick={() => setShowEditModal(false)}
                  disabled={isUpdating}
                  style={{
                    backgroundColor: isUpdating ? "grey" : "#8b6c2f",
                    color: "white",
                    border: "none",
                    padding: "10px 20px",
                    borderRadius: "5px",
                    cursor: isUpdating ? "not-allowed" : "pointer",
                    fontSize: "14px",
                    fontWeight: "bold"
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    setIsUpdating(true);
                    await handleUpdateUser();
                    setIsUpdating(false);
                  }}
                  style={{
                    marginLeft: "auto",
                    backgroundColor: isUpdating ? "grey" : "#8b6c2f",
                    color: "white",
                    border: "none",
                    padding: "10px 20px",
                    borderRadius: "5px",
                    cursor: isUpdating ? "not-allowed" : "pointer",
                    fontSize: "14px",
                    fontWeight: "bold"
                  }}
                  disabled={isUpdating}
                >
                  {isUpdating ? (
                    <span>
                      <span className="spinner" style={{
                        display: "inline-block",
                        width: "16px",
                        height: "16px",
                        border: "2px solid #fff",
                        borderTop: "2px solid #8b6c2f",
                        borderRadius: "50%",
                        animation: "spin 1s linear infinite",
                        marginRight: "8px",
                        verticalAlign: "middle"
                      }} />
                      Updating...
                    </span>
                  ) : (
                    "Update"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
{isDeleting && (
  <div style={{
    position: "fixed",
    top: 0, left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999
  }}>
    <div className="spinner" style={{
      width: "40px",
      height: "40px",
      border: "4px solid #ccc",
      borderTop: "4px solid #8b6c2f",
      borderRadius: "50%",
      animation: "spin 1s linear infinite"
    }}></div>
  </div>
)}

      </div>
    </div>
  );


};

export default UsersPageAdmin;