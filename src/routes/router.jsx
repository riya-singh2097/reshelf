import { lazy } from "react";
import { createBrowserRouter, Outlet } from "react-router";
import App from "../App.jsx";


const SearchPage = lazy(() => import("../pages/SearchPage.jsx"));
const OtherUserProfile = lazy(() => import("../pages/OtherUserProfile.jsx"));
const MessageContainer = lazy(
  () => import("../components/dashboard/MessageContainer.jsx"),
);
const AuthGuard = lazy(() => import("./guards/AuthGuard.jsx"));
const GuestGuard = lazy(() => import("./guards/GuestGuard.jsx"));
const AdminGuard = lazy(() => import("./guards/AdminGuard.jsx"));
const ShopGuard = lazy(() => import("./guards/ShopGuard.jsx"));
const OnboardingGuard = lazy(() => import("./guards/OnboardingGuard.jsx"));
const EmailVerifyGuard = lazy(() => import("./guards/EmailVerifyGuard.jsx"));
const LandingPage = lazy(() => import("../pages/LandingPage.jsx"));
const Login = lazy(() => import("../components/landingpage/LoginModal.jsx"));
const Register = lazy(
  () => import("../components/landingpage/RegisterModal.jsx"),
);
const Dashboard = lazy(() => import("../pages/Dashboard.jsx"));
const Profile = lazy(() => import("../pages/Profile.jsx"));
const ProfileCompletion = lazy(() => import("../pages/ProfileCompletion.jsx"));
const ListBook = lazy(() => import("../pages/ListBook.jsx"));
const UpdateProfile = lazy(() => import("../pages/UpdateProfile.jsx"));
const VerifyEmailInstructionsPage = lazy(
  () => import("../components/VerifyEmailInstructionsPage.jsx"),
);
const AdminDashboard = lazy(() => import("../pages/AdminDashboard.jsx"));
const AdminLogin = lazy(() => import("../pages/AdminLogin.jsx"));
const ShopDashboard = lazy(() => import("../pages/ShopDashboard.jsx"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: (
          <GuestGuard>
            <LandingPage />
          </GuestGuard>
        ),
        children: [
          {
            path: "/login",
            element: <Login />,
          },
          {
            path: "/register",
            element: <Register />,
          },
        ],
      },
      {
        path: "/admin-login",
        element: <AdminLogin />,
      },
      {
        element: <AdminGuard/>, // Only checks for adminToken + Admin Role
        children: [
          { path: "/admin", element: <AdminDashboard /> },
        ],
      },
      {
        element: (
          <AuthGuard>
            <EmailVerifyGuard>
              <OnboardingGuard>
                <Outlet />
              </OnboardingGuard>
            </EmailVerifyGuard>
          </AuthGuard>
        ),
        children: [
          {
            path: "/dashboard",
            element: <Dashboard />,
            children: [
              { path: "conversation/:id", element: <MessageContainer /> },
            ],
          },
          { path: "/search", element: <SearchPage /> },
          { path: "/profile", element: <Profile /> },
          { path: "/admin", element: <AdminDashboard /> },
          { path: "/profile/:id", element: <OtherUserProfile /> },
          { path: "/listbook", element: <ListBook /> },
          { path: "/update-profile", element: <UpdateProfile /> },
          {
            element: <ShopGuard />, 
            children: [
              { path: "/shop-dashboard", element: <ShopDashboard /> },
            ]
          },
        ],
      },

      {
        path: "/complete-profile",
        element: (
          <AuthGuard>
            <EmailVerifyGuard>
                <ProfileCompletion />
            </EmailVerifyGuard>
          </AuthGuard>
        ),
      },
      {
        path: "/verify",
        element: (
          <AuthGuard>
            <EmailVerifyGuard>
              <OnboardingGuard>
                <VerifyEmailInstructionsPage />
              </OnboardingGuard>
            </EmailVerifyGuard>
          </AuthGuard>
        ),
      },
    ],
  },
]);

export default router;
