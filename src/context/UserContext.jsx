import { createContext, useContext, useEffect, useState } from "react";
import api from "../lib/axios.js";
import { useFirebase } from "./FirebaseContext.jsx";
import { toast } from "react-toastify";

const UserContext = createContext(null);

export const UserContextProvider = ({ children }) => {
  const { user, loading: authLoading } = useFirebase();
  const [dbUser, setDbUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDbUser = async () => {
    if (!user) return;
    setLoading(true);
    if (user.emailVerified){
       try {
        const token = await user.getIdToken();
        const res = await api.get("/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
          
        setDbUser(res.data);
        // console.log("response : " ,res.data, "dbuser in context: ",dbUser);
        
      } catch (error) {
        //error via response
        if (error.response) {
          if (error.response.status === 404) {
            setDbUser({ isNew: true });
          } else {
            toast.error("Server Error. Please try again later.");
            setDbUser(null);
          }
        } else if (error.request) {
          console.error("Network error: Backend is down");
          toast.error(
            "Server is unreachable. Please check your internet or try again later.",
            {
              toastId: "network-error", // Prevents duplicate toasts
            }
          );
          setDbUser(null);
        }
      } finally {
        setLoading(false);
      }
    }
     
  };

  useEffect(() => {
    if (!authLoading) fetchDbUser();
  }, [user, authLoading]);

  return (
    <UserContext.Provider value={{ dbUser, loading, refreshUser: fetchDbUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);
