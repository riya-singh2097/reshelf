// components/guards/AuthGuard.jsx
import { lazy } from "react";
import { useFirebase } from "../../context/FirebaseContext.jsx";
import { Navigate, useLocation } from "react-router-dom";
const Loading = lazy(()=>import("../../components/Loading.jsx"));
 const AuthGuard = ({ children }) => {
  const { user, loading } = useFirebase();

console.log("inside AuthGuard");

  const location = useLocation();

  if (loading) return <Loading />;


  if (!user) {
    // Redirect to login, but save where they were trying to go
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default AuthGuard