"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      //no recargar de mas la API
      staleTime: 2 * 60 * 1000, // 2 min refresh
      gcTime: 5 * 60 * 1000, // 5 min en caché inactiva
      refetchOnWindowFocus: true, // si vuelve el internet
      refetchOnReconnect: true, // reintentos con backoff exponencial
      retry: 3,
    },
  },
});

export function QueryProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
