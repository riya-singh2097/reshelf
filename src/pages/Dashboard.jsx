import SearchbookBar from "../components/dashboard/SearchbookBar.jsx";
import MessageBox from "../components/dashboard/MessageBox.jsx";
import ChatLists from "../components/dashboard/ChatLists.jsx";
import BooksSearchResult from "../components/dashboard/BookSearchResult.jsx";
import {  useState } from "react";



const Dashboard = () => {

  const [booksSearchResult, setbooksSearchResult] = useState(null);
  const openModal = () => setbooksSearchResult("open");
  const closeModal = () => setbooksSearchResult("close");

  return (
    
    <>
      <section>
       
        <div>
          <SearchbookBar onSubmit={openModal} />
          <div>
          </div>
          <div>
            {booksSearchResult === "open" ? (
              <BooksSearchResult onClose={closeModal} />
            ) : (
              <div className=" flex  mx-auto justify-between">
                <ChatLists />
                <div className="divider divider-horizontal px-2"></div>
                <MessageBox />
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};
export default Dashboard;
