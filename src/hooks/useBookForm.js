import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import api from "../lib/axios.js";
import { uploadImage } from "../lib/cloudinary/uploadImage.js";

export const useBookForm = (user) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  
  const [formData, setFormData] = useState({
    category: "", academicType: "", subCategory: "", board: "",
    isbn: "", condition: "", bookTitle: "", bookAuthor: "",
    aboutBook: "", TransactionType: "",
  });

  // Handle ISBN Auto-fetch
  useEffect(() => {
    const isbnClean = formData.isbn.trim();
    if ((isbnClean.length === 10 || isbnClean.length === 13) && !imageFile) {
      fetch(`https://openlibrary.org/api/books?bibkeys=ISBN:${isbnClean}&format=json&jscmd=data`)
        .then(res => res.json())
        .then(data => {
          const info = data[`ISBN:${isbnClean}`];
          if (info) {
            setFormData(prev => ({
              ...prev,
              bookTitle: prev.bookTitle || info.title,
              bookAuthor: prev.bookAuthor || (info.authors?.[0]?.name || ""),
            }));
            if (info.cover?.large || info.cover?.medium) {
              setImagePreview(info.cover.large || info.cover.medium);
            }
          }
        }).catch(err => console.error("ISBN Error:", err));
    }
  }, [formData.isbn, imageFile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // REQUIREMENT: Cover image check
    if (!imagePreview && !imageFile) return toast.error("A book cover image is required.");
    if (galleryFiles.length === 0) return toast.error("Upload at least one actual book photo.");

    setLoading(true);
    try {
      const token = await user.getIdToken();
      
      // Upload Images
      let finalBookURL = imagePreview;
      if (imageFile) finalBookURL = await uploadImage(imageFile, "book");

      const galleryUrls = await Promise.all(
        galleryFiles.map(file => uploadImage(file, "book"))
      );

      const payload = {
        ...formData,
        bookAuthor: formData.bookAuthor || (formData.board ? `${formData.board} Board` : "N/A"),
        bookCover: finalBookURL,
        gallery: galleryUrls,
      };

      await api.post("/book/listbook", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      queryClient.invalidateQueries({ queryKey: ["booksByCurrentUser"], exact: false });
      toast.success("Listing created!");
      navigate("/profile");
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return {
    formData, setFormData, loading, imagePreview, setImagePreview,
    setImageFile, galleryPreviews, setGalleryFiles, setGalleryPreviews,
    handleSubmit, galleryFiles
  };
};