"use client";
import { useState, useCallback, useRef } from "react";
import { z } from "zod";

export interface FormField<T = unknown> {
  value: T;
  error?: string;
  touched: boolean;
  dirty: boolean;
}

export interface FormState<T extends object> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  dirty: Partial<Record<keyof T, boolean>>;
  isValid: boolean;
  isSubmitting: boolean;
  isDirty: boolean;
}

export interface UseFormOptions<T extends object> {
  initialValues: T;
  validate?: (values: T) => Partial<Record<keyof T, string>>;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  onSubmit?: (values: T) => void | Promise<void>;
  onValidationError?: (errors: Partial<Record<keyof T, string>>) => void;
}

export interface UseFormReturn<T extends object> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  dirty: Partial<Record<keyof T, boolean>>;
  isValid: boolean;
  isSubmitting: boolean;
  isDirty: boolean;
  setFieldValue: <K extends keyof T>(field: K, value: T[K]) => void;
  setFieldError: <K extends keyof T>(
    field: K,
    error: string | undefined
  ) => void;
  setFieldTouched: <K extends keyof T>(field: K, touched: boolean) => void;
  setValues: (values: Partial<T>) => void;
  setErrors: (errors: Partial<Record<keyof T, string>>) => void;
  setTouched: (touched: Partial<Record<keyof T, boolean>>) => void;
  reset: () => void;
  validate: () => boolean;
  validateField: <K extends keyof T>(field: K) => boolean;
  handleSubmit: (
    onSubmit?: (values: T) => void | Promise<void>
  ) => (e: React.FormEvent) => Promise<void>;
  getFieldProps: <K extends keyof T>(
    field: K
  ) => {
    value: T[K];
    error: string | undefined;
    onChange: (value: T[K]) => void;
    onBlur: () => void;
    onFocus: () => void;
  };
}

