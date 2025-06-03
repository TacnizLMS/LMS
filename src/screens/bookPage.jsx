import React, { useEffect, useState } from "react";
import { fetchBooks } from "../services/bookService";

import CartModal from "../model/cartModel";
import BookTable from "../components/bookTable";
import "../styling/book.css";
import Sidebar from "../components/sideBar";
import AppBar from "../components/appBar";
import { FiShoppingCart } from "react-icons/fi";

const BooksPage = () => {
  const [books, setBooks] = useState([]);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    fetchBooks().then(setBooks).catch(console.error);
  }, []);

  const handleAddToCart = (book) => {
    if (!cart.some((item) => item.id === book.id)) {
      setCart([...cart, book]);
    }
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  return (
    <div className="library-page">
      <Sidebar />
      <div className="main-contentb">
        <AppBar />
        <br />
        <div>
          <div>
            <button onClick={() => setShowCart(true)}>
              Cart ({cart.length})
            </button>
            <div style={{ marginTop: "20px" }}></div>
          </div>
        </div>

        <BookTable books={books} handleAddToCart={handleAddToCart} />
        {showCart && (
          <CartModal
            cartItems={cart}
            removeFromCart={removeFromCart}
            onClose={() => setShowCart(false)}
          />
        )}
      </div>
    </div>
  );
};

export default BooksPage;
