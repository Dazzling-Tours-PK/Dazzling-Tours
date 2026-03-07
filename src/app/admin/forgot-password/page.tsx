"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useAuth, useNotification, useForm } from "@/lib/hooks";
import {
  LoginCard,
  CardHeader,
  LockIcon,
  CheckIcon,
} from "../login/components/LoginComponents";
import { TextInput } from "@/app/Components/Form";
import { Button, Stack } from "@/app/Components/Common";

const ForgotPasswordPage = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");
  const { forgotPassword } = useAuth();
  const { showSuccess, showError } = useNotification();

  const { isSubmitting, getFieldProps, handleSubmit } = useForm({
    initialValues: {
      email: "",
    },
    validate: (values) => {
      const errs: Record<string, string> = {};
      if (!values.email) {
        errs.email = "Email is required";
      } else if (
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
      ) {
        errs.email = "Invalid email address";
      }
      return errs;
    },
    onSubmit: async (values) => {
      try {
        const result = await forgotPassword(values.email);
        if (result.success) {
          showSuccess("OTP sent to your email!");
          setSubmittedEmail(values.email);
          setIsSuccess(true);
        } else {
          showError(result.message);
        }
      } catch {
        showError("Failed to send OTP. Please try again.");
      }
    },
  });

  if (isSuccess) {
    return (
      <LoginCard>
        <CardHeader
          title="Check Your Email"
          subtitle={
            <>
              We've sent a 6-digit verification code to <br />
              <span className="font-bold text-gray-900">{submittedEmail}</span>
            </>
          }
          icon={<CheckIcon size="md" />}
        />

        <div className="space-y-4">
          <div className="bg-orange-50/50 border border-orange-100 rounded-2xl p-4 text-center">
            <p className="text-xs text-orange-800 leading-relaxed">
              Please enter the code on the next screen to reset your password.
              The code will expire in 10 minutes.
            </p>
          </div>

          <Link
            href={`/admin/reset-password?email=${encodeURIComponent(submittedEmail)}`}
            className="block"
          >
            <Button
              fullWidth
              size="xs"
              variant="filled"
              className="bg-gradient-to-r from-[#026df7] to-[#4295ff] border-none text-white font-bold py-2.5 rounded-2xl shadow-lg shadow-blue-100/50 hover:shadow-blue-200/50 active:scale-[0.98] transition-all"
            >
              Proceed to Reset Password
            </Button>
          </Link>
        </div>
      </LoginCard>
    );
  }

  return (
    <LoginCard>
      <CardHeader
        title="Forgot Password?"
        subtitle="Enter your email to receive a password reset code"
        icon={<LockIcon size="md" />}
      />

      <form onSubmit={handleSubmit()}>
        <Stack>
          <TextInput
            {...getFieldProps("email")}
            label="Admin Email Address"
            placeholder="abc@example.com"
            required
            size="xs"
            type="email"
            autoComplete="email"
            className="bg-gray-50/50 backdrop-blur-sm"
          />

          <Button
            type="submit"
            fullWidth
            loading={isSubmitting}
            size="xs"
            variant="filled"
            className="bg-gradient-to-r from-[#fd7d02] to-[#ff9d42] border-none text-white font-bold py-2.5 rounded-2xl shadow-lg shadow-orange-100/50 hover:shadow-orange-200/50 active:scale-[0.98] transition-all"
          >
            Send Reset Code
          </Button>

          <div className="text-center">
            <Link
              href="/admin/login"
              className="text-xs font-bold text-gray-500 hover:text-gray-800 transition-colors flex items-center justify-center group"
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
        </Stack>
      </form>
    </LoginCard>
  );
};

export default ForgotPasswordPage;
