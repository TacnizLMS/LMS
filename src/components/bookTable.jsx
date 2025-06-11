// components/bookTable.js
import React from "react";

const BookTable = ({ books, handleAddToCart }) => {
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
            <th>Quantity</th>
            <th>Availability</th>
            <th>Add to Cart</th>
          </tr>
        </thead>
        <tbody>
          {books && books.length > 0 ? (
            books.map((book) => (
              <tr key={book.id}>
                <td>{book.id}</td>
                <td>{book.name}</td>
                <td>{book.category}</td>
                <td>{book.type}</td>
                <td>{book.language}</td>
                <td>{book.quantity}</td>
                <td>
                  <span 
                    className={`availability-status ${
                      book.availability === 'Available' ? 'available' : 'not-available'
                    }`}
                  >
                    {book.availability}
                  </span>
                </td>
                <td>
                  {book.availability === "Available" && (
                    <input
                      type="checkbox"
                      onChange={() => handleAddToCart(book)}
                    />
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" style={{ textAlign: "center" }}>
                No records found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default BookTable;