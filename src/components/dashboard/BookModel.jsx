import bookImg from "../../assets/samplebook.jpg";

const BookInfo = ({ closeInfo }) => {
  return (
    <dialog open className="modal">
      <div className="modal-box">
        <div className="flex gap-4">
          <figure className="p-8">
            <img src={bookImg} alt="book image" />
          </figure>
          <div>
            <div>Title</div>
            <div>Author</div>
            <div>publisher</div>
            <div>Listed date</div>
          </div>
        </div>
      </div>

      <form
        method="dialog "
        className="modal-backdrop backdrop-blur-lg"
        onClick={closeInfo}
      >
        <button></button>
      </form>
    </dialog>
  );
};

export default BookInfo;
