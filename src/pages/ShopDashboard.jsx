import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Package, CheckCircle, XCircle } from "lucide-react";
import { Link } from "react-router";
import api from "../lib/axios.js";
import { toast } from "react-toastify";

const ShopDashboard = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShopBooks = async () => {
      try {
        const res = await api.get("/user/my-listings"); // Create this endpoint to return books by req.user._id
        setInventory(res.data.data);
      } catch (err) {
        toast.error("Failed to load inventory");
      } finally {
        setLoading(false);
      }
    };
    fetchShopBooks();
  }, []);

  const toggleAvailability = async (id, currentStatus) => {
    try {
      await api.patch(`/books/status/${id}`, { isAvailable: !currentStatus });
      setInventory(prev => 
        prev.map(book => book._id === id ? { ...book, isAvailable: !currentStatus } : book)
      );
      toast.success("Status updated");
    } catch (err) {
      toast.error("Update failed");
    }
  };

  if (loading) return <div className="p-10 text-center"><span className="loading loading-dots loading-lg"></span></div>;

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Shop Management</h1>
          <p className="opacity-70">Manage your store's listings and availability</p>
        </div>
        <Link to="/listbook" className="btn btn-primary gap-2">
          <Plus size={20} /> Add New Listing
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {inventory.length === 0 ? (
          <div className="col-span-full py-20 bg-base-200 rounded-3xl flex flex-col items-center opacity-50">
            <Package size={64} className="mb-4" />
            <h3 className="text-xl font-bold">Your inventory is empty</h3>
          </div>
        ) : (
          inventory.map((book) => (
            <div key={book._id} className="card bg-base-200 border border-base-300 shadow-sm overflow-hidden">
              <div className="flex p-4 gap-4">
                <img src={book.bookCover} className="w-20 h-28 object-cover rounded-lg" alt="" />
                <div className="flex-1">
                  <h3 className="font-bold line-clamp-1">{book.bookTitle}</h3>
                  <p className="text-xs opacity-60">ID: {book._id.slice(-6)}</p>
                  <div className={`badge mt-2 ${book.isAvailable ? 'badge-success' : 'badge-ghost'} gap-1`}>
                    {book.isAvailable ? <CheckCircle size={12}/> : <XCircle size={12}/>}
                    {book.isAvailable ? "Active" : "Hidden"}
                  </div>
                </div>
              </div>
              <div className="flex border-t border-base-300">
                <button 
                  onClick={() => toggleAvailability(book._id, book.isAvailable)}
                  className="flex-1 p-3 text-sm hover:bg-base-300 font-medium transition-colors"
                >
                  {book.isAvailable ? "Mark Sold" : "Relist"}
                </button>
                <button className="flex-1 p-3 text-sm hover:bg-base-300 text-error font-medium border-l border-base-300 transition-colors">
                  <Trash2 size={16} className="inline mr-1" /> Remove
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ShopDashboard;