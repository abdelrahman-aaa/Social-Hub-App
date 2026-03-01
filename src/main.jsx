// React Imports
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// Third-party Library Imports
import { RouterProvider } from "react-router";
import { Toaster } from "react-hot-toast";
import { HeroUIProvider } from "@heroui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "react-loading-skeleton/dist/skeleton.css";

// Local Context and Routing Imports
import AuthContextProvider from "./Context/AuthContextProvider/AuthContextProvider";
import { myRouter } from "./Routing/AppRouter";

// Global Styles
import "./index.css";

// Initialize React Query Client for API state management
const queryClient = new QueryClient();

/**
 * Application Root Render
 *
 * Wraps the main application with essential providers:
 * - QueryClientProvider: Manages data fetching and caching state across the app.
 * - AuthContextProvider: Manages and provides user authentication state globally.
 * - HeroUIProvider: Provides the design system and UI components theming.
 * - RouterProvider: Manages application page routing.
 */
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        <HeroUIProvider>
          {/* Main Application Router */}
          <RouterProvider router={myRouter} />

          {/* Global Toast Notifications */}
          <Toaster />
        </HeroUIProvider>
      </AuthContextProvider>
    </QueryClientProvider>
  </StrictMode>,
);
