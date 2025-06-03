import React from "react";
import "../styling/book.css";
import { IoClose } from 'react-icons/io5';

import { FiShoppingCart } from "react-icons/fi";


const CartModal = ({ cartItems, removeFromCart, onClose }) => {
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
        <table>
          <thead>
            <tr>
              <th>Book ID</th>
              <th>Name</th>
              <th>Category</th>
              <th>Language</th>
              <th>No of Books</th>
              <th></th>
            </tr>
          </thead>
          <tr style={{ height: "16px" }}></tr>
          <tbody>
            {cartItems.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>No records found</td>
              </tr>
            ) : (
              cartItems.map((book, index) => (
                <tr key={index}>
                  <td>{book.id}</td>
                  <td>{book.name}</td>
                  <td>{book.category}</td>
                  <td>{book.language}</td>
                  <td>1</td>
                  <td>
                    <button onClick={() => removeFromCart(book.id)}>Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div style={{ marginTop: "20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h4 style={{ margin: 0 }}>Total Books: {cartItems.length}</h4>
          <button>Confirm</button>
        </div>
      </div>
    </div>
  );
};

export default CartModal;


