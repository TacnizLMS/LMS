import React, { useState, useEffect } from "react";
import Sidebar from "../../components/sideBar";
import AppBar from "../../components/appBar";
import "../../styling/catalog.css";
import { useLocation } from "react-router-dom";
import { fetchAllCatalogs, updateCatalog,deleteCatalogById,returnBackBook as returnBackBookAPI,
  returnBackCatalog as returnBackCatalogAPI } from "../../services/catalogService";
import { FaEdit, FaTrash, FaUndo,FaRedo } from "react-icons/fa";

const CatalogAdmin = () => {
  const [catalogs, setCatalogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingReturn, setEditingReturn] = useState({
    catalogId: null,
    bookId: null,
  });
  const [editingFine, setEditingFine] = useState({
    catalogId: null,
    bookId: null,
  });
  const [deletingItems, setDeletingItems] = useState(new Set());

  const location = useLocation();

  // Extract tab from URL (default to 'active')
  const queryParams = new URLSearchParams(location.search);
  const tabParam = queryParams.get("tab") || "active";

  const [activeTab, setActiveTab] = useState(tabParam);

  // Get user ID from sessionStorage
  const getUserId = () => {
    return sessionStorage.getItem("userId");
  };

  // Store catalog count in secure storage
  const storeCatalogCount = (totalCount) => {
    try {
      const catalogCountData = {
        totalCount: totalCount,
        lastUpdated: new Date().toISOString(),
        timestamp: Date.now()
      };
      
      // Store in sessionStorage (secure for session-based storage)
      sessionStorage.setItem("catalogCount", JSON.stringify(catalogCountData));
      
      // Also store in a more persistent way if needed (optional)
      // You can use encrypted localStorage or a secure storage solution
      localStorage.setItem("catalogCount", JSON.stringify(catalogCountData));
      
      console.log("Catalog count stored:", catalogCountData);
    } catch (error) {
      console.error("Error storing catalog count:", error);
    }
  };

  // API call to return back a single book
  const returnBackBook = async (catalogId, catalogBookId) => {
    try {
      console.log('Calling returnBackBook API with:', { catalogId, catalogBookId });
      return await returnBackBookAPI(catalogId, catalogBookId);
    } catch (error) {
      console.error('Error returning back book:', error);
      throw error;
    }
  };

  // API call to return back entire catalog
  const returnBackCatalog = async (catalogId) => {
    try {
      console.log('Calling returnBackCatalog API with:', catalogId);
      return await returnBackCatalogAPI(catalogId);
    } catch (error) {
      console.error('Error returning back catalog:', error);
      throw error;
    }
  };

  // Handle status progression: pending → borrowed → complete
const handleStatusProgression = async (catalogId) => {
  try {
    console.log('handleStatusProgression called with:', catalogId);

    const catalog = catalogs.find(c => c.id === catalogId);
    if (!catalog) {
      console.error('Catalog not found:', catalogId);
      return;
    }

    let newCompleteState;

    switch (catalog.completeState) {
      case "pending":
        newCompleteState = "borrow";
        break;
      case "borrow":
        newCompleteState = "complete";
        break;
      case "complete":
        console.log("Catalog is already complete; no update needed.");
        return; // Don't allow changing from complete
      default:
        console.warn("Unexpected catalog state:", catalog.completeState);
        return;
    }

    // Call the API to update only the completeState
    await updateCatalog(catalogId, newCompleteState);

    // Update the local state
    setCatalogs(prevCatalogs => prevCatalogs.map(c =>
      c.id === catalogId ? { ...c, completeState: newCompleteState } : c
    ));

    storeCatalogCount(catalogs.length);
    console.log('Status updated successfully to:', newCompleteState);

  } catch (error) {
    console.error('Failed to update status:', error);
    alert('Failed to update status. Please try again.');
  }
};


  // Return all books in a catalog
  const returnAllBooks = async (catalogId) => {
    try {
      const catalog = catalogs.find(c => c.id === catalogId);
      if (!catalog) return;

      // Prepare data for all unreturned books
      const booksToReturn = catalog.catalogBooks
        .filter(book => !book.returnState)
        .map(book => ({
          bookId: book.book.id,
          quantity: 1,
          returnState: true
        }));

      if (booksToReturn.length === 0) {
        alert('All books in this catalog are already returned.');
        return;
      }

      console.log('Returning all books:', booksToReturn);

      // Call the API to update all books
      await updateCatalog(catalogId, booksToReturn);

      // Update local state
      setCatalogs(prevCatalogs => {
        const updatedCatalogs = prevCatalogs.map(catalog => {
          if (catalog.id !== catalogId) return catalog;

          const updatedBooks = catalog.catalogBooks.map(book => ({
            ...book,
            returnState: true
          }));

          return {
            ...catalog,
            catalogBooks: updatedBooks,
            completeState: "complete" // Set to "complete" string
          };
        });
        
        // Update catalog count after returning books
        storeCatalogCount(updatedCatalogs.length);
        
        return updatedCatalogs;
      });

      alert(`Successfully returned ${booksToReturn.length} books.`);
      
    } catch (error) {
      console.error('Failed to return all books:', error);
      alert('Failed to return all books. Please try again.');
    }
  };

  // Return back all books in a completed catalog
  const returnBackAllBooks = async (catalogId) => {
    try {
      const confirmMessage = 'Are you sure you want to change all books in this catalog back to "Not Returned" status? This will reactivate the catalog.';
      
      if (!window.confirm(confirmMessage)) {
        return;
      }

      console.log('Returning back all books in catalog:', catalogId);

      // Call the API to return back entire catalog
      await returnBackCatalog(catalogId);

      // Update local state
      setCatalogs(prevCatalogs => {
        const updatedCatalogs = prevCatalogs.map(catalog => {
          if (catalog.id !== catalogId) return catalog;

          const updatedBooks = catalog.catalogBooks.map(book => ({
            ...book,
            returnState: false
          }));

          return {
            ...catalog,
            catalogBooks: updatedBooks,
            completeState: "borrow" // Change back to borrow status
          };
        });
        
        // Update catalog count after reactivating catalog
        storeCatalogCount(updatedCatalogs.length);
        
        return updatedCatalogs;
      });

      alert('Successfully changed all books back to "Not Returned" status.');
      
    } catch (error) {
      console.error('Failed to return back all books:', error);
      alert('Failed to change books back to "Not Returned". Please try again.');
    }
  };

  useEffect(() => {
    const loadCatalogs = async () => {
      setLoading(true);
      setError(null);
      try {
        const userId = getUserId();
        console.log("Fetching catalogs for user:", userId);

        const data = await fetchAllCatalogs(); 
        console.log("Fetched catalog data:", data);

        const catalogsArray = Array.isArray(data) ? data : [data];
        setCatalogs(catalogsArray);
        
        // Store the total catalog count
        storeCatalogCount(catalogsArray.length);
        
      } catch (error) {
        console.error("Error fetching catalogs:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadCatalogs();
  }, [activeTab]);

  // Helper function to check if catalog is expired
  const isCatalogExpired = (catalog) => {
    const now = new Date();
    const expiredDate = new Date(catalog.expiredDate);
    
    // Pending catalogs are never considered expired
    if (catalog.completeState === "pending") {
      return false;
    }
    
    // Only consider catalogs with "borrow" status as potentially expired
    // Complete catalogs are never expired
    if (catalog.completeState === "complete") {
      return false;
    }
    
    return expiredDate < now;
  };

  // Helper function to check if catalog is active (not expired and not complete)
  const isCatalogActive = (catalog) => {
    // Pending catalogs are always active
    if (catalog.completeState === "pending") {
      return true;
    }
    
    return catalog.completeState === "borrow" && !isCatalogExpired(catalog);
  };

  // Filter catalogs based on active tab
  const getFilteredCatalogs = () => {
    return catalogs.filter((catalog) => {
      if (activeTab === "active") {
        // Active catalogs: pending status or borrow status and not expired
        return isCatalogActive(catalog);
      } else if (activeTab === "expired") {
        // Expired catalogs: borrow status but past expiry date (excluding pending)
        return isCatalogExpired(catalog);
      } else {
        // Completed catalogs: complete status
        return catalog.completeState === "complete";
      }
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  // Updated status badge with click functionality
  const getStatusBadge = (catalog) => {
    const getStatusClass = (status) => {
      switch (status) {
        case "complete":
          return "completed";
        case "pending":
          return "pending";
        case "borrow":
          return isCatalogExpired(catalog) ? "overdue" : "active";
        default:
          return "active";
      }
    };

    const getStatusText = (status) => {
      switch (status) {
        case "complete":
          return "Returned";
        case "pending":
          return "Pending";
        case "borrow":
          return isCatalogExpired(catalog) ? "Overdue" : "Active";
        default:
          return "Active";
      }
    };

    const getNextStatusText = (currentStatus) => {
      switch (currentStatus) {
        case "pending":
          return "Click to mark as Borrowed";
        case "borrow":
          return "Click to mark as Complete";
        case "complete":
          return "Status Complete";
        default:
          return "";
      }
    };

    return (
      <span 
        className={`status-badge ${getStatusClass(catalog.completeState)} ${catalog.completeState !== "complete" ? "clickable-status" : ""}`}
        onClick={() => catalog.completeState !== "complete" && handleStatusProgression(catalog.id)}
        title={getNextStatusText(catalog.completeState)}
        style={{ 
          cursor: catalog.completeState !== "complete" ? "pointer" : "default",
          userSelect: "none"
        }}
      >
        {getStatusText(catalog.completeState)}
      </span>
    );
  };

  const getTotalFine = (catalog) => {
    return catalog.catalogBooks.reduce((total, item) => total + item.fine, 0);
  };

  // Get counts for each tab
  const getCatalogCounts = () => {
    const activeCatalogs = catalogs.filter(catalog => isCatalogActive(catalog));
    const expiredCatalogs = catalogs.filter(catalog => isCatalogExpired(catalog));
    const completedCatalogs = catalogs.filter(catalog => catalog.completeState === "complete");

    return {
      active: activeCatalogs.length,
      expired: expiredCatalogs.length,
      completed: completedCatalogs.length,
    };
  };

  const filteredCatalogs = getFilteredCatalogs();
  const catalogCounts = getCatalogCounts();

  const handleReturnChange = async (catalogId, bookId, newReturnState) => {
    try {
      console.log('handleReturnChange called with:', { catalogId, bookId, newReturnState });
      
      // Find the catalog and the specific book
      const catalog = catalogs.find(c => c.id === catalogId);
      if (!catalog) {
        console.error('Catalog not found:', catalogId);
        return;
      }

      const catalogBook = catalog.catalogBooks.find(item => item.id === bookId);
      if (!catalogBook) {
        console.error('Book not found in catalog:', bookId);
        return;
      }

      // Convert the return state to boolean
      const returnState = newReturnState === "returned";
      console.log('Setting returnState to:', returnState);

      // If in completed tab and trying to change from returned to not returned, show confirmation
     if ((activeTab === "completed" || activeTab === "expired") && !returnState)
 {
        const confirmMessage = 'Are you sure you want to change this book back to "Not Returned" status? This may reactivate the catalog.';
        
        if (!window.confirm(confirmMessage)) {
          setEditingReturn({ catalogId: null, bookId: null });
          return;
        }

        // Call the return back book API
        await returnBackBook(catalogId, catalogBook.id); // catalogBook.id is the catalogBookId
      } else {
        // Prepare the book data for API call
        const books = [{
          bookId: catalogBook.book.id,
          quantity: 1,
          returnState: returnState
        }];

        console.log('Updating book with data:', books);

        // Call the API to update the book
        await updateCatalog(catalogId, books);
      }

      // Update local state for the specific book
      setCatalogs((prevCatalogs) => {
        const updatedCatalogs = prevCatalogs.map((catalog) => {
          if (catalog.id !== catalogId) return catalog;

          const updatedBooks = catalog.catalogBooks.map((book) => {
            if (book.id !== bookId) return book;
            console.log(`Updating book ${bookId} returnState from ${book.returnState} to ${returnState}`);
            return { ...book, returnState: returnState };
          });

          // Check if all books are now returned to update completeState
          const allReturned = updatedBooks.every(book => book.returnState);
          console.log('All books returned?', allReturned);
          
          // Determine new complete state
          let newCompleteState = catalog.completeState;
          if (allReturned) {
            newCompleteState = "complete";
          } else if (catalog.completeState === "complete") {
            // If changing from complete and not all books are returned, change to borrow
            newCompleteState = "borrow";
          }
          
          return { 
            ...catalog, 
            catalogBooks: updatedBooks,
            completeState: newCompleteState
          };
        });
        
        // Update catalog count after return state change
        storeCatalogCount(updatedCatalogs.length);
        
        return updatedCatalogs;
      });

      // Exit edit mode after successful change
      setEditingReturn({ catalogId: null, bookId: null });
      console.log('Return state updated successfully');
      
    } catch (error) {
      console.error('Failed to update return state:', error);
      alert('Failed to update return state. Please try again.');
      
      // Reset editing state even on error to prevent getting stuck in edit mode
      setEditingReturn({ catalogId: null, bookId: null });
    }
  };

  const handleDeleteCatalog = async (catalogId) => {
    try {
      setDeletingItems(prev => new Set(prev).add(`catalog-${catalogId}`));

      const catalog = catalogs.find(c => c.id === catalogId);
      if (!catalog) {
        throw new Error('Catalog not found');
      }

      // Check for unreturned books
      const unreturnedBooks = catalog.catalogBooks.filter(book => !book.returnState);
      if (unreturnedBooks.length > 0) {
        alert(`Cannot delete catalog with unreturned books`);
        return;
      }

      console.log('Attempting to delete catalog:', catalogId);
      
      await deleteCatalogById(catalogId);
      
      setCatalogs(prev => {
        const updatedCatalogs = prev.filter(c => c.id !== catalogId);
        // Update catalog count after deletion
        storeCatalogCount(updatedCatalogs.length);
        return updatedCatalogs;
      });
      
      alert('Catalog deleted successfully!');
    } catch (error) {
      console.error('Delete catalog failed:', error);
      alert(`Delete failed: ${error.message}`);
    } finally {
      setDeletingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(`catalog-${catalogId}`);
        return newSet;
      });
    }
  };

  return (
    <div className="library-page">
      <Sidebar />
      <div className="main-contentc">
        <AppBar />
        <div className="tabs-container">
          <div className="tab-buttons">
            <button
              className={activeTab === "active" ? "active" : ""}
              onClick={() => setActiveTab("active")}
            >
              Active Catalogs
              {catalogCounts.active > 0 && (
                <span className="tab-count">{catalogCounts.active}</span>
              )}
            </button>
            <button
              className={
                activeTab === "expired" ? "active expired-tab" : "expired-tab"
              }
              onClick={() => setActiveTab("expired")}
            >
              Expired Catalogs
              {catalogCounts.expired > 0 && (
                <span className="tab-count expired-count">
                  {catalogCounts.expired}
                </span>
              )}
            </button>
            <button
              className={activeTab === "completed" ? "active" : ""}
              onClick={() => setActiveTab("completed")}
            >
              Completed Catalogs
              {catalogCounts.completed > 0 && (
                <span className="tab-count">{catalogCounts.completed}</span>
              )}
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
                        <p>
                          <strong>Borrowed:</strong>{" "}
                          {formatDate(catalog.borrowDate)}
                        </p>
                        <p>
                          <strong>Due:</strong>{" "}
                          {formatDate(catalog.expiredDate)}
                        </p>
                        {getTotalFine(catalog) > 0 && (
                          <p className="fine-amount">
                            <strong>Total Fine:</strong> $
                            {getTotalFine(catalog).toFixed(2)}
                          </p>
                        )}
                      </div>
                      <div className="catalog-actions">
                        {/* Return All Button - only show for active/expired catalogs with unreturned books */}
                        {(activeTab === "active" || activeTab === "expired") && 
                         catalog.catalogBooks.some(book => !book.returnState) && (
                          <button
                            className="return-all-btn"
                            onClick={() => returnAllBooks(catalog.id)}
                            title="Return all books in this catalog"
                          >
                            <FaUndo /> Return All
                          </button>
                        )}
                        
                        {/* Return Back All Button - only show for completed catalogs */}
                        {activeTab === "completed" && (
                          <button
                            className="return-back-all-btn"
                            onClick={() => returnBackAllBooks(catalog.id)}
                            title="Change all books back to Not Returned status"
                          >
                            <FaRedo /> Reactivate Catalog
                          </button>
                        )}
                        
                        {/* Delete Catalog Button - only for completed catalogs */}
                        {activeTab === "completed" && (
                          <button
                            className="delete-catalog-btn"
                            onClick={() => {
                              if (window.confirm('Are you sure you want to delete this entire catalog? This action cannot be undone.')) {
                                handleDeleteCatalog(catalog.id);
                              }
                            }}
                            disabled={deletingItems.has(`catalog-${catalog.id}`)}
                            title="Delete entire catalog"
                          >
                            <FaTrash />
                            {deletingItems.has(`catalog-${catalog.id}`) ? 'Deleting...' : 'Delete Catalog'}
                          </button>
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
                                <td
                                  className={item.fine > 0 ? "fine-amounttab" : ""}
                                >
                                  ${item.fine.toFixed(2)}
                                </td>
                                <td>
                                  {activeTab === "expired" ? (
                                    editingFine.catalogId === catalog.id &&
                                    editingFine.bookId === item.id ? (
                                      <select
                                        value={item.finePaid ? "yes" : "no"}
                                        onChange={(e) => {
                                          const newFinePaid =
                                            e.target.value === "yes";
                                          setCatalogs((prevCatalogs) =>
                                            prevCatalogs.map((c) =>
                                              c.id === catalog.id
                                                ? {
                                                    ...c,
                                                    catalogBooks:
                                                      c.catalogBooks.map((b) =>
                                                        b.id === item.id
                                                          ? {
                                                              ...b,
                                                              finePaid:
                                                                newFinePaid,
                                                            }
                                                          : b
                                                      ),
                                                  }
                                                : c
                                            )
                                          );
                                          setEditingFine({ catalogId: null, bookId: null });
                                        }}
                                        onBlur={() =>
                                          setEditingReturn({
                                            catalogId: null,
                                            bookId: null,
                                          })
                                        }
                                        autoFocus
                                      >
                                        <option value="yes">Paid</option>
                                        <option value="no">Unpaid</option>
                                      </select>
                                    ) : (
                                      <div
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                          gap: "6px",
                                        }}
                                      >
                                        <span
                                          className={`status-indicator ${
                                            item.finePaid ? "paid" : "unpaid"
                                          }`}
                                        >
                                          {item.finePaid ? "Paid" : "Unpaid"}
                                        </span>
                                        <FaEdit
                                          className="edit-icon"
                                          onClick={() =>
                                            setEditingFine({
                                              catalogId: catalog.id,
                                              bookId: item.id,
                                            })
                                          }
                                        />
                                      </div>
                                    )
                                  ) : (
                                    <span
                                      className={`status-indicator ${
                                        item.finePaid ? "paid" : "unpaid"
                                      }`}
                                    >
                                      {item.finePaid ? "Paid" : "Unpaid"}
                                    </span>
                                  )}
                                </td>

                                <td>
                                  {/* Show edit functionality for all tabs now */}
                                  {editingReturn.catalogId === catalog.id &&
                                  editingReturn.bookId === item.id ? (
                                    <select
                                      value={item.returnState ? "returned" : "not-returned"}
                                      onChange={(e) =>
                                        handleReturnChange(
                                          catalog.id,
                                          item.id,
                                          e.target.value
                                        )
                                      }
                                      onBlur={() =>
                                        setEditingReturn({
                                          catalogId: null,
                                          bookId: null,
                                        })
                                      }
                                      autoFocus
                                    >
                                      <option value="returned">Returned</option>
                                      <option value="not-returned">Not Returned</option>
                                    </select>
                                  ) : (
                                    <div
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "15px",
                                      }}
                                    >
                                      <span
                                        className={`status-indicator ${
                                          item.returnState
                                            ? "returned"
                                            : "not-returned"
                                        }`}
                                      >
                                        {item.returnState ? "Returned" : "Not Returned"}
                                      </span>

                                      {/* Show edit icon for all tabs */}
                                      <FaEdit
                                        className="edit-icon"
                                        onClick={() =>
                                          setEditingReturn({
                                            catalogId: catalog.id,
                                            bookId: item.id,
                                          })
                                        }
                                      />
                                    </div>
                                  )}
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

export default CatalogAdmin;