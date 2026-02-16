import { useState } from "react";
import googleImage from "../../assets/google.png";
import { useFirebase } from "../../context/FirebaseContext.jsx";
import { useNavigate,Link } from "react-router-dom";
import { toast } from "react-toastify";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { user,createUser, signupWithGoogle, verifyEmail } = useFirebase();
  const navigate = useNavigate();

  async function googleSignUpHandler() {
    localStorage.removeItem("adminToken");
    try {
       await signupWithGoogle();
      navigate("/complete-profile", { state: { isNewUser: true } });
    } catch (error) {
      console.error(error);
        toast.error(error.message,{
        autoClose: 6000
      })
    }
  }

async function handleSubmit(e) {
  localStorage.removeItem("adminToken");
  e.preventDefault();
  try {
    if (password === confirmPassword) {
      // 1. Create user (Firebase signs them in automatically)
      const result = await createUser(email, confirmPassword);
      
      // 2. Send verification email
      // The URL here is where they land AFTER clicking the link
      await verifyEmail(result.user); 
      
      // 3. Stay on the registration page but show a persistent message
      toast.info("Account created! Please check your email. Once you click the link, you'll be sent to complete your profile.", {
        autoClose: 10000, 
      });

      navigate("/verify")

    } else {
      toast.error("Passwords do not match");
    }
  } catch (error) {
    console.error(error);
    
    toast.error(error.code);
    toast.error(error.message)
  }
}

  return (
    <dialog open className="modal">
      <div className="modal-box card lg:w-3/6 items-center">
        <h1 className="card-title text-3xl font-bold mb-2 ">REGISTER</h1>

        <form
          onSubmit={handleSubmit}
          className=" flex flex-col form bg-secondary/20 p-8 w-full gap-4 rounded-lg "
        >
          <div className="form-control">
            <input
              autoFocus
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              placeholder="Enter Your Email"
              className="input input-bordered "
            />
          </div>
          <div className="form-control">
            <input
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              placeholder="Set Password"
              className="input input-bordered "
            />
          </div>
          <div className="form-control">
            <input
              type="password"
              onChange={(e) => setConfirmPassword(e.target.value)}
              value={confirmPassword}
              placeholder="Confirm Password"
              className="input input-bordered "
            />
          </div>
          <button className="btn btn-accent ">REGISTER</button>
         
        </form>

        <div className="divider">OR</div>

        <button className="btn btn-primary px-8" onClick={googleSignUpHandler}>
          Register with
          <img src={googleImage} className="size-7" alt="google image" />
        </button>

        <div className="mt-6">
          Already have a account?
          <Link to="/login"
           
            className="text-center underline text-blue-600"
          >
            Login
          </Link>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop backdrop-blur-lg">
        <button onClick={()=>navigate("/")}></button>
      </form>
    </dialog>
  );
};

export default Register;
