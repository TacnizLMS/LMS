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
          <tbody>
            {cartItems.map((book, index) => (
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
            ))}
          </tbody>
        </table>
        <div style={{ marginTop: "20px" }}>
          <h4>Total Books: {cartItems.length}</h4>
                  <div style={{ marginTop: "10px" }}></div>
          <button>Confirm</button>
        </div>
      </div>
    </div>
  );
};

export default CartModal;
