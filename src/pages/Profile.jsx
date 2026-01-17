import BookCard from "../components/BookCard.jsx";
import { Link } from "react-router-dom";
import { Globe, Instagram, Mail, Twitter } from "lucide-react";
import { useFirebase } from "../context/FirebaseContext.jsx";
import { useUserContext } from "../context/UserContext.jsx";
import { useQuery } from "@tanstack/react-query";
import api from "../lib/axios.js";
import BookModal from "../components/BookModal.jsx";
import { useState } from "react";

const Profile = () => {
  const { user, logout } = useFirebase();
  const { dbUser } = useUserContext();
  const [selectedBook, setSelectedBook] = useState(null);

  const {
    data: books,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["booksByCurrentUser"],
    queryFn: async () => {
      const token = await user.getIdToken();
      const response = await api.get("/book/currentUser", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    },
    enabled: !!user,
    refetchOnMount: false,
  });

  const {
    aboutMe,
    email,
    username,
    profilePhotoURL,
    address = {},
    socialLinks = {},
  } = dbUser || {};

  const { street, city, state, pincode, country } = address;
  const { instagram, website, twitter } = socialLinks;

  return (
    <>
      <section className="p-8 h-full">
        <div className="breadcrumbs text-sm mb-4">
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li>Profile </li>
          </ul>
        </div>

        <div className="flex md:justify-between md:flex-row flex-col md:p-4 ">
          <div className="left-container lg:p-8 mr-4 w-full max-md:order-2">
            <h1 className="text-center mb-8  text-2xl">Book listed </h1>
            <div className="grid  grid-cols-3 max-sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {books?.map((book) => (
                <BookCard
                  key={book._id}
                  book={book}
                  onOpen={() => setSelectedBook(book)}
                />
              ))}
              {books?.length < 1 && <div>no books listed</div>}
            </div>
          </div>
          {/* The Modal Component */}
          {selectedBook && (
            <BookModal
              book={selectedBook}
              onClose={() => setSelectedBook(null)}
            />
          )}

          <div className="card flex flex-col  md:w-1/3  w-full max-md:order-1">
            <Link
              to="/listbook"
              className="btn btn-info font-bold md:text-2xl mb-8"
            >
              List a Book
            </Link>

            <div className="flex-1-auto">
              <div className="avatar w-full ">
                <div className="w-2/5 h-2/5 rounded-full ring-primary ring-offset-base-100 ring-2 ring-offset-2 mx-auto overflow-hidden">
                  <img
                    src={
                      profilePhotoURL ??
                      "https://i.pinimg.com/736x/79/e8/9f/79e89fdc173fed118526a1d32e1aac61.jpg"
                    }
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <h1 className="text-center mt-4  text-2xl">
                {username ?? "No username"}
              </h1>
            </div>
            <div className="info p-4 flex flex-col items-center justify-start">
              <div className="divider"></div>
              <div>
                <h1 className="mt-4 font-bold">Address: </h1>
                <h1>
                  {" "}
                  {street} {city} {state} {pincode} {country}
                </h1>
                <h1 className="mt-4 font-bold">Contact Info: </h1>
                <h1 className="flex gap-4">
                  <Mail /> {email}
                </h1>
                {website && (
                  <h1 className="flex gap-4">
                    <Globe /> <Link to={website}>{website}</Link>
                  </h1>
                )}
                {twitter && (
                  <h1 className="flex gap-4">
                    <Twitter />{" "}
                    <Link to={`https://x.com/${twitter}`}>{twitter}</Link>
                  </h1>
                )}
                {instagram && (
                  <h1 className="flex gap-4">
                    <Instagram />{" "}
                    <Link to={`https://www.instagram.com/${instagram}`}>
                      {instagram}
                    </Link>
                  </h1>
                )}
              </div>
              <div className="divider"></div>

              <div className="p-4 ">{aboutMe}</div>
              <div className="grid grid-cols-2 gap-4 mt-8">
                <Link
                  to="/update-profile"
                  className="btn btn-info font-bold  w-full"
                >
                  Edit Info
                </Link>

                <button
                  className="btn btn-info font-bold  w-full"
                  onClick={logout}
                >
                  Log Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Profile;
