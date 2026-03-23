import { Navigate, Outlet } from "react-router";
import { useFirebase } from "../../context/FirebaseContext.jsx";
import { useUserContext } from "../../context/UserContext.jsx";
import Loading from "../../components/Loading.jsx";

const ShopGuard = () => {
  const { user, loading: authLoading } = useFirebase();
  const { dbUser, loading: dbLoading } = useUserContext();

  // 1. Wait for all data to load before making a decision
  if (authLoading || dbLoading) return <Loading />;

  // 2. Check if user is logged in at all
  if (!user || !dbUser) {
    return <Navigate to="/login" replace />;
  }

  // 3. STRICT ROLE CHECK: Only let "shop" through
  // If the role is anything else (user, admin, etc.), block them.
  if (dbUser.role !== "shop") {
    console.warn("Access denied: User does not have the 'shop' role.");
    return <Navigate to="/dashboard" replace />;
  }

  // 4. If they are a shop, render the child routes (ShopDashboard)
  return <Outlet />;
};

export default ShopGuard;