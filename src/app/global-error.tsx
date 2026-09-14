"use client";

import { Button } from "@/components/ui/button";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
          <p className="font-serif text-7xl font-light text-accent">500</p>
          <h1 className="mt-4 font-serif text-2xl">Something went wrong</h1>
          <p className="mt-2 max-w-sm text-foreground-muted">
            An unexpected error occurred. Please try again.
          </p>
          <Button className="mt-8" onClick={reset}>
            Try Again
          </Button>
        </div>
      </body>
    </html>
  );
}
