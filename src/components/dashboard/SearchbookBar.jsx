import { Search } from "lucide-react";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";

const SearchbookBar = ({onSubmit}) => {

  const [userInput, setUserInput] = useState('')
  
  // console.log(userInput);

  const debouncedSearch  = useDebouncedCallback(
    (value)=>{
       if(value.trim().length === 0) return
console.log("valuse sent to dashboard : ",value);

      onSubmit(value.trim())
    },
    500
  )
  

function handleChange(e) {
  const value = e.target.value;
  setUserInput(value);

  // If input is empty, call onSubmit with empty string immediately 
  // to clear results, otherwise debounce the search.
  if (value.trim() === "") {
    onSubmit(""); 
    debouncedSearch.cancel(); // Stop any pending debounced calls
  } else {
    debouncedSearch(value);
  }
}

function handleSearchBook(e) {
  e.preventDefault();
  if (userInput.trim().length > 0) {
    debouncedSearch(userInput);
  }
}
  return (
    <div>
      <div className="search-bar p-4 ">
        <form>
          <div className="w-10/12 mx-auto flex gap-3">
            <input
              type="text"
              placeholder="Search"
                value={userInput}
              className="input bg-neutral-400 w-full placeholder-black text-black"
              onChange={ handleChange}
            />
            <button className=" btn btn-outline" onClick={handleSearchBook}>
              <Search />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SearchbookBar;
