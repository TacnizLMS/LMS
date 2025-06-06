import React, { useState, useEffect } from 'react';
import Sidebar from "../components/sideBar";
import AppBar from "../components/appBar";
import '../styling/catalog.css'; 
import { useLocation } from 'react-router-dom';


const Catalog = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

   const location = useLocation();

  // Extract tab from URL (default to 'borrowed')
  const queryParams = new URLSearchParams(location.search);
  const tabParam = queryParams.get("tab") || "borrowed";

  const [activeTab, setActiveTab] = useState(tabParam);

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          activeTab === 'borrowed'
            ? '/api/borrowed-books'
            : '/api/returned-books'
        );
        const data = await response.json();
        setBooks(data);
      } catch (error) {
        console.error('Error fetching books:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [activeTab]);

  return (
    <div className="library-page">
      <Sidebar />
      <div className="main-contentc">
        <AppBar />
        <div className="tabs-container">
          <div className="tab-buttons">
            <button
              className={activeTab === 'borrowed' ? 'active' : ''}
              onClick={() => setActiveTab('borrowed')}
            >
              Borrowed Books
            </button>
            <button
              className={activeTab === 'returned' ? 'active' : ''}
              onClick={() => setActiveTab('returned')}
            >
              Returned Books
            </button>
          </div>

          {loading ? (
            <p>Loading data...</p>
          ) : (
            <div className="table-wrapper">
              <table className="books-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>User ID</th>
                    <th>Quantity</th>
                    <th>Book ID</th>
                    <th>Book Name</th>
                    <th>{activeTab === 'borrowed' ? 'Due Date' : 'Returned Date'}</th>
                  </tr>
                </thead>
                <tbody>
                  {books.length > 0 ? (
                    books.map((book) => (
                      <tr key={book.id}>
                        <td>{book.id}</td>
                        <td>{book.userId}</td>
                        <td>{book.quantity}</td>
                        <td>{book.bookId}</td>
                        <td>{book.bookName}</td>
                        <td>
                          {activeTab === 'borrowed' ? book.dueDate : book.returnedDate}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6">No records found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Catalog;
