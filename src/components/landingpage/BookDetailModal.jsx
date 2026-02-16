import { Calendar, Hash, Bookmark, Star, X, BookOpen, CheckCircle } from "lucide-react";

const BookDetailsModal = ({ book, onClose, onConfirmFinish, isProcessing }) => {
  if (!book) return null;

  const formattedDate = book.createdAt
    ? new Date(book.createdAt).toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "N/A";

  return (
    <dialog className="modal modal-open backdrop-blur-sm transition-all p-4 z-[999]">
      <div className="modal-box max-w-4xl w-full p-0 rounded-3xl border border-base-300 shadow-2xl overflow-hidden bg-base-100 flex flex-col md:flex-row max-h-[90vh]">
        
        {/* LEFT: Image Section */}
        <div className="md:w-72 bg-base-200/50 flex flex-col items-center justify-center p-8 border-b md:border-b-0 md:border-r border-base-300">
          <div className="relative w-full aspect-[3/4] rounded-xl shadow-2xl overflow-hidden border-4 border-white">
            <img
              src={book.bookCover || "/placeholder-book.png"}
              alt={book.bookTitle}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="mt-6 flex flex-col w-full gap-3">
             <div className={`badge w-full py-4 font-bold uppercase tracking-widest ${
              book.isAvailable ? "badge-success" : "badge-error"
            }`}>
              {book.isAvailable ? "Available" : "Closed / Handed Over"}
            </div>
          </div>
        </div>

        {/* RIGHT: Content */}
        <div className="flex-1 flex flex-col bg-base-100 overflow-hidden">
          <div className="p-6 pb-4 flex justify-between items-start">
            <div>
              <h3 className="text-2xl font-black leading-tight">{book.bookTitle}</h3>
              <p className="text-primary font-bold">By {book.bookAuthor}</p>
            </div>
            <button className="btn btn-sm btn-circle btn-ghost" onClick={onClose}><X /></button>
          </div>

          <div className="px-6 pb-6 overflow-y-auto">
            <div className="grid grid-cols-2 gap-4 py-4 border-y border-base-200">
              <DetailItem icon={<Bookmark size={14}/>} label="Category" value={book.category} />
              <DetailItem icon={<Hash size={14}/>} label="ISBN" value={book.isbn || "N/A"} />
              <DetailItem icon={<Calendar size={14}/>} label="Listed On" value={formattedDate} />
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold opacity-50">Condition</span>
                <div className="flex gap-1 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className={`w-3 h-3 mask mask-star-2 ${i < book.condition ? 'bg-orange-400' : 'bg-base-300'}`} />
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6">
              <label className="text-[10px] uppercase font-bold opacity-50 flex items-center gap-2 mb-2">
                <BookOpen size={14} /> Description
              </label>
              <p className="text-sm opacity-80 leading-relaxed">{book.aboutBook}</p>
            </div>
          </div>

          {/* ACTION FOOTER */}
          <div className="p-6 bg-base-200 mt-auto flex gap-3">
             <button 
                onClick={onConfirmFinish}
                disabled={!book.isAvailable || isProcessing}
                className="btn btn-primary flex-1 gap-2"
             >
                <CheckCircle size={18} />
                {book.isAvailable ? "Done Negotiating / Close" : "Already Closed"}
             </button>
             <button onClick={onClose} className="btn btn-ghost">Cancel</button>
          </div>
        </div>
      </div>
    </dialog>
  );
};

const DetailItem = ({ icon, label, value }) => (
  <div className="flex flex-col">
    <span className="text-[10px] uppercase font-bold opacity-50 flex items-center gap-1">{icon} {label}</span>
    <span className="text-sm font-bold truncate">{value}</span>
  </div>
);

export default BookDetailsModal;