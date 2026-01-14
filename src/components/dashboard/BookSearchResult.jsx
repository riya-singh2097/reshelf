import BookCard from "../BookCard.jsx";
import BookModel from "./BookModel.jsx";
import { useState } from "react";

const BooksSearchResult = () => {

  const [selectedBook, setSelectedBook] = useState(null);
  const openInfoModal = ()=>setSelectedBook(true)
  const closeInfoModal = ()=>setSelectedBook(false)
  return (
    <>
     <div className="w-11/12 mx-auto p-4 mt-8">
      <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-5 gap-4">
        <BookCard  showInfo={openInfoModal} />
        <BookCard  showInfo={openInfoModal} />
        <BookCard  showInfo={openInfoModal} />
        <BookCard  showInfo={openInfoModal} />
        <BookCard  showInfo={openInfoModal} />
        <BookCard  showInfo={openInfoModal} />
        <BookCard  showInfo={openInfoModal} />
        <BookCard  showInfo={openInfoModal} />
        <BookCard  showInfo={openInfoModal} />
        <BookCard  showInfo={openInfoModal} />
      </div>
      {selectedBook && <BookModel closeInfo={closeInfoModal}/>}
     </div>

    </>
  );
};

export default BooksSearchResult;
