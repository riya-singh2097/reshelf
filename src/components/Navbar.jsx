import { Library } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useFirebase } from "../context/FirebaseContext.jsx";
import { useUserContext } from "../context/UserContext.jsx";
import { useThemeContext } from "../context/ThemeContext.jsx";

const Navbar = () => {
  const { user } = useFirebase();
  const { dbUser,  loading:dbLoading, refreshUser} = useUserContext();
  const { theme, toggleTheme } = useThemeContext();

  return (
    <header className="w-full "  >
      <div className="flex justify-between bg-base-200 p-8 mx-auto gap-8">
        <div className="flex ">
          <Library className="size-8" />
          <h1 className="text-3xl font-bold">ReShelf</h1>
        </div>

        {/* when to show login btn on nav bar */}
        <div className="flex gap-4">
          {!user && (
            <div className="flex items-center md:gap-12 md:mr-8 max-md:gap-4">
              <Link to="/login" className="btn btn-accent px-10 max-md:hidden">
                Login
              </Link>
              <Link
                to="/register"
                className="btn btn-outline px-10 max-md:hidden"
              >
                Register
              </Link>
              <h2>
                <a href="/#about">About</a>
              </h2>
              <h2>
                <a href="/#contact">Contact</a>
              </h2>
            </div>
          )}

          {/* THEME controller */}
          <label className="swap swap-rotate">
            <input
              type="checkbox"
              className="theme-controller"
              value="synthwave"
              checked={theme === "night"}
              onChange={toggleTheme}
            />

            {/* sun icon */}
            <svg
              className="swap-off h-10 w-10 fill-current"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
            </svg>

            {/* moon icon */}
            <svg
              className="swap-on h-10 w-10 fill-current"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
            </svg>
          </label>

          {/* avatar if login - on dashboard */}
          {user && (
            <Link to="/profile" className="flex items-center" onClick={async ()=> await refreshUser()}>
              <div className="avatar">
                <div className="w-14 h-14 rounded-full ring-primary ring-offset-base-100 ring-2 ring-offset-2 flex items-center justify-center bg-base-300 overflow-hidden">
                  {dbUser? (dbLoading ? (
                    <div className="w-full h-full  flex justify-center items-center">
           <span className="loading loading-spinner loading-md text-primary"></span>
        </div>
                  ):(
                    <img
                      src={dbUser?.profilePhotoURL??"https://i.pinimg.com/736x/79/e8/9f/79e89fdc173fed118526a1d32e1aac61.jpg"}
                      alt="User Profile"
                      className="w-full h-full object-cover"
                    />
                  ) ):  <img
                      src={dbUser?.profilePhotoURL??"https://i.pinimg.com/736x/79/e8/9f/79e89fdc173fed118526a1d32e1aac61.jpg"}
                      alt="User Profile"
                      className="w-full h-full object-cover"
                    />}
                </div>
              </div>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
export default Navbar;
