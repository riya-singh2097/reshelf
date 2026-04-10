import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import api from "../lib/axios";
import { useFirebase } from "../context/FirebaseContext";

const ReportUser = () => {
  const { id } = useParams(); // targetUserId from URL
  const navigate = useNavigate();
  const { user } = useFirebase();
  const [reason, setReason] = useState("Harassment");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = await user.getIdToken();
      // Updated route to match your backend: /report/user/:targetUserId
      await api.post(`/user/report/user/${id}`, 
        { reason, description }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      toast.success("Report submitted to administrators.");
      navigate(-1);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit report.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-base-100 rounded-3xl shadow-2xl border border-base-300">
      <h2 className="text-2xl font-black mb-2">Report User</h2>
      <p className="text-xs opacity-50 mb-6 uppercase tracking-widest font-bold">Target ID: {id}</p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label text-xs font-bold uppercase opacity-60">Reason</label>
          <select 
            className="select select-bordered w-full rounded-xl"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          >
            <option>Harassment</option>
            <option>Spam</option>
            <option>Inappropriate Content</option>
            <option>Fraud/Scam</option>
            <option>Other</option>
          </select>
        </div>

        <div>
          <label className="label text-xs font-bold uppercase opacity-60">Details</label>
          <textarea 
            required
            className="textarea textarea-bordered w-full h-32 rounded-xl"
            placeholder="Please provide specific details..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="flex gap-2 pt-2">
          <button type="submit" disabled={loading} className="btn btn-error flex-1 rounded-xl">
            {loading ? "Submitting..." : "Submit Report"}
          </button>
          <button type="button" onClick={() => navigate(-1)} className="btn btn-ghost rounded-xl">Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default ReportUser;