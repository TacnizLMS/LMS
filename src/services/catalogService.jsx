// services/catalogService.js

const API_BASE_URL = 'http://localhost:8080/api';

// Debug function to get auth token from various storage locations
const getAuthToken = () => {
  const possibleTokens = {
    token: localStorage.getItem("token"),
    authToken: localStorage.getItem("authToken"),
    jwt: sessionStorage.getItem("jwt"),
    accessToken: localStorage.getItem("accessToken"),
    sessionToken: sessionStorage.getItem("token"),
    sessionAuthToken: sessionStorage.getItem("authToken"),
  };

  console.log("All possible tokens:", possibleTokens);

  const rawToken =
    possibleTokens.jwt ||
    possibleTokens.token ||
    possibleTokens.authToken ||
    possibleTokens.accessToken ||
    possibleTokens.sessionToken ||
    possibleTokens.sessionAuthToken;

  if (!rawToken) return null;

  return rawToken.startsWith("Bearer ") ? rawToken : `Bearer ${rawToken}`;
};

export const fetchCatalogs = async (userId) => {
  try {
    const url = `${API_BASE_URL}/catalog/user/${userId}`;
    console.log('Fetching catalogs from:', url);

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

    const data = await response.json();
    console.log('Raw API response:', data);

    // Transform data if needed (or return as is)
    // Here, we just return the data directly because your component expects the full structure.
    return data;

  } catch (error) {
    console.error('Error in fetchCatalogs:', error);
    throw error;
  }
};
