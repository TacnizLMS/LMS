// components/bookTable.js
import React from "react";

const BookTable = ({
  books,
  cart,
  handleAddToCart,
  handleRemoveFromCart,
  handleIncreaseQuantity,
  handleDecreaseQuantity,
}) => {
  const isInCart = (bookId) => cart.some((item) => item.id === bookId);
  const getQuantity = (bookId) =>
    cart.find((item) => item.id === bookId)?.quantity || 0;

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
            <th>Set Quantity</th> 
          </tr>
        </thead>
        <tbody>
          {books && books.length > 0 ? (
            books.map((book) => (
              <tr key={book.id}>
                <td>{book.id}</td>
                <td>{book.name}</td>
                <td>{book.category}</td>
                  <td>{book.type && book.type.name ? book.type.name : 'N/A'}</td>
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
                      checked={isInCart(book.id)}
                      onChange={(e) =>
                        handleCheckboxChange(book, e.target.checked)
                      }
                    />
                  )}
                </td>
                <td>
                  {isInCart(book.id) && (
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <button onClick={() => handleDecreaseQuantity(book.id)}>-</button>
                      <span>{getQuantity(book.id)}</span>
                      <button onClick={() => handleIncreaseQuantity(book.id)}>+</button>
                    </div>
                  )}
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



export default BookTable;
