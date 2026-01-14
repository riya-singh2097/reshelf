import { useState, useEffect } from "react";
import { useFirebase } from "../context/FirebaseContext.jsx";
import { useUserContext } from "../context/UserContext.jsx";
import { useNavigate } from "react-router";
import api from "../lib/axios.js";
import  {statesNDistricts}  from "../lib/location.js";
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
  const [imageFile, setImageFile] = useState("");

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
    //try to find districts if address.state has a value
    if (address.state) {
      const foundState = statesNDistricts.find(
        (x) => x.state === address.state
      );

      // k if foundState actually exists before accessing .districts
      if (foundState) {
        setDistricts(foundState.districts);
      } else {
        setDistricts([]);
      }
    } else {
      // clear districts if no state is selected
      setDistricts([]);
    }
  }, [address.state]);

  const handleSocialChange = (e) =>
    setSocialLinks({ ...socialLinks, [e.target.name]: e.target.value });

  //preview of image in the image display box
  const previewImage = (file) => {
    const fileReader = new FileReader(); //read the gile turn it into url
    fileReader.readAsDataURL(file);
    fileReader.onloadend = () => setImageURL(fileReader.result);
  };
  const handleProfileImgPreview = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    // console.log(file);
    setImageFile(file);
    previewImage(file);
  };

  //uploading image from user to cloudinary
  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "ReShelf-User-Avatar");

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${
          import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
        }/image/upload`,
        formData,
        {
          // Optional: track progress for a progress bar
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            console.log(`Upload progress: ${percentCompleted}%`);
          },
        }
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

  //HANDLE SUBMIT TO SEND DATA TO BACKEND ...................................................
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      //upload avatar to cloudinary
      let finalImageUrl = user?.photoURL; // Default to existing

      // 1. Upload if user picked a new file
      if (imageFile) {
        const uploadedUrl = await uploadImage(imageFile);
        if (uploadedUrl) finalImageUrl = uploadedUrl;
      }

      // 2. Final Fallback
      if (!finalImageUrl) {
        finalImageUrl =
          "https://i.pinimg.com/736x/79/e8/9f/79e89fdc173fed118526a1d32e1aac61.jpg";
      }

      const payload = {
        firebaseUid: user.uid,
        email: user.email,
        profilePhotoURL: finalImageUrl,
        username: userName,
        role,
        address,
        socialLinks,
        aboutMe,
      };

      await api.post("/user/profile/create", payload);
      toast.success("Profile completed successfully!");
      await refreshUser();
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      toast.error(err.message, {
        autoClose: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-base-200 flex items-center justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="card w-full max-w-3xl bg-base-100 shadow-xl"
      >
        <div className="card-body space-y-6">
          {/* Header */}
          <div>
            <h2 className="text-2xl font-semibold">Complete Your Profile</h2>
            <p className="text-sm text-base-content/70">
              Help us personalize your experience
            </p>
          </div>

          {/* Avatar Preview */}
          <div className="flex justify-center rounded-full">
            <img
              src={
                user?.photoURL ??
                imageURL ??
                "https://i.pinimg.com/736x/79/e8/9f/79e89fdc173fed118526a1d32e1aac61.jpg"
              }
              alt="avatar"
              className="w-24 h-24 rounded-full bg-base-300  object-cover"

            />
          </div>

          {/*profile photo */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Upload your profile photo here</span>
            </label>
            <input
              type="file"
              accept="image/png, image/jpeg, image/jpg"
              className="file-input file-input-bordered file-input-sm w-full max-w-xs"
              onChange={(e) => handleProfileImgPreview(e)}
            />

            <label className="label">
              <span className="label-text">
                Username <span className="text-error">*</span>
              </span>
            </label>
            <input
              name="username"
              placeholder="Username"
              className="input input-bordered"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
            />
            <label className="label">
              <span className="label-text">
                Role <span className="text-error">*</span>
              </span>
            </label>
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
          </div>

          {/* Address */}
          <div>
            <h3 className="font-semibold text-lg mb-2">
              Address<span className="text-error">*</span>
            </h3>
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
                name="district"
                placeholder="District"
                className="select select-bordered"
                value={address.district}
                onChange={handleAddressChange}
                disabled={!address.state}
                required
              >
                <option value="" disabled hidden>
                  Select a District
                </option>

                {districts?.map((d, index) => {
                  return (
                    <option key={index} value={d}>
                      {d}
                    </option>
                  );
                  // console.log(d);
                })}
              </select>

              <select
                name="state"
                placeholder="State"
                className="select select-bordered text-base-content"
                value={address.state}
                onChange={handleAddressChange}
                required
              >
                <option value="" disabled hidden>
                  Select a State
                </option>

                {statesNDistricts.map((x) => {
                  return (
                    <option key={x.code} value={x.state}>
                      {x.state}
                    </option>
                  );
                })}
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
          </div>

          {/* Social Links */}
          <div>
            <h3 className="font-semibold text-lg mb-2">Social Links</h3>
            <div className="space-y-3">
              <input
                name="instagram"
                placeholder="@instagram-username"
                className="input input-bordered w-full"
                value={socialLinks.instagram}
                onChange={handleSocialChange}
              />
              <input
                name="twitter"
                placeholder="@twitter-username"
                className="input input-bordered w-full"
                value={socialLinks.twitter}
                onChange={handleSocialChange}
              />
              <input
                name="website"
                placeholder="Website"
                className="input input-bordered w-full"
                value={socialLinks.website}
                onChange={handleSocialChange}
              />
            </div>
          </div>

          <div>
            <label className="label">
              <span className="label-text">About Me</span>
            </label>
            <textarea
              name="about-me"
              placeholder="About me"
              className="input input-bordered w-full h-40"
              value={aboutMe}
              onChange={(e) => setAboutMe(e.target.value)}
            />
          </div>

          {/* Submit */}
          <div className="pt-4">
            <button
              type="submit"
              className="btn btn-secondary w-full"
              disabled={loading}
            >
              {loading ? "Saving..." : "Complete Profile"}
            </button>
          </div>

        </div>
      </form>
    </section>
  );
};

export default ProfileCompletion;
