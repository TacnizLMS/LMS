// services/userService.js
const API_BASE_URL = 'http://localhost:8080';

// Fetch all users from API
export const fetchUsers = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/users/all`);
    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }
    const userData = await response.json();
    return userData;
  } catch (error) {
    throw new Error(`Error fetching users: ${error.message}`);
  }
};

// Delete user by ID
export const deleteUser = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/users/${userId}`, {
      method: "DELETE",
    });
    
    if (!response.ok) {
      throw new Error("Failed to delete user");
    }
    
    return { success: true, message: "User deleted successfully" };
  } catch (error) {
    throw new Error(`Error deleting user: ${error.message}`);
  }
};

// Add new user (you can implement this based on your API)
export const addUser = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
      throw new Error("Failed to add user");
    }
    
    const newUser = await response.json();
    return newUser;
  } catch (error) {
    throw new Error(`Error adding user: ${error.message}`);
  }
};

// Update user (you can implement this based on your API)
export const updateUser = async (userId, userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/users/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
      throw new Error("Failed to update user");
    }
    
    const updatedUser = await response.json();
    return updatedUser;
  } catch (error) {
    throw new Error(`Error updating user: ${error.message}`);
  }
};