const API_BASE_URL = 'http://localhost:8080/';

// catalog fine pay by cash
export async function payCatalogFineByCash(catalogId) {
    const response = await fetch(`${API_BASE_URL}pay-catalog-fine-cash/${catalogId}`, {
        method: 'POST',
    });
    if (!response.ok) {
        throw new Error('Failed to pay catalog fine by cash');
    }
    const url = await response.text();
    return url;
}