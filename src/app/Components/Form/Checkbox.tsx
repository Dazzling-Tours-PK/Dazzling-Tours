"use client";
import React, { forwardRef, useEffect, useState } from "react";

export interface CheckboxProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type" | "size" | "onChange" | "onBlur" | "onFocus" | "checked"
> {
  label?: string;
  description?: string;
  error?: string;
  size?: "xs" | "sm" | "md" | "lg";
  disabled?: boolean;
  className?: string;
  indeterminate?: boolean;
  children?: React.ReactNode;
  // Form integration props
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  onBlur?: () => void;
  onFocus?: () => void;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label,
      description,
      error,
      size = "md",
      disabled = false,
      className = "",
      indeterminate = false,
      children,
      // Form integration props
      checked: formChecked,
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
      xs: "form-checkbox-xs",
      sm: "form-checkbox-sm",
      md: "form-checkbox-md",
      lg: "form-checkbox-lg",
    };

    const labelSizeClasses = {
      xs: "form-text-xs",
      sm: "form-text-sm",
      md: "form-text-sm",
      lg: "form-text-base",
    };

    React.useEffect(() => {
      if (ref && "current" in ref && ref.current) {
        ref.current.indeterminate = indeterminate;
      }
    }, [indeterminate, ref]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const checked = e.target.checked;

      // Call form onChange if provided (for form integration)
      if (formOnChange) {
        formOnChange(checked);
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

    return (
      <div className="form-group">
        <div className="form-flex form-items-start form-gap-3">
          <div className="form-relative form-flex-shrink-0 form-mt-05">
            <input
              ref={ref}
              type="checkbox"
              className={`
                ${sizeClasses[size]}
                form-checkbox-base
                ${internalError ? "form-input-error" : ""}
                ${className}
              `.trim()}
              disabled={disabled}
              checked={formChecked !== undefined ? formChecked : false}
              onChange={handleChange}
              onBlur={handleBlur}
              onFocus={handleFocus}
              {...props}
            />

            {/* Custom checkmark */}
            <div className="form-absolute form-inset-0 form-flex form-items-center form-justify-center form-pointer-events-none">
              <i className="bi bi-check form-text-white form-text-xs form-opacity-0 form-transition-opacity"></i>
            </div>
          </div>

          <div className="form-flex-1">
            {label && (
              <label
                className={`form-label form-cursor-pointer ${
                  labelSizeClasses[size]
                } ${disabled ? "form-text-gray-500" : ""}`}
              >
                {label}
              </label>
            )}

            {description && (
              <p className="form-description form-mt-1">{description}</p>
            )}

            {children && <div className="form-mt-1">{children}</div>}
          </div>
        </div>

        {internalError && (
          <p className="form-error form-mt-2">
            <i className="bi bi-exclamation-circle form-error-icon"></i>
            {internalError}
          </p>
        )}
      </div>
    );
  },
);

Checkbox.displayName = "Checkbox";

export default Checkbox;
