"use client";
import React, { forwardRef, useEffect, useState, useRef } from "react";

export interface SelectProps
  extends Omit<
    React.SelectHTMLAttributes<HTMLSelectElement>,
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
  placeholder?: string;
  data?: Array<{ value: string; label: string; disabled?: boolean }>;
  searchable?: boolean;
  clearable?: boolean;
  validateOnChange?: boolean;
  validator?: (value: string) => string | undefined;
  // Form integration props
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
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
      placeholder,
      data,
      children,
      searchable = false,
      clearable = false,
      validateOnChange = false,
      validator,
      // Form integration props
      value: formValue,
      onChange: formOnChange,
      onBlur: formOnBlur,
      onFocus: formOnFocus,
      ...props
    },
    ref
  ) => {
    const [internalError, setInternalError] = useState<string | undefined>(
      error
    );
    const [hasBeenTouched, setHasBeenTouched] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedLabel, setSelectedLabel] = useState("");
    const dropdownRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Update internal error when external error changes
    useEffect(() => {
      setInternalError(error);
    }, [error]);

    // Update selected label when value changes
    useEffect(() => {
      if (formValue && data) {
        const selectedItem = data.find((item) => item.value === formValue);
        if (selectedItem) {
          setSelectedLabel(selectedItem.label);
        }
      } else {
        setSelectedLabel("");
      }
    }, [formValue, data]);

    // Close dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
          setSearchTerm("");
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);

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

    // Filter data based on search term
    const filteredData =
      data?.filter((item) =>
        item.label.toLowerCase().includes(searchTerm.toLowerCase())
      ) || [];

    const handleChange = (value: string) => {
      // Run validation if enabled and validator is provided
      if (validateOnChange && validator && hasBeenTouched) {
        const validationError = validator(value);
        setInternalError(validationError);
      }

      // Call form onChange if provided (for form integration)
      if (formOnChange) {
        formOnChange(value);
      }

      setIsOpen(false);
      setSearchTerm("");
    };

    const handleBlur = () => {
      setHasBeenTouched(true);

      // Run validation on blur if validator is provided
      if (validator && formValue) {
        const validationError = validator(formValue);
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

    const handleClear = (e: React.MouseEvent) => {
      e.stopPropagation();
      handleChange("");
    };

    const handleToggleDropdown = () => {
      if (disabled) return;
      setIsOpen(!isOpen);
      if (!isOpen && inputRef.current) {
        inputRef.current.focus();
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleToggleDropdown();
      } else if (e.key === "Escape") {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    // If not searchable, render as regular select
    if (!searchable) {
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
            <select
              ref={ref}
              className={`${baseClasses} form-input-with-right-icon`}
              disabled={disabled}
              value={formValue !== undefined ? formValue : ""}
              onChange={(e) => handleChange(e.target.value)}
              onBlur={handleBlur}
              onFocus={handleFocus}
              {...props}
            >
              {placeholder && (
                <option value="" disabled>
                  {placeholder}
                </option>
              )}

              {data
                ? data.map((item) => (
                    <option
                      key={item.value}
                      value={item.value}
                      disabled={item.disabled}
                    >
                      {item.label}
                    </option>
                  ))
                : children}
            </select>

            {/* Custom dropdown arrow */}
            <div className="form-input-icon-right">
              <i className="bi bi-chevron-down form-text-gray-400"></i>
            </div>
          </div>

          {internalError && (
            <p className="form-error">
              <i className="bi bi-exclamation-circle form-error-icon"></i>
              {internalError}
            </p>
          )}
        </div>
      );
    }

    // Searchable select implementation
    return (
      <div className="form-group">
        {label && (
          <label className="form-label">
            {label}
            {required && <span className="form-required">*</span>}
          </label>
        )}

        {description && <p className="form-description">{description}</p>}

        <div className="form-input-container" ref={dropdownRef}>
          <div
            className={`${baseClasses} form-input-with-right-icon searchable-select-trigger`}
            onClick={handleToggleDropdown}
            onKeyDown={handleKeyDown}
            tabIndex={disabled ? -1 : 0}
            role="combobox"
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            aria-controls={isOpen ? "select-options-list" : undefined}
          >
            <span className={!selectedLabel ? "text-muted" : ""}>
              {selectedLabel || placeholder || "Select an option..."}
            </span>

            <div className="form-input-icon-right">
              {clearable && formValue && (
                <button
                  type="button"
                  className="btn-clear"
                  onClick={handleClear}
                  aria-label="Clear selection"
                >
                  <i className="bi bi-x-circle"></i>
                </button>
              )}
              <i
                className={`bi bi-chevron-${
                  isOpen ? "up" : "down"
                } form-text-gray-400`}
              ></i>
            </div>
          </div>

          {isOpen && (
            <div className="searchable-select-dropdown">
              <div className="searchable-select-search">
                <input
                  ref={inputRef}
                  type="text"
                  className="form-control"
                  placeholder="Search options..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") {
                      setIsOpen(false);
                      setSearchTerm("");
                    }
                  }}
                />
                <i className="bi bi-search search-icon"></i>
              </div>

              <div className="searchable-select-options">
                {filteredData.length > 0 ? (
                  filteredData.map((item) => (
                    <div
                      key={item.value}
                      className={`searchable-select-option ${
                        item.value === formValue ? "selected" : ""
                      } ${item.disabled ? "disabled" : ""}`}
                      onClick={() => !item.disabled && handleChange(item.value)}
                    >
                      {item.label}
                      {item.value === formValue && (
                        <i className="bi bi-check selected-icon"></i>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="searchable-select-no-results">
                    No options found
                  </div>
                )}
              </div>
            </div>
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
  }
);

Select.displayName = "Select";

export default Select;
