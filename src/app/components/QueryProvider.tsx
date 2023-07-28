'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { cache } from 'react';

const queryClient = cache(
  () =>
    new QueryClient({
      defaultOptions: {
        queries: {
          refetchOnWindowFocus: false,
        },
      },
    })
);

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  return <QueryClientProvider client={queryClient()}>{children}</QueryClientProvider>;
}
