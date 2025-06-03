import React from "react";

const BookTable = ({ books, handleAddToCart }) => {
  return (
    <div className="table-wrapper">
      <table className="books-table">
        <thead>
          <tr>
            <th>Book ID</th>
            <th>Name</th>
            <th>Category</th>
            <th>Type</th>
            <th>Language</th>
            <th>Availability</th>
            <th>Add to Cart</th>
          </tr>
        </thead>
        <tbody>
          {books && books.length > 0 ? (
            books.map((book) => (
              <tr key={book.id}>
                <td>{book.id}</td>
                <td>{book.name}</td>
                <td>{book.category}</td>
                <td>{book.type}</td>
                <td>{book.language}</td>
                <td>{book.availability}</td>
                <td>
                  {book.availability === "Available" && (
                    <input
                      type="checkbox"
                      onChange={() => handleAddToCart(book)}
                    />
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" style={{ textAlign: "center" }}>
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
