import { useFirebase } from "../../context/FirebaseContext.jsx";
import Loading from "../../components/Loading.jsx";
import VerifyEmailInstructionsPage from "../../components/VerifyEmailInstructionsPage.jsx";

const EmailVerifyGuard = ({ children }) => {
  const { user, loading } = useFirebase();
// console.log("inside EmailVerifyGuard");

  if (loading) return <Loading />;

  // If no user, AuthGuard (if wrapped) should have handled this, 
  // but let's be safe:
  if (!user) return null; 

  // Check the flag directly. The Instructions page will handle the "refreshing" logic.
  if (!user.emailVerified) {
    // console.log("yaha se hote hue jaa raha haiVerifyEmailInstructionsPage ");
    
    return <VerifyEmailInstructionsPage />;
  }

  return children;
};

export default EmailVerifyGuard;