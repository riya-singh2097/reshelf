import { useQueryClient, useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import { toast } from "react-toastify";
import api from "../lib/axios.js";
import { useFirebase } from "../context/FirebaseContext.jsx";
import { useUserContext } from "../context/UserContext.jsx";
import { uploadImage } from "../lib/cloudinary/uploadImage.js";

const BookListingForm = () => {
  const { user } = useFirebase();
  const { dbUser } = useUserContext();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [loading, setLoading] = useState(false);
  
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState("");
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);

  const [formData, setFormData] = useState({
    category: "",
    academicType: "",
    subCategory: "", 
    board: "",
    isbn: "",
    condition: "5",
    bookTitle: "",
    bookAuthor: "",
    aboutBook: "",
    TransactionType: "",
  });

  // --- Mutation Logic ---
  const mutation = useMutation({
    mutationFn: async (payload) => {
      // We don't need to manually get token here because 
      // your updated api.js interceptor handles it automatically!
      return api.post("/book/listbook", payload);
    },
    onSuccess: () => {
      toast.success("Book Listed Successfully!");
      // This refreshes the cache for BOTH Profile and ShopDashboard
      queryClient.invalidateQueries({ queryKey: ["booksByCurrentUser"] });
      navigate("/profile");
    },
    onError: (err) => {
      console.error("Mutation Error:", err);
      toast.error(err.response?.data?.message || "Failed to list book in database");
    },
  });

  const fetchFromOpenLibrary = async (isbn) => {
    if (isbn.length < 10) return;
    try {
      const res = await fetch(`https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`);
      const data = await res.json();
      const book = data[`ISBN:${isbn}`];

      if (book) {
        setFormData(prev => ({
          ...prev,
          bookTitle: book.title || prev.bookTitle,
          bookAuthor: book.authors?.[0]?.name || prev.bookAuthor,
        }));
        if (book.cover?.large) setCoverPreview(book.cover.large);
        toast.success("Book details fetched!");
      }
    } catch (error) {
      console.error("OpenLibrary API Error", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === "category" && value === "non-academic") {
        setFormData(prev => ({ ...prev, academicType: "", board: "", subCategory: "" }));
    }

    if (name === "isbn" && (value.length === 10 || value.length === 13)) {
      fetchFromOpenLibrary(value);
    }
  };

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files);
    if (galleryFiles.length + files.length > 4) return toast.error("Max 4 gallery photos");
    setGalleryFiles(prev => [...prev, ...files]);
    const newPreviews = files.map(f => URL.createObjectURL(f));
    setGalleryPreviews(prev => [...prev, ...newPreviews]);
  };

  // --- Final Submission Logic ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!coverPreview) return toast.error("Cover image is required");
    if (galleryFiles.length < 1) return toast.error("Add at least 1 real photo of the book");

    setLoading(true);
    try {
      let finalCover = coverPreview;
      
      // 1. Upload Cover to Cloudinary (if it's a new file)
      if (coverFile) {
        finalCover = await uploadImage(coverFile, "book_covers");
        if (!finalCover) throw new Error("Cover upload failed");
      }

      // 2. Upload Gallery to Cloudinary
      const galleryUrls = await Promise.all(
        galleryFiles.map(f => uploadImage(f, "book_gallery"))
      );

      if (galleryUrls.some(url => !url)) {
        throw new Error("One or more gallery images failed to upload");
      }

      // 3. Send to Backend
      mutation.mutate({
        ...formData,
        bookCover: finalCover,
        gallery: galleryUrls, 
        ownerName: dbUser?.username || "User"
      });

    } catch (err) {
      console.error("Submission Process Error:", err);
      toast.error(err.message || "Something went wrong during upload");
      setLoading(false); // Only stop loading on error so the button stays disabled on success
    }
  };

  const showISBN = useMemo(() => {
    return formData.category === "non-academic" || 
           formData.academicType === "college" || 
           formData.board === "ICSE" 
  }, [formData.category, formData.academicType, formData.board]);

  const standards = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th", "11th", "12th"];

  return (
    <section className="min-h-screen bg-base-200 py-10 px-4">
      <div className="breadcrumbs text-sm mb-4 max-w-4xl mx-auto">
        <ul>
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><Link to="/profile">Profile</Link></li>
          <li className="text-primary font-semibold">List New Book</li>
        </ul>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8 bg-base-100 p-6 md:p-10 rounded-3xl shadow-2xl border border-base-300">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-control">
            <label className="label-text font-bold mb-2">Main Category *</label>
            <select name="category" value={formData.category} onChange={handleChange} className="select select-bordered w-full" required>
              <option value="">Select Category</option>
              <option value="academic">Academic</option>
              <option value="non-academic">Non-Academic</option>
            </select>
          </div>

          {showISBN && (
            <div className="form-control">
              <label className="label-text font-bold mb-2">ISBN Number</label>
              <input type="text" name="isbn" placeholder="Enter ISBN to auto-fill" className="input input-bordered" value={formData.isbn} onChange={handleChange} />
            </div>
          )}
        </div>

        {formData.category === "academic" && (
          <div className="space-y-6 p-4 bg-base-200/50 rounded-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label-text font-semibold mb-1">Academic Level</label>
                <select name="academicType" value={formData.academicType} onChange={handleChange} className="select select-bordered" required>
                  <option value="">-- Level --</option>
                  <option value="school">School</option>
                  <option value="college">College</option>
                </select>
              </div>

              {formData.academicType === "school" && (
                <div className="form-control">
                  <label className="label-text font-semibold mb-1">Board</label>
                  <select name="board" value={formData.board} onChange={handleChange} className="select select-bordered" required>
                    <option value="">-- Board --</option>
                    <option value="CBSE">CBSE</option>
                    <option value="ICSE">ICSE</option>
                    <option value="state">State Board</option>
                  </select>
                </div>
              )}
            </div>

            {formData.academicType === "school" && (
              <div className="form-control max-w-md">
                <label className="label-text font-bold mb-2 text-primary">Standard/Grade *</label>
                <select name="subCategory" value={formData.subCategory} onChange={handleChange} className="select select-primary select-bordered" required>
                  <option value="">-- Select Standard --</option>
                  {standards.map(std => <option key={std} value={std}>{std} Standard</option>)}
                </select>
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-base-300 pt-6">
          <div className="form-control">
            <label className="label-text font-semibold">Book Title *</label>
            <input name="bookTitle" value={formData.bookTitle} onChange={handleChange} className="input input-bordered" required />
          </div>
          <div className="form-control">
            <label className="label-text font-semibold">Author *</label>
            <input name="bookAuthor" value={formData.bookAuthor} onChange={handleChange} className="input input-bordered" required />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-control">
            <label className="label-text font-semibold">Condition</label>
            <select name="condition" value={formData.condition} onChange={handleChange} className="select select-bordered" required>
              <option value="5">Brand New</option>
              <option value="4">Like New</option>
              <option value="3">Good (Readable)</option>
              <option value="2">Fair (Heavily Used)</option>
              <option value="1">Worn out</option>
            </select>
          </div>
          <div className="form-control">
            <label className="label-text font-semibold">Listing Type</label>
            <select name="TransactionType" value={formData.TransactionType} onChange={handleChange} className="select select-bordered" required>
              <option value="">-- Select --</option>
              <option value="lend">Lend</option>
              <option value="donate">Donate</option>
              <option value="sell">Sell</option>
              <option value="exchange">Exchange / Swap</option>
              <option value="rent">Rent</option>
              <option value="free">Giveaway</option>
            </select>
          </div>
        </div>

        {/* --- Media --- */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold border-b pb-2">Visuals</h3>
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="form-control">
              <span className="label-text font-semibold mb-2 block">Cover Photo</span>
              <div className="w-40 h-56 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center overflow-hidden relative bg-base-200 hover:border-primary transition-colors">
                {coverPreview ? (
                  <img src={coverPreview} className="object-cover w-full h-full" alt="Cover" />
                ) : (
                  <span className="text-xs text-center opacity-40">Click to upload</span>
                )}
                <input type="file" onChange={handleCoverChange} className="absolute inset-0 opacity-0 cursor-pointer" />
              </div>
            </div>

            <div className="flex-1 w-full">
              <span className="label-text font-semibold mb-2 block">Gallery (Photos of your actual book)</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-2 border-dashed p-4 rounded-2xl min-h-[150px] bg-base-200/30">
                {galleryPreviews.map((src, i) => (
                  <div key={i} className="aspect-square rounded-xl overflow-hidden border-2 border-white shadow-sm">
                    <img src={src} className="object-cover w-full h-full" alt="Preview" />
                  </div>
                ))}
                {galleryFiles.length < 4 && (
                  <label className="aspect-square flex flex-col items-center justify-center bg-base-100 rounded-xl cursor-pointer hover:bg-base-300 border border-base-300">
                    <span className="text-2xl">+</span>
                    <input type="file" multiple onChange={handleGalleryChange} className="hidden" />
                  </label>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="form-control">
          <label className="label-text font-semibold">Description</label>
          <textarea 
            name="aboutBook" 
            className="textarea textarea-bordered h-28" 
            placeholder="Describe the condition, edition, or any extra details..."
            value={formData.aboutBook}
            onChange={handleChange}
          />
        </div>

        <button 
          type="submit" 
          disabled={loading || mutation.isPending} 
          className="btn btn-primary btn-block text-lg shadow-xl"
        >
          {loading ? <span className="loading loading-spinner"></span> : "List Book Now"}
        </button>
      </form>
    </section>
  );
};

export default BookListingForm;