import React, { useEffect, useState } from "react";
import {
  fetchBooks,
  updateBook,
  availabilityToString,
  addBook,
  deleteBook,
  fetchBookTypes,
} from "../../services/bookService";
import BookTable from "../../components/bookTableAdmin";
import Sidebar from "../../components/sideBar";
import AppBar from "../../components/appBar";
import "../../styling/book.css";
import {
  showSuccess,
  showError,
  confirmDialog,
} from "../../utils/alertUtil"; 

// Store book count in secure storage
const storeBookCount = (totalCount, totalBooks) => {
  try {
    const bookCountData = {
      totalCount: totalCount,
      totalBooks: totalBooks,
      lastUpdated: new Date().toISOString(),
      timestamp: Date.now(),
    };

    // Store in sessionStorage (secure for session-based storage)
    sessionStorage.setItem("bookCount", JSON.stringify(bookCountData));

    // Also store in a more persistent way if needed (optional)
    // You can use encrypted localStorage or a secure storage solution
    localStorage.setItem("bookCount", JSON.stringify(bookCountData));

    console.log("Book count stored:", bookCountData);
  } catch (error) {
    console.error("Error storing book count:", error);
  }
};

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
  const [bookTypes, setBookTypes] = useState([]);

  const transformBookForUI = (book) => {
    return {
      id: book.id,
      name: book.title || "Untitled",
      category: book.author || "Unknown Author",
      type:
        book.type?.name ||
        (typeof book.type === "string" ? book.type : "Unknown"),
      language: book.language,
      availablequantity: book.availableCount || 0,
      availability: availabilityToString(book.availability),
      availabilityBoolean: book.availability,
    };
  };

  // Function to calculate and store total book count
  const calculateAndStoreTotalCount = (booksList) => {
    const totalCount = booksList.reduce((sum, book) => {
      const quantity = parseInt(book.quantity) || 0;
      return sum + quantity;
    }, 0);

    // Store book count using the secure storage function
    storeBookCount(totalCount, booksList.length);

    return totalCount;
  };

  useEffect(() => {
    // Fetch fresh data
    fetchBooks()
      .then((fetchedBooks) => {
        setBooks(fetchedBooks);
        calculateAndStoreTotalCount(fetchedBooks);
      })
      .catch(console.error);

    const loadBookTypes = async () => {
      try {
        const types = await fetchBookTypes();
        setBookTypes(types);
      } catch (error) {
        console.error("Failed to load book types:", error);
      }
    };

    loadBookTypes();
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

      const updatedBooks = books.map((book) =>
        book.id === editingBook.id ? transformedBook : book
      );

      setBooks(updatedBooks);

      // Recalculate and store total count
      calculateAndStoreTotalCount(updatedBooks);

      setShowEditModal(false);
      setEditingBook(null);
      setOriginalBook(null);
      await showSuccess("Book updated successfully!");
    } catch (error) {
      console.error("Failed to update book:", error);
      await showError("Failed to update book. Please try again.");
    }
  };

  const handleAddBook = async () => {
    try {
      const createdBook = await addBook(newBook);

      const updatedBooks = [...books, createdBook];
      setBooks(updatedBooks);

      // Recalculate and store total count
      calculateAndStoreTotalCount(updatedBooks);

      setShowAddModal(false);
      setNewBook({
        name: "",
        category: "",
        language: "",
        quantity: 1,
      });
      await showSuccess("Book added successfully!");
    } catch (error) {
      console.error("Failed to add book:", error);
      await showError("Failed to add book. Please try again.");
    }
  };

  const handleDeleteBook = async (id) => {
    if (await confirmDialog("Are you sure you want to delete this book?")) {
      try {
        await deleteBook(id);
        const updatedBooks = books.filter((book) => book.id !== id);
        setBooks(updatedBooks);

        // Recalculate and store total count
        calculateAndStoreTotalCount(updatedBooks);
        await showSuccess("Book deleted successfully!");
      } catch (error) {
        console.error("Failed to delete book:", error);
        await showError("Failed to delete book. Please try again.");
      }
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

        <BookTable
          books={books}
          onEditBook={handleEditBook}
          onDeleteBook={handleDeleteBook}
        />

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
                Quantity:{" "}
                <input
                  type="number"
                  value={newBook.quantity}
                  onChange={(e) =>
                    setNewBook({
                      ...newBook,
                      quantity: e.target.value,
                    })
                  }
                />
              </label>
              <label>
                Type:
                <select
                  value={newBook.type?.id || ""}
                  onChange={(e) => {
                    const selected = bookTypes.find(
                      (t) => t.id === e.target.value
                    );
                    setNewBook({ ...newBook, type: selected });
                  }}
                >
                  <option value="">Select Type</option>
                  {bookTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
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
                Quantity:{" "}
                <input
                  type="number"
                  value={editingBook.quantity ?? ""}
                  onChange={(e) =>
                    setEditingBook({
                      ...editingBook,
                      quantity: e.target.value,
                    })
                  }
                />
              </label>

              <label>
                Type:
                <select
                  value={editingBook.type?.id || ""}
                  onChange={(e) => {
                    const selected = bookTypes.find(
                      (t) => t.id === e.target.value
                    );
                    setEditingBook({
                      ...editingBook,
                      type: selected || { id: "", name: "" },
                    });
                  }}
                >
                  <option value="">Select Type</option>
                  {bookTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
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
