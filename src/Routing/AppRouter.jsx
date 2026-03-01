// Third-party Library Imports
import { createBrowserRouter } from "react-router";

// Layout and Common Components
import Layout from "../Components/Layout/Layout";
import NotFoundPage from "../Components/NotFoundPage/NotFoundPage";

// Route Guards
import ProtectedRoute from "./ProtectedRoute/ProtectedRoute";
import AuthProtectedRoute from "./AuthProtectedRoute/AuthProtectedRoute";

// Page Components
import Posts from "../Pages/Posts/Posts";
import Login from "../Pages/Login/Login";
import Register from "../Pages/Register/Register";
import PostDetails from "../Pages/PostDetails/PostDetails";
import ChangeUserPassword from "../Pages/ChangeUserPassword/ChangeUserPassword";

/**
 * Main Application Router Configuration
 *
 * Defines the routing structure for the entire application.
 * Uses `createBrowserRouter` for standard DOM history routing.
 *
 * Routes are wrapped in guard components:
 * - `ProtectedRoute`: Requires the user to be logged in (token exists)
 * - `AuthProtectedRoute`: Prevents logged-in users from accessing auth pages
 */
export const myRouter = createBrowserRouter([
  {
    path: "",
    element: <Layout />,
    children: [
      // Protected Routes (Require Authentication)
      {
        index: true,
        element: (
          <ProtectedRoute>
            <Posts />
          </ProtectedRoute>
        ),
      },
      {
        path: "posts",
        element: (
          <ProtectedRoute>
            <Posts />
          </ProtectedRoute>
        ),
      },
      {
        path: "postDetails/:details",
        element: (
          <ProtectedRoute>
            <PostDetails />
          </ProtectedRoute>
        ),
      },
      {
        path: "change-password",
        element: (
          <ProtectedRoute>
            <ChangeUserPassword />
          </ProtectedRoute>
        ),
      },

      // Auth Routes (Require Non-Authentication)
      {
        path: "login",
        element: (
          <AuthProtectedRoute>
            <Login />
          </AuthProtectedRoute>
        ),
      },
      {
        path: "register",
        element: (
          <AuthProtectedRoute>
            <Register />
          </AuthProtectedRoute>
        ),
      },

      // Fallback 404 Route
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
