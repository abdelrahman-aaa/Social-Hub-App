// UI Components from HeroUI
import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from "@heroui/react";

// Icons
import { Aave, Android } from "iconsax-reactjs";

// React Hooks and Context Imports
import { useContext, useRef, useState } from "react";
import { AuthUserContext } from "../../Context/AuthContextProvider/AuthContextProvider";

// Routing and Networking Imports
import { Link, NavLink, useNavigate } from "react-router";
import toast from "react-hot-toast";
import axios from "axios";

/**
 * AppNavbar Component
 *
 * The main application navigation bar. It dynamically renders navigation links
 * and user profile actions depending on the authentication state.
 * Features:
 * - Responsive mobile menu
 * - User profile dropdown
 * - Profile image upload functionality
 */
export default function AppNavbar() {
  // Toggle state for the mobile responsive menu
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Access global user context for authentication state and refetching logic
  const { userData, setUserData, getUserData } = useContext(AuthUserContext);

  // React Router hook for programmatic navigation
  const router = useNavigate();

  // Ref for the hidden file input used in the profile image update
  const profileImage = useRef();

  /**
   * Handles user logout.
   * Clears local storage tokens, resets user state, and routes to login.
   */
  function handleLogOut() {
    localStorage.clear();
    setUserData(null);
    router("/login");
  }

  /**
   * Handles the profile image upload process.
   * Reads from the hidden file input, forms a multipart/form-data request,
   * uploads to the server, and triggers a user data refresh on success.
   */
  function handleProfileImage() {
    const myForm = new FormData();
    myForm.append("photo", profileImage.current.files[0]);

    toast.promise(
      axios.put(`${import.meta.env.VITE_BASE_URL}/users/upload-photo`, myForm, {
        headers: {
          token: localStorage.getItem("token"),
        },
      }),
      {
        loading: "Updating Profile Image...",
        success: function ({ data: { message } }) {
          // Refresh user data to display the new image across the app
          getUserData();
          return message;
        },
        error: function (error) {
          // Fixed undeclared error variable issue from original code
          return (
            error?.response?.data?.error || "Failed to update profile image"
          );
        },
      },
    );
  }

  return (
    <>
      <Navbar
        isBordered
        className=" bg-blue-200/40 py-3"
        onMenuOpenChange={setIsMenuOpen}
      >
        {/* Left Side: Brand and Mobile Toggle */}
        <NavbarContent>
          <NavbarMenuToggle
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="sm:hidden"
          />
          <NavbarBrand as={Link} to="/">
            <h3 className="text-2xl font-bold text-blue-500">Social Hub App</h3>
          </NavbarBrand>
        </NavbarContent>

        {/* Center: Main App Navigation Links */}
        <NavbarContent className="hidden sm:flex gap-4" justify="center">
          {/* Only show 'Posts' link if the user is authenticated */}
          {localStorage.getItem("token") && (
            <NavbarItem>
              <NavLink
                className={function ({ isActive }) {
                  return isActive
                    ? "text-blue-800 border-b-2 border-blue-500"
                    : "";
                }}
                to="Posts"
              >
                Posts
              </NavLink>
            </NavbarItem>
          )}
        </NavbarContent>

        {/* Right Side: Profile Dropdown or Login/Register Links */}
        <NavbarContent justify="end">
          {localStorage.getItem("token") ? (
            <NavbarItem>
              <Dropdown placement="bottom">
                <DropdownTrigger>
                  <Avatar
                    isBordered
                    as="button"
                    className="transition-transform cursor-pointer"
                    color="primary"
                    name={userData?.name || "User"}
                    size="md"
                    src={userData?.photo}
                  />
                </DropdownTrigger>
                <DropdownMenu
                  aria-label="Profile Actions"
                  variant="flat"
                  className="text-center"
                >
                  <DropdownItem key="profile" className="h-14 gap-2">
                    <p className="font-semibold">Signed in as</p>
                    <p className="font-semibold">{userData?.email}</p>
                  </DropdownItem>
                  <DropdownItem key="name">Name: {userData?.name}</DropdownItem>
                  <DropdownItem
                    key="Upload_Photo"
                    onClick={function () {
                      // Trigger hidden file input click
                      profileImage.current.click();
                    }}
                  >
                    Update Profile Photo
                  </DropdownItem>
                  <DropdownItem
                    key="Change_Password"
                    onClick={() => router("/change-password")}
                  >
                    Change Password
                  </DropdownItem>
                  <DropdownItem
                    key="logout"
                    onClick={handleLogOut}
                    color="danger"
                  >
                    Log Out
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </NavbarItem>
          ) : (
            <NavbarItem>
              <Button as={Link} color="primary" to="Register" variant="shadow">
                Sign Up
              </Button>
            </NavbarItem>
          )}
        </NavbarContent>

        {/* Mobile Navbar Menu items */}
        <NavbarMenu className="pt-4">
          {localStorage.getItem("token") ? (
            <NavbarMenuItem>
              <Link
                onClick={function () {
                  setIsMenuOpen(false);
                }}
                to="Posts"
              >
                Posts
              </Link>
            </NavbarMenuItem>
          ) : (
            <NavbarMenuItem>
              <Link
                onClick={function () {
                  setIsMenuOpen(false);
                }}
                to="register"
              >
                Sign Up
              </Link>
            </NavbarMenuItem>
          )}
        </NavbarMenu>
      </Navbar>

      {/* Hidden file input for handling profile photo uploads triggered via the dropdown menu */}
      <input
        type="file"
        className="hidden"
        onChange={handleProfileImage}
        ref={profileImage}
      />
    </>
  );
}
