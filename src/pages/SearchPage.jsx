import { useSearchParams } from "react-router";
import { useEffect, useState } from "react";
import api from "../lib/axios.js";
import BooksSearchResult from "../components/BookSearchResult.jsx";
import SearchbookBar from "../components/SearchbookBar.jsx";
import { useFirebase } from "../context/FirebaseContext.jsx";

const SearchPage = () => {
  const { user } = useFirebase();
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  //SEARCH INPUT -> BACKEND
  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return;
      setLoading(true);
      try {
        const token = await user.getIdToken();
        const res = await api.get(`/book/${query}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setResults(res.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [query]);

  return (
    <>
    <div className="container mx-auto min-h-screen ">
    <SearchbookBar/>
      {loading ? (
        <div className="flex justify-center p-20">
          <span className="loading loading-lg"></span>
        </div>
      ) : (
        <BooksSearchResult books={results} />
      )}
    </div>
    </>
  );
};

export default SearchPage;
