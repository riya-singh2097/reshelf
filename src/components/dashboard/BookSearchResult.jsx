import BookInfo from "./BookRequestModal.jsx";
import { useState } from "react";
import { ChevronRight, BookOpen } from "lucide-react";

const BooksSearchResult = ({ books = [] }) => {
  const [selectedBook, setSelectedBook] = useState(null);
console.log(books[0]);

  if (books.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 opacity-50 text-base-content">
        <BookOpen size={48} className="mb-4" />
        <h3 className="text-xl font-medium">No books found</h3>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto lg:mt-6 lg:p-8 p-4">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-base-content italic">Results</h2>
        <div className="h-1 w-16 bg-primary rounded-full mt-2"></div>
      </div>

      {/* Grid: 1 col on mobile/tablet, 3 cols on large screens */}
      <ul className="grid grid-cols-1 lg:grid-cols-4 md:grid-cols-2 gap-6">
        {books.map((book) => (
          <li
            key={book._id}
            onClick={() => setSelectedBook(book)}
            className="group flex flex-col justify-between bg-base-200 p-5 rounded-2xl cursor-pointer hover:bg-base-300 transition-all duration-300 border border-base-300 hover:border-primary/40 shadow-sm hover:shadow-xl"
          >
            <div className="flex gap-4">
              {/* Cover Image */}
              <div className="relative shrink-0">
                <img
                  src={book.bookCover || "/book-placeholder.png"}
                  alt={book.bookTitle}
                  className="w-24 h-32 object-cover rounded-xl shadow-md group-hover:rotate-2 transition-transform duration-300"
                />
              </div>

              {/* Book Details */}
              <div className="flex flex-col justify-between py-1">
                <div>
                  <h3 className="font-bold text-lg leading-tight text-base-content group-hover:text-primary transition-colors line-clamp-2">
                    {book.bookTitle}
                  </h3>
                  <p className="text-sm font-medium text-base-content/70 mt-1">
                    by {book.author}
                  </p>
                </div>

                <div className="flex flex-col gap-2 mt-auto">
                  {/* Transaction Type from Object */}
                  <div className="flex items-center gap-2">
                    <span className="badge badge-primary badge-sm font-bold uppercase tracking-wider">
                      {book.TransactionType}
                    </span>
                    <span className="text-xs font-semibold opacity-60">
                       {book.distance}
                    </span>
                  </div>
                  
                  {/* Price info */}
                  <p className="text-lg font-black text-base-content">
                    ${book.price}
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom bar for card polish */}
            <div className="mt-4 pt-3 border-t border-base-content/5 flex justify-between items-center text-primary font-semibold text-sm">
              View Details
              <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </li>
        ))}
      </ul>

      {selectedBook && (
        <BookInfo
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
        />
      )}
    </div>
  );
};

export default BooksSearchResult;