export function useForm<T extends object>({
  initialValues,
  validate,
  validateOnChange = false,
  validateOnBlur = true,
  onSubmit,
  onValidationError,
}: UseFormOptions<T>): UseFormReturn<T> {
  const [values, setValuesState] = useState<T>(initialValues);
  const [errors, setErrorsState] = useState<Partial<Record<keyof T, string>>>(
    {}
  );
  const [touched, setTouchedState] = useState<
    Partial<Record<keyof T, boolean>>
  >({});
  const [dirty, setDirtyState] = useState<Partial<Record<keyof T, boolean>>>(
    {}
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const initialValuesRef = useRef(initialValues);

  // Calculate derived state
  const isValid = Object.keys(errors).length === 0;
  const isDirty = Object.keys(dirty).some((key) => dirty[key as keyof T]);

  // Validation function
  const validateForm = useCallback(() => {
    if (!validate) return true;

    const newErrors = validate(values);
    setErrorsState(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [values, validate]);

  // Field validation function
  const validateField = useCallback(
    <K extends keyof T>(field: K): boolean => {
      if (!validate) return true;

      const fieldErrors = validate(values);
      const fieldError = fieldErrors[field];

      if (fieldError !== errors[field]) {
        setErrorsState((prev) => ({ ...prev, [field]: fieldError }));
      }

      return !fieldError;
    },
    [values, validate, errors]
  );

  // Set field value
  const setFieldValue = useCallback(
    <K extends keyof T>(field: K, value: T[K]) => {
      setValuesState((prev) => ({ ...prev, [field]: value }));
      setDirtyState((prev) => ({
        ...prev,
        [field]: value !== initialValuesRef.current[field],
      }));

      if (validateOnChange) {
        validateField(field);
      }
    },
    [validateOnChange, validateField]
  );

  // Set field error
  const setFieldError = useCallback(
    <K extends keyof T>(field: K, error: string | undefined) => {
      setErrorsState((prev) => ({ ...prev, [field]: error }));
    },
    []
  );

  // Set field touched
  const setFieldTouched = useCallback(
    <K extends keyof T>(field: K, touched: boolean) => {
      setTouchedState((prev) => ({ ...prev, [field]: touched }));

      if (touched && validateOnBlur) {
        validateField(field);
      }
    },
    [validateOnBlur, validateField]
  );

  // Set multiple values
  const setValues = useCallback((newValues: Partial<T>) => {
    setValuesState((prev) => ({ ...prev, ...newValues }));
    setDirtyState((prev) => {
      const newDirty = { ...prev };
      Object.keys(newValues).forEach((key) => {
        const field = key as keyof T;
        newDirty[field] = newValues[field] !== initialValuesRef.current[field];
      });
      return newDirty;
    });
  }, []);

  // Set multiple errors
  const setErrors = useCallback(
    (newErrors: Partial<Record<keyof T, string>>) => {
      setErrorsState(newErrors);
    },
    []
  );

  // Set multiple touched
  const setTouched = useCallback(
    (newTouched: Partial<Record<keyof T, boolean>>) => {
      setTouchedState(newTouched);
    },
    []
  );

  // Reset form
  const reset = useCallback(() => {
    setValuesState(initialValuesRef.current);
    setErrorsState({});
    setTouchedState({});
    setDirtyState({});
    setIsSubmitting(false);
  }, []);

  // Handle form submission
  const handleSubmit = useCallback(
    (customOnSubmit?: (values: T) => void | Promise<void>) => {
      return async (e: React.FormEvent) => {
        e.preventDefault();

        // Mark all fields as touched
        const allTouched = Object.keys(values).reduce((acc, key) => {
          acc[key as keyof T] = true;
          return acc;
        }, {} as Partial<Record<keyof T, boolean>>);
        setTouchedState(allTouched);

        // Validate form
        const isValid = validateForm();

        // Get the latest errors after validation
        const latestErrors = validate ? validate(values) : {};

        if (!isValid) {
          // Call onValidationError callback if provided
          if (onValidationError) {
            onValidationError(latestErrors);
          }

          // Scroll to first error field if possible
          const firstErrorField = Object.keys(latestErrors)[0];
          if (firstErrorField) {
            // Try to find the input field by name or id
            const errorElement = document.querySelector(
              `[name="${firstErrorField}"], [id="${firstErrorField}"]`
            ) as HTMLElement;
            if (errorElement) {
              errorElement.scrollIntoView({
                behavior: "smooth",
                block: "center",
              });
              errorElement.focus();
            }
          }
          return;
        }

        setIsSubmitting(true);

        try {
          const submitHandler = customOnSubmit || onSubmit;
          if (submitHandler) {
            await submitHandler(values);
          }
        } catch (error) {
        } finally {
          setIsSubmitting(false);
        }
      };
    },
    [values, validateForm, onSubmit, onValidationError, validate]
  );

  // Get field props for form components
  const getFieldProps = useCallback(
    <K extends keyof T>(field: K) => {
      return {
        value: values[field],
        error: errors[field],
        onChange: (value: T[K]) => setFieldValue(field, value),
        onBlur: () => setFieldTouched(field, true),
        onFocus: () => setFieldTouched(field, false),
      };
    },
    [values, errors, setFieldValue, setFieldTouched]
  );

  return {
    values,
    errors,
    touched,
    dirty,
    isValid,
    isSubmitting,
    isDirty,
    setFieldValue,
    setFieldError,
    setFieldTouched,
    setValues,
    setErrors,
    setTouched,
    reset,
    validate: validateForm,
    validateField,
    handleSubmit,
    getFieldProps,
  };
}

// Zod integration helper
export function createZodForm<T extends z.ZodType>(schema: T) {
  return {
    validate: (values: z.infer<T>) => {
      const result = schema.safeParse(values);
      if (result.success) {
        return {};
      }

      const errors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path.join(".");
        errors[path] = issue.message;
      });

      return errors;
    },
  };
}
