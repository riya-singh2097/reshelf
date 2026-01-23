import { Calendar, Hash, Bookmark, Star, Trash2, X, BookOpen } from "lucide-react";

const BookModal = ({ book, onClose, onDelete }) => {
  const formattedDate = book.createdAt
    ? new Date(book.createdAt).toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "N/A";

  return (
    <dialog className="modal modal-open backdrop-blur-md transition-all p-6">
      <div className="modal-box max-w-3xl w-full p-0 rounded-[1.5rem] border border-base-300 shadow-2xl overflow-hidden bg-base-100 flex flex-col md:flex-row max-h-[85vh]">
        
        {/* LEFT: Curated Image Area */}
        <div className="md:w-64 bg-base-200/50 flex flex-col items-center justify-start p-8 relative border-b md:border-b-0 md:border-r border-base-300">
          
          <div className="absolute top-10 w-32 h-32 bg-primary/20 blur-3xl rounded-full" />

          {/* Book Cover - Strictly Sized */}
          <div className="relative z-10 w-36 md:w-44 transition-transform hover:scale-[1.02] duration-300">
            <div className="aspect-[3/4] rounded shadow-2xl overflow-hidden border-[6px] border-white">
              <img
                src={book.bookCover || "/placeholder-book.png"}
                alt={book.bookTitle}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="mt-8 flex flex-col items-center gap-4 z-10 w-full">
            <span className={`px-4 py-1.5 rounded-lg text-[10px] font-black tracking-widest uppercase shadow-sm ${
              book.TransactionType === "lend" ? "bg-secondary text-secondary-content" : "bg-accent text-accent-content"
            }`}>
              {book?.TransactionType || "N/A"}
            </span>
            
            <button
              onClick={onDelete}
              className="btn btn-ghost btn-sm text-error font-bold hover:bg-error/10 gap-2"
            >
              <Trash2 size={14} />
              <span className="text-[10px] uppercase">Remove</span>
            </button>
          </div>
        </div>

        {/* RIGHT: Content Section */}
        <div className="flex-1 flex flex-col min-w-0 bg-base-100">
          {/* Header */}
          <div className="p-8 pb-6 flex justify-between items-start">
            <div className="pr-8">
              <h3 className="text-2xl md:text-3xl font-black text-base-content tracking-tight leading-tight">
                {book.bookTitle}
              </h3>
              <p className="text-primary font-bold text-lg mt-1">
                <span className="text-base-content/50 font-medium text-sm">by</span> {book.bookAuthor}
              </p>
            </div>
            <button 
              className="btn btn-sm btn-circle btn-ghost bg-base-200 text-base-content hover:bg-base-300" 
              onClick={onClose}
            >
              <X size={20} />
            </button>
          </div>

          {/* Details Body */}
          <div className="px-8 pb-8 overflow-y-auto">
            {/* Minimal Grid */}
            <div className="grid grid-cols-2 gap-y-8 gap-x-6 py-6 border-y border-base-200">
              <DetailItem icon={<Bookmark size={16} className="text-primary" />} label="Category" value={book.category} />
              
              <div className="flex flex-col">
                <span className="flex items-center gap-2 text-[11px] uppercase font-bold text-base-content/60 tracking-wider mb-1">
                  <Star size={16} className="text-primary" /> Condition
                </span>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div 
                      key={i} 
                      className={`w-3 h-3 mask mask-star-2 ${i < (book.condition || 0) ? 'bg-orange-500' : 'bg-base-300'}`} 
                    />
                  ))}
                </div>
              </div>

              <DetailItem icon={<Hash size={16} className="text-primary" />} label="ISBN" value={book.isbn || "Not Provided"} />
              <DetailItem icon={<Calendar size={16} className="text-primary" />} label="Date Added" value={formattedDate} />
            </div>

            {/* Description Section */}
            <div className="mt-8">
              <label className="text-[11px] uppercase font-bold tracking-[0.15em] text-base-content/50 flex items-center gap-2 mb-3">
                <BookOpen size={14} /> The Narrative
              </label>
              <p className="text-md leading-relaxed text-base-content font-medium opacity-90">
                {book.aboutBook || "No detailed description available for this title."}
              </p>
            </div>
          </div>
        </div>
      </div>

      <form method="dialog" className="modal-backdrop bg-neutral-focus/40" onClick={onClose}>
        <button className="cursor-default">close</button>
      </form>
    </dialog>
  );
};

const DetailItem = ({ icon, label, value }) => (
  <div className="flex flex-col">
    <span className="flex items-center gap-2 text-[11px] uppercase font-bold text-base-content/60 tracking-wider">
      {icon} {label}
    </span>
    <div className="text-sm font-bold text-base-content mt-1">
      {value}
    </div>
  </div>
);

export default BookModal;