const API_BASE_URL = 'http://localhost:8080/';

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
const headers = {
    'Content-Type': 'application/json',
    'Authorization': getAuthToken(),
};
// get users all fines by id
export const getUserFinesById = async (userId) => {
    try {
        const response = await fetch(`${API_BASE_URL}api/fines/user/${userId}`, {
            method: 'GET',
            headers,
        });
        if (!response.ok) {
            throw new Error('Failed to fetch user fines: ' + response.status);
        }
        const result = await response.json();
        console.log("Response", result);
        return result;
    } catch (error) {
        console.error(error);
        return null;
    }
};

// pay fine by catalog id
export const payFineByCatalogId = async (catalogId) => {
    try {
        const response = await fetch(`${API_BASE_URL}pay-catalog-fine/${catalogId}`, {
            method: 'POST',
            headers,
        });
        if (!response.ok) {
            throw new Error('Failed to pay fine: ' + response.status);
        }
        const result = await response.text();
        console.log("Response", result);
        return result;
    } catch (error) {
        console.error(error);
        return null;
    }
};

// pay catalog book fine
export const payCatalogBookFine = async (catalogId, catalogBookId) => {
    try {
        const response = await fetch(`${API_BASE_URL}pay-catalog-book-fine/${catalogId}`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ catalogBookId }),
        });
        if (!response.ok) {
            throw new Error('Failed to pay catalog book fine: ' + response.status);
        }
        const result = await response.text();
        console.log("Response", result);
        return result;
    } catch (error) {
        console.error(error);
        return null;
    }
};
