// Third-party Library Imports
import axios from "axios";
import { createContext, useEffect, useState } from "react";

/**
 * Authentication Context
 *
 * Provides a global state for the user's authentication data and actions.
 * Used by components to check if a user is logged in, and to access user details.
 */
export const AuthUserContext = createContext();

/**
 * Authentication Context Provider Component
 *
 * Wraps the parts of the application that need access to authentication state.
 * It manages fetching the user profile data using a stored token.
 *
 * @param {Object} props - Component properties
 * @param {React.ReactNode} props.children - Child components to render inside the provider
 */
export default function AuthContextProvider({ children }) {
  // State to hold the current logged-in user's profile data
  const [userData, setUserData] = useState(null);

  // State to hold the authentication token, initialized from localStorage
  const [token, setToken] = useState(function () {
    return localStorage.getItem("token");
  });

  /**
   * Effect Hook: Initialization
   * Runs once when the provider mounts. If a token exists in localStorage,
   * it attempts to fetch the latest user data from the server.
   */
  useEffect(function () {
    if (localStorage.getItem("token")) {
      getUserData();
    }
  }, []);

  /**
   * Fetches the user profile data from the API endpoint.
   * Requires a valid token in the request headers.
   * On success, updates the `userData` state.
   * On failure (e.g., token expired), sets `userData` to null.
   *
   * @returns {Promise<Object|null>} The user data object if successful, null otherwise
   */
  async function getUserData() {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/users/profile-data`,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        },
      );
      // Update state with the fetched user information
      setUserData(response.data.data.user);
      return response.data.user;
    } catch (error) {
      // Clear user data if fetching fails
      setUserData(null);
      return null;
    }
  }

  return (
    <>
      {/* Provide userData state and related actions to the component tree */}
      <AuthUserContext.Provider value={{ userData, setUserData, getUserData }}>
        {children}
      </AuthUserContext.Provider>
    </>
  );
}
