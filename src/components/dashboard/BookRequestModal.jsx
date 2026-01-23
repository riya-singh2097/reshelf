import { useState, useEffect } from "react";
import api from "../../lib/axios.js";
import { useFirebase } from "../../context/FirebaseContext.jsx";
import { toast } from "react-toastify";
import { useUserContext } from "../../context/UserContext.jsx";

const BookInfo = ({ book, onClose }) => {
  const { user } = useFirebase();
  const {dbUser} = useUserContext();
  const [ownerInfo, setOwnerInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch Owner Info when modal opens
  useEffect(() => {
    const fetchOwner = async () => {
      if (!book?.owner) return;
      try {
        const token = await user.getIdToken();
        const res = await api.get(`/user/${book.owner}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOwnerInfo(res.data.data);
      } catch (error) {
        console.error("Error fetching owner:", error);
      }
    };
    fetchOwner();
  }, [book.owner, user]);

console.log(ownerInfo);
  // const handleBorrowRequest = async () => {
  //   // Prevent requesting your own book
  //   if (ownerInfo?._id === dbUser._id) { // Note: Compare mongoID vs mongoID
  //       return toast.warning("This is your own listing!");
  //   }

  //   setLoading(true);
  //   try {
  //     const token = await user.getIdToken();
  //     // Adjust this endpoint to your actual borrowing/chat logic
  //     await api.post("/requests/create", {
  //       bookId: book._id,
  //       ownerId: book.owner
  //     }, {
  //       headers: { Authorization: `Bearer ${token}` }
  //     });
      
  //     toast.success(`Request sent to ${ownerInfo?.fullName || "Owner"}!`);
  //     onClose();
  //   } catch (error) {
  //     toast.error(error.response?.data?.message || "Failed to send request");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <dialog className="modal modal-open modal-bottom sm:modal-middle">
      <div className="modal-box max-w-5xl border border-base-300 overflow-x-hidden p-0 rounded-3xl overflow-hidden">
        
        <button className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4 z-50" onClick={onClose}>✕</button>

        <div className="flex flex-col md:flex-row">
          {/* LEFT SIDE */}
          <div className="md:w-1/3 bg-base-200/50 p-8 flex flex-col items-center border-r border-base-300">
            <div className="w-full aspect-[3/4] overflow-hidden rounded-xl shadow-2xl">
              <img src={book.bookCover} alt={book.bookTitle} className="w-full h-full object-cover" />
            </div>

            <div className={`badge mt-5 w-full py-4 text-xs font-bold tracking-widest ${
              book.TransactionType === "lend" ? "badge-secondary" : "badge-accent"
            }`}>
              {book?.TransactionType?.toUpperCase()}
            </div>

            <div className="mt-6 w-full text-center">
                <p className="text-xs uppercase opacity-50 font-bold mb-1">Listed By</p>
                <p className="font-semibold">{ownerInfo ? ownerInfo.fullName : "Loading..."}</p>
            </div>

            <button 
              // onClick={handleBorrowRequest}
              disabled={loading}
              className={`btn btn-primary rounded-xl mt-4 w-full ${loading ? 'loading' : ''}`}
            >
              {book.TransactionType === "lend" ? "Request to Borrow" : "Inquire about Swap"}
            </button>
          </div>

          {/* RIGHT SIDE (Scrollable) */}
          <div className="md:w-2/3 p-8 md:p-12 max-h-[80vh] overflow-y-auto">
            <h3 className="font-black text-4xl leading-tight">{book.bookTitle}</h3>
            <p className="text-xl opacity-70 italic mb-8">by {book.bookAuthor}</p>

            <div className="grid grid-cols-2 gap-8">
              <div>
                <span className="block text-[10px] uppercase font-bold opacity-40">Category</span>
                <p className="text-lg font-medium">{book.category}</p>
              </div>
              <div>
                <span className="block text-[10px] uppercase font-bold opacity-40">Condition</span>
                <div className="rating rating-xs block">
                  {[...Array(5)].map((_, i) => (
                    <input key={i} type="radio" className="mask mask-star-2 bg-orange-400" checked={i + 1 === book.condition} readOnly />
                  ))}
                </div>
              </div>
              <div>
                <span className="block text-[10px] uppercase font-bold opacity-40">ISBN</span>
                <p className="font-mono text-sm">{book.isbn || "N/A"}</p>
              </div>
            </div>

            <div className="mt-10">
              <h4 className="text-[10px] uppercase font-bold opacity-40 mb-4">About this book</h4>
              <p className="text-md leading-relaxed opacity-80">{book.aboutBook}</p>
            </div>
          </div>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop bg-black/40" onClick={onClose}><button>close</button></form>
    </dialog>
  );
};

export default BookInfo;