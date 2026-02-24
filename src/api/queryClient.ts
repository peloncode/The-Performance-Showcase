import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchInterval: 10000, // Actualizar cada 3 segundos
      staleTime: 1000,
    },
  },
});
