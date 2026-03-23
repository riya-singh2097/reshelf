import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Trash2, Package, CheckCircle, XCircle, Lock } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import api from "../lib/axios.js";
import Loading from "../components/Loading.jsx";
import BookModal from "../components/BookModal.jsx";

const ShopDashboard = () => {
  const queryClient = useQueryClient();
  const [selectedBook, setSelectedBook] = useState(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // 1. Fetch Inventory
  const {
    data: booksData,
    isLoading,
  } = useQuery({
    queryKey: ["booksByCurrentUser"],
    queryFn: async () => {
      const response = await api.get("/book/currentUser");
      return response?.data?.data || response?.data || [];
    },
  });

  const books = Array.isArray(booksData) ? booksData : [];

  // 2. Pagination Logic
  const indexOfLastBook = currentPage * itemsPerPage;
  const indexOfFirstBook = indexOfLastBook - itemsPerPage;
  const currentBooks = books.slice(indexOfFirstBook, indexOfLastBook);
  const totalPages = Math.ceil(books.length / itemsPerPage);

  // 3. Mutation to Mark as Sold (Irreversible)
  const markAsSoldMutation = useMutation({
    mutationFn: async (id) => {
      // Note: We don't need to send a body because your 
      // controller is hardcoded to set isAvailable: false
      return api.put(`/book/status/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["booksByCurrentUser"] });
      toast.success("Book successfully marked as Sold");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Update failed");
    }
  });

  // 4. Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      return api.delete(`/book/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["booksByCurrentUser"] });
      toast.success("Listing removed successfully");
      setSelectedBook(null);
    },
    onError: (error) => {
      toast.error(`Delete failed: ${error.message}`);
    }
  });

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to remove this listing permanently?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <Loading />;

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-8">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8 bg-base-100 p-6 rounded-2xl shadow-sm border border-base-300">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Shop Management</h1>
          <p className="opacity-70 font-medium">Manage {books.length} items in your inventory</p>
        </div>
        <Link to="/listbook" className="btn btn-primary gap-2 shadow-lg">
          <Plus size={20} /> Add New Listing
        </Link>
      </div>

      {/* Grid Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.length === 0 ? (
          <div className="col-span-full py-20 bg-base-200 rounded-3xl flex flex-col items-center opacity-50 border-2 border-dashed border-base-300">
            <Package size={64} className="mb-4" />
            <h3 className="text-xl font-bold">No books found</h3>
            <p>Start your shop by adding your first listing.</p>
          </div>
        ) : (
          currentBooks.map((book) => (
            <div key={book._id} className="card bg-base-100 border border-base-300 shadow-sm overflow-hidden flex flex-col">
              <div className="flex p-4 gap-4 cursor-pointer" onClick={() => setSelectedBook(book)}>
                <img 
                  src={book.bookCover} 
                  className={`w-24 h-32 object-cover rounded-lg shadow-sm bg-base-300 transition-opacity ${!book.isAvailable ? 'grayscale opacity-50' : ''}`} 
                  alt={book.bookTitle} 
                />
                <div className="flex-1">
                  <h3 className="font-bold line-clamp-2 text-lg leading-tight">{book.bookTitle}</h3>
                  <p className="text-xs opacity-60 mt-1 uppercase font-semibold">ISBN: {book.isbn || "N/A"}</p>
                  
                  <div className={`badge mt-3 gap-1 py-3 px-3 font-bold uppercase text-[10px] ${
                    book.isAvailable ? 'badge-success' : 'badge-ghost border-dashed'
                  }`}>
                    {book.isAvailable ? <CheckCircle size={14}/> : <XCircle size={14}/>}
                    <span>{book.isAvailable ? "Available" : "Sold Out"}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex border-t border-base-300 bg-base-200/50 mt-auto">
                {book.isAvailable ? (
                  <button 
                    onClick={() => {
                        if(window.confirm("Mark as Sold? This cannot be undone.")) {
                            markAsSoldMutation.mutate(book._id);
                        }
                    }}
                    disabled={markAsSoldMutation.isPending}
                    className="flex-1 p-4 text-sm hover:bg-orange-100 text-orange-700 font-bold transition-colors border-r border-base-300"
                  >
                    {markAsSoldMutation.isPending ? "Updating..." : "Mark as Sold"}
                  </button>
                ) : (
                  <button 
                    disabled
                    className="flex-1 p-4 text-sm bg-base-200 text-base-content/40 font-bold border-r border-base-300 cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Lock size={14} /> Finalized
                  </button>
                )}
                
                <button 
                  onClick={() => handleDelete(book._id)}
                  className="p-4 text-sm hover:bg-error/10 text-error font-bold transition-colors"
                  title="Remove Listing"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-12">
          <div className="join shadow-sm border border-base-300">
            <button
              className="join-item btn btn-md bg-base-100"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              «
            </button>
            <button className="join-item btn btn-md no-animation bg-base-100 font-bold">
              Page {currentPage} of {totalPages}
            </button>
            <button
              className="join-item btn btn-md bg-base-100"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              »
            </button>
          </div>
        </div>
      )}

      {selectedBook && (
        <BookModal 
          book={selectedBook} 
          onClose={() => setSelectedBook(null)} 
          onDelete={() => handleDelete(selectedBook._id)} 
        />
      )}
    </div>
  );
};

export default ShopDashboard;