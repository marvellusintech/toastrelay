"use client";

import {
  isServer,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { Toaster } from "sonner";

import { ApiError } from "@/app/_queries/api_client";
// import { toastError } from "@/lib/utils";

function makeQueryClient() {
  const seen = new Set<string>();

  return new QueryClient({
    queryCache: new QueryCache({
      onError: (error, query) => {
        if (error instanceof ApiError && error.suppressGlobalError) return;
        if (query.meta?.preventGlobalError) return;

        const message = error instanceof Error ? error.message : "Unknown error";
        const sig = `${query.queryHash}|${message}`;
        if (seen.has(sig)) return;

        seen.add(sig);
        setTimeout(() => seen.delete(sig), 3000);

        const rootKey = Array.isArray(query.queryKey)
          ? String(query.queryKey[0])
          : "query";
        const hasData = query.state.data !== undefined;
        // toastError(
        //   `${hasData ? "Error updating" : "Error fetching"} ${rootKey}: ${message}`
        // );
      },
    }),
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        refetchOnWindowFocus: false,
        retry: (failureCount, error) => {
          if (error instanceof ApiError) {
            if (error.isCanceled) return false;
            if (error.statusCode >= 400 && error.statusCode < 500) return false;
          }

          return failureCount < 3;
        },
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

function getQueryClient() {
  if (isServer) return makeQueryClient();
  if (!browserQueryClient) browserQueryClient = makeQueryClient();
  return browserQueryClient;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={getQueryClient()}>
      {children}
      <Toaster richColors closeButton position="top-right" />
    </QueryClientProvider>
  );
}
