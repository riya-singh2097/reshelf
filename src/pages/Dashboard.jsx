import MessageBox from "../components/dashboard/MessageBox.jsx";
import ChatLists from "../components/dashboard/ChatLists.jsx";

const Dashboard = () => {

  return (
    <>
      <section>
        <div>
       <div className=" flex  mx-auto justify-between">
              <ChatLists />
              <div className="divider divider-horizontal px-2"></div>
              <MessageBox />
            </div>
        </div>
      </section>
    </>
  );
};
export default Dashboard;
