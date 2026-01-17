import { createContext, useContext } from "react";
import { useFirebase } from "./FirebaseContext.jsx";
import { useQuery } from "@tanstack/react-query";
import api from "../lib/axios.js";

const UserContext = createContext(null);

export const UserContextProvider = ({ children }) => {
  const { user, loading: authLoading } = useFirebase();

  const {
    data: dbUser,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["dbUser", user?.uid],
    queryFn: async () => {
      try {
        const token = await user.getIdToken();
        const res = await api.get("/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        return res.data;
      } catch (error) {
        if (error.response?.status === 404) {
          return { isNew: true };
        }
        throw error;
      }
    },
    enabled: !!user && !authLoading, //fetch only when user is loaded
    retry: 1, // retry once if fails
    staleTime: Infinity, // Data never becomes "old" on its own
    refetchOnMount: false, // Don't fetch when navigating to a new page
    gcTime: 1000 * 60 * 60, // Keep in cache for 1 hour even if not used By default, if a query is not being used by any visible component for 5 minutes, it deletes the data from memory to save RAM.
  });

  return (
    <UserContext.Provider
      value={{
        dbUser,
        loading: isLoading || authLoading,
        isError,
        error,
        refreshUser: refetch,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);
