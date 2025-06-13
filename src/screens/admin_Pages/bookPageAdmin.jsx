import React, { useEffect, useState } from "react";
import { fetchBooks } from "../../services/bookService";
import BookTable from "../../components/bookTableAdmin";
import Sidebar from "../../components/sideBar";
import AppBar from "../../components/appBar";
import "../../styling/book.css";

const BooksPageAdmin = () => {
  const [books, setBooks] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newBook, setNewBook] = useState({
    name: "",
    category: "",
    type: "",
    language: "",
    quantity: 1,
    availability: "Available",
  });

  useEffect(() => {
    fetchBooks().then(setBooks).catch(console.error);
  }, []);

  const handleAddBook = () => {
    // This should ideally call your backend to save the book.
    const newId = Math.max(...books.map((b) => b.id)) + 1;
    const bookWithId = { ...newBook, id: newId };
    setBooks((prev) => [...prev, bookWithId]);
    setShowAddModal(false);
    setNewBook({
      name: "",
      category: "",
      type: "",
      language: "",
      quantity: 1,
      availability: "Available",
    });
  };

  return (
    <div className="library-page">
      <Sidebar />
      <div className="main-contentb">
        <AppBar />
        <br />

        {/* Add Book Button */}
        <div>
          <button onClick={() => setShowAddModal(true)}>+ Add Book</button>
          <div style={{ marginTop: "20px" }}></div>
        </div>

        <BookTable books={books} />

        {/* Add Book Modal */}
        {showAddModal && (
          <div className="modal-overlayBook">
            <div className="modal-contentBook">
              <h2>Add New Book</h2>
              <label>
                Title:{" "}
                <input
                  value={newBook.name}
                  onChange={(e) =>
                    setNewBook({ ...newBook, name: e.target.value })
                  }
                />
              </label>
              <label>
                Author:{" "}
                <input
                  value={newBook.category}
                  onChange={(e) =>
                    setNewBook({ ...newBook, category: e.target.value })
                  }
                />
              </label>
              <label>
                Type:{" "}
                <input
                  value={newBook.type}
                  onChange={(e) =>
                    setNewBook({ ...newBook, type: e.target.value })
                  }
                />
              </label>
              <label>
                Quantity:{" "}
                <input
                  type="number"
                  value={newBook.quantity}
                  onChange={(e) =>
                    setNewBook({
                      ...newBook,
                      quantity: parseInt(e.target.value),
                    })
                  }
                />
              </label>
              <div className="form-field">
                <label>
                  Language:
                  <br />
                  <select
                    value={newBook.language}
                    onChange={(e) =>
                      setNewBook({ ...newBook, language: e.target.value })
                    }
                  >
                    <option value="">Select Language</option>
                    <option value="English">English</option>
                    <option value="Sinhala">Sinhala</option>
                    <option value="Tamil">Tamil</option>
                  </select>
                </label>

                <label>
                  Availability:
                  <select
                    value={newBook.availability}
                    onChange={(e) =>
                      setNewBook({ ...newBook, availability: e.target.value })
                    }
                  >
                    <option>Available</option>
                    <option>Not Available</option>
                  </select>
                </label>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
                 <button
                  onClick={() => setShowAddModal(false)}
                  
                >
                  Cancel
                </button>
                <button onClick={handleAddBook} style={{ marginLeft: "auto" }}>Save</button>
               
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BooksPageAdmin;
