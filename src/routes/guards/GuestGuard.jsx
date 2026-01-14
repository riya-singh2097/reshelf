import { Navigate } from "react-router";
import { useFirebase } from "../../context/FirebaseContext.jsx";

const GuestGuard = ({ children }) => {
  const { user, loading } = useFirebase();

  if (loading) return null; 

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default GuestGuard;