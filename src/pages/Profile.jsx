import { useState } from "react";
import { Link } from "react-router-dom";
import { Globe, Instagram, Mail, Twitter } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import BookCard from "../components/BookCard.jsx";
import BookModal from "../components/BookModal.jsx";
import Loading from "../components/Loading.jsx";
import api from "../lib/axios.js";

import { useFirebase } from "../context/FirebaseContext.jsx";
import { useUserContext } from "../context/UserContext.jsx";
import { toast } from "react-toastify";

const Profile = () => {
  const { user, logout } = useFirebase();
  const { dbUser } = useUserContext();
  const [selectedBook, setSelectedBook] = useState(null);
  const queryClient = useQueryClient();

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  // 1. Safe Destructuring of dbUser (Fixes the ReferenceError)
  const {
    aboutMe = "No bio provided.",
    email,
    username = "Anonymous User",
    profilePhotoURL,
    address = {},
    socialLinks = {},
  } = dbUser || {};

  const { street, city, state, pincode, country } = address;
  const { instagram, website, twitter } = socialLinks;

  // 2. Fetch Books
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
  });

  // 3. Pagination Logic
  const indexOfLastBook = currentPage * itemsPerPage;
  const indexOfFirstBook = indexOfLastBook - itemsPerPage;
  const currentBooks = books?.slice(indexOfFirstBook, indexOfLastBook);
  const totalPages = Math.ceil((books?.length || 0) / itemsPerPage);

  // Guard clause for initial load
  if (!dbUser && !isError) return <Loading />;

  //delete book

const deleteMutation = useMutation({
  mutationFn: async (id) => {
    const token = await user.getIdToken();
    return api.delete(`/book/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
  onSuccess: () => {
    // This tells React Query to refetch the books list immediately
    queryClient.invalidateQueries({ queryKey: ["booksByCurrentUser"] });
    toast.success("Book deleted successfully!");
    setSelectedBook(null); // Close the modal
  },
  onError: (error) => {
    toast.error(`Delete failed: ${error.response?.data?.message || error.message}`);
  }
});

// Update your delete function to call the mutation
const deleteBook = (id) => {
  if (window.confirm("Are you sure you want to delete this book?")) {
    deleteMutation.mutate(id);
  }
};

  return (
    <>
      <section className="p-8">
        <div className="breadcrumbs text-sm mb-4">
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li className="text-primary font-semibold">Profile</li>
          </ul>
        </div>

        <div className="flex md:justify-between md:flex-row flex-col md:p-4 gap-8">
          
          {/* LEFT CONTAINER: Books Grid */}
          <div className="left-container w-full max-md:order-2">
            <h1 className="text-center mb-8 text-2xl font-bold border-b pb-2 border-base-300">
              Books Listed ({books?.length || 0})
            </h1>

            {isError && (
              <div className="alert alert-error mb-4">
                <span>{error?.message || "Failed to load books."}</span>
              </div>
            )}

            {isLoading ? (
              <Loading />
            ) : (
              <div className="flex flex-col items-center">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
                  {currentBooks?.map((book) => (
                    <BookCard
                      key={book._id}
                      book={book}
                      onOpen={() => setSelectedBook(book)}
                    />
                  ))}
                </div>

                {books?.length < 1 && (
                  <div className="text-center py-20 opacity-50 italic">
                    You haven't listed any books yet.
                  </div>
                )}

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="join mt-10">
                    <button
                      className="join-item btn btn-sm"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((prev) => prev - 1)}
                    >
                      «
                    </button>
                    <button className="join-item btn btn-sm no-animation cursor-default">
                      Page {currentPage} of {totalPages}
                    </button>
                    <button
                      className="join-item btn btn-sm"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage((prev) => prev + 1)}
                    >
                      »
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* RIGHT SIDEBAR: User Info */}
          <div className="card bg-base-100 shadow-xl border border-base-300 p-6 flex flex-col md:w-1/3 w-full max-md:order-1 h-fit">
            <Link
              to="/listbook"
              className="btn btn-primary font-bold text-lg mb-8 shadow-md"
            >
              + List a Book
            </Link>

            <div className="flex flex-col items-center">
              <div className="avatar">
                <div className="w-32 h-32 rounded-full ring-primary ring-offset-base-100 ring-2 ring-offset-2 overflow-hidden">
                  <img
                    src={profilePhotoURL || "https://i.pinimg.com/736x/79/e8/9f/79e89fdc173fed118526a1d32e1aac61.jpg"}
                    alt="Profile"
                    className="object-cover"
                  />
                </div>
              </div>
              <h2 className="mt-4 text-2xl font-bold text-center">
                {username}
              </h2>
            </div>

            <div className="divider">Details</div>

            <div className="space-y-3 text-sm">
              <div>
                <span className="font-bold block text-xs opacity-60 uppercase">Address</span>
                <p>{street}, {city}, {state} {pincode}</p>
                <p className="font-semibold">{country}</p>
              </div>

              <div>
                <span className="font-bold block text-xs opacity-60 uppercase">Contact</span>
                <div className="flex items-center gap-2 mt-1">
                  <Mail size={16} className="text-primary" /> {email}
                </div>
                
                {website && (
                  <div className="flex items-center gap-2 mt-1">
                    <Globe size={16} className="text-primary" />
                    <a href={website} target="_blank" rel="noreferrer" className="link link-hover text-info">{website}</a>
                  </div>
                )}

                <div className="flex gap-4 mt-3">
                  {twitter && (
                    <a href={`https://x.com/${twitter}`} target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">
                      <Twitter size={20} />
                    </a>
                  )}
                  {instagram && (
                    <a href={`https://instagram.com/${instagram}`} target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">
                      <Instagram size={20} />
                    </a>
                  )}
                </div>
              </div>

              <div className="divider">About Me</div>
              <p className="italic text-base-content/80 leading-relaxed">
                "{aboutMe}"
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-10">
              <Link to="/update-profile" className="btn btn-outline btn-info btn-sm">
                Edit Profile
              </Link>
              <button onClick={logout} className="btn btn-outline btn-error btn-sm">
                Log Out
              </button>
            </div>
          </div>
        </div>
      </section>

      {selectedBook && (
        <BookModal book={selectedBook} onClose={() => setSelectedBook(null)} onDelete={()=>deleteBook(selectedBook._id)} />
      )}
    </>
  );
};

export default Profile;