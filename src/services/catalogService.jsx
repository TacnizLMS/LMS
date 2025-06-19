// services/catalogService.js

const API_BASE_URL = 'http://localhost:8080/api';

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

// Function to fetch catalogs for a user
export const fetchCatalogs = async (userId) => {
  try {
    const url = `${API_BASE_URL}/catalog/user/${userId}`;
    console.log('Fetching catalogs from:', url);

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

// Function to create a new catalog
export const createCatalog = async ({ userId, books }) => {
  try {
    const url = `${API_BASE_URL}/catalog/add`;

    const token = getAuthToken();
    console.log('Using token for createCatalog:', token ? `${token.substring(0, 20)}...` : 'No token found');

    const headers = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = token;
    }

    const body = JSON.stringify({
      userId,
      books,
    });

    console.log('Creating catalog with payload:', body);

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body,
    });

    console.log('CreateCatalog response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('CreateCatalog error response:', errorText);
      throw new Error(`Failed to create catalog. Status: ${response.status}, Message: ${errorText}`);
    }

    const result = await response.json();
    console.log('Catalog created successfully:', result);

    return result;

  } catch (error) {
    console.error('Error in createCatalog:', error);
    throw error;
  }
};

//fetch all catalogs
export const fetchAllCatalogs = async () => {
  try {
    const url = `${API_BASE_URL}/catalog/all`;
    console.log('Fetching all catalogs from:', url);

    const token = getAuthToken();
    console.log('Using token for fetchAllCatalogs:', token ? `${token.substring(0, 20)}...` : 'No token found');

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

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error fetching all catalogs:', errorText);
      throw new Error(`Failed to fetch all catalogs. Status: ${response.status}, Message: ${errorText}`);
    }

    const data = await response.json();
    console.log('Fetched all catalogs:', data);

    return data;

  } catch (error) {
    console.error('Error in fetchAllCatalogs:', error);
    throw error;
  }
};




export const updateCatalog = async (catalogId, completeState) => {
  try {
    const url = `${API_BASE_URL}/catalog/update/${catalogId}`;
    console.log('Updating catalog at:', url);

    const token = getAuthToken();
    const headers = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    }

    const requestBody = {
      completeState: completeState, // Only this is sent
    };

    console.log('Sending body:', requestBody);

    const response = await fetch(url, {
      method: 'PUT',
      headers,
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to update catalog: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const result = await response.json();
    console.log('Catalog updated successfully:', result);
    return result;
  } catch (error) {
    console.error('Error updating catalog:', error);
    throw error;
  }
};




export const deleteCatalogById = async (catalogId) => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_BASE_URL}/catalog/delete/${catalogId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Server error: ${errorText}`);
    }

    return await response.text();
  } catch (err) {
    console.error('Delete catalog error:', err);
    throw err;
  }
};

// Function to return back a single book (change from returned to not returned)
export const returnBackBook = async (catalogId, catalogBookId) => {
  try {
    const url = `${API_BASE_URL}/catalog/return-back-book/${catalogId}`;
    console.log('Returning back book at:', url);
    console.log('Catalog Book ID:', catalogBookId);

    // Get the auth token
    const token = getAuthToken();
    console.log('Using token:', token ? `${token.substring(0, 20)}...` : 'No token found');

    const headers = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = token;
    }

    const requestBody = {
      catalogBookId: catalogBookId
    };

    console.log('Request headers:', headers);
    console.log('Request body:', requestBody);

    const response = await fetch(url, {
      method: 'PUT',
      headers,
      body: JSON.stringify(requestBody),
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
    console.log('Return back book response:', data);

    return data;

  } catch (error) {
    console.error('Error in returnBackBook:', error);
    throw error;
  }
};

// Function to return back entire catalog (change all books from returned to not returned)
export const returnBackCatalog = async (catalogId) => {
  try {
    const url = `${API_BASE_URL}/catalog/return-back/${catalogId}`;
    console.log('Returning back entire catalog at:', url);

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
      method: 'PUT',
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
    console.log('Return back catalog response:', data);

    return data;

  } catch (error) {
    console.error('Error in returnBackCatalog:', error);
    throw error;
  }
};