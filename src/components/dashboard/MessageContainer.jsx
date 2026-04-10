import { useRef, useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { X, CheckCircle, Star, ShieldAlert, ChevronRight } from "lucide-react";
import api from "../../lib/axios.js";
import { useFirebase } from "../../context/FirebaseContext.jsx";
import { useUserContext } from "../../context/UserContext.jsx";
import { useSocket } from "../../context/SocketContext.jsx";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// --- SUB-COMPONENT: User Profile Action Modal ---
const UserProfileModal = ({ userId, username, photo, onClose, onOpenRate }) => {
  const navigate = useNavigate();
  if (!userId) return null;

  return (
    <dialog className="modal modal-open backdrop-blur-md z-[1010]">
      <div className="modal-box max-w-sm rounded-3xl border border-base-300 shadow-2xl bg-base-100 p-8 flex flex-col items-center text-center">
        <button className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4" onClick={onClose}>
          <X size={18} />
        </button>
        
        <div className="avatar mb-4">
          <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
            <img src={photo || "https://via.placeholder.com/150"} alt={username} />
          </div>
        </div>
        
        <h3 className="text-2xl font-black">{username}</h3>
        <p className="text-[10px] uppercase tracking-widest opacity-40 font-bold mb-6">Chat Participant</p>
        
        <div className="flex flex-col w-full gap-3">
          <button 
            onClick={() => { navigate(`/profile/${userId}`); onClose(); }}
            className="btn btn-primary btn-md rounded-2xl flex justify-between px-6"
          >
            View Profile <ChevronRight size={18}/>
          </button>

          <button 
            onClick={onOpenRate}
            className="btn btn-outline btn-md rounded-2xl flex justify-between px-6"
          >
            Rate User <Star size={18} />
          </button>

          <button 
            onClick={() => { navigate(`/report/${userId}`); onClose(); }}
            className="btn btn-ghost btn-sm text-error mt-2 gap-2"
          >
            <ShieldAlert size={14} /> Report User
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop" onClick={onClose}><button>close</button></form>
    </dialog>
  );
};

//Rating Modal
const RatingModal = ({ targetUserId, onClose }) => {
  const [rating, setRating] = useState(5);
  const [note, setNote] = useState("");
  const { user } = useFirebase();

  const { mutate: submitRating, isPending } = useMutation({
    mutationFn: async () => {
      const token = await user.getIdToken();
      return api.post(`/user/rate/${targetUserId}`, { rating, note }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    },
    onSuccess: () => {
      toast.success("Rating submitted!");
      onClose();
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed to submit rating."),
  });

  return (
    <dialog className="modal modal-open z-[1020]">
      <div className="modal-box rounded-3xl shadow-2xl">
        <h3 className="font-black text-xl mb-4 text-center">Rate your interaction</h3>
        <div className="rating rating-lg w-full justify-center mb-6">
          {[1, 2, 3, 4, 5].map((num) => (
            <input 
              key={num}
              type="radio" 
              name="rating-star"
              className="mask mask-star-2 bg-orange-400" 
              checked={rating === num}
              onChange={() => setRating(num)}
            />
          ))}
        </div>
        <textarea 
          className="textarea textarea-bordered w-full h-28 rounded-2xl" 
          placeholder="Leave a note about this user..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <div className="modal-action flex gap-2">
          <button className="btn btn-ghost flex-1 rounded-xl" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary flex-1 rounded-xl" disabled={isPending} onClick={() => submitRating()}>
            {isPending ? "Submitting..." : "Submit Rating"}
          </button>
        </div>
      </div>
    </dialog>
  );
};

// Book Details Modal
const BookDetailsModal = ({ book, onClose, onConfirmFinish, isProcessing }) => {
  if (!book) return null;

  return (
    <dialog className="modal modal-open backdrop-blur-md p-4 z-[1000]">
      <div className="modal-box max-w-3xl w-full p-0 rounded-3xl border border-base-300 shadow-2xl overflow-hidden bg-base-100 flex flex-col md:flex-row max-h-[85vh]">
        <div className="md:w-64 bg-base-200/50 flex flex-col items-center justify-center p-6 border-b md:border-b-0 md:border-r border-base-300">
          <div className="w-40 aspect-[3/4] rounded-lg shadow-xl overflow-hidden border-4 border-white">
            <img src={book.bookCover} alt={book.bookTitle} className="w-full h-full object-cover" />
          </div>
          <div className={`mt-4 badge badge-md font-bold ${book.isAvailable ? "badge-success" : "badge-ghost opacity-50"}`}>
            {book.isAvailable ? "Available" : "Closed"}
          </div>
        </div>

        <div className="flex-1 flex flex-col bg-base-100 overflow-hidden">
          <div className="p-6 flex justify-between items-start">
            <div>
              <h3 className="text-xl font-black">{book.bookTitle}</h3>
              <p className="text-primary font-bold text-sm">By {book.bookAuthor}</p>
            </div>
            <button className="btn btn-sm btn-circle btn-ghost" onClick={onClose}><X size={18} /></button>
          </div>

          <div className="px-6 pb-6 overflow-y-auto space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-4 py-4 border-y border-base-200">
              <div>
                <p className="text-[10px] uppercase font-bold opacity-50">Category</p>
                <p className="font-bold">{book.category}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold opacity-50">ISBN</p>
                <p className="font-bold">{book.isbn || "N/A"}</p>
              </div>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold opacity-50 mb-1">Description</p>
              <p className="opacity-80 leading-relaxed">{book.aboutBook}</p>
            </div>
          </div>

          <div className="p-4 bg-base-200 mt-auto flex gap-2">
            <button 
              onClick={onConfirmFinish}
              disabled={!book.isAvailable || isProcessing}
              className="btn btn-primary flex-1 btn-sm rounded-xl"
            >
              {isProcessing ? <span className="loading loading-spinner"></span> : <><CheckCircle size={16}/> Done Negotiating</>}
            </button>
            <button onClick={onClose} className="btn btn-ghost btn-sm rounded-xl">Cancel</button>
          </div>
        </div>
      </div>
    </dialog>
  );
};

//  MAIN COMPONENT 
const MessageContainer = () => {
  const { id: conversationId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = useFirebase();
  const { dbUser } = useUserContext();
  const { socket } = useSocket();
  const [inputText, setInputText] = useState("");
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [showProfileActions, setShowProfileActions] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const lastMessageRef = useRef();
  const queryClient = useQueryClient();

  const initialUsername = state?.username;
  const initialPhoto = state?.photo;

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ["messages", conversationId],
    queryFn: async () => {
      const token = await user.getIdToken();
      const res = await api.get(`/chat/${conversationId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
    enabled: !!conversationId && !!user && !!dbUser,
  });

  const otherUserId = messages.find((m) => m.senderId !== dbUser?._id)?.senderId || messages[0]?.receiverId;

  const { data: modalBook, isLoading: loadingBook } = useQuery({
    queryKey: ["book-detail", selectedBookId],
    queryFn: async () => {
      const token = await user.getIdToken();
      const res = await api.get(`/book/get-book/${selectedBookId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data;
    },
    enabled: !!selectedBookId,
  });

  const { mutate: closeListing, isPending: isClosing } = useMutation({
    mutationFn: async (bookId) => {
      const token = await user.getIdToken();
      return api.put(`/book/status/${bookId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
    },
    onSuccess: () => {
      toast.success("Listing closed! Negotiation complete.");
      queryClient.invalidateQueries(["book-detail", selectedBookId]);
      setSelectedBookId(null);
    },
    onError: () => toast.error("Error closing listing."),
  });

  useEffect(() => {
    if (!socket) return;
    const handleNewMessage = (newMessage) => {
      if (newMessage.conversationId === conversationId) {
        queryClient.setQueryData(["messages", conversationId], (oldData) => {
          const exists = oldData?.find((m) => m._id === newMessage._id);
          if (exists) return oldData;
          return [...(oldData || []), newMessage];
        });
      }
    };
    socket.on("newMessage", handleNewMessage);
    return () => socket.off("newMessage", handleNewMessage);
  }, [socket, conversationId, queryClient]);

  const { mutate: sendMessage, isPending: isSending } = useMutation({
    mutationFn: async (text) => {
      const token = await user.getIdToken();
      const res = await api.post(`/message/send/${otherUserId}`, { message: text }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data;
    },
    onSuccess: (newMsg) => {
      setInputText("");
      queryClient.setQueryData(["messages", conversationId], (old) => [...(old || []), newMsg]);
    },
  });

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim() || isSending) return;
    sendMessage(inputText);
  };

  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (isLoading) return <div className="h-full flex items-center justify-center"><span className="loading loading-spinner loading-lg"></span></div>;

  return (
    <div className="h-full flex flex-col bg-base-100 relative">
      {/* HEADER */}
      <div className="bg-base-200 px-4 py-2 border-b border-base-300 flex items-center gap-3 min-h-16">
        <button onClick={() => navigate("/dashboard")} className="lg:hidden btn btn-sm btn-circle btn-ghost"><X /></button>
        <div 
          className="avatar cursor-pointer hover:opacity-80 transition-all active:scale-95"
          onClick={() => setShowProfileActions(true)}
        >
          <div className="w-10 rounded-full ring-primary ring-2 ring-offset-2">
            <img src={initialPhoto || "https://via.placeholder.com/150"} alt="User" />
          </div>
        </div>
        <div className="flex flex-col cursor-pointer" onClick={() => setShowProfileActions(true)}>
          <span className="font-bold text-sm leading-tight">{initialUsername || "User"}</span>
          <span className="text-[10px] opacity-40 font-bold uppercase">Click for options</span>
        </div>
      </div>

      {/* MESSAGES AREA */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        {messages.map((msg) => {
          const isMe = dbUser && msg.senderId === dbUser._id;
          const isRequest = msg.messageType === "request";

          return (
            <div key={msg._id} className={`chat ${isMe ? "chat-end" : "chat-start"} mb-6`}>
              <div className={`chat-bubble shadow-md max-w-[85%] text-sm ${isRequest ? "bg-base-300 text-base-content border-l-4 border-primary" : isMe ? "bg-primary text-primary-content" : "bg-secondary text-secondary-content"}`}>
                {isRequest && (
                  <div className="mb-2 border-b border-base-content/10 pb-1 flex justify-between">
                    <span className="text-[10px] font-black uppercase">📚 REQUEST</span>
                    <span className="badge badge-xs font-bold">{msg.requestStatus}</span>
                  </div>
                )}
                <p>{msg.message}</p>
                {isRequest && (
                  <div className="mt-3 flex gap-2">
                    <button onClick={() => setSelectedBookId(msg.bookId)} className="btn btn-xs btn-outline rounded-lg">View Details</button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <div ref={lastMessageRef} />
      </div>

      {/* INPUT FORM */}
      <div className="p-4 bg-base-200 border-t border-base-300">
        <form onSubmit={handleSend} className="flex gap-2">
          <input type="text" value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder="Message..." className="input input-bordered flex-1 rounded-xl" />
          <button type="submit" disabled={isSending} className="btn btn-primary rounded-xl px-6">{isSending ? "..." : "Send"}</button>
        </form>
      </div>

      {/* --- MODALS --- */}
      {showProfileActions && (
        <UserProfileModal 
          userId={otherUserId}
          username={initialUsername}
          photo={initialPhoto}
          onClose={() => setShowProfileActions(false)}
          onOpenRate={() => {
            setShowProfileActions(false);
            setShowRatingModal(true);
          }}
        />
      )}

      {showRatingModal && (
        <RatingModal 
          targetUserId={otherUserId}
          onClose={() => setShowRatingModal(false)}
        />
      )}

      {selectedBookId && (
        <BookDetailsModal 
          book={modalBook} 
          onClose={() => setSelectedBookId(null)}
          onConfirmFinish={() => closeListing(selectedBookId)}
          isProcessing={isClosing || loadingBook}
        />
      )}
    </div>
  );
};

export default MessageContainer;