import { useFirebase } from "../context/FirebaseContext.jsx";
import { useBookForm } from "../hooks/useBookForm.js"; // Import the hook above

const BookListingForm = () => {
  const { user } = useFirebase();
  const {
    formData, setFormData, loading, imagePreview, setImagePreview,
    setImageFile, galleryPreviews, setGalleryFiles, setGalleryPreviews,
    handleSubmit, galleryFiles
  } = useBookForm(user);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <section className="min-h-screen bg-base-200 flex items-center justify-center p-6">
      <form onSubmit={handleSubmit} className="card w-full max-w-3xl bg-base-100 shadow-xl p-8 space-y-6">
        <h2 className="text-2xl font-bold">List Your Book</h2>

        {/* SECTION: COVER UPLOAD */}
        <div className="flex flex-col items-center gap-4 bg-base-200 p-4 rounded-xl border border-dashed">
          <div className="w-32 h-44 rounded-lg bg-base-300 flex items-center justify-center overflow-hidden">
            {imagePreview ? <img src={imagePreview} className="object-cover h-full w-full" alt="Cover" /> : <span className="text-xs opacity-40">Required Cover</span>}
          </div>
          <input type="file" accept="image/*" className="file-input file-input-sm w-full max-w-xs" 
            onChange={(e) => {
                const file = e.target.files[0];
                setImageFile(file);
                setImagePreview(URL.createObjectURL(file));
            }} 
          />
        </div>

        {/* SECTION: CATEGORY LOGIC */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select name="category" value={formData.category} onChange={handleChange} className="select select-bordered" required>
            <option value="">Select Category</option>
            <option value="academic">Academic / Textbooks</option>
            <option value="non-academic">Non-Academic (Fiction)</option>
          </select>

          {formData.category === "academic" && (
            <select name="academicType" value={formData.academicType} onChange={handleChange} className="select select-bordered" required>
              <option value="">-- Level --</option>
              <option value="school">School (K-12)</option>
              <option value="college">College / University</option>
            </select>
          )}
        </div>

        {/* SECTION: ISBN (Conditional) */}
        {(formData.category === "non-academic" || formData.academicType === "college" || (formData.academicType === "school" && ["CBSE", "ICSE"].includes(formData.board))) && (
          <div className="form-control">
            <label className="label-text font-bold text-primary">ISBN Number (Auto-fills details)</label>
            <input name="isbn" type="text" className="input input-bordered border-primary" value={formData.isbn} onChange={handleChange} maxLength="13" />
          </div>
        )}

        {/* SECTION: TEXT FIELDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="bookTitle" placeholder="Book Title *" className="input input-bordered" value={formData.bookTitle} onChange={handleChange} required />
          <input name="bookAuthor" placeholder="Author / Publisher" className="input input-bordered" value={formData.bookAuthor} onChange={handleChange} />
        </div>

        {/* SECTION: GALLERY */}
        <div className="form-control">
          <label className="label-text font-bold text-secondary">Actual Book Photos (1-4) *</label>
          <input type="file" multiple className="file-input file-input-bordered" required onChange={(e) => {
              const files = Array.from(e.target.files).slice(0, 4);
              setGalleryFiles(files);
              setGalleryPreviews(files.map(f => URL.createObjectURL(f)));
          }} />
          <div className="flex gap-2 mt-2">
            {galleryPreviews.map((src, i) => <img key={i} src={src} className="w-16 h-20 object-cover rounded shadow" />)}
          </div>
        </div>

        <button type="submit" className="btn btn-secondary w-full" disabled={loading}>
          {loading ? <span className="loading loading-spinner"></span> : "Complete Listing"}
        </button>
      </form>
    </section>
  );
};

export default BookListingForm;