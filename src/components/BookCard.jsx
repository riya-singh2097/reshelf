 import bookImg from "../assets/samplebook.jpg"
 
 const BookCard = ({ book,onOpen }) => {
  return (
    <div 
      className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group border border-base-300 overflow-hidden"
      onClick={onOpen}
    >
      {/* Image Container with fixed aspect ratio */}
      <figure className="bg-base-200 pt-6 px-4">
        <img 
          src={book.bookCover} 
          alt={book.bookTitle} 
          className="rounded-sm shadow-md h-full w-full object-contain group-hover:scale-105 transition-transform duration-300 "
        />
      </figure>

      <div className="card-body p-4 gap-1">
        {/* Category Badge */}
        <div className="flex justify-between items-start">
           <span className="badge badge-primary badge-sm">{book.category}</span>
           <span className="text-xs opacity-60 font-mono">{book.condition}</span>
        </div>

        {/* Title & Author */}
        <h2 className="card-title text-lg leading-tight line-clamp-2 mt-2">
          {book.bookTitle}
        </h2>
        <p className="text-sm opacity-70 italic">by {book.bookAuthor}</p>

        {/* Action / Footer */}
        <div className="card-actions justify-end mt-4">
          <button className="btn btn-sm btn-outline btn-primary no-animation" onClick={onOpen}>
             View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookCard