// UI Components from HeroUI
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Form,
  Input,
} from "@heroui/react";

// Icons
import { Lock1, Eye, EyeSlash } from "iconsax-reactjs";

// React and Form Handling
import { useState } from "react";
import { useForm } from "react-hook-form";

// Networking and Feedback
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

/**
 * ChangeUserPassword Page
 *
 * Allows an authenticated user to update their password.
 * Sends a PUT request to /users/change-password with the current
 * and new passwords. The form is cleared on success.
 *
 * Security enforced:
 *  - Current password verified server-side before any change is persisted
 *  - Min 8 characters enforced client-side and server-side
 *  - Password confirmation match validated before the request is sent
 *  - Toggle visibility per field to reduce typos
 */
export default function ChangeUserPassword() {
  // ── Visibility toggles for each password field ───────────────────────────
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // ── React Hook Form ───────────────────────────────────────────────────────
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      password: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Watch newPassword so the confirm field can compare against it
  const newPasswordValue = watch("newPassword");

  // ── Mutation ──────────────────────────────────────────────────────────────
  const { mutate, isPending } = useMutation({
    /**
     * PUT /users/change-password
     * Body: { password, newPassword }
     * Header: token
     */
    mutationFn: async ({ password, newPassword }) => {
      return axios.patch(
        `${import.meta.env.VITE_BASE_URL}/users/change-password`,
        { password, newPassword },
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        },
      );
    },

    onSuccess: ({ data }) => {
      toast.success(data?.message || "Password changed successfully");
      // Clear the form so no sensitive values remain in the inputs
      reset();
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.error ||
          error?.response?.data?.message ||
          "Failed to change password",
      );
    },
  });

  // ── Submit Handler ────────────────────────────────────────────────────────
  function onSubmit({ password, newPassword }) {
    // Only send password and newPassword — confirmPassword is client-only
    mutate({ password, newPassword });
  }

  // ── Helper: eye-toggle end-content for password inputs ───────────────────
  function EyeToggle({ show, onToggle }) {
    return (
      <button
        type="button"
        onClick={onToggle}
        className="text-default-400 hover:text-default-600 focus:outline-none"
        aria-label={show ? "Hide password" : "Show password"}
      >
        {show ? <EyeSlash size="18" /> : <Eye size="18" />}
      </button>
    );
  }

  // ── UI ────────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-md mx-auto mt-10">
      <title>Social Hub App</title>
      <Card className="bg-gray-400/60">
        {/* ── Header ── */}
        <CardHeader className="flex gap-3 items-center">
          <Lock1 size="28" className="text-primary" />
          <h1 className="text-xl font-bold">Change Password</h1>
        </CardHeader>
        <Divider />

        {/* ── Form ── */}
        <CardBody>
          <Form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-5"
          >
            {/* Current Password */}
            <Input
              label="Current Password"
              type={showCurrent ? "text" : "password"}
              isInvalid={!!errors.password}
              errorMessage={errors.password?.message}
              endContent={
                <EyeToggle
                  show={showCurrent}
                  onToggle={() => setShowCurrent((v) => !v)}
                />
              }
              {...register("password", {
                required: "Current password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
              })}
            />

            {/* New Password */}
            <Input
              label="New Password"
              type={showNew ? "text" : "password"}
              isInvalid={!!errors.newPassword}
              errorMessage={errors.newPassword?.message}
              endContent={
                <EyeToggle
                  show={showNew}
                  onToggle={() => setShowNew((v) => !v)}
                />
              }
              {...register("newPassword", {
                required: "New password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
                validate: (value) =>
                  value !== watch("password") ||
                  "New password must differ from the current one",
              })}
            />

            {/* Confirm New Password */}
            <Input
              label="Confirm New Password"
              type={showConfirm ? "text" : "password"}
              isInvalid={!!errors.confirmPassword}
              errorMessage={errors.confirmPassword?.message}
              endContent={
                <EyeToggle
                  show={showConfirm}
                  onToggle={() => setShowConfirm((v) => !v)}
                />
              }
              {...register("confirmPassword", {
                required: "Please confirm your new password",
                validate: (value) =>
                  value === newPasswordValue || "Passwords do not match",
              })}
            />

            {/* Submit */}
            <Button
              color="primary"
              className="w-full"
              type="submit"
              variant="shadow"
              isLoading={isPending}
            >
              Update Password
            </Button>
          </Form>
        </CardBody>
      </Card>
    </div>
  );
}
