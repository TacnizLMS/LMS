const API_BASE_URL = 'http://localhost:8080';

// Debug function to get auth token from various storage locations
const getAuthToken = () => {
  const possibleTokens = {
    jwt: sessionStorage.getItem("jwt"),
  };

  console.log("All possible tokens:", possibleTokens);

  const rawToken = possibleTokens.jwt;

  if (!rawToken) return null;

  // Add Bearer prefix
  return rawToken.startsWith("Bearer ") ? rawToken : `Bearer ${rawToken}`;
};

// Function to decode JWT and extract email
const getUserEmailFromToken = () => {
  try {
    const token = sessionStorage.getItem("jwt");
    if (!token) return null;
    
    // Remove 'Bearer ' prefix if it exists
    const cleanToken = token.replace('Bearer ', '');
    
    // Decode JWT payload (note: this doesn't verify the signature)
    const payload = JSON.parse(atob(cleanToken.split('.')[1]));
    
    console.log('JWT payload:', payload);
    
    // Common JWT fields for email: 'email', 'sub', 'username'
    return payload.email || payload.sub || payload.username || null;
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};

// Function to get current user email from storage or JWT
export const getCurrentUserEmail = () => {
  // Try storage first
  const storedEmail = localStorage.getItem('userEmail') || sessionStorage.getItem('userEmail');
  if (storedEmail) {
    console.log('Found email in storage:', storedEmail);
    return storedEmail;
  }
  
  // Try to get from JWT token
  const emailFromToken = getUserEmailFromToken();
  if (emailFromToken) {
    console.log('Found email in JWT token:', emailFromToken);
    return emailFromToken;
  }
  
  console.log('No email found in storage or JWT token');
  return null;
};

// Fetch all users from API
export const fetchUsers = async () => {
  try {
    const url = `${API_BASE_URL}/auth/users/all`;
    console.log('Fetching users from:', url);

    // Get the auth token
    const token = getAuthToken();
    console.log('Using token:', token ? `${token.substring(0, 20)}...` : 'No token found');

    const headers = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = token;
    }

    console.log('Request headers:', headers);

    const response = await fetch(url, {
      method: 'GET',
      headers,
    });

    console.log('Response status:', response.status);

    if (response.status === 403) {
      const errorText = await response.text();
      console.log('403 Error response body:', errorText);
      throw new Error(`Access denied. Server response: ${errorText}`);
    }

    if (response.status === 401) {
      const errorText = await response.text();
      console.log('401 Error response body:', errorText);
      throw new Error(`Unauthorized. Server response: ${errorText}`);
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.log('Error response body:', errorText);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const userData = await response.json();
    console.log('Raw API response:', userData);

    return userData;
  } catch (error) {
    console.error('Error in fetchUsers:', error);
    throw error;
  }
};

// Change user password
export const changePassword = async (email, oldPassword, newPassword) => {
  try {
    // Construct URL with query parameters (as your backend expects)
    const url = `${API_BASE_URL}/password/changePassword?email=${encodeURIComponent(email)}&oldPassword=${encodeURIComponent(oldPassword)}&newPassword=${encodeURIComponent(newPassword)}`;
    console.log('Changing password at:', url);
    console.log('Parameters:', { email, oldPasswordLength: oldPassword.length, newPasswordLength: newPassword.length });

    // Get the auth token
    const token = getAuthToken();
    console.log('Using token:', token ? `${token.substring(0, 20)}...` : 'No token found');

    const headers = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = token;
    }

    console.log('Request headers:', headers);

    const response = await fetch(url, {
      method: 'POST',
      headers,
      // No body needed since we're using query parameters
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);

    // Handle different status codes
    if (response.status === 400) {
      const errorText = await response.text();
      console.log('400 Error response body:', errorText);
      throw new Error(`Bad request. Please check your input parameters.`);
    }

    if (response.status === 401) {
      const errorText = await response.text();
      console.log('401 Error response body:', errorText);
      try {
        const errorJson = JSON.parse(errorText);
        throw new Error(errorJson.message || 'Unauthorized access');
      } catch (parseError) {
        throw new Error('Current password is incorrect');
      }
    }

    if (response.status === 403) {
      const errorText = await response.text();
      console.log('403 Error response body:', errorText);
      throw new Error(`Access denied. Please check your permissions.`);
    }

    if (response.status === 404) {
      const errorText = await response.text();
      console.log('404 Error response body:', errorText);
      throw new Error('User not found');
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.log('Error response body:', errorText);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const result = await response.json();
    console.log('Password change successful:', result);

    return result;
  } catch (error) {
    console.error('Error in changePassword:', error);
    throw error;
  }
};

// Generic API call with auth token
export const authenticatedRequest = async (endpoint, options = {}) => {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log('Making authenticated request to:', url);
    
    // Get the auth token
    const token = getAuthToken();
    console.log('Using token:', token ? `${token.substring(0, 20)}...` : 'No token found');

    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };
    if (token) {
      headers['Authorization'] = token;
    }

    console.log('Request headers:', headers);

    const response = await fetch(url, {
      ...options,
      headers,
    });

    console.log('Response status:', response.status);

    if (response.status === 403) {
      const errorText = await response.text();
      console.log('403 Error response body:', errorText);
      throw new Error(`Access denied. Server response: ${errorText}`);
    }

    if (response.status === 401) {
      const errorText = await response.text();
      console.log('401 Error response body:', errorText);
      throw new Error(`Unauthorized. Server response: ${errorText}`);
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.log('Error response body:', errorText);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const result = await response.json();
    console.log('Raw API response:', result);

    return result;
  } catch (error) {
    console.error('Error in authenticatedRequest:', error);
    throw error;
  }
};