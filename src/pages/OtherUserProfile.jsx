import { useState, useEffect } from "react";
import api from "../lib/axios.js";
import { useFirebase } from "../context/FirebaseContext.jsx";
import { useParams } from "react-router";
import { MapPin, BookOpen, Star } from "lucide-react";
import BNWprofile from "../assets/bnwprofile.webp";
import BookCard from "../components/BookCard.jsx";

const OtherUserProfile = () => {
  const { id } = useParams();
  const { user } = useFirebase();
  const [currentUser, setCurrentUser] = useState(null);
  const [userBooks, setUserBooks] = useState([]);
  const [reviewsData, setReviewsData] = useState({ reviews: [], stats: { averageRating: 0, reviewCount: 0 } });
  const [loading, setLoading] = useState(true);
  
  const [selectedBook, setSelectedBook] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!id || !user) return;
      try {
        setLoading(true);
        const token = await user.getIdToken();
        const headers = { Authorization: `Bearer ${token}` };

        // Fetch User Info, Books, and Reviews in parallel
        const [userRes, booksRes, reviewsRes] = await Promise.all([
          api.get(`/user/${id}`, { headers }),
          api.get(`/book/user/${id}`, { headers }),
          api.get(`/user/reviews/${id}`, { headers }) // Fetching the ratings
        ]);

        setCurrentUser(userRes.data.data);
        setUserBooks(booksRes.data?.data || []);
        setReviewsData(reviewsRes.data);

      } catch (error) {
        console.error("Error fetching data:", error);
        setUserBooks([]); 
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [id, user]);

  if (loading) return (
    <div className="h-screen flex justify-center items-center bg-base-100">
      <span className="loading loading-infinity loading-lg text-primary"></span>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 min-h-screen bg-base-100 text-base-content">
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
        
        {/* SIDEBAR */}
        <aside className="lg:w-1/3 space-y-10">
          <div className="flex flex-col items-center lg:items-start">
            <div className="avatar mb-6">
              <div className="w-40 rounded-full ring ring-primary ring-offset-base-100 ring-offset-4 shadow-2xl">
                <img src={currentUser?.profilePhotoURL || BNWprofile} alt="User Avatar" className="object-cover" />
              </div>
            </div>
            <h1 className="text-3xl font-black tracking-tighter lowercase italic underline decoration-primary/30 underline-offset-4">
              {currentUser?.username}
            </h1>

            {/* RATING BADGE */}
            <div className="flex items-center gap-2 mt-4 bg-orange-50 px-4 py-1.5 rounded-full border border-orange-100 shadow-sm">
              <Star size={16} className="text-orange-500 fill-orange-500" />
              <span className="font-bold text-orange-800">
                {Number(reviewsData?.stats?.averageRating || 0).toFixed(1)}
              </span>
              <span className="text-[10px] opacity-60 font-black uppercase tracking-widest">
                ({reviewsData?.stats?.reviewCount || 0} reviews)
              </span>
            </div>
          </div>

          <div className="space-y-8">
            <section>
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-4 border-b border-base-300 pb-2">Location</h3>
              <div className="flex items-center gap-3 text-sm font-medium">
                <MapPin size={16} className="text-primary" />
                <span>{currentUser?.address?.district || "N/A"}, {currentUser?.address?.state || ""}</span>
              </div>
            </section>

            <section>
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-4 border-b border-base-300 pb-2">The Summary</h3>
              <p className="text-sm leading-relaxed opacity-70 italic">
                "{currentUser?.aboutMe || "No bio provided."}"
              </p>
            </section>

            {/* RECENT REVIEWS SECTION */}
            <section>
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-4 border-b border-base-300 pb-2">Recent Reviews</h3>
              <div className="space-y-4 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                {reviewsData?.reviews?.length > 0 ? (
                  reviewsData.reviews.map((rev) => (
                    <div key={rev._id} className="bg-base-200/50 p-3 rounded-2xl border border-base-300/50">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] font-bold text-primary">@{rev.reviewerId?.username}</span>
                        <div className="flex items-center gap-1 text-orange-600">
                          <span className="text-[10px] font-bold">{rev.rating}</span>
                          <Star size={10} fill="currentColor" />
                        </div>
                      </div>
                      <p className="text-[11px] opacity-80 italic leading-snug">"{rev.note || "No comment"}"</p>
                    </div>
                  ))
                ) : (
                  <p className="text-[10px] opacity-30 italic py-4">No reviews for this user yet.</p>
                )}
              </div>
            </section>
          </div>
        </aside>

        {/* MAIN: BOOK GRID */}
        <main className="lg:w-2/3">
          <header className="flex items-baseline justify-between mb-12 border-b border-base-300 pb-6">
            <h2 className="text-4xl font-black tracking-tight lowercase italic">books listed</h2>
            <span className="badge badge-lg font-mono opacity-50 px-4">{userBooks?.length || 0} titles</span>
          </header>

          {userBooks?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {userBooks.map((book) => (
                <BookCard
                  key={book._id} 
                  book={book} 
                  onOpen={() => setSelectedBook(book)} 
                />
              ))}
            </div>
          ) : (
            <div className="py-32 flex flex-col items-center justify-center border-2 border-dashed border-base-300 rounded-[40px] opacity-20">
              <BookOpen size={48} className="mb-4" />
              <p className="text-xl font-black italic uppercase tracking-[0.2em]">The shelf is empty</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default OtherUserProfile;