// React and Routing Imports
import { useState } from "react";
import { Link, useNavigate } from "react-router";

// Form Handling and Validation Imports
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod/src/zod.js";
import * as zod from "zod";

// API and UI Utility Imports
import axios from "axios";
import toast from "react-hot-toast";

// Assets and Icon Imports
import bgImage from "../../assets/signup-bg-DGRfriy9.png";
import {
  Message,
  Image,
  Notification,
  People,
  Heart,
  User,
  Sms,
  Lock,
  Calendar,
} from "iconsax-reactjs";

/**
 * Zod Validation Schema for Registration Form
 *
 * Enforces rules for new accounts:
 * - Proper name formatting
 * - Unique username and valid email
 * - Complex passwords that must match
 * - User must be over 18 years old
 * - Valid gender selection
 */
const schema = zod
  .object({
    name: zod
      .string("name must be string")
      .regex(/^[a-zA-Z][a-zA-Z ]{2,20}$/, "Enter valid name")
      .nonempty("name is required"),
    username: zod.string(),
    email: zod.email("Email not valid"),
    password: zod
      .string()
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/,
        "password not valid",
      ),
    rePassword: zod.string(),
    dateOfBirth: zod.coerce
      .date()
      .refine(
        function (value) {
          const today = new Date();
          const age = today.getFullYear() - value.getFullYear();
          if (age > 18) {
            return true;
          }
          return false;
        },
        {
          error: "age must be above 18",
        },
      )
      .transform(function (value) {
        return value.toLocaleDateString("en-CA");
      }),
    gender: zod.enum(["male", "female"]),
  })
  .refine(
    function ({ password, rePassword }) {
      if (password === rePassword) {
        return true;
      }
      return false;
    },
    {
      error: "password and rePassword should be the same",
      path: ["rePassword"], // Attaches the error to the rePassword field
    },
  );

/**
 * Register Page Component
 *
 * Manages the multi-field user registration form.
 * Combines React Hook Form with Zod for robust client-side validation
 * before transmitting the payload to the server.
 */
export default function Register() {
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
      name: "",
      username: "",
      email: "",
      password: "",
      rePassword: "",
      dateOfBirth: "",
      gender: "",
    },
    mode: "all", // Validates on all input events (change, blur)
    resolver: zodResolver(schema),
  });

  /**
   * Submits the new user profile data to the server to create an account.
   * On success: redirects user to the Login page.
   * On error: displays a toast notification with the error message.
   *
   * @param {Object} x - The validated registration form data payload
   */
  async function sendUserRegister(x) {
    setIsLoading(true);

    // Automatically handles displaying Loading/Success/Error toast states
    toast.promise(
      axios.post(`${import.meta.env.VITE_BASE_URL}/users/signup`, x),
      {
        loading: "Creating account...",
        success: function (msgs) {
          myNavigate("/login");
          return <p className="text-green-600">{msgs.data.message}</p>;
        },
        error: function (msgs) {
          return (
            <p className="text-red-800">
              {msgs.response?.data?.error || "Registration failed"}
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
        <div
          className={`absolute inset-0 bg-[url(${bgImage})] opacity-20`}
        ></div>

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
            Join Our
            <br />
            Community Today
          </h1>
          <p className="text-blue-100 text-lg mb-12 max-w-md">
            Create an account to connect with friends, share updates, and
            discover new interests.
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
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white overflow-y-auto">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Create Account
            </h2>
            <p className="text-gray-500 text-sm">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-blue-600 hover:text-blue-700 font-semibold hover:underline"
              >
                Login
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit(sendUserRegister)} className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size="20" className="text-gray-400" />
                </div>
                <input
                  {...register("name")}
                  type="text"
                  placeholder="Enter your Name"
                  className={`w-full pl-10 pr-4 py-3 bg-gray-50 border ${
                    errors.name
                      ? "border-red-500 focus:ring-red-200"
                      : "border-gray-200 focus:ring-blue-200 focus:border-blue-500"
                  } rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 transition duration-200`}
                />
              </div>
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                User Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size="20" className="text-gray-400" />
                </div>
                <input
                  {...register("username")}
                  type="text"
                  placeholder="Enter your User Name"
                  className={`w-full pl-10 pr-4 py-3 bg-gray-50 border ${
                    errors.username
                      ? "border-red-500 focus:ring-red-200"
                      : "border-gray-200 focus:ring-blue-200 focus:border-blue-500"
                  } rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 transition duration-200`}
                />
              </div>
              {errors.username && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.username.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
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

            <div className="space-y-1">
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

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size="20" className="text-gray-400" />
                </div>
                <input
                  {...register("rePassword")}
                  type="password"
                  placeholder="Confirm your password"
                  className={`w-full pl-10 pr-4 py-3 bg-gray-50 border ${
                    errors.rePassword
                      ? "border-red-500 focus:ring-red-200"
                      : "border-gray-200 focus:ring-blue-200 focus:border-blue-500"
                  } rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 transition duration-200`}
                />
              </div>
              {errors.rePassword && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.rePassword.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">
                  Date of Birth
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar size="20" className="text-gray-400" />
                  </div>
                  <input
                    {...register("dateOfBirth")}
                    type="date"
                    className={`w-full pl-10 pr-4 py-3 bg-gray-50 border ${
                      errors.dateOfBirth
                        ? "border-red-500 focus:ring-red-200"
                        : "border-gray-200 focus:ring-blue-200 focus:border-blue-500"
                    } rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 transition duration-200`}
                  />
                </div>
                {errors.dateOfBirth && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.dateOfBirth.message}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">
                  Gender
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size="20" className="text-gray-400" />
                  </div>
                  <select
                    {...register("gender")}
                    className={`w-full pl-10 pr-4 py-3 bg-gray-50 border ${
                      errors.gender
                        ? "border-red-500 focus:ring-red-200"
                        : "border-gray-200 focus:ring-blue-200 focus:border-blue-500"
                    } rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 transition duration-200 appearance-none`}
                  >
                    <option value="" disabled>
                      Select Gender
                    </option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-500">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      ></path>
                    </svg>
                  </div>
                </div>
                {errors.gender && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.gender.message}
                  </p>
                )}
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-slate-600 hover:bg-slate-700 text-white font-semibold py-3.5 rounded-xl shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 group"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    Create Account{" "}
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
