"use client";
import React, { forwardRef, useEffect, useState } from "react";

export interface TextareaProps extends Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  "size" | "onChange" | "onBlur" | "onFocus" | "value"
> {
  label?: string;
  description?: string;
  error?: string;
  required?: boolean;
  size?: "xs" | "sm" | "md" | "lg";
  variant?: "default" | "filled" | "unstyled";
  disabled?: boolean;
  className?: string;
  maxLength?: number;
  showCharCount?: boolean;
  resize?: "none" | "vertical" | "horizontal" | "both";
  // Form integration props
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      description,
      error,
      required = false,
      size = "md",
      variant = "default",
      disabled = false,
      className = "",
      maxLength,
      showCharCount = false,
      resize = "vertical",
      // Form integration props
      value: formValue,
      onChange: formOnChange,
      onBlur: formOnBlur,
      onFocus: formOnFocus,
      ...props
    },
    ref,
  ) => {
    const [internalError, setInternalError] = useState<string | undefined>(
      error,
    );

    // Update internal error when external error changes
    useEffect(() => {
      setInternalError(error);
    }, [error]);

    const sizeClasses = {
      xs: "form-input-xs",
      sm: "form-input-sm",
      md: "form-input-md",
      lg: "form-input-lg",
    };

    const variantClasses = {
      default: "form-input-default",
      filled: "form-input-filled",
      unstyled: "form-input-unstyled",
    };

    const resizeClasses = {
      none: "form-resize-none",
      vertical: "form-resize-y",
      horizontal: "form-resize-x",
      both: "form-resize",
    };

    const baseClasses = `
      form-input-base
      ${sizeClasses[size]}
      ${variantClasses[variant]}
      ${resizeClasses[resize]}
      ${internalError ? "form-input-error" : ""}
      ${className}
    `.trim();

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value;

      // Call form onChange if provided (for form integration)
      if (formOnChange) {
        formOnChange(value);
      }
    };

    const handleBlur = () => {
      // Call form onBlur if provided (for form integration)
      if (formOnBlur) {
        formOnBlur();
      }
    };

    const handleFocus = () => {
      // Call form onFocus if provided (for form integration)
      if (formOnFocus) {
        formOnFocus();
      }
    };

    const currentValue = formValue !== undefined ? formValue : "";
    const currentLength = currentValue ? String(currentValue).length : 0;

    return (
      <div className="form-group">
        {label && (
          <label className="form-label">
            {label}
            {required && <span className="form-required">*</span>}
          </label>
        )}

        {description && <p className="form-description">{description}</p>}

        <div className="form-input-container">
          <textarea
            ref={ref}
            className={baseClasses}
            disabled={disabled}
            maxLength={maxLength}
            value={currentValue}
            onChange={handleChange}
            onBlur={handleBlur}
            onFocus={handleFocus}
            {...props}
          />
        </div>

        {(showCharCount || maxLength) && (
          <div className="form-flex form-justify-between form-items-center form-mt-1">
            {internalError && (
              <p className="form-error">
                <i className="bi bi-exclamation-circle form-error-icon"></i>
                {internalError}
              </p>
            )}
            <div className="form-text-xs form-text-gray-500 form-ml-auto">
              {currentLength}
              {maxLength ? `/${maxLength}` : ""} characters
            </div>
          </div>
        )}

        {error && !showCharCount && !maxLength && (
          <p className="form-error">
            <i className="bi bi-exclamation-circle form-error-icon"></i>
            {error}
          </p>
        )}
      </div>
    );
  },
);

Textarea.displayName = "Textarea";

export default Textarea;
