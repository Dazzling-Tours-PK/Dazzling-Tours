import { z } from "zod";

// Contact form validation schema
export const contactSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters")
    .trim(),

  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .max(100, "Email must be less than 100 characters")
    .trim(),

  phone: z
    .string()
    .min(1, "Phone number is required")
    .min(10, "Phone number must be at least 10 digits")
    .max(20, "Phone number must be less than 20 characters")
    .regex(/^[\+]?[1-9][\d]{0,15}$/, "Please enter a valid phone number")
    .trim(),

  subject: z
    .string()
    .min(1, "Subject is required")
    .min(3, "Subject must be at least 3 characters")
    .max(200, "Subject must be less than 200 characters")
    .trim(),

  message: z
    .string()
    .min(1, "Message is required")
    .min(10, "Message must be at least 10 characters")
    .max(1000, "Message must be less than 1000 characters")
    .trim(),
});

// Blog comment schema
export const commentSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters")
    .trim(),

  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .max(100, "Email must be less than 100 characters")
    .trim(),

  comment: z
    .string()
    .min(1, "Comment is required")
    .min(5, "Comment must be at least 5 characters")
    .max(500, "Comment must be less than 500 characters")
    .trim(),
});

// Testimonial schema
export const testimonialSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters")
    .trim(),

  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .max(100, "Email must be less than 100 characters")
    .trim(),

  rating: z
    .number()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating must be at most 5"),

  message: z
    .string()
    .min(1, "Testimonial message is required")
    .min(10, "Testimonial must be at least 10 characters")
    .max(500, "Testimonial must be less than 500 characters")
    .trim(),

  tourId: z.string().optional(),
});

// Auth schemas
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .trim(),

  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),

    newPassword: z
      .string()
      .min(1, "New password is required")
      .min(6, "New password must be at least 6 characters")
      .max(100, "New password must be less than 100 characters"),

    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .trim(),
});

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(1, "Password is required")
      .min(6, "Password must be at least 6 characters")
      .max(100, "Password must be less than 100 characters"),

    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// Type inference from schemas
export type ContactFormData = z.infer<typeof contactSchema>;
export type CommentFormData = z.infer<typeof commentSchema>;
export type TestimonialFormData = z.infer<typeof testimonialSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

// Validation helper functions
export const validateContactData = (data: unknown) => {
  return contactSchema.safeParse(data);
};

export const validateCommentData = (data: unknown) => {
  return commentSchema.safeParse(data);
};

export const validateTestimonialData = (data: unknown) => {
  return testimonialSchema.safeParse(data);
};

export const validateLoginData = (data: unknown) => {
  return loginSchema.safeParse(data);
};

export const validateChangePasswordData = (data: unknown) => {
  return changePasswordSchema.safeParse(data);
};

export const validateForgotPasswordData = (data: unknown) => {
  return forgotPasswordSchema.safeParse(data);
};

export const validateResetPasswordData = (data: unknown) => {
  return resetPasswordSchema.safeParse(data);
};
