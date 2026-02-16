import { lazy, useState } from "react";
import ChatLists from "../components/dashboard/ChatLists.jsx";
import { Outlet, useNavigate, useParams } from "react-router";
const RequestList = lazy(
  () => import("../components/dashboard/RequestList.jsx"),
);

const Dashboard = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  // State to switch between Chat List and Request List on the left
  const [view, setView] = useState("chats"); 

const handleConversationSelect = (conversationId, username, photo) => {
  navigate(`/dashboard/conversation/${encodeURIComponent(conversationId)}`, {
    state: { username, photo } // Pass data here
  });
};

  return (
    <section className="min-h-screen bg-base-100 py-4 md:py-10 px-4 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-4 h-[85vh]">
          
          {/* LEFT SIDE: Sidebar */}
          <div className={`${id ? "hidden" : "flex"} lg:flex flex-col flex-1 bg-base-200 rounded-xl overflow-hidden border border-base-300`}>
            {/* Sidebar Toggle Header */}
            <div className="flex border-b border-base-300">
              <button 
                onClick={() => setView("chats")}
                className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider ${view === "chats" ? "bg-primary text-primary-content" : "hover:bg-base-300"}`}
              >
                Chats
              </button>
              <button 
                onClick={() => setView("requests")}
                className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider ${view === "requests" ? "bg-primary text-primary-content" : "hover:bg-base-300"}`}
              >
                Requests
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-2">
              {view === "chats" ? (
                <ChatLists selectedConversation={handleConversationSelect} />
              ) : (
                <RequestList selectedConversation={handleConversationSelect} />
              )}
            </div>
          </div>

          {/* DIVIDER: Desktop Only */}
          <div className="hidden lg:flex divider divider-horizontal opacity-30"></div>

          {/* RIGHT SIDE: Content Area */}
          <div className={`${!id ? "hidden" : "block"} lg:block flex-[2] bg-base-100 rounded-xl overflow-hidden border border-base-300`}>
            {id ? (
              <Outlet /> 
            ) : (
              <div className="h-full flex flex-col items-center justify-center opacity-40 text-center p-10">
                <div className="text-6xl mb-4">💬</div>
                <h2 className="text-xl font-bold">Select a conversation</h2>
                <p>Pick a chat from the left to start messaging</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};

export default Dashboard;