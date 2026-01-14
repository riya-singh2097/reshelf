import googleImage from "../../assets/google.png"
import { useFirebase } from "../../context/FirebaseContext.jsx";
import {useState } from "react"
import {useNavigate,Link} from 'react-router-dom'
import {  toast } from 'react-toastify';


const Login = () => {
  
  const {signInUser,signupWithGoogle,forgotPassword} = useFirebase();
  const navigate = useNavigate()

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

 
  
  
  async function handleSubmit(e) {
   e.preventDefault();
    try {
      await signInUser(email, password);
      navigate('/dashboard')
    } catch (error) {
      console.error(error)
      // alert(error.message)
      toast.error(error.message)
    }
  } 

  async function  googleSignInHandler(){
    try {
      await signupWithGoogle()
      navigate('/dashboard')
    } catch (error) {
      console.error(error);
      toast.error(error.message,{
        autoClose: 6000
      })
    }
  }


  return (
    <dialog open className="modal " >
  <div className="modal-box card lg:w-3/6 items-center">
    <h1 className="card-title text-3xl font-bold mb-4 ">LOGIN</h1>

         <form onSubmit={handleSubmit} className=" flex flex-col form bg-secondary/20 p-8 w-full gap-8 rounded-lg ">
           <div className="form-control ">
             <input autoFocus
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
               placeholder="Enter Your Password"
               className="input input-bordered "
             />
           </div>
           <button className="btn btn-accent ">LOGIN</button>
         <p  className="text-center underline text-blue-600 cursor-pointer" onClick={()=>{forgotPassword(email)}}>Forgot password</p>
         </form>
       <div className="divider">OR</div>
       <button className="btn btn-primary px-8" onClick={googleSignInHandler}>Login with  <img src={googleImage} className="size-7" alt="google image" /></button>
       <div className="mt-2">Don't have a account? <Link to="/register" className="link text-center underline text-blue-600">Register</Link></div>
  </div>

  {/* CLICKING OUTSIDE CLOSES MODAL */}
  <form method="dialog" className="modal-backdrop backdrop-blur-lg" >
    <button onClick={()=>navigate("/")}></button>
  </form>
</dialog>

  );
};

export default Login;
