const BookCard = ({ book, onOpen }) => {
  return (
    <div 
      className="card bg-base-100 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group border border-base-300 overflow-hidden h-full flex flex-col"
      onClick={onOpen}
    >
      {/* Reduced figure height */}
      <figure className="bg-base-200 pt-4 px-3 h-40">
        <img 
          src={book?.bookCover} 
          alt={book?.bookTitle} 
          className="rounded-sm shadow-sm h-full w-full object-contain group-hover:scale-105 transition-transform duration-300"
        />
      </figure>

      {/* Reduced padding and gap */}
      <div className="card-body p-3 gap-0 flex-grow">
        <div className="flex justify-between items-center mb-1">
          <span className="badge badge-primary scale-75 origin-left">{book?.category}</span>
          <span className="text-[10px] opacity-60 font-mono uppercase">{book?.condition}</span>
        </div>

        {/* Smaller title text */}
        <h2 className="text font-bold min-h-[2.5rem]">
          {book?.bookTitle}
        </h2>
        <p className="text-sm opacity-90 italic truncate">by {book?.bookAuthor}</p>

        <div className="card-actions justify-end mt-2">
          <button 
            className="btn btn-xs btn-primary btn-outline" 
            onClick={(e) => {
              e.stopPropagation(); // Prevent double trigger with div onClick
              onOpen();
            }}
          >
            Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookCard