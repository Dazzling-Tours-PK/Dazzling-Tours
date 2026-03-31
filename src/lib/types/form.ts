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
