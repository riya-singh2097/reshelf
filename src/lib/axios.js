import axios from "axios";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

// Helper function to ensure Firebase is ready before the interceptor runs
const getFirebaseUser = () => {
  const auth = getAuth();
  return new Promise((resolve) => {
    // If already loaded, return immediately
    if (auth.currentUser) {
      resolve(auth.currentUser);
      return;
    }
    // Otherwise, wait once for the state to change
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
};

api.interceptors.request.use(
  async (config) => {
    // 1. Wait for Firebase to determine if a user exists
    const firebaseUser = await getFirebaseUser();

    if (firebaseUser) {
      // 2. Feature: ALWAYS use Firebase token if user exists
      const token = await firebaseUser.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      // 3. Feature: Use adminToken ONLY if no Firebase user is active
      const adminToken = localStorage.getItem("adminToken");
      if (adminToken) {
        config.headers.Authorization = `Bearer ${adminToken}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;