import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldAlert, Lock, Mail, Loader2 } from "lucide-react";
import api from "../lib/axios.js";
import { toast } from "react-toastify";
import { useUserContext } from "../context/UserContext.jsx";
import { useFirebase } from "../context/FirebaseContext.jsx"; // Added this import

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { logout } = useFirebase(); 
  const { adminRefresh } = useUserContext();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Force logout the previous Firebase user first to clear tokens
      if (logout) await logout(); 

      // 2. Perform Admin Login via your custom Backend
      const res = await api.post("/admin/login", { email, password });
      
      // 3. Store Admin Token (Axios Interceptor will pick this up automatically)
      localStorage.setItem("adminToken", res.data.token);
      
      // 4. Update Context & Navigate
      if (adminRefresh) {
        await adminRefresh(); 
      }
      
      toast.success("Identity Verified. Access Granted.");
      navigate("/admin");
    } catch (err) {
      console.error("Admin Login Error:", err);
      const errorMsg = err.response?.data?.message || "Authentication Failed";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-300 p-4">
      <div className="card w-full max-w-md bg-base-100 shadow-2xl border-t-8 border-error">
        <div className="card-body">
          <div className="flex flex-col items-center mb-6">
            <div className="p-4 bg-error/10 rounded-full mb-2">
              <ShieldAlert size={48} className="text-error" />
            </div>
            <h1 className="text-3xl font-black italic tracking-tighter uppercase text-center">
               Admin Terminal
            </h1>
            <p className="text-xs opacity-50 uppercase font-bold mt-1 tracking-widest text-center">
              Secured Environment
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-bold uppercase text-xs">Credential ID (Email)</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 opacity-30" size={18} />
                <input 
                  type="email" 
                  placeholder="admin@reshelf.com" 
                  className="input input-bordered w-full pl-10 focus:border-error"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-bold uppercase text-xs">Security Key (Password)</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 opacity-30" size={18} />
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  className="input input-bordered w-full pl-10 focus:border-error"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="btn btn-error w-full text-lg font-bold mt-4 shadow-lg uppercase group"
              disabled={loading}
            >
              {loading ? <Loader2 className="animate-spin" /> : "Authorize Access"}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button 
              onClick={() => navigate("/")} 
              className="text-xs opacity-40 hover:opacity-100 transition-opacity uppercase font-bold tracking-widest"
            >
              ← Terminate Session & Return
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;