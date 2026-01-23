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

// Dashboard.jsx

async function handleSearch(query) {
  // 1. Guard Clause: If query is empty, clear results and stop
  if (!query || query.trim() === "") {
    setBookResult([]);
    return;
  }

  try {
    const token = await user.getIdToken();
    const res = await api.get(`/book/${query}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.data.data && res.data.data.length > 0) {
      setBookResult(res.data.data);
    } else {
      setBookResult([]);
    }
  } catch (error) {
    // 2. Handle 404 specifically if your backend returns 404 for "not found"
    if (error.response && error.response.status === 404) {
      setBookResult([]);
    } else {
      console.error(error);
      toast.error(error.message);
    }
  }
}
console.log("book sercg result : ",bookResult);

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
