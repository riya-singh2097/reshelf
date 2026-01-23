import firebaseConfig from "../firebase/firebaseConfig";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  sendEmailVerification,
} from "firebase/auth";
import { toast } from "react-toastify";

const Config = firebaseConfig;

const firebaseApp = initializeApp(Config);
const fireabaseAuth = getAuth(firebaseApp);

const googleProvider = new GoogleAuthProvider();

const FirebaseContext = createContext(null);

export const FirebaseProvider = (props) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
// console.log("user: ",user);

  //register user
  const createUser = async (email, password) =>
    await createUserWithEmailAndPassword(fireabaseAuth, email, password);
  //login user
  const signInUser = async (email, password) =>
    await signInWithEmailAndPassword(fireabaseAuth, email, password);
  //signup with google
  const signupWithGoogle = async () =>
    await signInWithPopup(fireabaseAuth, googleProvider);

  //forgot password
  const forgotPassword = async (email) => {
    if (email) {
      // console.log("inside forgot password");
      await sendPasswordResetEmail(fireabaseAuth, email)
        .then(() => {
          toast.success(
            "Password reset email sent! If you don't see it, please check your spam folder.",
            {
              autoClose: 10000,
            }
          );
        })
        .catch((error) => {
          const errorMessage = error.message;
          toast.error(errorMessage);
        });
    } else {
      toast.error("Please enter email !");
    }
  };

  //verify user
  const verifyEmail = async (userToVerify) => {
    if (!userToVerify) return;
    try {
      await sendEmailVerification(userToVerify);
      toast.success("Verification email sent!");
    } catch (error) {
      toast.error(error.message);
    }
  };

const refreshUser = async () => {
  if (user) {
    await user.reload();
    console.log("new user data: ", user);
    
  }
};

  //logout user
  const logout = () => {
    signOut(fireabaseAuth);
    toast.success("Logged Out Successfully!");
  };

  //track of login or logout state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(fireabaseAuth, (user) => {
      console.log("Auth state changed:", user);
      setUser(user);
console.log("user: ",user);

      setLoading(false);
    });

    return unsubscribe;//provided by firebase to limit the checking of auth state change 
  }, []);

  // console.log("user:",user);

 const value = useMemo(() => ({
  createUser,
  signInUser,
  signupWithGoogle,
  logout,
  user,
  loading,
  forgotPassword,
  verifyEmail,
  refreshUser
}), [user, loading]);

  return (
    <FirebaseContext.Provider value={value}>
      {props.children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => useContext(FirebaseContext);
