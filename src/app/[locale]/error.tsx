"use client";

import { Button } from "@/components/ui/button";

export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto flex min-h-[50vh] w-full max-w-7xl flex-col items-center justify-center px-4 text-center">
      <p className="font-serif text-6xl font-light text-foreground">500</p>
      <h1 className="mt-4 text-xl font-medium text-foreground">Something went wrong</h1>
      <p className="mt-2 max-w-sm text-sm text-foreground-muted">
        An unexpected error occurred while loading this page. Please try again.
      </p>
      <Button onClick={reset} className="mt-8">
        Try again
      </Button>
    </div>
  );
}