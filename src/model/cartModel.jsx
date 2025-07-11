import React from "react";
import "../styling/book.css";
import { IoClose } from "react-icons/io5";
import { FiShoppingCart } from "react-icons/fi";
import { createCatalog } from "../services/catalogService";
import { showSuccess, showError, confirmDialog } from "../utils/alertUtil";

const CartModal = ({
  cartItems,
  removeFromCart,
  onClose,
  increaseQty,
  decreaseQty,
  userId,
}) => {
  const handleConfirm = async () => {
    try {
      const booksPayload = cartItems.map((item) => ({
        bookId: item.id,
        quantity: item.quantity,
      }));

      await createCatalog({
        userId,
        books: booksPayload,
      });

      await showSuccess("Catalog created successfully!");
      window.location.reload();
      onClose(); // Close the modal
    } catch (error) {
      console.error("Failed to create catalog:", error);
  await showError("Failed to create catalog. Please try again.");}
  };

  return (
    <div className="modal-backdrop1">
      <div className="modal-content1">
        <div className="header">
          <div className="icon-box">
            <FiShoppingCart size={28} />
          </div>
          <h2>Cart</h2>
          <button className="close-btn" onClick={onClose}>
            <IoClose size={24} />
          </button>
        </div>
        <hr className="gold-line" />
        <table
          style={{ borderCollapse: "separate", borderSpacing: "0 0.5rem" }}
        >
          <thead>
            <tr>
              <th style={{ padding: "0 16px" }}>Book ID</th>
              <th style={{ padding: "0 16px" }}>Name</th>
              <th style={{ padding: "0 16px" }}>Category</th>
              <th style={{ padding: "0 16px" }}>Language</th>
              <th style={{ padding: "0 16px" }}>No of Books</th>
              <th style={{ padding: "0 16px" }}></th>
            </tr>
          </thead>
          <tbody>
            {cartItems.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  No records found
                </td>
              </tr>
            ) : (
              cartItems.map((book, index) => (
                <React.Fragment key={index}>
                  <tr>
                    <td style={{ padding: "8px 16px" }}>{book.id}</td>
                    <td style={{ padding: "8px 16px" }}>{book.name}</td>
                    <td style={{ padding: "8px 16px" }}>{book.category}</td>
                    <td style={{ padding: "8px 16px" }}>{book.language}</td>
                    <td style={{ padding: "8px 16px" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                        }}
                      >
                        <button
                          className="qMarks"
                          onClick={() => decreaseQty(book.id)}
                        >
                          -
                        </button>
                        <span>{book.quantity}</span>
                        <button
                          className="qMarks"
                          onClick={() => increaseQty(book.id)}
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td style={{ padding: "8px 16px" }}>
                      <button onClick={() => removeFromCart(book.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                  {index !== cartItems.length - 1 && (
                    <tr style={{ height: "5px" }}>
                      <td colSpan="6"></td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
        <div
          style={{
            marginTop: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <h4 style={{ margin: 0 }}>
            Total Books:{" "}
            {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
          </h4>
          <button onClick={handleConfirm}>Confirm</button>
        </div>
      </div>
    </div>
  );
};

export default CartModal;
