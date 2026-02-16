import { Outlet, useLocation } from 'react-router-dom'; // Import useLocation
import Navbar from "./components/Navbar.jsx";
import { Footer } from "./components/Footer.jsx";
import { ToastContainer } from 'react-toastify';
import Loading from './components/Loading.jsx';
import { useFirebase } from './context/FirebaseContext.jsx';

function App() {
  const { loading } = useFirebase();
  const location = useLocation();

  // Define which paths should NOT show the Navbar/Footer
  const isAdminPath = location.pathname.startsWith('/admin');

  return (
    <>
      {loading && <Loading />}
      <div className='min-h-screen flex flex-col'>
        {/* Only show Navbar if NOT an admin path */}
        {!isAdminPath && <Navbar />}
        
        <main className="flex-grow">
          <Outlet />
        </main>
        
        <ToastContainer
          position="top-center"
          hideProgressBar
          autoClose={3000} />
          
        {/* Only show Footer if NOT an admin path */}
        {!isAdminPath && <Footer />}
      </div>
    </>
  );
}

export default App;