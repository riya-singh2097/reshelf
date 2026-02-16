import { useQuery } from "@tanstack/react-query";
import api from "../../lib/axios.js";
import { useFirebase } from "../../context/FirebaseContext.jsx";

const ChatLists = ({ selectedConversation }) => {
  const { user } = useFirebase();

  const { data: conversations = [], isLoading } = useQuery({
    queryKey: ["conversations", user?.uid],
    queryFn: async () => {
      const res = await api.get("/message/conversations");
      return res.data; 
    },
    enabled: !!user,
  });

  if (isLoading) return (
    <div className="flex justify-center p-10">
      <span className="loading loading-spinner text-primary"></span>
    </div>
  );

  return (
    <div className="w-full bg-base-100 h-full flex flex-col">
      <div className="p-4 border-b border-base-300">
        <h1 className="text-3xl font-black text-base-content">Chats</h1>
      </div>

      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="text-center py-20 opacity-40">
            <p className="text-sm">No conversations found.</p>
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {conversations.map((chat) => (
              <div 
                key={chat._id} 
                onClick={() => selectedConversation(chat._id,chat.otherUser?.username,chat.otherUser?.profilePhotoURL, )}
                className="flex gap-4 items-center p-3 rounded-2xl hover:bg-base-200 transition-all cursor-pointer group active:scale-[0.98]"
              >
                {/* Avatar with DaisyUI ring */}
                <div className="avatar">
                  <div className="w-12 rounded-full ring-primary ring-offset-base-100 group-hover:ring-2 ring-offset-2 transition-all">
                    <img 
                      src={chat.otherUser?.profilePhotoURL || "https://via.placeholder.com/150"} 
                      alt={chat.otherUser?.username} 
                    />
                  </div>
                </div>

                {/* User Info & Last Message */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <h2 className="font-bold text-base-content truncate">
                      {chat.otherUser?.username}
                    </h2>
                    {/* Optional: Format updatedAt if you want a timestamp here */}
                  </div>
                  <p className="text-xs text-base-content/60 truncate italic">
                    {chat.lastMessage?.message || "No messages yet"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatLists;