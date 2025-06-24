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

