// services/bookService.js

const API_BASE_URL = 'http://localhost:8080/api';

// Helper functions for availability conversion
const availabilityToString = (booleanValue) => {
  return booleanValue ? 'Available' : 'Not Available';
};

const availabilityToBoolean = (stringValue) => {
  return stringValue === 'Available';
};

// Debug function to check all possible token locations
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

export const fetchBooks = async () => {
  try {
    console.log('Fetching books from:', `${API_BASE_URL}/books`);
    
    const token = getAuthToken();
    console.log('Using token:', token ? `${token.substring(0, 20)}...` : 'No token found');
    
    const headers = {
      'Content-Type': 'application/json',
    };
    
    // Try different authorization header formats
    if (token) {
      headers['Authorization'] = token;
    }
    
    console.log('Request headers:', headers);
    
    const response = await fetch(`${API_BASE_URL}/books`, {
      method: 'GET',
      headers: headers,
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    console.log('Final request to:', `${API_BASE_URL}/books`);
    console.log('Headers sent:', headers);

    
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
    
    // Transform the data - convert boolean availability to string for UI display
    const transformedData = data.map(book => ({
      id: book._id?.$oid || book.id, // Handle MongoDB _id structure
      name: book.title || 'Untitled',
      category: book.author || 'Unknown Author',
      type: book.type
        ? {
            id: book.type._id?.$oid || book.type.id || "", // Handle nested _id structure
            name: book.type.name || "",
          }
        : { id: "", name: "" },
      language: book.language,
      quantity: book.quantity || 0,
      availableCount: book.availableCount || 0, // Use availableCount if present
      availability: availabilityToString(book.availability), // Convert boolean to string for UI
      availabilityBoolean: book.availability // Keep original boolean for reference
    }));
    
    console.log('Transformed data:', transformedData);
    return transformedData;
    
  } catch (error) {
    console.error('Error in fetchBooks:', error);
    throw error;
  }
};

// Alternative function if you need to pass credentials explicitly
export const fetchBooksWithCredentials = async (username, password) => {
  try {
    const credentials = btoa(`${username}:${password}`); // Basic auth
    
    const response = await fetch(`${API_BASE_URL}/books`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${credentials}`
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.map(book => ({
      id: book._id?.$oid || book.id, // Handle MongoDB _id structure
      name: book.title || 'Untitled',
      category: book.author || 'Unknown Author',
      type: book.type
        ? {
            id: book.type._id?.$oid || book.type.id || "", // Handle nested _id structure
            name: book.type.name || "",
          }
        : { id: "", name: "" },
      language: book.language,
      quantity: book.quantity || 0,
      availableCount: book.availableCount || 0, // Use availableCount if present
      availability: availabilityToString(book.availability), // Convert boolean to string for UI
      availabilityBoolean: book.availability
    }));
    
  } catch (error) {
    console.error('Error in fetchBooksWithCredentials:', error);
    throw error;
  }
};

export const updateBook = async (bookId, updatedFields) => {
  try {
    const token = getAuthToken();
    console.log('Updating book with ID:', bookId);
    console.log('Updated fields:', updatedFields);
    
    const headers = {
      'Content-Type': 'application/json',
    };
    
    // Add authorization header if token exists
    if (token) {
      headers['Authorization'] = token;
    }
    
    // Transform the data for API - convert availability string back to boolean
    const apiData = { ...updatedFields };
    
    if (apiData.type && apiData.type.id) {
      apiData.typeId = apiData.type.id;  // Send typeId
      delete apiData.type;               // Remove type object
    }

    // Convert availability string to boolean for API
    if (apiData.availability !== undefined) {
      if (typeof apiData.availability === 'string') {
        // Convert "Available" to true, "Not Available" to false
        apiData.availability = availabilityToBoolean(apiData.availability);
      }
      // If it's already a boolean, keep it as is
    }
    
    // If availabilityBoolean exists, use it instead (for explicit boolean handling)
    if (apiData.availabilityBoolean !== undefined) {
      apiData.availability = apiData.availabilityBoolean;
      delete apiData.availabilityBoolean; // Remove the helper field from API payload
    }
    
    // Also handle other field mappings if needed (e.g., name -> title, category -> author)
    if (apiData.name !== undefined) {
      apiData.title = apiData.name;
      delete apiData.name;
    }
    
    if (apiData.category !== undefined) {
      apiData.author = apiData.category;
      delete apiData.category;
    }
    
    console.log('API data being sent:', apiData);
    
    const response = await fetch(`${API_BASE_URL}/books/${bookId}`, {
      method: 'PUT',
      headers: headers,
      body: JSON.stringify(apiData),
    });

    console.log('Update response status:', response.status);

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

    const updatedBook = await response.json();
    console.log('Updated book response:', updatedBook);
    return updatedBook;
  } catch (error) {
    console.error('Error updating book:', error);
    throw error;
  }
};

export const addBook = async (newBook) => {
  try {
    const token = getAuthToken(); 
    const headers = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = token;
    }

    // Prepare data for API with hardcoded typeId
    const apiData = {
      title: newBook.name,
      author: newBook.category,
      typeId: newBook.type?.id,
      language: newBook.language,
      quantity: newBook.quantity,
    };

    console.log("Sending book to API:", apiData);

    const response = await fetch(`${API_BASE_URL}/books`, {
      method: 'POST',
      headers,
      body: JSON.stringify(apiData),
    });

    console.log('Create response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response body:", errorText);
      throw new Error(`Failed to create book: ${errorText}`);
    }

    const createdBook = await response.json();

    // Transform it back to UI format
    return {
      id: createdBook._id?.$oid || createdBook.id,
      name: createdBook.title,
      category: createdBook.author,
      type: createdBook.type
        ? {
            id: createdBook.type._id?.$oid || createdBook.type.id || "",
            name: createdBook.type.name || "",
          }
        : { id: "", name: "" },
      language: createdBook.language,
      quantity: createdBook.quantity,
      availability: availabilityToString(createdBook.availability),
    };
  } catch (error) {
    console.error('Error adding book:', error);
    throw error;
  }
};

export const deleteBook = async (id) => {
  const token = sessionStorage.getItem("jwt"); // same as other functions
  if (!token) {
    throw new Error("No auth token found, cannot delete book");
  }

  const bearerToken = token.startsWith("Bearer ") ? token : `Bearer ${token}`;

  const response = await fetch(`http://localhost:8080/api/books/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": bearerToken,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to delete book: ${errorText}`);
  }

  return true;
};

export const fetchBookTypes = async () => {
  try {
    const token = getAuthToken();

    const headers = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = token;
    }

    const response = await fetch(`${API_BASE_URL}/types/all`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response body:", errorText);
      throw new Error(`Failed to fetch book types: ${errorText}`);
    }

    const data = await response.json();
    console.log('Fetched book types:', data);
    return data; // Returns [{ id, name }, ...]
  } catch (error) {
    console.error('Error fetching book types:', error);
    throw error;
  }
};

// Export helper functions for use in components
export { availabilityToString, availabilityToBoolean };