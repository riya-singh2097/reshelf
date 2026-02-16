import axios from "axios";
import { getAuth } from "firebase/auth";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

api.interceptors.request.use(async (config) => {
  const auth = getAuth();
  const firebaseUser = auth.currentUser;

  if (firebaseUser) {
    // If a Firebase user exists, ALWAYS use their token for regular routes
    const token = await firebaseUser.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    // Only use adminToken if NO Firebase user is active
    const adminToken = localStorage.getItem("adminToken");
    if (adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
    }
  }
  return config;
}, (error) => Promise.reject(error));

export default api;