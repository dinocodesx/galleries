import type { PropsWithChildren } from "react";

// Add global providers here (e.g., QueryClientProvider, ThemeProvider, ToastProvider).
// Currently a pass-through stub — keep this file in place; it will grow with the app.
export function AppProviders({ children }: PropsWithChildren) {
  return <>{children}</>;
}
