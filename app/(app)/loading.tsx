import { Skeleton } from "@/components/ui/skeleton";

export default function AppLoading() {
  return (
    <>
      <div className="flex flex-col gap-2">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-4 w-72" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="h-[150px] rounded-xl" />
        <Skeleton className="h-[150px] rounded-xl" />
        <Skeleton className="h-[150px] rounded-xl" />
      </div>
      <Skeleton className="h-[220px] w-full rounded-xl" />
    </>
  );
}
