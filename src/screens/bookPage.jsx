import React, { useEffect, useState } from "react";
import { fetchBooks } from "../services/bookService";

import CartModal from "../model/cartModel";
import BookTable from "../components/bookTable";
import "../styling/book.css";
import Sidebar from "../components/sideBar";
import AppBar from "../components/appBar";

const BooksPage = () => {
  const [books, setBooks] = useState([]);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    fetchBooks().then(setBooks).catch(console.error);
  }, []);

  // Get user ID from localStorage
  const getUserId = () => {
    return sessionStorage.getItem("userId");
  };

  const handleAddToCart = (book) => {
    const existing = cart.find((item) => item.id === book.id);
    if (!existing) {
      setCart([...cart, { ...book, quantity: 1 }]);
    }
  };

  const handleRemoveFromCart = (bookId) => {
    setCart(cart.filter((item) => item.id !== bookId));
  };

  const handleIncreaseQuantity = (bookId) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === bookId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const handleDecreaseQuantity = (bookId) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.id === bookId ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  return (
    <div className="library-page">
      <Sidebar />
      <div className="main-contentb">
        <AppBar />
        <br />
        <div>
          <button onClick={() => setShowCart(true)}>
            Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)})
          </button>
          <div style={{ marginTop: "20px" }}></div>
        </div>

        <BookTable
          books={books}
          cart={cart}
          handleAddToCart={handleAddToCart}
          handleRemoveFromCart={handleRemoveFromCart}
          handleIncreaseQuantity={handleIncreaseQuantity}
          handleDecreaseQuantity={handleDecreaseQuantity}
        />

        {showCart && (
          <CartModal
            cartItems={cart}
            removeFromCart={handleRemoveFromCart}
            increaseQty={handleIncreaseQuantity}
            decreaseQty={handleDecreaseQuantity}
            onClose={() => setShowCart(false)}
            userId={getUserId()}
          />
        )}
      </div>
    </div>
  );
};

export default BooksPage;
