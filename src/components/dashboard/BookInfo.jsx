const BookInfo = ({ book, onClose }) => {
  console.log(book);
  
  return (
    <dialog className="modal modal-open modal-bottom sm:modal-middle">
      <div className="modal-box max-w-5xl border border-base-300 overflow-x-hidden p-8">
        
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4 z-50"
          onClick={onClose}
        >
          ✕
        </button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-6 md:gap-x-10">
          
          <div className="md:col-span-1 flex flex-col items-center">
            <div className="w-full aspect-[3/4] overflow-hidden rounded-xl shadow-2xl bg-base-200">
              <img
                src={book.bookCover}
                alt={book.bookTitle}
                className="w-full h-full object-cover"
              />
            </div>

            <div
              className={`badge mt-5 w-full py-3 text-sm font-bold ${
                book.TransactionType === "lend"
                  ? "badge-secondary"
                  : "badge-accent"
              }`}
            >
              Type: {book?.TransactionType?.toUpperCase() || "N/A"}
            </div>

            <button className="btn btn-md btn-outline rounded-full mt-4 w-full">
              Request to Borrow
            </button>
          </div>

          <div className="md:col-span-2 min-w-0 mt-6 md:mt-0">
            <h3 className="font-bold text-3xl md:text-4xl leading-tight break-words">
              {book.bookTitle}
            </h3>

            <p className="mt-1 text-xl opacity-70 font-medium">
              by {book.bookAuthor}
            </p>

            <div className="divider my-4">Details</div>

            <div className="grid grid-cols-2 gap-x-8 gap-y-5 text-sm">
              <div className="min-w-0">
                <span className="font-semibold block text-xs opacity-60 uppercase">
                  Category
                </span>
                <p className="font-medium">{book.category}</p>
              </div>

              <div>
                <span className="font-semibold block text-xs opacity-60 uppercase">
                  Condition
                </span>
                <div className="rating rating-sm mt-1">
                  {[...Array(5)].map((_, i) => (
                    <input
                      key={i}
                      type="radio"
                      className="mask mask-star-2 bg-orange-400"
                      checked={i + 1 === book.condition}
                      readOnly
                    />
                  ))}
                </div>
              </div>

              <div className="min-w-0">
                <span className="font-semibold block text-xs opacity-60 uppercase">
                  ISBN
                </span>
                <p className="break-all font-mono">
                  {book.isbn || "N/A"}
                </p>
              </div>

              <div>
                <span className="font-semibold block text-xs opacity-60 uppercase">
                  Added on
                </span>
                <p>
                  {new Date(book.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* ABOUT SECTION */}
          <div className="md:col-span-3 mt-10">
            <div className="divider text-lg">About this book</div>
            <div className="bg-base-200 p-6 rounded-2xl border border-base-300">
              <p className="text-sm leading-relaxed italic">
                “{book.aboutBook}”
              </p>
            </div>
          </div>
        </div>
      </div>

      <form method="dialog" className="modal-backdrop" onClick={onClose}>
        <button>close</button>
      </form>
    </dialog>
  );
};

export default BookInfo;


