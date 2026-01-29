import ChatLists from "../components/dashboard/ChatLists.jsx";
import { Outlet, useNavigate, useParams } from "react-router";
import RequestList from "../components/dashboard/RequestList.jsx";

const Dashboard = () => {
  const navigate = useNavigate()
 let params = useParams();
const handleConversationSelect = (id) => {
    navigate(`/dashboard/conversation/${encodeURIComponent(id)}`);
  };
  return (
    <section className="min-h-screen bg-base-100 py-10 px-4 md:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Responsive Flex: Stacks on Mobile, Side-by-Side on Desktop */}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <ChatLists selectedConversation={handleConversationSelect} />
          </div>

          <div className="hidden lg:flex divider divider-horizontal opacity-30"></div>
          <div className="lg:hidden divider opacity-30"></div>
          <div className="flex-1">
            {params.id? <Outlet />: <RequestList selectedConversation={handleConversationSelect} />}
           
           
          </div>
        </div>
      </div>
    </section>
  );
};
export default Dashboard;
