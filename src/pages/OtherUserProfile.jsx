import { useState, useEffect } from "react";
import api from "../lib/axios.js";
import { useFirebase } from "../context/FirebaseContext.jsx";
import { useParams } from "react-router";
import { MapPin, MessageSquare, BookOpen } from "lucide-react";
import BNWprofile from "../assets/bnwprofile.webp";
import BookCard from "../components/BookCard.jsx";

const OtherUserProfile = () => {
  const { id } = useParams();
  const { user } = useFirebase();
  const [currentUser, setCurrentUser] = useState(null);
  const [userBooks, setUserBooks] = useState([]); 
  const [loading, setLoading] = useState(true);
  
  // State for Modal
  const [selectedBook, setSelectedBook] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!id || !user) return;
      try {
        setLoading(true);
        const token = await user.getIdToken();

        const userRes = await api.get(`/user/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCurrentUser(userRes.data.data);

        const booksRes = await api.get(`/book/user/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserBooks(booksRes.data?.data || []);

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
        <aside className="lg:w-2/4 space-y-12">
          <div className="flex flex-col items-center lg:items-start">
            <div className="avatar mb-6">
              <div className="w-40 rounded-full ring ring-primary ring-offset-base-100 ring-offset-4 shadow-2xl">
                <img src={currentUser?.profilePhotoURL || BNWprofile} alt="User Avatar" />
              </div>
            </div>
            <h1 className="text-3xl font-black tracking-tighter lowercase italic underline decoration-primary/30 underline-offset-4">
              {currentUser?.username}
            </h1>
          </div>

          <div className="space-y-8">
            <section>
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-4 border-b border-base-300 pb-2">Location</h3>
              <div className="flex items-center gap-3 text-sm font-medium">
                <MapPin size={16} className="text-primary" />
                <span>{currentUser?.address?.district}, {currentUser?.address?.state}</span>
              </div>
            </section>

            <section>
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-4 border-b border-base-300 pb-2">The Summary</h3>
              <p className="text-sm leading-relaxed opacity-70 italic">
                "{currentUser?.aboutMe || "A passionate reader."}"
              </p>
            </section>

          </div>
        </aside>

        {/* MAIN: BOOK GRID */}
        <main className="lg:w-3/4">
          <header className="flex items-baseline justify-between mb-12 border-b border-base-300 pb-6">
            <h2 className="text-4xl font-black tracking-tight lowercase italic">books listed</h2>
            <span className="badge badge-lg font-mono opacity-50 px-4">{userBooks?.length || 0} titles</span>
          </header>

          {userBooks?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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