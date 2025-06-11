// components/bookTable.js
import React from "react";

const BookTable = ({ books, cart, handleAddToCart, handleRemoveFromCart }) => {
  const isChecked = (bookId) => cart.some((item) => item.id === bookId);

  const handleCheckboxChange = (book, checked) => {
    if (checked) {
      handleAddToCart(book);
    } else {
      handleRemoveFromCart(book.id);
    }
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
                      book.availability === "Available"
                        ? "available"
                        : "not-available"
                    }`}
                  >
                    {book.availability}
                  </span>
                </td>
                <td>
                  {book.availability === "Available" && (
                    <input
                      type="checkbox"
                      checked={isChecked(book.id)}
                      onChange={(e) =>
                        handleCheckboxChange(book, e.target.checked)
                      }
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
