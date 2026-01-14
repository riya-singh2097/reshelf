import {  useState } from "react";
import { useFirebase } from "../context/FirebaseContext";
import { useNavigate } from "react-router";

const VerifyEmailInstructionsPage = () => {
  const { user, refreshUser } = useFirebase();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const navigate = useNavigate();


  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshUser(); // This now updates the global state
      if(user.emailVerified){
        navigate("/complete-profile")
      }
      
    } catch (error) {
      console.error("Reload failed", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // useEffect(() => {
  //   // Poll every 3 seconds
  //   const interval = setInterval(async () => {
  //     try {
  //       await refreshUser();
  //     } catch (e) {
  //       console.error("Polling error", e);
  //     }
  //   }, 5000);

  //   return () => clearInterval(interval);
  // }, [refreshUser]);

  return (
    <div className="h-screen flex flex-col items-center justify-center p-10 bg-base-200 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold">Please Verify Your Email</h2>
      <p className="py-4">Sent to: <strong>{user?.email}</strong></p>
      <button 
        className={`btn btn-primary ${isRefreshing ? 'loading' : ''}`} 
        onClick={handleManualRefresh}
      >
        Click to proceed after verification
      </button>
    </div>
  );
};

export default VerifyEmailInstructionsPage