import { Skeleton } from "@/components/ui/skeleton";

export default function LocaleLoading() {
  return (
    <div className="mx-auto flex min-h-[50vh] w-full max-w-7xl flex-col items-center justify-center px-4">
      <Skeleton className="h-6 w-56" />
      <Skeleton className="mt-4 h-4 w-80 max-w-full" />
    </div>
  );
}