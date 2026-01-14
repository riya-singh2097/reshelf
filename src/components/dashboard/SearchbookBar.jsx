import { Search } from "lucide-react";
import { useState } from "react";

const SearchbookBar = ({onSubmit}) => {

  const [userInput, setUserInput] = useState('')

  function handleSearchBook(e){
    e.preventDefault()
    console.log(userInput);
    onSubmit()
    
  }
  return (
    <div>
      <div className="search-bar p-4 ">
        <form>
          <div className="w-10/12 mx-auto flex gap-3">
            <input
              type="text"
              placeholder="Search"
              className="input bg-neutral-400 w-full placeholder-black text-black"
              onChange={(e)=> setUserInput(e.target.value)}
            />
            <button className=" btn btn-outline" onClick={(e)=>handleSearchBook(e)}>
              <Search />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SearchbookBar;
