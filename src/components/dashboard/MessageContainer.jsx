import { useRef, useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Calendar, Hash, Bookmark, Star, X, BookOpen, CheckCircle } from "lucide-react";
import api from "../../lib/axios.js";
import { useFirebase } from "../../context/FirebaseContext.jsx";
import { useUserContext } from "../../context/UserContext.jsx";
import { useSocket } from "../../context/SocketContext.jsx";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// --- SUB-COMPONENT: Book Details Modal ---
const BookDetailsModal = ({ book, onClose, onConfirmFinish, isProcessing }) => {
  if (!book) return null;

  return (
    <dialog className="modal modal-open backdrop-blur-md p-4 z-[1000]">
      <div className="modal-box max-w-3xl w-full p-0 rounded-3xl border border-base-300 shadow-2xl overflow-hidden bg-base-100 flex flex-col md:flex-row max-h-[85vh]">
        {/* Left: Image Section */}
        <div className="md:w-64 bg-base-200/50 flex flex-col items-center justify-center p-6 border-b md:border-b-0 md:border-r border-base-300">
          <div className="w-40 aspect-[3/4] rounded-lg shadow-xl overflow-hidden border-4 border-white">
            <img src={book.bookCover} alt={book.bookTitle} className="w-full h-full object-cover" />
          </div>
          <div className={`mt-4 badge badge-md font-bold ${book.isAvailable ? "badge-success" : "badge-ghost opacity-50"}`}>
            {book.isAvailable ? "Available" : "Closed"}
          </div>
        </div>

        {/* Right: Content Section */}
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
              className="btn btn-primary flex-1 btn-sm"
            >
              {isProcessing ? <span className="loading loading-spinner"></span> : <><CheckCircle size={16}/> Done Negotiating</>}
            </button>
            <button onClick={onClose} className="btn btn-ghost btn-sm">Cancel</button>
          </div>
        </div>
      </div>
    </dialog>
  );
};

// --- MAIN COMPONENT ---
const MessageContainer = () => {
  const { id: conversationId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = useFirebase();
  const { dbUser } = useUserContext();
  const { socket } = useSocket();
  const [inputText, setInputText] = useState("");
  const [selectedBookId, setSelectedBookId] = useState(null);
  const lastMessageRef = useRef();
  const queryClient = useQueryClient();

  const initialUsername = state?.username;
  const initialPhoto = state?.photo;

  // 1. Fetch messages
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

  // 2. Fetch specific book for Modal
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

  // 3. Mutation: Close Listing
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

  // 4. Socket Listener
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

  // 5. Send Message Logic
  const { mutate: sendMessage, isPending: isSending } = useMutation({
    mutationFn: async (text) => {
      const token = await user.getIdToken();
      const receiverId = messages.find((m) => m.senderId !== dbUser._id)?.senderId || messages[0]?.receiverId;
      const res = await api.post(`/message/send/${receiverId}`, { message: text }, {
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
        <div className="avatar">
          <div className="w-10 rounded-full ring-primary ring-2 ring-offset-2">
            <img src={initialPhoto || "https://via.placeholder.com/150"} alt="User" />
          </div>
        </div>
        <span className="font-bold text-sm">{initialUsername || "User"}</span>
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
                    <button onClick={() => setSelectedBookId(msg.bookId)} className="btn btn-xs btn-outline">View Details</button>
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
          <input type="text" value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder="Message..." className="input input-bordered flex-1" />
          <button type="submit" disabled={isSending} className="btn btn-primary">{isSending ? "..." : "Send"}</button>
        </form>
      </div>

      {/* MODAL OVERLAY */}
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