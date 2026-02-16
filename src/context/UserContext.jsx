import { createContext, useContext, useState, useEffect } from "react";
import { useFirebase } from "./FirebaseContext.jsx";
import { useQuery } from "@tanstack/react-query";
import api from "../lib/axios.js";

const UserContext = createContext(null);

export const UserContextProvider = ({ children }) => {
  const { user, loading: authLoading } = useFirebase();
  
  // Track if an admin is logged in manually
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(!!localStorage.getItem("adminToken"));

  // Sync admin state if localStorage changes (e.g., after login)
  useEffect(() => {
    const handleStorage = () => setIsAdminLoggedIn(!!localStorage.getItem("adminToken"));
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const {
    data: dbUser,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    // IMPORTANT: The key now changes if an admin logs in OR firebase user changes
    queryKey: ["dbUser", user?.uid, isAdminLoggedIn], 
    queryFn: async () => {
      try {
        // Priority 1: Check if we are an Admin
        if (localStorage.getItem("adminToken")) {
          // We'll create this simple endpoint next, or just return a dummy admin object
          const res = await api.get("/admin/stats"); // Or a specific /admin/profile if you have it
          return { role: "admin", ...res.data };
        }

        // Priority 2: Check if we are a Firebase User
        if (user) {
          const res = await api.get("/user/profile");
          return res.data;
        }

        return null;
      } catch (error) {
        if (error.response?.status === 404) return { isNew: true };
        throw error;
      }
    },
    // Enable if there is EITHER a firebase user OR an admin token
    enabled: (!authLoading && !!user) || isAdminLoggedIn,
    retry: 1,
  });

  // Manual refresh helper for Admin login
  const adminRefresh = () => {
    setIsAdminLoggedIn(true);
    refetch();
  };

  return (
    <UserContext.Provider
      value={{
        dbUser,
        loading: isLoading || authLoading,
        isError,
        error,
        refreshUser: refetch,
        adminRefresh // Export this to call after admin login
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);