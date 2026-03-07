"use client";
import {
  MutationCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";
import { useNotification } from "@/lib/hooks";

interface MutationContext {
  skipGlobalError?: boolean;
}

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const { showError } = useNotification();

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes
            retry: 1,
            refetchOnWindowFocus: false,
          },
          mutations: {
            retry: 1,
          },
        },
        mutationCache: new MutationCache({
          onError: (error, variables, context) => {
            console.error("Mutation error:", error);
            // Only show global error if no custom error handling is provided
            if (!(context as MutationContext)?.skipGlobalError) {
              showError(
                error.message ||
                  "An error occurred while processing your request",
              );
            }
          },
        }),
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
