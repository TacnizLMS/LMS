// components/bookTableAdmin.js
import React from "react";

const BookTableAdmin = ({ books, onEditBook, onDeleteBook }) => {
  // Helper function to safely render values
  const safeRender = (value) => {
    if (value === null || value === undefined) {
      return "N/A";
    }
    if (typeof value === "object") {
      // If it's an object, try to extract meaningful info or stringify it
      return value.name || value.title || JSON.stringify(value) || "Unknown";
    }
    return String(value);
  };

  return (
    <div className="table-wrapper">
      <table className="books-table">
        <thead>
          <tr>
            <th>Book ID</th>
            <th>Title</th>
            <th>Author</th>
            <th>Type</th>
            <th>Language</th>
            <th>Full Quantity</th>
            <th>Available Quantity</th>
            <th>Availability</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {books && books.length > 0 ? (
            books.map((book) => (
              <tr key={book.id}>
                <td>{safeRender(book.id)}</td>
                <td>{safeRender(book.name)}</td>
                <td>{safeRender(book.category)}</td>
                <td>{safeRender(book.type)}</td>
                <td>{safeRender(book.language)}</td>
              <td style={{ textAlign: "center" }}>{safeRender(book.quantity)}</td>
                <td style={{ textAlign: "center" }}>{safeRender(book.availableCount)}</td>
                
                <td>
                  <span
                    className={`availability-status ${
                      book.availability === "Available"
                        ? "available"
                        : "not-available"
                    }`}
                  >
                    {safeRender(book.availability)}
                  </span>
                </td>

                <td>
                  <button
                    title="Edit"
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      marginRight: 8,
                      color: "black",
                    }}
                    onClick={() => onEditBook && onEditBook(book)}
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 20h9" />
                      <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
                    </svg>
                  </button>
                  <button
                    title="Delete"
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      marginRight: 8,
                      color: "black",
                    }}
                    onClick={() => onDeleteBook(book.id)}
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2 2h2a2 2 0 0 1 2 2v2" />
                      <line x1="10" y1="11" x2="10" y2="17" />
                      <line x1="14" y1="11" x2="14" y2="17" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" style={{ textAlign: "center" }}>
                No records found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default BookTableAdmin;
