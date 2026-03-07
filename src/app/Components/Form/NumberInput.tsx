"use client";
import React, { forwardRef, useEffect, useState } from "react";

export interface NumberInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type" | "size" | "onChange" | "onBlur" | "onFocus" | "value"
> {
  label?: string;
  description?: string;
  error?: string;
  required?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  size?: "xs" | "sm" | "md" | "lg";
  variant?: "default" | "filled" | "unstyled";
  disabled?: boolean;
  className?: string;
  currency?: string;
  min?: number;
  max?: number;
  step?: number;
  precision?: number;
  validateOnChange?: boolean;
  validator?: (value: number) => string | undefined;
  // Form integration props
  value?: number;
  onChange?: (value: number) => void;
  onBlur?: () => void;
  onFocus?: () => void;
}

const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
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
      currency,
      min,
      max,
      step = 1,
      precision = 2,
      validateOnChange = false,
      validator,
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

    const baseClasses = `
      form-input-base
      ${sizeClasses[size]}
      ${variantClasses[variant]}
      ${internalError ? "form-input-error" : ""}
      ${className}
    `.trim();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value;

      // Handle precision if specified
      if (precision !== undefined && value.includes(".")) {
        const parts = value.split(".");
        if (parts[1] && parts[1].length > precision) {
          value = parts[0] + "." + parts[1].substring(0, precision);
        }
      }

      e.target.value = value;
      const numericValue = parseFloat(value) || 0;

      // Run validation if enabled and validator is provided
      if (validateOnChange && validator && hasBeenTouched) {
        const validationError = validator(numericValue);
        setInternalError(validationError);
      }

      // Call form onChange if provided (for form integration)
      if (formOnChange) {
        formOnChange(numericValue);
      }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setHasBeenTouched(true);

      // Run validation on blur if validator is provided
      if (validator) {
        const numericValue = parseFloat(e.target.value) || 0;
        const validationError = validator(numericValue);
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
          {currency && <div className="form-input-currency">{currency}</div>}

          {leftIcon && !currency && (
            <div className="form-input-icon-left">{leftIcon}</div>
          )}

          <input
            ref={ref}
            type="number"
            className={`${baseClasses} ${
              currency || leftIcon ? "form-input-with-left-icon" : ""
            } ${rightIcon ? "form-input-with-right-icon" : ""}`}
            disabled={disabled}
            min={min}
            max={max}
            step={step}
            value={formValue !== undefined ? formValue : ""}
            onChange={handleChange}
            onBlur={handleBlur}
            onFocus={handleFocus}
            {...props}
          />

          {rightIcon && (
            <div className="form-input-icon-right">{rightIcon}</div>
          )}
        </div>

        {internalError && (
          <p className="form-error">
            <i className="bi bi-exclamation-circle form-error-icon"></i>
            {internalError}
          </p>
        )}
      </div>
    );
  },
);

NumberInput.displayName = "NumberInput";

export default NumberInput;
