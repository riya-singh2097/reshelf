// components/guards/OnboardingGuard.jsx
import { useUserContext } from "../../context/UserContext.jsx";
import { Navigate, useLocation } from "react-router-dom";
import Loading from "../../components/Loading.jsx";

 const OnboardingGuard = ({ children }) => {
  const { dbUser, loading } = useUserContext();
  const location = useLocation();
// console.log("inside OnboardingGuard");

  if (loading) return <Loading />;

  // If the user has NO profile in the DB
  if(dbUser===null){
    return <Navigate to="/" replace />
  }
  if (dbUser?.isNew) {
    if (location.pathname !== "/complete-profile") {
      return <Navigate to="/complete-profile" replace />;
    }
  } 
  
  // If the user HAS a profile but is trying to go to /complete-profile
  if (!dbUser?.isNew && location.pathname === "/complete-profile") {
    return <Navigate to="/dashboard" replace />;
  }
//YAHA PE GEMINI SE CODE LENA FOR NOT FURTHERING THE PROCESS OF APP 
  return children;
};

export default OnboardingGuard