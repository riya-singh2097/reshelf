import { useRef, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../lib/axios.js";
import { useFirebase } from "../../context/FirebaseContext.jsx";
import { useUserContext } from "../../context/UserContext.jsx";
import { useSocket } from "../../context/SocketContext.jsx"; // Assuming you have a Socket Context

const MessageContainer = () => {
  const { id: conversationId } = useParams();
  const { user } = useFirebase();
  const { dbUser } = useUserContext();
  const { socket } = useSocket(); // Get socket instance to listen for new messages
  const [inputText, setInputText] = useState("");
  const lastMessageRef = useRef();
  const queryClient = useQueryClient();

  // 1. Get messages from Backend using TanStack Query
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

  // 2. Real-time listener: Listen for "newMessage" event from Socket.io
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (newMessage) => {
      // Only add message if it belongs to this specific conversation
      if (newMessage.conversationId === conversationId) {
        // Update the TanStack cache manually so we see the message instantly
        queryClient.setQueryData(["messages", conversationId], (oldData) => [
          ...oldData,
          newMessage,
        ]);
      }
    };

    socket.on("newMessage", handleNewMessage);

    // Clean up listener when component unmounts
    return () => socket.off("newMessage", handleNewMessage);
  }, [socket, conversationId, queryClient]);

  // 3. Mutation to send message to the server
  const { mutate: sendMessage, isPending: isSending } = useMutation({
    mutationFn: async (text) => {
      const token = await user.getIdToken();

      // Find who is receiving the message (the person who is NOT me)
      const receiverId =
        messages.find((m) => m.senderId !== dbUser._id)?.senderId ||
        messages[0]?.receiverId;

      const res = await api.post(
        `/message/send/${receiverId}`,
        { message: text },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data;
    },
    onSuccess: (newMessage) => {
      setInputText("");
      // Update local cache so the sender sees their own message immediately
      queryClient.setQueryData(["messages", conversationId], (oldData) => [
        ...oldData,
        newMessage,
      ]);
    },
  });

  // Handle clicking the send button
  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim() || isSending) return;
    sendMessage(inputText);
  };

  // Auto-scroll to the latest message at the bottom
  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (isLoading) return <div className="flex h-full items-center justify-center font-bold">Loading...</div>;

  return (
    <div className="md:min-w-[500px] h-full flex flex-col bg-base-100 border-x border-base-300">
      {/* Top Header of Chat */}
      <div className="bg-base-200 px-4 py-3 border-b border-base-300 flex items-center justify-between">
        <span className="font-bold text-sm tracking-wide">CHAT BOX</span>
      </div>

      {/* Area where messages are displayed */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        {messages.map((msg) => {
          // Check if I am the sender to put bubble on the right
          const isMe = dbUser && msg.senderId === dbUser._id;
          const isRequest = msg.messageType === "request";

          return (
            <div key={msg._id} className={`chat ${isMe ? "chat-end" : "chat-start"} mb-6`}>
              <div
                className={`chat-bubble shadow-md max-w-[85%] ${
                  isRequest
                    ? "bg-base-300 text-base-content border-l-4 border-primary"
                    : isMe
                    ? "bg-primary text-primary-content"
                    : "bg-secondary text-secondary-content"
                }`}
              >
                {/* Header for Book Requests only */}
                {isRequest && (
                  <div className="flex items-center justify-between gap-4 border-b border-base-content/10 pb-1 mb-2">
                    <span className="text-[10px] font-black uppercase">📚 REQUEST</span>
                    <span className="badge badge-xs font-bold">{msg.requestStatus}</span>
                  </div>
                )}

                <p className="text-sm">{msg.message}</p>
              </div>

              {/* Message Time and Status */}
              <div className="chat-footer opacity-50 text-[10px] mt-1">
                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                {isMe && <span className="ml-1 text-blue-500">✔</span>}
              </div>
            </div>
          );
        })}
        {/* Invisible div to help with auto-scrolling */}
        <div ref={lastMessageRef} />
      </div>

      {/* Form to type and send message */}
      <div className="p-4 bg-base-200 border-t border-base-300">
        <form onSubmit={handleSend} className="flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type here..."
            className="input input-bordered flex-1 bg-base-100"
          />
          <button
            type="submit"
            disabled={isSending || !inputText.trim()}
            className="btn btn-primary"
          >
            {isSending ? "..." : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default MessageContainer;