import { useEffect, useState } from "react";
import { useParams } from "react-router";
import api from "../../lib/axios.js"; // or use fetch
import { useFirebase } from "../../context/FirebaseContext.jsx";

const MessageContainer = () => {
  const { id } = useParams(); // This 'id' comes from your route path='/dashboard/conversation/:id'
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
 const { user } = useFirebase();
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
         const token = await user.getIdToken();
        const res = await api.get(`/chat/${id}`,{
            headers: {Authorization : `Bearer ${token}`}
        });
        setMessages(res.data.messages);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchMessages();
  }, [id]);
console.log(messages);

  if (loading) return <div className="p-4">Loading chat...</div>;

  return (
    <div className='md:min-w-[500px] h-full flex flex-col py-2'>
      <div className="flex-1 overflow-y-auto px-4">
        {messages.length > 0 ? (
          messages.map((msg) => (
            <div key={msg._id} className="chat chat-start my-2">
               {/* Adjust 'chat-start' vs 'chat-end' based on msg.senderId */}
              <div className="chat-bubble bg-primary text-white">
                {msg.message} {/* Replace with your actual text field name */}
              </div>
              <div className="chat-footer opacity-50 text-xs">
                {new Date(msg.createdAt).toLocaleTimeString()}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center opacity-50">No messages yet. Say hello!</p>
        )}
      </div>
      
      {/* Input area would go here */}
      <div className="mt-auto p-4 border-t border-base-300">
         <input type="text" placeholder="Type a message..." className="input input-bordered w-full" />
      </div>
    </div>
  );
};

export default MessageContainer;