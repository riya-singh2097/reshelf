import axios from "axios";

 export const uploadImage = async (file, type) => {
    const formData = new FormData();
    formData.append("file", file);
   // Decide which preset to use based on what we are uploading
  const preset = type === "avatar" ? "ReShelf-User-Avatar" : "ReShelf-Books-Preset";
  formData.append("upload_preset", preset);

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${
          import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
        }/image/upload/`,
        formData,
      );

      return response.data.secure_url;
    } catch (error) {
      console.error(
        "Cloudinary Upload Error:",
        error.response?.data || error.message
      );
      toast.error("cloudinary image upload error");
      // throw error;
    }
  };

  