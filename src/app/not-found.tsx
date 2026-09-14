import Link from "next/link";

export default function RootNotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="font-serif text-7xl font-light text-accent">404</p>
      <h1 className="mt-4 font-serif text-2xl">Page not found</h1>
      <Link
        href="/en"
        className="mt-8 rounded-md bg-foreground px-6 py-3 text-sm font-medium text-background hover:bg-foreground/90"
      >
        Back to Home
      </Link>
    </div>
  );
}
