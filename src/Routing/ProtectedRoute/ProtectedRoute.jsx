// Third-party Library Imports
import { Navigate } from "react-router";

/**
 * ProtectedRoute Component
 *
 * A routing guard designed to protect application-specific pages (e.g., Posts, Profile).
 * Validates whether a user is authenticated before granting access.
 * If the user is authenticated (token exists), the requested component is rendered.
 * Otherwise, they are redirected to the login page.
 *
 * @param {Object} props - Component properties
 * @param {React.ReactNode} props.children - The child component to render if authenticated
 */
export default function ProtectedRoute({ children }) {
  // Check if the user is authenticated via stored token
  if (localStorage.getItem("token")) {
    return children;
  }

  // Redirect unauthenticated users to the login page
  return <Navigate to="/login" />;
}
