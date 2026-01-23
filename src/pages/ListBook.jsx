import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../lib/axios.js";
import { useFirebase } from "../context/FirebaseContext.jsx";
import { uploadImage } from "../lib/cloudinary/uploadImage.js";

const BookListingForm = () => {
  const { user } = useFirebase();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState("");

  const [formData, setFormData] = useState({
    category: "",
    academicType: "",
    subCategory: "", // Used for Standard
    board: "",
    isbn: "",
    condition: "",
    bookTitle: "",
    bookAuthor: "",
    aboutBook: "",
    TransactionType: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "category") {
      setFormData({
        ...formData,
        category: value,
        academicType: "",
        subCategory: "",
        board: "",
        isbn: "",
        TransactionType: "",
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
    setImageFile(file);
  };

  // useEffect(()=> console.log(imagePreview),[imagePreview])//result;  blob:http://localhost:5173/78f9ee8b-9242-46ad-a930-d8129b1c8a96

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      //image url from cloudinary
      let finalBookURL = "";
      if (imageFile) {
        const uploadURL = await uploadImage(imageFile, "book");
        if (uploadURL) finalBookURL = uploadURL;
      }

      const payload = {
        ...formData,
        bookCover: finalBookURL,
      };
      const token = await user.getIdToken();
      const result = await api.post("/book/listbook", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (result) {
        toast.success("Book Listed Successfully!");
        console.log(result.status);
        if (result.status === 200) {
          // 1. Completely remove the old data from cache
          await queryClient.removeQueries({ queryKey: ["booksByCurrentUser"] });

          // 2. Then invalidate to trigger a fresh fetch
          await queryClient.invalidateQueries({
            queryKey: ["booksByCurrentUser"],
          });
          navigate("/profile");
        }
      }
    } catch (error) {
      toast.error(error.message);
      console.error(error);
    } finally {
      setLoading(false);
    }
    // setTimeout(() => setLoading(false), 2000);
  };

  return (
    <section className="min-h-screen bg-base-200 flex items-center justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="card w-full max-w-3xl bg-base-100 shadow-xl"
      >
        <div className="card-body space-y-6">
          <div>
            <h2 className="text-2xl font-semibold">List Your Book</h2>
            <p className="text-sm text-base-content/70">
              Fill in the primary details to get started.
            </p>
          </div>

          {/* 1. Photo Upload (Always Present) */}
          <div className="flex flex-col items-center gap-4">
            <div className="avatar">
              <div className="w-32 h-44 rounded-lg bg-base-300 shadow-inner overflow-hidden border-2 border-dashed border-base-content/20 flex items-center justify-center">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Book Preview"
                    className="object-cover"
                  />
                ) : (
                  <span className="text-xs text-center p-2 opacity-50">
                    No Cover Uploaded
                  </span>
                )}
              </div>
            </div>
            <p className="text-xs text-center p-2 opacity-50">
              Download the image and upload or click the picture of book and
              upload{" "}
            </p>
            <div className="form-control w-full max-w-xs">
              <input
                type="file"
                accept="image/*"
                className="file-input file-input-bordered file-input-sm w-full"
                onChange={handleImageChange}
                required
              />
            </div>
          </div>

          {/* 2. Book Title (Always Present) */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Book Title *</span>
            </label>
            <input
              type="text"
              name="bookTitle"
              placeholder="e.g. NCERT Mathematics Class 10"
              className="input input-bordered"
              value={formData.bookTitle}
              onChange={handleChange}
              required
            />
          </div>
          {/* 3. Book Author (Always Present) */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Book Author *</span>
            </label>
            <input
              type="text"
              name="bookAuthor"
              placeholder="Enter author name"
              className="input input-bordered"
              value={formData.bookAuthor}
              onChange={handleChange}
              required
            />
          </div>

          {/* 4. Category Selection (Always Present) */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Main Category *</span>
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="select select-bordered"
              required
            >
              <option value="">Select Category</option>
              <option value="academic">Academic</option>
              <option value="non-academic">Non-Academic</option>
            </select>
          </div>

          {/* --- CONDITIONAL LOGIC --- */}
          {/* IF ACADEMIC: Display Academic Level */}
          {formData.category === "academic" && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">
                    Academic Level *
                  </span>
                </label>
                <select
                  name="academicType"
                  value={formData.academicType}
                  onChange={handleChange}
                  className="select select-bordered w-full"
                  required
                >
                  <option value="">-- Select Level --</option>
                  <option value="school">School (K-12)</option>
                  <option value="college">College (Degree/Diploma)</option>
                </select>
              </div>

              {/* IF SCHOOL: Display Standard and Comprehensive Board List */}
              {formData.academicType === "school" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in slide-in-from-top-2 duration-300">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Standard</span>
                    </label>
                    <select
                      name="subCategory"
                      value={formData.subCategory}
                      onChange={handleChange}
                      className="select select-bordered"
                      required
                    >
                      <option value="">Select Class</option>
                      <option value="12th">12th Standard</option>
                      <option value="11th">11th Standard</option>
                      <option value="10th">10th Standard</option>
                      <option value="9th">9th Standard</option>
                      <option value="8th">8th Standard</option>
                      <option value="7th">7th Standard</option>
                      <option value="6th">6th Standard</option>
                      <option value="5th">5th Standard</option>
                      <option value="4th">4th Standard</option>
                      <option value="3rd">3rd Standard</option>
                      <option value="2nd">2nd Standard</option>
                      <option value="1st">1st Standard</option>
                    </select>
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">
                        Education Board
                      </span>
                    </label>
                    <select
                      name="board"
                      value={formData.board}
                      onChange={handleChange}
                      className="select select-bordered"
                      required
                    >
                      <option value="">Select Board</option>
                      <optgroup label="National Boards">
                        <option value="CBSE">CBSE (Central Board)</option>
                        <option value="ICSE">ICSE / ISC</option>
                        <option value="NIOS">NIOS (Open Schooling)</option>
                        <option value="IB">
                          IB (International Baccalaureate)
                        </option>
                        <option value="IGCSE">IGCSE (Cambridge)</option>
                      </optgroup>
                      <optgroup label="State Boards">
                        <option value="Maharashtra">
                          Maharashtra State Board
                        </option>
                        <option value="UP">Uttar Pradesh (UP Board)</option>
                        <option value="Karnataka">Karnataka (SSLC/PUC)</option>
                        <option value="TamilNadu">
                          Tamil Nadu State Board
                        </option>
                        <option value="WestBengal">West Bengal Board</option>
                        <option value="Delhi">Delhi Board</option>
                        <option value="OtherState">Other State Board</option>
                      </optgroup>
                    </select>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* IF NON-ACADEMIC: Display ISBN and college books  */}
          {(formData.category === "non-academic" ||
            formData.academicType === "college") && (
            <div className="form-control animate-in fade-in duration-300">
              <label className="label">
                <span className="label-text font-medium">ISBN Number</span>
              </label>
              <input
                type="text"
                name="isbn"
                placeholder="ISBN-10 or ISBN-13"
                className="input input-bordered"
                value={formData.isbn}
                onChange={handleChange}
                pattern="[0-9]{10}|[0-9]{13}"
                maxLength="13"
                minLength="10"
                required
              />
            </div>
          )}
          {formData.category === "non-academic" && (
            <div className="form-control animate-in fade-in duration-300">
              <label className="label">Genre / Sub-Category</label>
              <select
                name="subCategory"
                value={formData.subCategory}
                onChange={handleChange}
                required
                className="select select-bordered"
              >
                <option value="">-- Select a Genre --</option>

                <optgroup label="Fiction">
                  <option value="Action & Adventure">Action & Adventure</option>
                  <option value="Classics">Classics</option>
                  <option value="Contemporary">Contemporary</option>
                  <option value="Fantasy">Fantasy</option>
                  <option value="Historical Fiction">Historical Fiction</option>
                  <option value="Horror">Horror</option>
                  <option value="Literary Fiction">Literary Fiction</option>
                  <option value="Mystery & Thriller">Mystery & Thriller</option>
                  <option value="Romance">Romance</option>
                  <option value="Sci-Fi">Science Fiction (Sci-Fi)</option>
                  <option value="Young Adult">Young Adult (YA)</option>
                </optgroup>

                <optgroup label="Non-Fiction">
                  <option value="Art & Photography">Art & Photography</option>
                  <option value="Biography & Memoir">Biography & Memoir</option>
                  <option value="Business & Economics">
                    Business & Economics
                  </option>
                  <option value="Cookbooks">Cookbooks</option>
                  <option value="History">History</option>
                  <option value="Self-Help">
                    Personal Development / Self-Help
                  </option>
                  <option value="Philosophy">Philosophy</option>
                  <option value="Religion & Spirituality">
                    Religion & Spirituality
                  </option>
                  <option value="True Crime">True Crime</option>
                </optgroup>

                <option value="Other">Other</option>
              </select>
            </div>
          )}

          <div className="grid grid-cols-2 grid-rows-1 gap-4">
            {/* 5. Book Condition (Always Present) */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Condition *</span>
              </label>
              <select
                name="condition"
                value={formData.condition}
                onChange={handleChange}
                className="select select-bordered"
                required
              >
                <option value="">Select Level</option>
                <option value="5">Brand New</option>
                <option value="4">Like New</option>
                <option value="3">Good (Light Use)</option>
                <option value="2">Fair (Heavily Used)</option>
                <option value="1">Poor (Readable but worn)</option>
              </select>
            </div>

            {/* 6. Transaction Type */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">
                  Transaction Type *
                </span>
              </label>
              <select
                name="TransactionType"
                className="select select-bordered"
                onChange={handleChange}
                required
              >
                <option value="">Select Transaction Type</option>
                <option value="sell">Sell</option>
                <option value="lend">Lend</option>
                <option value="donate">Donate</option>
                <option value="free">Free</option>
              </select>
            </div>
          </div>
          {/* 7. About Book (Always Present) */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">About Book</span>
            </label>
            <textarea
              name="aboutBook"
              placeholder="Describe the condition, author, or edition..."
              className="textarea textarea-bordered h-28"
              value={formData.aboutBook}
              onChange={handleChange}
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="btn btn-secondary w-full"
              disabled={loading}
            >
              {loading ? "Listing..." : "Complete Listing"}
            </button>
          </div>
        </div>
      </form>
    </section>
  );
};

export default BookListingForm;
