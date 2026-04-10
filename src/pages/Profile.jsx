import { useState } from "react";
import { Link } from "react-router-dom";
import { Star, Plus } from "lucide-react"; 
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import BookCard from "../components/BookCard.jsx";
import BookModal from "../components/BookModal.jsx";
import Loading from "../components/Loading.jsx";
import api from "../lib/axios.js";

import { useFirebase } from "../context/FirebaseContext.jsx";
import { useUserContext } from "../context/UserContext.jsx";
import { toast } from "react-toastify";

const Profile = () => {
  const { logout } = useFirebase();
  const { dbUser } = useUserContext();
  const [selectedBook, setSelectedBook] = useState(null);
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  // 1. Fetch Rating & Review Data
  const { data: ratingData, status: ratingStatus } = useQuery({
    queryKey: ["userRating", dbUser?._id],
    queryFn: async () => {
      const res = await api.get(`/user/reviews/${dbUser._id}`);
      return res.data;
    },
    enabled: !!dbUser?._id,
  });

  // 2. Fetch User's Books
  const { data: booksData, isLoading: booksLoading } = useQuery({
    queryKey: ["booksByCurrentUser"],
    queryFn: async () => {
      const response = await api.get("/book/currentUser");
      return response?.data?.data || response?.data || [];
    },
    enabled: !!dbUser?._id,
  });

  // 3. Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => api.delete(`/book/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["booksByCurrentUser"] });
      toast.success("Book deleted successfully!");
      setSelectedBook(null);
    },
  });

  const deleteBook = (id) => deleteMutation.mutate(id);

  if (!dbUser) return <Loading />;

  // --- DATA NORMALIZATION ---
  const books = Array.isArray(booksData) ? booksData : [];
  const reviewsList = ratingData?.reviews || [];
  
  // Logical Fallback: Use API data first, then dbUser context, then 0
  const stats = {
    averageRating: ratingData?.stats?.averageRating ?? dbUser?.averageRating ?? 0,
    reviewCount: ratingData?.stats?.reviewCount ?? dbUser?.reviewCount ?? 0
  };

  const currentBooks = books.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <section className="p-8 max-w-7xl mx-auto min-h-screen">
      <div className="flex md:flex-row flex-col gap-8">
        
        {/* LEFT: Books Grid */}
        <div className="flex-1 order-2 md:order-1">
          <h1 className="text-2xl font-bold border-b pb-4 mb-6">Books Listed ({books.length})</h1>
          {booksLoading ? (
            <div className="flex justify-center p-10"><span className="loading loading-spinner loading-lg text-primary"></span></div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
              {currentBooks.length > 0 ? (
                currentBooks.map((book) => (
                  <BookCard key={book._id} book={book} onOpen={() => setSelectedBook(book)} />
                ))
              ) : (
                <div className="col-span-full py-20 text-center opacity-40 italic">No books listed yet.</div>
              )}
            </div>
          )}
        </div>

        {/* RIGHT: Sidebar */}
        <div className="md:w-80 w-full order-1 md:order-2 space-y-6">
          <Link to="/listbook" className="btn btn-primary w-full shadow-lg"><Plus size={18}/> List a Book</Link>
          
          <div className="card bg-base-100 shadow-xl border border-base-200 p-6 items-center text-center">
            <div className="avatar mb-4">
              <div className="w-24 h-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 overflow-hidden">
                <img src={dbUser?.profilePhotoURL || "https://i.pinimg.com/736x/79/e8/9f/79e89fdc173fed118526a1d32e1aac61.jpg"} alt="Profile" className="object-cover" />
              </div>
            </div>
            
            <h2 className="text-xl font-bold">{dbUser?.username}</h2>
            
            {/* RATING DISPLAY */}
            <div className="flex items-center gap-2 mt-2 bg-orange-50 px-3 py-1 rounded-full border border-orange-100 shadow-sm">
              <Star size={14} className="text-orange-500 fill-orange-500" />
              <span className="font-bold text-sm text-orange-700">
                {Number(stats.averageRating).toFixed(1)}
              </span>
              <span className="text-[10px] opacity-60 font-black uppercase tracking-tighter">
                ({stats.reviewCount} reviews)
              </span>
            </div>

            <div className="divider w-full text-[10px] uppercase opacity-50 font-bold">Details</div>
            <div className="text-left w-full text-xs space-y-2">
              <p><strong>Email:</strong> {dbUser?.email}</p>
              <p><strong>City:</strong> {dbUser?.address?.city || "Not set"}</p>
              <div className="pt-2">
                <p className="font-bold text-[10px] uppercase opacity-50 mb-1">About</p>
                <p className="italic opacity-80 leading-relaxed line-clamp-3">"{dbUser?.aboutMe || "No bio available."}"</p>
              </div>
            </div>

            <div className="divider w-full text-[10px] uppercase opacity-50 font-bold">Recent Reviews</div>
            <div className="w-full space-y-3 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
              {reviewsList.length > 0 ? (
                reviewsList.map((rev) => (
                  <div key={rev._id} className="bg-base-200 p-2 rounded text-left border border-base-300 shadow-sm">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] font-bold text-primary">@{rev.reviewerId?.username || "anonymous"}</span>
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] font-bold">{rev.rating}</span>
                        <Star size={8} fill="orange" className="text-orange-500"/>
                      </div>
                    </div>
                    <p className="text-[10px] opacity-80 italic leading-tight">"{rev.note || "No comment"}"</p>
                  </div>
                ))
              ) : (
                <p className="text-[10px] opacity-40 py-4 italic text-center uppercase">No reviews yet</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 w-full mt-8">
              <Link to="/update-profile" className="btn btn-outline btn-sm">Edit</Link>
              <button onClick={logout} className="btn btn-outline btn-error btn-sm">Logout</button>
            </div>
          </div>
        </div>
      </div>

      {selectedBook && (
        <BookModal 
          book={selectedBook} 
          onClose={() => setSelectedBook(null)} 
          onDelete={() => deleteBook(selectedBook._id)} 
        />
      )}
    </section>
  );
};

export default Profile;