import { useQuery } from "@tanstack/react-query";

// lib/queries.js
export const useUserProfile = (user) => {
  return useQuery({
    queryKey: ['userProfile', user?.uid],
    queryFn: async () => {
      const token = await user.getIdToken();
      const res = await api.get("/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
    enabled: !!user && user.emailVerified, // Only run if user exists
    retry: 1, // Only retry once if backend is down
  });
};

export const getBooksByCurrentUser = ()=>  useQuery({
    queryKey: ["booksByCurrentUser"],
    queryFn: async () => {
      // console.log("data fetched ");
      
      const token = await user.getIdToken();
       const response = await api.get("/book/currentUser", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data
    },
    enabled:!!user,
    refetchOnMount: false,
  });