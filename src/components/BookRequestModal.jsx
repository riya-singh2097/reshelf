import { Link } from "react-router-dom";
import { useFirebase } from "../context/FirebaseContext.jsx";
import { toast } from "react-toastify";
import api from "../lib/axios.js";
import { useState } from "react";

const BookInfo = ({ book, onClose }) => {
console.log(book.owner, book._id,book.bookTitle );
  const { user } = useFirebase();
  const [loading, setLoading] = useState(false);

  async function handleRequest(e) {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    try {
      const token = await user.getIdToken();
      const res = await api.post(`/request`, {
        receiverId: book.owner,
        bookId: book._id,
        bookTitle: book.bookTitle,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        toast.success("Request sent successfully!");
        onClose(); // Close modal on success
      }
    } catch (error) {
      // Access the specific error message from your backend duplicate check
      const errMsg = error.response?.data?.message || error.message;
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <dialog className="modal modal-open backdrop-blur-md transition-all">
      <div className="modal-box max-w-4xl w-[80vw] max-h-[90vh] p-0 overflow-y-auto rounded-[32px] border border-white/20 shadow-2xl bg-base-100 scrollbar-hide">
        <button 
          className="btn btn-sm btn-circle btn-ghost sticky float-right right-6 top-6 z-50 bg-base-200/80 backdrop-blur-md" 
          onClick={onClose}
        >✕</button>

        <div className="flex flex-col lg:flex-row h-full">
          
          {/* LEFT: VISUAL PANEL (Non-scrollable relative to content) */}
          <div className="lg:w-[35%] bg-base-200/50 p-8 flex flex-col items-center border-r border-base-300">
            
            {/* The Glowing Book Cover */}
            <div className="relative group w-full flex justify-center py-6">
              {/* Vibrant Glow Layers */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-primary/40 blur-[50px] rounded-full opacity-40"></div>
              
              <div className="relative z-10 w-[50%] aspect-[3/4.5] rounded-xl overflow-hidden shadow-2xl border-2 border-white/50">
                <img 
                  src={book.bookCover} 
                  alt={book.bookTitle} 
                  className="w-full h-full object-cover" 
                />
              </div>
            </div>

            {/* Action Section */}
            <div className="w-full mt-6 space-y-4">
                <button 
                    onClick={handleRequest}
                    className="btn btn-primary btn-block rounded-2xl h-14 text-lg font-bold shadow-lg hover:shadow-primary/40 transition-all border-none"
                >
                    Request to Borrow
                </button>

                <div className="bg-base-100/40 p-4 rounded-2xl border border-base-300 flex flex-col items-center gap-1">
                    <span className="text-[10px] font-black tracking-widest uppercase opacity-40 text-center">Listed By</span>
                    <Link 
                        to={`/profile/${book.owner}`} 
                        className="flex items-center gap-2 group hover:text-primary transition-colors"
                    >
                        <span className="font-bold underline underline-offset-4">{book.ownerName }</span>
                    </Link>
                </div>
            </div>
          </div>

          {/* RIGHT: CONTENT PANEL */}
          <div className="lg:w-[65%] p-8 lg:p-12 flex flex-col gap-8">
            
            {/* Header */}
            <div>
              <h3 className="text-4xl lg:text-5xl font-black tracking-tighter text-base-content lowercase leading-tight">
                {book.bookTitle}
              </h3>
              <p className="text-xl opacity-60">by <span className="text-primary font-bold">{book.bookAuthor}</span></p>
            </div>

            {/* Stats Grid - 2x2 */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-base-200/50 p-4 rounded-2xl border border-base-300">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">Category</p>
                    <p className="font-bold">{book.category}</p>
                </div>
                <div className="bg-base-200/50 p-4 rounded-2xl border border-base-300">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">Condition</p>
                    <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className={`w-2.5 h-2.5 rounded-full ${i < book.condition ? "bg-orange-400 shadow-[0_0_8px_#fb923c]" : "bg-base-300"}`} />
                        ))}
                    </div>
                </div>
                <div className="bg-base-200/50 p-4 rounded-2xl border border-base-300">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">ISBN</p>
                    <p className="font-mono text-xs font-bold">{book.isbn || "N/A"}</p>
                </div>
                <div className="bg-base-200/50 p-4 rounded-2xl border border-base-300">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">Date Added</p>
                    <p className="font-bold text-sm">{new Date(book.createdAt).toLocaleDateString()}</p>
                </div>
            </div>

            {/* Gallery Section */}
            {book.gallery?.length > 0 && (
                <div className="space-y-3">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30">Item Gallery</h4>
                    <div className="grid grid-cols-4 gap-3">
                        {book.gallery.map((img, idx) => (
                            <div key={idx} className="aspect-square rounded-xl overflow-hidden border border-base-300 shadow-sm">
                                <img src={img} className="w-full h-full object-cover" alt="Gallery" />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Description */}
            <div className="space-y-3">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30">Synopsis</h4>
              <p className="text-lg leading-relaxed opacity-70 italic font-medium">
                {book.aboutBook || "No detailed description available."}
              </p>
            </div>
          </div>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop bg-black/70" onClick={onClose}><button>close</button></form>
    </dialog>
  );
};

export default BookInfo;