import React, { useState, useEffect } from 'react';
import Sidebar from "../components/sideBar";
import AppBar from "../components/appBar";
import '../styling/catalog.css'; 
import { useLocation } from 'react-router-dom';
import { fetchCatalogs } from '../services/catalogService';

const Catalog = () => {
  const [catalogs, setCatalogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const location = useLocation();

  // Extract tab from URL (default to 'active')
  const queryParams = new URLSearchParams(location.search);
  const tabParam = queryParams.get("tab") || "active";

  const [activeTab, setActiveTab] = useState(tabParam);

  // Get user ID from localStorage or wherever you store it
  const getUserId = () => {
    // You might need to adjust this based on how you store user ID
    return localStorage.getItem("userId") || "o4rBPPB"; // fallback to example userId
  };

  useEffect(() => {
    const fetchCatalogData = async () => {
      setLoading(true);
      setError(null);
      try {
        const userId = getUserId();
        console.log('Fetching catalogs for user:', userId);
        
        const data = await fetchCatalogs(userId);
        console.log('Fetched catalog data:', data);
        
        // Handle both array and single object responses
        const catalogsArray = Array.isArray(data) ? data : [data];
        setCatalogs(catalogsArray);
      } catch (error) {
        console.error('Error fetching catalogs:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCatalogData();
  }, [activeTab]);

  // Helper function to check if catalog is expired
  const isCatalogExpired = (catalog) => {
    const now = new Date();
    const expiredDate = new Date(catalog.expiredDate);
    return expiredDate < now && !catalog.completeState;
  };

  // Filter catalogs based on active tab
  const getFilteredCatalogs = () => {
    return catalogs.filter(catalog => {
      if (activeTab === 'active') {
        return !catalog.completeState && !isCatalogExpired(catalog); // Active/borrowed catalogs (not expired)
      } else if (activeTab === 'expired') {
        return isCatalogExpired(catalog); // Expired catalogs
      } else {
        return catalog.completeState; // Completed/returned catalogs
      }
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusBadge = (catalog) => {
    if (catalog.completeState) {
      return <span className="status-badge completed">Returned</span>;
    } else if (isCatalogExpired(catalog)) {
      return <span className="status-badge overdue">Overdue</span>;
    } else {
      return <span className="status-badge active">Active</span>;
    }
  };

  const getTotalFine = (catalog) => {
    return catalog.catalogBooks.reduce((total, item) => total + item.fine, 0);
  };

  // Get counts for each tab
  const getCatalogCounts = () => {
    const activeCatalogs = catalogs.filter(catalog => !catalog.completeState && !isCatalogExpired(catalog));
    const expiredCatalogs = catalogs.filter(catalog => isCatalogExpired(catalog));
    const completedCatalogs = catalogs.filter(catalog => catalog.completeState);
    
    return {
      active: activeCatalogs.length,
      expired: expiredCatalogs.length,
      completed: completedCatalogs.length
    };
  };

  const filteredCatalogs = getFilteredCatalogs();
  const catalogCounts = getCatalogCounts();

  return (
    <div className="library-page">
      <Sidebar />
      <div className="main-contentc">
        <AppBar />
        <div className="tabs-container">
          <div className="tab-buttons">
            <button
              className={activeTab === 'active' ? 'active' : ''}
              onClick={() => setActiveTab('active')}
            >
              Active Catalogs
              {catalogCounts.active > 0 && <span className="tab-count">{catalogCounts.active}</span>}
            </button>
            <button
              className={activeTab === 'expired' ? 'active expired-tab' : 'expired-tab'}
              onClick={() => setActiveTab('expired')}
            >
              Expired Catalogs
              {catalogCounts.expired > 0 && <span className="tab-count expired-count">{catalogCounts.expired}</span>}
            </button>
            <button
              className={activeTab === 'completed' ? 'active' : ''}
              onClick={() => setActiveTab('completed')}
            >
              Completed Catalogs
              {catalogCounts.completed > 0 && <span className="tab-count">{catalogCounts.completed}</span>}
            </button>
          </div>

          {loading ? (
            <div className="loading-container">
              <p>Loading catalogs...</p>
            </div>
          ) : error ? (
            <div className="error-container">
              <p className="error-message">Error: {error}</p>
              <button onClick={() => window.location.reload()}>Retry</button>
            </div>
          ) : (
            <div className="catalogs-container">
              {filteredCatalogs.length > 0 ? (
                filteredCatalogs.map((catalog) => (
                  <div key={catalog.id} className="catalog-card">
                    <div className="catalog-header">
                      <div className="catalog-info">
                        <h3>Catalog ID: {catalog.id.slice(-8)}</h3>
                        <p>User ID: {catalog.userId}</p>
                        <p>Total Books: {catalog.quantity}</p>
                        {getStatusBadge(catalog)}
                      </div>
                      <div className="catalog-dates">
                        <p><strong>Borrowed:</strong> {formatDate(catalog.borrowDate)}</p>
                        <p><strong>Due:</strong> {formatDate(catalog.expiredDate)}</p>
                        {getTotalFine(catalog) > 0 && (
                          <p className="fine-amount"><strong>Total Fine:</strong> ${getTotalFine(catalog).toFixed(2)}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="books-list">
                      <h4>Books in this catalog:</h4>
                      <div className="table-wrapper">
                        <table className="books-table">
                          <thead>
                            <tr>
                              <th>Book ID</th>
                              <th>Title</th>
                              <th>Author</th>
                              <th>Type</th>
                              <th>Fine</th>
                              <th>Fine Paid</th>
                              <th>Returned</th>
                            </tr>
                          </thead>
                          <tbody>
                            {catalog.catalogBooks.map((item) => (
                              <tr key={item.id}>
                                <td>{item.book.id.slice(-8)}</td>
                                <td>{item.book.title}</td>
                                <td>{item.book.author}</td>
                                <td>{item.book.type.name}</td>
                                <td className={item.fine > 0 ? 'fine-amount' : ''}>
                                  ${item.fine.toFixed(2)}
                                </td>
                                <td>
                                  <span className={`status-indicator ${item.finePaid ? 'paid' : 'unpaid'}`}>
                                    {item.finePaid ? 'Paid' : 'Unpaid'}
                                  </span>
                                </td>
                                <td>
                                  <span className={`status-indicator ${item.returnState ? 'returned' : 'not-returned'}`}>
                                    {item.returnState ? 'Yes' : 'No'}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-data">
                  <p>No {activeTab} catalogs found.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Catalog;