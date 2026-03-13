"use client";
import { useState, useCallback, useRef, useEffect } from "react";
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
  persistKey?: string;
}

export interface UseFormReturn<T extends object> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  dirty: Partial<Record<keyof T, boolean>>;
  isValid: boolean;
  isSubmitting: boolean;
  isDirty: boolean;
  setFieldValue: <K extends keyof T>(
    field: K,
    value: T[K],
    options?: { shouldMarkDirty?: boolean },
  ) => void;
  setFieldError: <K extends keyof T>(
    field: K,
    error: string | undefined,
  ) => void;
  setFieldTouched: <K extends keyof T>(field: K, touched: boolean) => void;
  setValues: (
    values: Partial<T>,
    options?: {
      shouldMarkDirty?: boolean;
      shouldReinitialize?: boolean;
      baselineSyncOnly?: boolean;
    },
  ) => void;
  setErrors: (errors: Partial<Record<keyof T, string>>) => void;
  setTouched: (touched: Partial<Record<keyof T, boolean>>) => void;
  setDirty: (isDirty: boolean) => void;
  reset: () => void;
  clearDraft: () => void;
  validate: () => boolean;
  validateField: <K extends keyof T>(field: K) => boolean;
  handleSubmit: (
    onSubmit?: (values: T) => void | Promise<void>,
  ) => (e: React.FormEvent) => Promise<void>;
  getFieldProps: <K extends keyof T>(
    field: K,
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
  persistKey,
}: UseFormOptions<T>): UseFormReturn<T> {
  const [values, setValuesState] = useState<T>(initialValues);
  const [errors, setErrorsState] = useState<Partial<Record<keyof T, string>>>(
    {},
  );
  const [touched, setTouchedState] = useState<
    Partial<Record<keyof T, boolean>>
  >({});
  const [dirty, setDirtyState] = useState<Partial<Record<keyof T, boolean>>>(
    {},
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const initialValuesRef = useRef(initialValues);
  const isInitialized = useRef(false);

  // Load from localStorage on mount
  useEffect(() => {
    if (persistKey && typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(persistKey);
        if (saved) {
          const parsed = JSON.parse(saved);
          setValuesState((prev) => ({ ...prev, ...parsed }));
        }
      } catch (e) {
        console.error("Failed to load form draft:", e);
      }
    }
    isInitialized.current = true;
  }, [persistKey]);

  // Save to localStorage on change
  useEffect(() => {
    if (persistKey && isInitialized.current && typeof window !== "undefined") {
      localStorage.setItem(persistKey, JSON.stringify(values));
    }
  }, [values, persistKey]);

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
        setErrorsState((prev) => {
          const newErrors = { ...prev };
          if (fieldError) {
            newErrors[field] = fieldError;
          } else {
            delete newErrors[field];
          }
          return newErrors;
        });
      }

      return !fieldError;
    },
    [values, validate, errors],
  );

  // Set field value
  const setFieldValue = useCallback(
    <K extends keyof T>(
      field: K,
      value: T[K],
      options?: { shouldMarkDirty?: boolean },
    ) => {
      setValuesState((prev) => ({ ...prev, [field]: value }));

      if (options?.shouldMarkDirty !== false) {
        setDirtyState((prev) => ({
          ...prev,
          [field]: value !== initialValuesRef.current[field],
        }));
      }

      if (validateOnChange) {
        validateField(field);
      }
    },
    [validateOnChange, validateField],
  );

  // Set field error
  const setFieldError = useCallback(
    <K extends keyof T>(field: K, error: string | undefined) => {
      setErrorsState((prev) => {
        const newErrors = { ...prev };
        if (error) {
          newErrors[field] = error;
        } else {
          delete newErrors[field];
        }
        return newErrors;
      });
    },
    [],
  );

  // Set field touched
  const setFieldTouched = useCallback(
    <K extends keyof T>(field: K, touched: boolean) => {
      setTouchedState((prev) => ({ ...prev, [field]: touched }));

      if (touched && validateOnBlur) {
        validateField(field);
      }
    },
    [validateOnBlur, validateField],
  );

  // Set multiple values
  const setValues = useCallback(
    (
      newValues: Partial<T>,
      options?: {
        shouldMarkDirty?: boolean;
        shouldReinitialize?: boolean;
        baselineSyncOnly?: boolean;
      },
    ) => {
      if (!options?.baselineSyncOnly) {
        setValuesState((prev) => ({ ...prev, ...newValues }));
      }

      if (options?.shouldReinitialize || options?.baselineSyncOnly) {
        initialValuesRef.current = {
          ...initialValuesRef.current,
          ...newValues,
        };
        // Reset dirty state for fields that were just synced
        setDirtyState((prev) => {
          const newDirty = { ...prev };
          Object.keys(newValues).forEach((key) => {
            delete newDirty[key as keyof T];
          });
          return newDirty;
        });
        return;
      }

      if (options?.shouldMarkDirty !== false) {
        setDirtyState((prev) => {
          const newDirty = { ...prev };
          Object.keys(newValues).forEach((key) => {
            const field = key as keyof T;
            newDirty[field] =
              newValues[field] !== initialValuesRef.current[field];
          });
          return newDirty;
        });
      }
    },
    [],
  );

  // Set multiple errors
  const setErrors = useCallback(
    (newErrors: Partial<Record<keyof T, string>>) => {
      setErrorsState(newErrors);
    },
    [],
  );

  // Set multiple touched
  const setTouched = useCallback(
    (newTouched: Partial<Record<keyof T, boolean>>) => {
      setTouchedState(newTouched);
    },
    [],
  );

  // Set dirty state manually
  const setDirty = useCallback((isDirty: boolean) => {
    if (!isDirty) {
      setDirtyState({});
    } else {
      // Mark all as dirty if needed, but usually we just want to clear it
      const allDirty = Object.keys(values).reduce(
        (acc, key) => {
          acc[key as keyof T] = true;
          return acc;
        },
        {} as Partial<Record<keyof T, boolean>>,
      );
      setDirtyState(allDirty);
    }
  }, [values]);

  // Reset form
  const reset = useCallback(() => {
    setValuesState(initialValuesRef.current);
    setErrorsState({});
    setTouchedState({});
    setDirtyState({});
    setIsSubmitting(false);
  }, []);

  // Clear localStorage draft
  const clearDraft = useCallback(() => {
    if (persistKey && typeof window !== "undefined") {
      localStorage.removeItem(persistKey);
    }
  }, [persistKey]);

  // Handle form submission
  const handleSubmit = useCallback(
    (customOnSubmit?: (values: T) => void | Promise<void>) => {
      return async (e: React.FormEvent) => {
        e.preventDefault();

        // Mark all fields as touched
        const allTouched = Object.keys(values).reduce(
          (acc, key) => {
            acc[key as keyof T] = true;
            return acc;
          },
          {} as Partial<Record<keyof T, boolean>>,
        );
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
              `[name="${firstErrorField}"], [id="${firstErrorField}"]`,
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
        } catch {
        } finally {
          setIsSubmitting(false);
        }
      };
    },
    [values, validateForm, onSubmit, onValidationError, validate],
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
    [values, errors, setFieldValue, setFieldTouched],
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
    setDirty,
    reset,
    clearDraft,
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
