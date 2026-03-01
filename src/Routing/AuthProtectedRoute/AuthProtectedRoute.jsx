// Third-party Library Imports
import { Navigate } from "react-router";

/**
 * AuthProtectedRoute Component
 *
 * A routing guard designed specifically for authentication pages (Login, Register).
 * Validates whether a logged-in user is trying to access auth pages.
 * If the user is already authenticated (token exists), they are redirected to the home page.
 * Otherwise, the requested authentication component is rendered.
 *
 * @param {Object} props - Component properties
 * @param {React.ReactNode} props.children - The child component to render if unauthenticated
 */
export default function AuthProtectedRoute({ children }) {
  // Check if user is already logged in securely via token existence
  if (localStorage.getItem("token")) {
    return <Navigate to="/" />;
  }

  // Return the child component if no token is found
  return children;
}
