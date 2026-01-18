import BookInfo from "./BookInfo.jsx";
import { useState } from "react";

const BooksSearchResult = ({ books = [] }) => {
  const [selectedBook, setSelectedBook] = useState(null);

  return (
    <>
      <div className="max-w-4xl mx-auto lg:mt-6 lg:p-8 p-4">
        <h2 className="text-lg font-semibold mb-4">Results</h2>

        <ul className="space-y-4">
          {books.map((book) => (
            <li 
            onClick={() => setSelectedBook(book)}
              key={book._id}
              className="flex items-center justify-between bg-base-100 p-4 rounded-xl shadow hover:bg-base-200 transition"
            >
              {/* LEFT SIDE */}
              <div
                className="flex items-center gap-4 cursor-pointer"
              >
                {/* Book Image */}
                <img
                  src={book.bookCover || "/book-placeholder.png"}
                  alt={book.bookTitle}
                  className="w-16 h-20 object-cover rounded-md"
                />

                {/* Book Info */}
                <div>
                  <h3 className="font-semibold text-base">
                    {book.bookTitle}
                  </h3>

                  <p className="text-sm text-gray-500">
                    Price: ${book.price} | Distance: {book.distance} miles
                  </p>

                  <p className="text-sm text-gray-500">
                    Author: {book.author}
                  </p>
                </div>
              </div>

          
            </li>
          ))}
        </ul>
      </div>

      {selectedBook && (
        <BookInfo
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
        />
      )}
    </>
  );
};

export default BooksSearchResult;
