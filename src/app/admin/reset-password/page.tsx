"use client";
import React, { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth, useNotification, useForm } from "@/lib/hooks";
import {
  LoginCard,
  CardHeader,
  LockIcon,
} from "../login/components/LoginComponents";
import { TextInput } from "@/app/Components/Form";
import { Button } from "@/app/Components/Common";

const ResetPasswordPage = () => {
  const { resetPassword } = useAuth();
  const { showSuccess, showError } = useNotification();
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") || "";

  const { isSubmitting, getFieldProps, handleSubmit, setFieldValue } = useForm({
    initialValues: {
      email: emailParam,
      otp: "",
      newPassword: "",
      confirmPassword: "",
    },
    validate: (values) => {
      const errs: Record<string, string> = {};
      if (!values.email) errs.email = "Email is required";
      if (!values.otp) errs.otp = "OTP is required";
      else if (values.otp.length !== 6) errs.otp = "OTP must be 6 digits";
      if (!values.newPassword) errs.newPassword = "New password is required";
      else if (values.newPassword.length < 6)
        errs.newPassword = "Password must be at least 6 characters";
      if (values.newPassword !== values.confirmPassword)
        errs.confirmPassword = "Passwords do not match";
      return errs;
    },
    onSubmit: async (values) => {
      try {
        const result = await resetPassword(
          values.email,
          values.otp,
          values.newPassword,
        );
        if (result.success) {
          showSuccess("Password reset successfully! You can now login.");
          router.push("/admin/login");
        } else {
          showError(result.message);
        }
      } catch {
        showError("Failed to reset password. Please try again.");
      }
    },
  });

  useEffect(() => {
    if (emailParam) setFieldValue("email", emailParam);
  }, [emailParam, setFieldValue]);

  return (
    <LoginCard>
      <CardHeader
        title="Reset Password"
        subtitle="Securely change your admin password"
        icon={<LockIcon size="md" />}
      />

      <form className="space-y-4" onSubmit={handleSubmit()}>
        <TextInput
          {...getFieldProps("email")}
          label="Admin Email"
          placeholder="admin@dazzlingtours.com"
          required
          size="xs"
          type="email"
          autoComplete="email"
          className="bg-gray-50/50 backdrop-blur-sm"
        />

        <TextInput
          {...getFieldProps("otp")}
          label="6-Digit OTP"
          placeholder="000000"
          required
          maxLength={6}
          size="xs"
          className="bg-gray-50/50 backdrop-blur-sm text-center tracking-[0.5em] font-bold text-lg"
        />

        <TextInput
          {...getFieldProps("newPassword")}
          label="New Password"
          placeholder="••••••••"
          required
          size="xs"
          type="password"
          className="bg-gray-50/50 backdrop-blur-sm"
        />

        <TextInput
          {...getFieldProps("confirmPassword")}
          label="Confirm New Password"
          placeholder="••••••••"
          required
          size="xs"
          type="password"
          className="bg-gray-50/50 backdrop-blur-sm"
        />

        <div className="pt-2">
          <Button
            type="submit"
            fullWidth
            loading={isSubmitting}
            size="xs"
            variant="filled"
            className="bg-gradient-to-r from-[#fd7d02] to-[#ff9d42] border-none text-white font-bold py-2.5 rounded-2xl shadow-lg shadow-orange-100/50 hover:shadow-orange-200/50 active:scale-[0.98] transition-all"
          >
            Reset Password
          </Button>
        </div>

        <div className="text-center pt-2">
          <Link
            href="/admin/login"
            className="text-xs font-bold text-gray-400 hover:text-gray-700 transition-colors inline-flex items-center group"
          >
            <svg
              className="w-4 h-4 mr-1.5 transition-transform group-hover:-translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Login
          </Link>
        </div>
      </form>
    </LoginCard>
  );
};

export default ResetPasswordPage;
