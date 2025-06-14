import React, { useEffect, useState } from "react";
import {
  fetchBooks,
  updateBook,
  availabilityToString,
  addBook,
  deleteBook
} from "../../services/bookService";
import BookTable from "../../components/bookTableAdmin";
import Sidebar from "../../components/sideBar";
import AppBar from "../../components/appBar";
import "../../styling/book.css";

const BooksPageAdmin = () => {
  const [books, setBooks] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [originalBook, setOriginalBook] = useState(null);
  const [newBook, setNewBook] = useState({
    name: "",
    category: "",
    type: "",
    language: "",
    quantity: 1,
    availability: "Available",
  });

  const transformBookForUI = (book) => {
    return {
      id: book.id,
      name: book.title || "Untitled",
      category: book.author || "Unknown Author",
      type:
        book.type?.name ||
        (typeof book.type === "string" ? book.type : "Unknown"),
      language: book.language,
      quantity: book.quantity || 0,
      availability: availabilityToString(book.availability),
      availabilityBoolean: book.availability,
    };
  };

  useEffect(() => {
    fetchBooks().then(setBooks).catch(console.error);
  }, []);

  // Function to get only the changed fields
  const getChangedFields = (original, updated) => {
    const changes = {};

    Object.keys(updated).forEach((key) => {
      if (original[key] !== updated[key]) {
        changes[key] = updated[key];
      }
    });

    return changes;
  };

  // Handle edit book click
  const handleEditBook = (book) => {
    setEditingBook({ ...book });
    setOriginalBook({ ...book });
    setShowEditModal(true);
  };

  // Handle save edited book
  const handleSaveEditedBook = async () => {
    try {
      const changedFields = getChangedFields(originalBook, editingBook);

      // Always send these two fields
      changedFields.availability = editingBook.availability;
      changedFields.availabilityBoolean =
        editingBook.availability === "Available";

      const updatedBook = await updateBook(editingBook.id, changedFields);

      const transformedBook = transformBookForUI(updatedBook);

      setBooks((prevBooks) =>
        prevBooks.map((book) =>
          book.id === editingBook.id ? transformedBook : book
        )
      );

      setShowEditModal(false);
      setEditingBook(null);
      setOriginalBook(null);
    } catch (error) {
      console.error("Failed to update book:", error);
      alert("Failed to update book. Please try again.");
    }
  };

  const handleAddBook = async () => {
    try {
      const createdBook = await addBook(newBook);

      setBooks((prev) => [...prev, createdBook]);
      setShowAddModal(false);
      setNewBook({
        name: "",
        category: "",
        // type: "",
        language: "",
        quantity: 1,
      });
    } catch (error) {
      console.error("Failed to add book:", error);
      alert("Failed to add book. Please try again.");
    }
  };

  const handleDeleteBook = async (id) => {
  if (!window.confirm("Are you sure you want to delete this book?")) return;

  try {
    await deleteBook(id);
    setBooks((prevBooks) => prevBooks.filter((book) => book.id !== id));
  } catch (error) {
    console.error("Failed to delete book:", error);
    alert("Failed to delete book. Please try again.");
  }
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

        <BookTable books={books} onEditBook={handleEditBook} onDeleteBook={handleDeleteBook} />

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
              {/* <label>
                Type:{" "}
                <input
                  value={newBook.type}
                  onChange={(e) =>
                    setNewBook({ ...newBook, type: e.target.value })
                  }
                />
              </label> */}

              <label>
                Quantity:{" "}
                <input
                  type="number"
                  value={newBook.quantity}
                  onChange={(e) =>
                    setNewBook({
                      ...newBook,
                      quantity: e.target.value, // store as string
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

                {/* <label>
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
                </label> */}
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "20px",
                }}
              >
                <button onClick={() => setShowAddModal(false)}>Cancel</button>
                <button onClick={handleAddBook} style={{ marginLeft: "auto" }}>
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Book Modal */}
        {showEditModal && editingBook && (
          <div className="modal-overlayBook">
            <div className="modal-contentBook">
              <h2>Edit Book</h2>
              <label>
                Title:{" "}
                <input
                  value={editingBook.name}
                  onChange={(e) =>
                    setEditingBook({
                      ...editingBook,
                      name: e.target.value,
                      availabilityBoolean: e.target.value === "Available",
                    })
                  }
                />
              </label>
              <label>
                Author:{" "}
                <input
                  value={editingBook.category}
                  onChange={(e) =>
                    setEditingBook({ ...editingBook, category: e.target.value })
                  }
                />
              </label>
              <label>
                Type:{" "}
                <input
                  value={editingBook.type}
                  onChange={(e) =>
                    setEditingBook({ ...editingBook, type: e.target.value })
                  }
                />
              </label>
              <label>
                Quantity:{" "}
                <input
                  type="number"
                  value={editingBook.quantity ?? ""}
                  onChange={(e) =>
                    setEditingBook({
                      ...editingBook,
                      quantity: e.target.value, // don't parse yet
                    })
                  }
                />
              </label>

              <div className="form-field">
                <label>
                  Language:
                  <br />
                  <select
                    value={editingBook.language}
                    onChange={(e) =>
                      setEditingBook({
                        ...editingBook,
                        language: e.target.value,
                      })
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
                    value={editingBook.availability}
                    onChange={(e) =>
                      setEditingBook({
                        ...editingBook,
                        availability: e.target.value,
                      })
                    }
                  >
                    <option>Available</option>
                    <option>Not Available</option>
                  </select>
                </label>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "20px",
                }}
              >
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingBook(null);
                    setOriginalBook(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEditedBook}
                  style={{ marginLeft: "auto" }}
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BooksPageAdmin;
