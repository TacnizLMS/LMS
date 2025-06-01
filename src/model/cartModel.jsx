import React from "react";
import "../styling/book.css";

const CartModal = ({ cartItems, removeFromCart, onClose }) => {
  return (
    <div className="modal-backdrop1">
      <div className="modal-content1">
        <h2>Cart</h2>
        <table>
          <thead>
            <tr>
              <th>Book ID</th>
              <th>Name</th>
              <th>Category</th>
              <th>Language</th>
              <th>No of Books</th>
              <th>Delete</th>
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
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default CartModal;
