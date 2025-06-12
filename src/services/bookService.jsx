// services/bookService.js

const API_BASE_URL = 'http://localhost:8080/api';

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
    
    // Transform the data
    const transformedData = data.map(book => ({
      id: book.id,
      name: book.title,
      category: book.author,
      type: book.type?.name || 'Unknown',
      language: 'English',
      quantity: book.quantity,
      availability: book.availability ? 'Available' : 'Not Available'
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
      id: book.id,
      name: book.title,
      category: book.author,
      type: book.type?.name || 'Unknown',
      language: 'English',
      quantity: book.quantity,
      availability: book.availability ? 'Available' : 'Not Available'
    }));
    
  } catch (error) {
    console.error('Error in fetchBooksWithCredentials:', error);
    throw error;
  }
};