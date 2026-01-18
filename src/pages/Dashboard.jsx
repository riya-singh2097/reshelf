import SearchbookBar from "../components/dashboard/SearchbookBar.jsx";
import MessageBox from "../components/dashboard/MessageBox.jsx";
import ChatLists from "../components/dashboard/ChatLists.jsx";
import BooksSearchResult from "../components/dashboard/BookSearchResult.jsx";
import { useState } from "react";
import api from "../lib/axios.js";
import { useFirebase } from "../context/FirebaseContext.jsx";
import { toast } from "react-toastify";

const Dashboard = () => {
  const { user } = useFirebase();
  const [bookResult, setBookResult] = useState([])

  async function handleSearch(query) {
    console.log("inside handle search dashboard");
    
    try {
      const token = await user.getIdToken();
      const res = await api.get(`/book/${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("res: ",res);
     if(res.data.data.length > 0){
       const books = res.data.data
      console.log("books:", books, typeof books);

      setBookResult(books)
     }else{
      setBookResult([])
     }
    } catch (error) {
      console.error(error);
      
      toast.error(error.message);
    }
  }

  return (
    <>
      <section>
        <div>
          <SearchbookBar onSubmit={handleSearch} />
          <div>
            {bookResult.length > 0?
              <BooksSearchResult books={bookResult}/>
           : <div className=" flex  mx-auto justify-between">
              <ChatLists />
              <div className="divider divider-horizontal px-2"></div>
              <MessageBox />
            </div>}
           
          </div>
        </div>
      </section>
    </>
  );
};
export default Dashboard;
