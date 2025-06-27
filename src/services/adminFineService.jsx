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


export async function getAllCatalogs() {
    const response = await fetch(`${API_BASE_URL}api/catalog/all`, {
        headers: headers,
    });
    if (!response.ok) {
        throw new Error('Failed to fetch catalogs');
    }
    return await response.json();
}

export async function payCatalogFineByCash(catalogId) {
    const response = await fetch(`${API_BASE_URL}pay-catalog-fine-cash/${catalogId}`, {
        method: 'POST',
        headers: headers,
    });
    if (!response.ok) {
        throw new Error('Failed to pay catalog fine by cash');
    }
    console.log("Response", response);
    const url = await response.text();
    return url;
}

export async function payCatalogBookFineByCash(catalogId, catalogBookId) {
    const response = await fetch(`${API_BASE_URL}pay-catalog-book-fine-cash/${catalogId}`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ catalogBookId }),
    });
    if (!response.ok) {
        throw new Error('Failed to pay catalog book fine by cash');
    }
    const url = await response.text();
    return url;
}