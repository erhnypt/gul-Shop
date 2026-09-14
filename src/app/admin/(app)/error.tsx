"use client";

import { Button } from "@/components/ui/button";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
      <p className="font-serif text-6xl font-light text-foreground">500</p>
      <h1 className="mt-4 text-xl font-medium text-foreground">Admin error</h1>
      <p className="mt-2 max-w-sm text-sm text-foreground-muted">
        {error.message ?? "An unexpected error occurred."}
      </p>
      <Button onClick={reset} className="mt-8">
        Try again
      </Button>
    </div>
  );
}