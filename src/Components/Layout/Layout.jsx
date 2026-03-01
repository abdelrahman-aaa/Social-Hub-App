// Routing and Components Imports
import { Outlet, useLocation } from "react-router";
import AppNavbar from "../AppNavbar/AppNavbar";

/**
 * Global Layout Wrapper Component
 *
 * Provides structural consistency across the application by wrapping
 * all routes with the AppNavbar (conditionally) and maintaining the main view container.
 * It hides the Navbar on Authentication pages (Login/Register).
 */
export default function Layout() {
  // Use location hook to determine the current path and conditionally render UI
  const { pathname } = useLocation();

  return (
    <>
      <main>
        {/* Render AppNavbar only if the user is not on the login or register pages */}
        {pathname !== "/login" && pathname !== "/register" && <AppNavbar />}

        {/* Main Content Area where child routes are recursively rendered via React Router's Outlet */}
        <div className="min-h-screen overflow-auto">
          <Outlet />
        </div>
      </main>
    </>
  );
}
