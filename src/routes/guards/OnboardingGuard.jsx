import { useUserContext } from "../../context/UserContext.jsx";
import { Navigate, useLocation } from "react-router-dom";
import Loading from "../../components/Loading.jsx";

const OnboardingGuard = ({ children }) => {
  const { dbUser, loading, isError } = useUserContext();
  const location = useLocation();

  if (loading) return <Loading />;

  // Server error handling
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <h1 className="text-xl font-bold text-red-600">Server Offline</h1>
        <p>We can't connect to our services right now.</p>
        <button onClick={() => window.location.reload()} className="mt-4 p-2 bg-blue-500 text-white rounded">
          Try Again
        </button>
      </div>
    );
  }

  // No user data
  if (!dbUser) return <Navigate to="/" replace />;

  // Onboarding logic
  if (dbUser.isNew) {
    // If new and not on completion page, send them there
    if (location.pathname !== "/complete-profile") {
      return <Navigate to="/complete-profile" replace />;
    }
  } else {
    // If profile is COMPLETED but they try to access /complete-profile
    if (location.pathname === "/complete-profile") {
      const destination = dbUser.role === "shop" ? "/shop-dashboard" : "/dashboard";
      return <Navigate to={destination} replace />;
    }
  }

  return children;
};

export default OnboardingGuard;