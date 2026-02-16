import { Navigate, Outlet } from "react-router";
import { useUserContext } from "../../context/UserContext";

const AdminGuard = () => {
  const { dbUser, loading } = useUserContext();
  const hasToken = !!localStorage.getItem("adminToken");

  if (loading) return null; // Or a big system loader

  // If there is no token or the role is not admin, boot them
  if (!hasToken || dbUser?.role !== "admin") {
    return <Navigate to="/admin-login" replace />;
  }

  return <Outlet />;
};

export default AdminGuard;