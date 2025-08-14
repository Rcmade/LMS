"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Children } from "../types";
const QueryProvider = ({ children }: Children) => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default QueryProvider;
