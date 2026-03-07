"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth, useNotification, useAdminSeed, useForm } from "@/lib/hooks";
import { LoginCard, CardHeader, LockIcon } from "./components/LoginComponents";
import { TextInput } from "@/app/Components/Form";
import { Button } from "@/app/Components/Common";
import { validationRules } from "./config/theme";

const LoginPage = () => {
  const { login, isAuthenticated } = useAuth();
  const { showSuccess, showError } = useNotification();
  const { mutate: seedAdmin } = useAdminSeed();
  const router = useRouter();

  const { isSubmitting, getFieldProps, handleSubmit } = useForm({
    initialValues: {
      email: "",
      password: "",
    },
    validate: (values) => {
      const errs: Record<string, string> = {};
      if (!values.email) {
        errs.email = "Email is required";
      } else if (!validationRules.email.pattern.test(values.email)) {
        errs.email = validationRules.email.message;
      }
      if (!values.password) {
        errs.password = "Password is required";
      } else if (values.password.length < validationRules.password.minLength) {
        errs.password = validationRules.password.message;
      }
      return errs;
    },
    onSubmit: async (values) => {
      try {
        const result = await login(values.email, values.password);
        if (result.success) {
          showSuccess("Login successful!");
          router.push("/admin");
        } else {
          showError(result.message);
        }
      } catch {
        showError("Login failed. Please try again.");
      }
    },
  });

  // Run seeder on first mount
  useEffect(() => {
    seedAdmin();
  }, [seedAdmin]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/admin");
    }
  }, [isAuthenticated, router]);

  return (
    <LoginCard>
      <CardHeader
        title="Admin Login"
        subtitle="Sign in to your admin account"
        icon={<LockIcon size="md" />}
      />

      <form onSubmit={handleSubmit()} className="space-y-4">
        <TextInput
          {...getFieldProps("email")}
          label="Email Address"
          placeholder="abc@example.com"
          required
          size="md"
          type="email"
          autoComplete="email"
          className="bg-gray-50/50 backdrop-blur-sm"
        />

        <TextInput
          {...getFieldProps("password")}
          label="Password"
          placeholder="••••••••"
          required
          size="md"
          type="password"
          autoComplete="current-password"
          className="bg-gray-50/50 backdrop-blur-sm"
        />

        <div className="flex justify-end pt-1">
          <Link
            href="/admin/forgot-password"
            className="text-xs font-bold text-[#fd7d02] hover:text-orange-600 transition-colors"
          >
            Forgot your password?
          </Link>
        </div>

        <Button
          type="submit"
          fullWidth
          loading={isSubmitting}
          size="md"
          variant="filled"
          className="bg-gradient-to-r from-[#fd7d02] to-[#ff9d42] border-none text-white font-bold rounded-2xl shadow-lg shadow-orange-100/50 hover:shadow-orange-200/50 active:scale-[0.98] transition-all"
        >
          Sign in
        </Button>
      </form>
    </LoginCard>
  );
};

export default LoginPage;
