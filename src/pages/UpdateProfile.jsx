import { useState, useEffect } from "react";
import { useFirebase } from "../context/FirebaseContext.jsx";
import { useUserContext } from "../context/UserContext.jsx";
import { useNavigate } from "react-router";
import api from "../lib/axios.js";
import { statesNDistricts } from "../lib/location.js";
import { toast } from "react-toastify";
import { uploadImage } from "../lib/cloudinary/uploadImage.js";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const UpdateProfile = () => {
  const { user } = useFirebase();
  const { dbUser } = useUserContext();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [loading, setLoading] = useState(false);
  const [districts, setDistricts] = useState([]);
  const [imageFile, setImageFile] = useState("");
  const [userName, setUserName] = useState(dbUser?.username || "");
  const [aboutMe, setAboutMe] = useState(dbUser?.aboutMe || "");
  const [imagePreview, setImagePreview] = useState(
    dbUser?.profilePhotoURL || ""
  );
  const [address, setAddress] = useState(
    dbUser?.address || { street: "", state: "", district: "", pincode: "" }
  );
  const [socialLinks, setSocialLinks] = useState(
    dbUser?.socialLinks || { instagram: "", twitter: "", website: "" }
  );

  const { mutateAsync: updateProfile, isPending } = useMutation({
    mutationFn: async (profileData) => {
      const token = await user.getIdToken();
      return api.put("/user/profile/update", profileData, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["dbUser", user?.uid] });
      toast.success("Profile updated!");
      navigate("/dashboard");
    },
  });

  const handleProfileImgPreview = (e) => {
    const file = e.target.files[0];
    // console.log(file, "file in handleProfileImgPreview");//just some infor in obj form
    setImageFile(file); //save this for the Cloudinary upload later
    setImagePreview(URL.createObjectURL(file));
  };

  //address
  const handleAddressChange = (e) =>
    setAddress({ ...address, [e.target.name]: e.target.value });

  //sync of districts with state
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

  //socila media links
  const handleSocialChange = (e) =>
    setSocialLinks({ ...socialLinks, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      //uplaoding image to cloudinary and get the link
      setLoading(true);
      //upload avatar to cloudinary
      let finalImageUrl = dbUser?.profilePhotoURL;

      // 1. Upload if user picked a new file
      if (imageFile) {
        const uploadedUrl = await uploadImage(imageFile, "avatar");
        if (uploadedUrl) finalImageUrl = uploadedUrl;
      }

      // 2. Final Fallback
      if (!finalImageUrl) {
        finalImageUrl =
          "https://i.pinimg.com/736x/79/e8/9f/79e89fdc173fed118526a1d32e1aac61.jpg";
      }

      await updateProfile({
        profilePhotoURL: finalImageUrl,
        username: userName,
        address,
        socialLinks,
        aboutMe,
      });
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Something went wrong");
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
            <h2 className="text-2xl font-semibold">Update Your Profile</h2>
          </div>
          {/* profile photo display */}
          <div className="flex justify-center rounded-full ring-primary ring-offset-base-100 ring-2 ring-offset-2 mx-auto overflow-hidden">
            <img
              src={imagePreview}
              alt="avatar"
              className="w-24 h-24 rounded-full bg-base-300  object-cover"
            />
          </div>
          {/*choose profile photo  */}
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
            {/* username */}
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
                disabled={loading || isPending}
              >
                {loading || isPending ? "Saving..." : "Complete Profile"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </section>
  );
};

export default UpdateProfile;
