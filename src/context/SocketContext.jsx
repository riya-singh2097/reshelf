import { createContext, useState, useEffect, useContext } from "react";
import io from "socket.io-client";
import { useUserContext } from "./UserContext"; // We need your dbUser ID

const SocketContext = createContext();

// Custom hook to use the socket easily
export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const { dbUser } = useUserContext();

    useEffect(() => {
        if (dbUser) {
            // Create socket connection
            // Pass the userId in the query so the backend can map it
            const socketInstance = io(import.meta.env.VITE_API_URL, {
                query: {
                    userId: dbUser._id,
                },
            });

            setSocket(socketInstance);

            // Listen for the online users list from the backend
            socketInstance.on("getOnlineUsers", (users) => {
                setOnlineUsers(users);
            });

            // Cleanup when user logs out or component unmounts
            return () => socketInstance.close();
        } else {
            // If there is no dbUser, close existing socket
            if (socket) {
                socket.close();
                setSocket(null);
            }
        }
    }, [dbUser]);

    return (
        <SocketContext.Provider value={{ socket, onlineUsers }}>
            {children}
        </SocketContext.Provider>
    );
};