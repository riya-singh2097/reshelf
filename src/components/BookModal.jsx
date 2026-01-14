const BookModal = ({ book, onClose }) => {
  return (
    <dialog className="modal modal-open modal-bottom sm:modal-middle">
      <div className="modal-box max-w-3xl border border-base-300 overflow-x-hidden p-6">
        <button 
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 z-50" 
          onClick={onClose}
        >✕</button>
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-2 md:gap-x-8">
          
          {/* 1. IMAGE AREA - Stays in Row 1, Col 1 */}
          <div className="md:col-span-1 flex flex-col items-center">
            <div className="w-full aspect-[3/4] overflow-hidden rounded-lg shadow-xl bg-base-200">
              <img 
                src={book.bookCover} 
                alt={book.bookTitle} 
                className="w-full h-full object-cover" 
              />
            </div>
            <div className={`badge mt-4 w-full p-4 font-bold shrink-0 ${book.TransactionType === 'lend' ? 'badge-secondary' : 'badge-accent'}`}>
              Type: {book?.TransactionType?.toUpperCase() || "N/A"}
            </div>
          </div>

          {/* 2. HEADER & SPECS AREA - Stays in Row 1, Col 2+3 */}
          <div className="md:col-span-2 min-w-0 mt-4 md:mt-0">
            <h3 className="font-bold text-2xl md:text-3xl break-words leading-tight">
              {book.bookTitle}
            </h3>
            <p className="py-1 text-xl opacity-70 break-words font-medium">by {book.bookAuthor}</p>
            
            <div className="divider my-2">Details</div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="min-w-0">
                <span className="font-semibold block text-xs opacity-60 uppercase">Category</span>
                <p className="break-words font-medium">{book.category}</p>
              </div>
              <div>
                <span className="font-semibold block text-xs opacity-60 uppercase">Condition</span>
                <div className="rating rating-xs block mt-1">
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
                <span className="font-semibold block text-xs opacity-60 uppercase">ISBN</span>
                <p className="break-all font-mono">{book.isbn || "N/A"}</p>
              </div>
              <div>
                <span className="font-semibold block text-xs opacity-60 uppercase">Added on</span>
                <p>{new Date(book.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* 3. ABOUT SECTION - Forced to Row 2, spanning all 3 columns */}
          <div className="md:col-span-3 md:col-start-1 mt-6">
            <div className="divider">About this book</div>
            <div className="bg-base-200 p-4 rounded-xl border border-base-300 w-full">
              <p className="text-sm leading-relaxed break-words whitespace-normal italic">
                "{book.aboutBook}"
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
export default BookModal