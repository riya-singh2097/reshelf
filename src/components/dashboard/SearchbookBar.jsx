import { Search } from "lucide-react";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";

const SearchbookBar = ({onSubmit}) => {

  const [userInput, setUserInput] = useState('')
  
  console.log(userInput);

  const debouncedSearch  = useDebouncedCallback(
    (value)=>{
      console.log("sending backend: ",value);
      onSubmit(value)
    },
    500
  )
  
  //handle onchange 
function handleChange(e){
    const value = e.target.value;
    console.log(value);
   setUserInput(value);

  if (value.trim().length === 0) {
    onSubmit("")
    return ;
  }
  debouncedSearch(value);
}
  function handleSearchBook(e){
    e.preventDefault()
    if (userInput.trim().length === 0) {
    onSubmit("");
    return;
  }
  debouncedSearch(userInput)
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
