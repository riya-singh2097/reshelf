import { lazy } from "react";
import { createBrowserRouter, Outlet } from "react-router";
import App from "../App.jsx";
const AuthGuard = lazy(() => import("./guards/AuthGuard.jsx"));
const GuestGuard = lazy(() => import("./guards/GuestGuard.jsx"));
const OnboardingGuard = lazy(() => import("./guards/OnboardingGuard.jsx"));
const EmailVerifyGuard = lazy(() => import("./guards/EmailVerifyGuard.jsx"));
const LandingPage = lazy(() => import("../pages/LandingPage.jsx"));
const Login = lazy(() => import("../components/landingpage/LoginModal.jsx"));
const Register = lazy(() =>
  import("../components/landingpage/RegisterModal.jsx")
);
const Dashboard = lazy(() => import("../pages/Dashboard.jsx"));
const Profile = lazy(() => import("../pages/Profile.jsx"));
const ProfileCompletion = lazy(() => import("../pages/ProfileCompletion.jsx"));
const ListBook = lazy(() => import("../pages/ListBook.jsx"));
const UpdateProfile = lazy(() => import("../pages/UpdateProfile.jsx"));
const VerifyEmailInstructionsPage = lazy(() =>
  import("../components/VerifyEmailInstructionsPage.jsx")
);


const router = createBrowserRouter([
  {
    path: "/",
    element: (
        <App />
    ),
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
          { path: "/dashboard", element: <Dashboard /> },
          { path: "/profile", element: <Profile /> },
          { path: "/listbook", element: <ListBook /> },
          { path: "/update-profile", element: <UpdateProfile /> },
        ],
      },

      {
        path: "/complete-profile",
        element: (
          <AuthGuard>
            <EmailVerifyGuard>
              <OnboardingGuard>
                <ProfileCompletion />
              </OnboardingGuard>
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
