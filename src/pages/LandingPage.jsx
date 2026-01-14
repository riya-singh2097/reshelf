import Hero from "../components/landingpage/Hero"
import  About  from "../components/landingpage/About"
import  Contact  from "../components/landingpage/Contact"
import { Outlet, useNavigate } from "react-router"
import { useFirebase } from "../context/FirebaseContext"


const LandingPage = () => {
console.log("landing page ");
// const {user}= useFirebase()
// console.log("user in landing page", user);
// const navigate = useNavigate();
// if(user) navigate("/dashboard")


    return (
        <>  
            <Outlet/> 
            <Hero/>
            <About/>
            <Contact/>
        </>
    )
}

export default LandingPage