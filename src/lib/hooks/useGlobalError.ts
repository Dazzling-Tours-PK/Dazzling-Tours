import {
  UseMutationOptions,
  UseQueryOptions,
  UseMutationResult,
  UseQueryResult,
} from "@tanstack/react-query";
import { useNotification } from "./useNotification";

// Higher-order function to wrap mutations with global error handling
export const withGlobalError = <TData, TError, TVariables, TContext>(
  mutationFn: (
    variables: TVariables,
    options?: UseMutationOptions<TData, TError, TVariables, TContext>,
  ) => UseMutationResult<TData, TError, TVariables, TContext>,
) => {
  return (
    variables: TVariables,
    options?: UseMutationOptions<TData, TError, TVariables, TContext>,
  ) => {
    const { showError } = useNotification();

    return mutationFn(variables, {
      ...options,
      onError: (
        error: TError,
        variables: TVariables,
        onMutateResult: TContext | undefined,
        context: unknown,
      ) => {
        // Call custom error handler if provided
        if (options?.onError) {
          (
            options.onError as (
              error: TError,
              variables: TVariables,
              onMutateResult: TContext | undefined,
              context: unknown,
            ) => void
          )(error, variables, onMutateResult, context);
        }

        // Show global error notification
        showError(
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
        );
      },
    });
  };
};

// Higher-order function to wrap queries with global error handling
export const withGlobalQueryError = <TData, TError>(
  queryFn: (
    options?: UseQueryOptions<TData, TError>,
  ) => UseQueryResult<TData, TError>,
) => {
  return (options?: UseQueryOptions<TData, TError>) => {
    return queryFn(options);
  };
};
