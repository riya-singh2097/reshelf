// components/guards/GuestGuard.jsx
import { useFirebase } from "../../context/FirebaseContext.jsx";
import { Navigate } from "react-router-dom";
import Loading from "../../components/Loading.jsx"; // Use a standard import for guards

const GuestGuard = ({ children }) => {
  const { user, loading } = useFirebase();

  // 1. Wait for Firebase to figure out if we are logged in
  if (loading) return <Loading />;

  // 2. If we ARE logged in, we shouldn't see the Landing Page
  if (user) return <Navigate to="/dashboard" replace />;

  // 3. Only if not loading and no user, show the Landing Page
  return children;
};

export default GuestGuard;