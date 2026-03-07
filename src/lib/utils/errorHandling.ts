import { AxiosError } from "axios";

/**
 * Type guard to check if an error is an AxiosError
 */
export function isAxiosError(error: unknown): error is AxiosError {
  return (
    typeof error === "object" &&
    error !== null &&
    "isAxiosError" in error &&
    (error as AxiosError).isAxiosError === true
  );
}

/**
 * Type guard to check if an error has a response with data
 */
export function hasErrorResponse(
  error: unknown,
): error is AxiosError<{ error?: string; message?: string }> {
  return (
    isAxiosError(error) &&
    error.response !== undefined &&
    error.response.data !== undefined
  );
}

/**
 * Extracts a user-friendly error message from an error object
 * Handles Axios errors, Error objects, and unknown types
 */
export function getErrorMessage(
  error: unknown,
  defaultMessage: string = "An error occurred",
): string {
  // Handle Axios errors with response
  if (hasErrorResponse(error)) {
    return (
      error.response?.data.error ||
      error.response?.data.message ||
      error.message ||
      defaultMessage
    );
  }

  // Handle Axios errors without response (network errors)
  if (isAxiosError(error)) {
    return error.message || defaultMessage;
  }

  // Handle standard Error objects
  if (error instanceof Error) {
    return error.message || defaultMessage;
  }

  // Handle string errors
  if (typeof error === "string") {
    return error || defaultMessage;
  }

  // Fallback for unknown error types
  return defaultMessage;
}
