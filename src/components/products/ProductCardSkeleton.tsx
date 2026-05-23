import { Skeleton } from '@/components/ui/Skeleton';

export function ProductCardSkeleton() {
  return (
    <div className="bg-white border border-scout-border rounded-2xl overflow-hidden">
      <Skeleton className="aspect-square w-full rounded-none" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <div className="flex items-center justify-between pt-1">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="flex gap-1 pt-1">
          <Skeleton className="h-6 w-8 rounded-md" />
          <Skeleton className="h-6 w-8 rounded-md" />
          <Skeleton className="h-6 w-8 rounded-md" />
        </div>
      </div>
    </div>
  );
}
