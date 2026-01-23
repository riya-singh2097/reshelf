import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import { useDebouncedCallback } from "use-debounce";
import { useNavigate, useSearchParams } from "react-router"; 

const SearchbookBar = () => {
  const [userInput, setUserInput] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentQuery = searchParams.get("q") || "";

  useEffect(() => {
    setUserInput(currentQuery);
  }, [currentQuery]);

  const debouncedSearch = useDebouncedCallback((value) => {
    const trimmed = value.trim();
    if (trimmed) {
      navigate(`/search?q=${encodeURIComponent(trimmed)}`);
    } 
  }, 500);

  function handleChange(e) {
    const value = e.target.value;
    setUserInput(value);
    if (value.trim() === "") {
      debouncedSearch.cancel();
    } else {
      debouncedSearch(value);
    }
  }

  function handleSearchBook(e) {
    e.preventDefault();
    if (userInput.trim()) {
      debouncedSearch.cancel();
      navigate(`/search?q=${encodeURIComponent(userInput.trim())}`);
    }
  }

  return (
    
    <div className="w-full max-w-xs sm:max-w-md md:max-w-xl lg:max-w-2xl mx-auto px-4 mt-4 md:mt-8"> 
      <div className="search-bar w-full">
        <form onSubmit={handleSearchBook}>
          <div className="flex gap-2 sm:gap-3">
            <input
              type="text"
              placeholder="Search books..."
              value={userInput}
              /* h-10 sm:h-12: Smaller height on mobile for better thumb reach
                 text-sm sm:text-base: Adjust font size for readability
              */
              className="input bg-neutral-400 w-full placeholder-black text-black text-sm sm:text-base h-10 sm:h-12"
              onChange={handleChange}
            />
            <button type="submit" className="btn btn-outline btn-square sm:btn-md h-10 sm:h-12 min-h-0">
              <Search className="size-4 sm:size-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SearchbookBar;