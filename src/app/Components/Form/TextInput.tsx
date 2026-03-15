"use client";
import React, { forwardRef, useEffect, useState } from "react";

export interface TextInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "size" | "onChange" | "onBlur" | "onFocus" | "value"
> {
  label?: string;
  description?: string;
  error?: string;
  required?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  variant?: "default" | "filled" | "unstyled";
  disabled?: boolean;
  className?: string;
  validateOnChange?: boolean;
  validator?: (value: string) => string | undefined;
  maxLength?: number;
  showCharCount?: boolean;
  // Form integration props
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
}

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  (
    {
      label,
      description,
      error,
      required = false,
      leftIcon,
      rightIcon,
      size = "md",
      variant = "default",
      disabled = false,
      className = "",
      validateOnChange = false,
      validator,
      maxLength,
      showCharCount = false,
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
    const [hasBeenTouched, setHasBeenTouched] = useState(false);

    // Update internal error when external error changes
    useEffect(() => {
      setInternalError(error);
    }, [error]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;

      // Run validation if enabled and validator is provided
      if (validateOnChange && validator && hasBeenTouched) {
        const validationError = validator(value);
        setInternalError(validationError);
      }

      // Call form onChange if provided (for form integration)
      if (formOnChange) {
        formOnChange(value);
      }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setHasBeenTouched(true);

      // Run validation on blur if validator is provided
      if (validator) {
        const validationError = validator(e.target.value);
        setInternalError(validationError);
      }

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

    const sizeClasses = {
      xs: "form-input-xs",
      sm: "form-input-sm",
      md: "form-input-md",
      lg: "form-input-lg",
      xl: "form-input-xl",
    };

    const variantClasses = {
      default: "form-input-default",
      filled: "form-input-filled",
      unstyled: "form-input-unstyled",
    };

    const baseClasses = `
      form-input-base
      ${sizeClasses[size]}
      ${variantClasses[variant]}
      ${internalError ? "form-input-error" : ""}
      ${className}
    `.trim();

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
          {leftIcon && <div className="form-input-icon-left">{leftIcon}</div>}

          <input
            ref={ref}
            className={`${baseClasses} ${
              leftIcon ? "form-input-with-left-icon" : ""
            } ${rightIcon ? "form-input-with-right-icon" : ""}`}
            disabled={disabled}
            value={currentValue}
            onChange={handleChange}
            onBlur={handleBlur}
            onFocus={handleFocus}
            maxLength={maxLength}
            {...props}
          />

          {rightIcon && (
            <div className="form-input-icon-right">{rightIcon}</div>
          )}
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

        {internalError && !showCharCount && !maxLength && (
          <p className="form-error">
            <i className="bi bi-exclamation-circle form-error-icon"></i>
            {internalError}
          </p>
        )}
      </div>
    );
  },
);

TextInput.displayName = "TextInput";

export default TextInput;
