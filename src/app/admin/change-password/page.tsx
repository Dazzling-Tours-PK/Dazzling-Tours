"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth, useNotification, useForm } from "@/lib/hooks";
import { Page, Stack, Group, Button, Card } from "@/app/Components/Common";
import { TextInput } from "@/app/Components/Form";

const ChangePasswordPage = () => {
  const { changePassword, isAuthenticated, user, logout } = useAuth();
  const { showSuccess, showError } = useNotification();
  const router = useRouter();

  const form = useForm({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validate: (values) => {
      const errors: Record<string, string> = {};

      if (!values.currentPassword) {
        errors.currentPassword = "Current password is required";
      }

      if (!values.newPassword) {
        errors.newPassword = "New password is required";
      } else if (values.newPassword.length < 6) {
        errors.newPassword = "Password must be at least 6 characters long";
      }

      if (!values.confirmPassword) {
        errors.confirmPassword = "Please confirm your new password";
      } else if (values.newPassword !== values.confirmPassword) {
        errors.confirmPassword = "Passwords do not match";
      }

      if (
        values.currentPassword &&
        values.newPassword &&
        values.currentPassword === values.newPassword
      ) {
        errors.newPassword =
          "New password must be different from current password";
      }

      return errors;
    },
    validateOnChange: true,
    validateOnBlur: true,
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/admin/login");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.validate()) {
      return;
    }

    try {
      const result = await changePassword(
        form.values.currentPassword,
        form.values.newPassword,
      );

      if (result.success) {
        showSuccess(
          "Password changed successfully! You will be redirected to the login page.",
        );
        // Clear form
        form.reset();

        // Redirect after delay
        setTimeout(() => {
          logout();
          router.push("/admin/login");
        }, 300);
      } else {
        showError(result.message || "Password change failed");
        if (result.message?.toLowerCase().includes("current password")) {
          form.setFieldError("currentPassword", result.message);
        }
      }
    } catch {
      showError("Password change failed. Please try again.");
    }
  };

  if (!isAuthenticated) {
    return (
      <Page
        title="Change Password"
        description="Update your account password"
        loading={true}
      >
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <p>Redirecting to login...</p>
        </div>
      </Page>
    );
  }

  return (
    <Page
      title="Change Password"
      description={`Update your password for ${user?.email || "your account"}`}
      headerActions={
        <Button variant="outline" onClick={() => router.back()}>
          <i className="bi bi-arrow-left"></i> Back
        </Button>
      }
    >
      <form onSubmit={handleSubmit}>
        <Stack>
          <Card padding="xl">
            <TextInput
              label="Current Password"
              type="password"
              {...form.getFieldProps("currentPassword")}
              placeholder="Enter your current password"
              required
              autoComplete="current-password"
            />

            <TextInput
              label="New Password"
              type="password"
              {...form.getFieldProps("newPassword")}
              placeholder="Enter your new password"
              description="Password must be at least 6 characters long"
              required
              autoComplete="new-password"
            />

            <TextInput
              label="Confirm New Password"
              type="password"
              {...form.getFieldProps("confirmPassword")}
              placeholder="Confirm your new password"
              required
              autoComplete="new-password"
            />

            <Group style={{ marginTop: "1.5rem", justifyContent: "flex-end" }}>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={
                  !form.values.currentPassword ||
                  !form.values.newPassword ||
                  !form.values.confirmPassword ||
                  !form.isValid
                }
              >
                <i className="bi bi-key"></i> Change Password
              </Button>
            </Group>
          </Card>
        </Stack>
      </form>
    </Page>
  );
};

export default ChangePasswordPage;
