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

  // Check if any item is in cart to show the Set Quantity column
  const showQuantityColumn = cart.length > 0;

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
            {showQuantityColumn && <th>Set Quantity</th>}
          </tr>
        </thead>
        <tbody>
          {books && books.length > 0 ? (
            books.map((book) => {
              const currentQuantity = getQuantity(book.id);
              const isMaxQuantityReached = currentQuantity >= book.availableCount;
              const isOutOfStock = book.availableCount === 0;
              
              return (
                <tr key={book.id}>
                  <td>{book.id}</td>
                  <td>{book.name}</td>
                  <td>{book.category}</td>
                  <td>{book.type && book.type.name ? book.type.name : 'N/A'}</td>
                  <td>{book.language}</td>
                  <td>{book.availableCount}</td>
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
                        disabled={isOutOfStock}
                        onChange={(e) =>
                          handleCheckboxChange(book, e.target.checked)
                        }
                        style={{
                          cursor: isOutOfStock ? 'not-allowed' : 'pointer',
                          opacity: isOutOfStock ? 0.5 : 1
                        }}
                      />
                    )}
                  </td>
                  {showQuantityColumn && (
                    <td>
                      {isInCart(book.id) && (
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <button onClick={() => handleDecreaseQuantity(book.id)}>-</button>
                          <span>{currentQuantity}</span>
                          <button 
                            onClick={() => handleIncreaseQuantity(book.id)}
                            disabled={isMaxQuantityReached}
                            style={{
                              cursor: isMaxQuantityReached ? 'not-allowed' : 'pointer',
                              opacity: isMaxQuantityReached ? 0.5 : 1,
                              backgroundColor: isMaxQuantityReached ? '#ccc' : ''
                            }}
                          >
                            +
                          </button>
                        </div>
                      )}
                    </td>
                  )}
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={showQuantityColumn ? "9" : "8"} style={{ textAlign: "center" }}>
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