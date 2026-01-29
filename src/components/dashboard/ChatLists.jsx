import { useQuery } from "@tanstack/react-query";
import api from "../../lib/axios.js";
import { useFirebase } from "../../context/FirebaseContext.jsx";

const ChatLists = ({ selectedConversation }) => {
  const { user } = useFirebase();

  const { data: conversations = [], isLoading } = useQuery({
    queryKey: ["conversations", user?.uid],
    queryFn: async () => {
      const token = await user.getIdToken();
      const res = await api.get("/message/conversations", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.data || [];
    },
    enabled: !!user,
  });

  if (isLoading) return <div className="p-4 text-center"><span className="loading loading-spinner text-primary"></span></div>;

  return (
    <div className="w-full bg-base-100 h-full">
      <div className="flex flex-col p-4">
        <h1 className="text-3xl font-black mb-6 text-base-content">Chats</h1>
        <div className="space-y-1">
          {conversations.length === 0 ? (
            <div className="text-center py-20 opacity-40">
              <p>No active conversations.</p>
            </div>
          ) : (
            conversations.map((chat) => (
              <div 
                key={chat._id} 
                className="group" 
                onClick={() => selectedConversation(chat._id)}
              >
                <div className="flex gap-4 items-center p-3 rounded-2xl hover:bg-base-200 transition-all cursor-pointer active:scale-95">
                  <div className="avatar">
                    <div className="w-14 rounded-full ring-primary/30 ring-2">
                      <img src={chat.otherUser?.profilePhotoURL || "https://via.placeholder.com/150"} alt="profile" />
                    </div>
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <h1 className="font-bold text-base-content">{chat.otherUser?.username}</h1>
                    <p className="text-xs text-base-content/60 truncate">
                      {chat.lastMessage?.message || "Click to start chatting..."}
                    </p>
                  </div>
                </div>
                <div className="divider my-0 opacity-5"></div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatLists;