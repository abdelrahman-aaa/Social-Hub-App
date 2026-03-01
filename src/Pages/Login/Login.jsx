// React and Routing Imports
import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router";

// Form Handling and Validation Imports
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod/src/zod.js";
import * as zod from "zod";

// API and UI Utility Imports
import axios from "axios";
import toast from "react-hot-toast";

// Context and Icon Imports
import { AuthUserContext } from "../../Context/AuthContextProvider/AuthContextProvider";
import {
  Message,
  Image,
  Notification,
  People,
  Heart,
  Sms,
  Lock,
} from "iconsax-reactjs";

/**
 * Zod Validation Schema for Login Form
 *
 * Enforces:
 * - Valid email format
 * - Password complexity (min 8 chars, max 16, requires uppercase, lowercase, number, and special character)
 */
const schema = zod.object({
  email: zod.email("Email not valid"),
  password: zod
    .string()
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/,
      "password not valid",
    ),
});

/**
 * Login Page Component
 *
 * Handles user authentication by securely transmitting credentials to the server.
 * Provides a responsive split-screen design with app features highlighted on the left
 * and the login form on the right.
 */
export default function Login() {
  // Global auth state for setting user data upon successful login
  const { setUserData } = useContext(AuthUserContext);

  // Local state for tracking form submission progress
  const [isLoading, setIsLoading] = useState(false);

  // React Router hook for programmatic navigation
  const myNavigate = useNavigate();

  // Initialize React Hook Form with Zod integration
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "all", // Validates on all input events (change, blur)
    resolver: zodResolver(schema),
  });

  /**
   * Submits the user credentials to authenticate against the server.
   * On success: stores JWT token, updates global context, redirects to Home.
   * On error: displays a toast notification with the error message.
   *
   * @param {Object} x - The validated form data (email, password)
   */
  async function sendUserLogin(x) {
    setIsLoading(true);

    // Automatically handles displaying Loading/Success/Error toast states
    toast.promise(
      axios.post(`${import.meta.env.VITE_BASE_URL}/users/signin`, x),
      {
        loading: "Signing in...",
        success: function (msgs) {
          localStorage.setItem("token", msgs.data.data.token);
          setUserData(msgs.data.data.user);
          myNavigate("/");
          return <p className="text-green-600">{msgs.data.message}</p>;
        },
        error: function (msgs) {
          return (
            <p className="text-red-800">
              {msgs.response?.data?.errors || "Login failed"}
            </p>
          );
        },
      },
    );

    setIsLoading(false);
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <title>Social Hub App</title>
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-600 to-indigo-900 relative overflow-hidden flex-col justify-between p-12 text-white">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>

        <div className="absolute top-10 left-10 w-32 h-32 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-10 right-10 w-32 h-32 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-12">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-lg flex items-center justify-center font-bold text-xl">
              S
            </div>
            <span className="text-2xl font-bold tracking-tight">SocialHub</span>
          </div>

          <h1 className="text-5xl font-bold leading-tight mb-4">
            Welcome Back
            <br />
            to SocialHub App
          </h1>
          <p className="text-blue-100 text-lg mb-12 max-w-md">
            Sign in to connect people all over the world and share your moments.
          </p>

          <div className="grid grid-cols-2 gap-4 mb-12">
            <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 hover:bg-white/20 transition duration-300">
              <Message
                size="32"
                className="text-green-400 mb-3"
                variant="Bold"
              />
              <h3 className="font-semibold mb-1">Real-time Chat</h3>
              <p className="text-xs text-blue-200">Instant messaging</p>
            </div>
            <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 hover:bg-white/20 transition duration-300">
              <Image
                size="32"
                className="text-purple-400 mb-3"
                variant="Bold"
              />
              <h3 className="font-semibold mb-1">Share Media</h3>
              <p className="text-xs text-blue-200">Photos & videos</p>
            </div>
            <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 hover:bg-white/20 transition duration-300">
              <Notification
                size="32"
                className="text-red-400 mb-3"
                variant="Bold"
              />
              <h3 className="font-semibold mb-1">Smart Alerts</h3>
              <p className="text-xs text-blue-200">Stay updated</p>
            </div>
            <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 hover:bg-white/20 transition duration-300">
              <People
                size="32"
                className="text-yellow-400 mb-3"
                variant="Bold"
              />
              <h3 className="font-semibold mb-1">Communities</h3>
              <p className="text-xs text-blue-200">Find your tribe</p>
            </div>
          </div>

          <div className="flex gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 font-bold text-xl">
                <People size="20" variant="Bold" /> 2M+
              </div>
              <div className="text-sm text-blue-200">Active Users</div>
            </div>
            <div>
              <div className="flex items-center gap-2 font-bold text-xl">
                <Heart size="20" variant="Bold" /> 10M+
              </div>
              <div className="text-sm text-blue-200">Posts Shared</div>
            </div>
            <div>
              <div className="flex items-center gap-2 font-bold text-xl">
                <Message size="20" variant="Bold" /> 50M+
              </div>
              <div className="text-sm text-blue-200">Messages Sent</div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 relative">
            <div className="flex text-yellow-400 text-sm mb-3">★ ★ ★ ★ ★</div>
            <p className="mb-4 italic text-blue-100">
              "SocialHub has completely changed how I connect with friends and
              discover new communities. The experience is seamless!"
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-orange-500 flex items-center justify-center overflow-hidden">
                <img
                  src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                  alt="User"
                />
              </div>
              <div>
                <div className="font-semibold">Alex Johnson</div>
                <div className="text-xs text-blue-200">Product Designer</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Login</h2>
            <p className="text-gray-500 text-sm">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-blue-600 hover:text-blue-700 font-semibold hover:underline"
              >
                Sign up
              </Link>
            </p>
          </div>

          <div className="flex gap-4 mb-8">
            <button
              type="button"
              className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition duration-300"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              <span className="text-gray-700 font-medium text-sm">Google</span>
            </button>
            <button
              type="button"
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#1877F2] text-white rounded-xl hover:bg-[#166fe5] transition duration-300"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036c-2.148 0-2.971.742-2.971 2.28v1.692h4.626l-.62 3.667h-4.006v7.98H9.101Z" />
              </svg>
              <span className="font-medium text-sm">Facebook</span>
            </button>
          </div>

          <div className="relative flex items-center gap-4 mb-8">
            <div className="h-px bg-gray-200 flex-1"></div>
            <span className="text-gray-400 text-xs font-medium uppercase">
              or continue with email
            </span>
            <div className="h-px bg-gray-200 flex-1"></div>
          </div>

          <form onSubmit={handleSubmit(sendUserLogin)} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Sms size="20" className="text-gray-400" />
                </div>
                <input
                  {...register("email")}
                  type="email"
                  placeholder="name@example.com"
                  className={`w-full pl-10 pr-4 py-3 bg-gray-50 border ${
                    errors.email
                      ? "border-red-500 focus:ring-red-200"
                      : "border-gray-200 focus:ring-blue-200 focus:border-blue-500"
                  } rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 transition duration-200`}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size="20" className="text-gray-400" />
                </div>
                <input
                  {...register("password")}
                  type="password"
                  placeholder="Create a strong password"
                  autoComplete="new-password"
                  className={`w-full pl-10 pr-4 py-3 bg-gray-50 border ${
                    errors.password
                      ? "border-red-500 focus:ring-red-200"
                      : "border-gray-200 focus:ring-blue-200 focus:border-blue-500"
                  } rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 transition duration-200`}
                />
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-slate-600 hover:bg-slate-700 text-white font-semibold py-3.5 rounded-xl shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 group"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    Sign in{" "}
                    <span className="group-hover:translate-x-1 transition-transform">
                      →
                    </span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
