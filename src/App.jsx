import { Outlet} from 'react-router-dom'
import Navbar from "./components/Navbar.jsx";
import { Footer } from "./components/Footer.jsx";
import { ToastContainer, toast } from 'react-toastify';
import Loading from './components/Loading.jsx';
import { useFirebase } from './context/FirebaseContext.jsx';
function App() {
// console.log("app ");
   const {loading}=useFirebase()
  return (

    <>
      <Navbar/>
      <main >
        {loading?<Loading/>:<Outlet/>}
      </main>
       <ToastContainer
       position="top-center"
       hideProgressBar
       autoClose={3000} />
      <Footer/>

    </>
  )
}



export default App
