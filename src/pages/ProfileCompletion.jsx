import { useState, useEffect } from "react";
import { useFirebase } from "../context/FirebaseContext.jsx";
import { useUserContext } from "../context/UserContext.jsx";
import { useNavigate } from "react-router";
import api from "../lib/axios.js";
import { statesNDistricts } from "../lib/location.js";
import { toast } from "react-toastify";
import axios from "axios";

const ProfileCompletion = () => {
 const { user } = useFirebase();
  const { refreshUser } = useUserContext();
  const navigate = useNavigate();

  const [role, setRole] = useState("");
  const [userName, setUserName] = useState("");
  const [aboutMe, setAboutMe] = useState("");
  const [loading, setLoading] = useState(false);
  const [districts, setDistricts] = useState([]);
  const [imageURL, setImageURL] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const [address, setAddress] = useState({
    street: "",
    district: "",
    state: "",
    pincode: "",
  });

  const [socialLinks, setSocialLinks] = useState({
    instagram: "",
    twitter: "",
    website: "",
  });

  useEffect(() => {
    if (user?.displayName) {
      setUserName(user.displayName);
    }
  }, [user]);

  const handleAddressChange = (e) =>
    setAddress({ ...address, [e.target.name]: e.target.value });

  useEffect(() => {
    if (address.state) {
      const foundState = statesNDistricts.find(
        (x) => x.state === address.state
      );
      setDistricts(foundState ? foundState.districts : []);
    } else {
      setDistricts([]);
    }
  }, [address.state]);

  const handleSocialChange = (e) =>
    setSocialLinks({ ...socialLinks, [e.target.name]: e.target.value });

  // Image Preview
  const handleProfileImgPreview = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImageURL(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Upload to Cloudinary
  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "ReShelf-User-Avatar");

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${
          import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
        }/image/upload`,
        formData
      );

      return response.data.secure_url;
    } catch (error) {
      console.error("Cloudinary Upload Error:", error);
      toast.error("Image upload failed");
      return null;
    }
  };

  // Submit Handler
const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      let finalImageUrl = user?.photoURL || "https://i.pinimg.com/736x/79/e8/9f/79e89fdc173fed118526a1d32e1aac61.jpg";

      if (imageFile) {
        const uploadedUrl = await uploadImage(imageFile);
        if (uploadedUrl) finalImageUrl = uploadedUrl;
      }

      const payload = {
        firebaseUid: user.uid,
        email: user.email,
        profilePhotoURL: finalImageUrl,
        username: userName,
        role, // 'shop' or 'individual'
        address,
        socialLinks,
        aboutMe,
      };

      // 1. Create the profile in DB
      await api.post("/user/profile/create", payload);

      // 2. Refresh UserContext (this re-runs the useQuery to set isNew: false)
      await refreshUser(); 

      toast.success("Profile completed successfully!");

      // 3. Navigate based on the role just submitted
      if (role === "shop") {
        navigate("/shop-dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const avatarSrc =
    imageURL ||
    user?.photoURL ||
    "https://i.pinimg.com/736x/79/e8/9f/79e89fdc173fed118526a1d32e1aac61.jpg";

  return (
    <section className="min-h-screen bg-base-200 flex items-center justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="card w-full max-w-3xl bg-base-100 shadow-xl"
      >
        <div className="card-body space-y-6">
          <div>
            <h2 className="text-2xl font-semibold">Complete Your Profile</h2>
            <p className="text-sm text-base-content/70">
              Help us personalize your experience
            </p>
          </div>

          {/* Avatar */}
          <div className="flex justify-center">
            <img
              src={avatarSrc}
              alt="avatar"
              className="w-24 h-24 rounded-full bg-base-300 object-cover"
            />
          </div>

          {/* Upload */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">
                Upload your profile photo here
              </span>
            </label>
            <input
              type="file"
              accept="image/png, image/jpeg, image/jpg"
              className="file-input file-input-bordered file-input-sm w-full max-w-xs"
              onChange={handleProfileImgPreview}
            />
          </div>

          {/* Username */}
          <input
            placeholder="Username"
            className="input input-bordered"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
          />

          {/* Role */}
          <select
            className="select select-bordered"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="">Select role</option>
            <option value="individual">Individual</option>
            <option value="shop">Shop</option>
          </select>

          {/* Address */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="street"
              placeholder="Street"
              className="input input-bordered"
              value={address.street}
              onChange={handleAddressChange}
              required
            />

            <select
              name="state"
              className="select select-bordered"
              value={address.state}
              onChange={handleAddressChange}
              required
            >
              <option value="">Select State</option>
              {statesNDistricts.map((x) => (
                <option key={x.code} value={x.state}>
                  {x.state}
                </option>
              ))}
            </select>

            <select
              name="district"
              className="select select-bordered"
              value={address.district}
              onChange={handleAddressChange}
              disabled={!address.state}
              required
            >
              <option value="">Select District</option>
              {districts.map((d, index) => (
                <option key={index} value={d}>
                  {d}
                </option>
              ))}
            </select>

            <input
              name="pincode"
              placeholder="Pincode"
              className="input input-bordered"
              value={address.pincode}
              onChange={handleAddressChange}
              required
            />
          </div>

          {/* About */}
          <textarea
            placeholder="About me"
            className="textarea textarea-bordered w-full"
            value={aboutMe}
            onChange={(e) => setAboutMe(e.target.value)}
          />

          {/* Submit */}
          <button
            type="submit"
            className="btn btn-secondary w-full"
            disabled={loading}
          >
            {loading ? "Saving..." : "Complete Profile"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default ProfileCompletion;
