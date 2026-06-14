import { cn } from "@/lib/utils";

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("skeleton", className)}
      {...props}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="p-5 rounded-xl border border-surface-variant bg-surface-container-lowest space-y-3 card-elevation-1">
      <Skeleton className="h-6 w-1/3 rounded-lg" />
      <Skeleton className="h-4 w-2/3 rounded" />
      <div className="pt-3 border-t border-surface-variant flex justify-between">
        <Skeleton className="h-8 w-1/4 rounded" />
        <Skeleton className="h-8 w-1/4 rounded" />
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="w-full border border-surface-variant rounded-xl overflow-hidden card-elevation-1 bg-surface-container-lowest">
      <div className="p-4 bg-surface-container border-b border-surface-variant flex gap-4">
        <Skeleton className="h-5 w-1/4" />
        <Skeleton className="h-5 w-1/4" />
        <Skeleton className="h-5 w-1/4" />
        <Skeleton className="h-5 w-1/4" />
      </div>
      <div className="divide-y divide-surface-variant p-4 space-y-4">
        {Array.from({ length: rows }).map((_, idx) => (
          <div key={idx} className="flex gap-4 pt-3 first:pt-0">
            <Skeleton className="h-5 flex-1" />
            <Skeleton className="h-5 flex-1" />
            <Skeleton className="h-5 flex-1" />
            <Skeleton className="h-5 flex-1" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-10 w-28" />
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div key={idx} className="p-4 rounded-xl border border-surface-variant bg-surface-container-lowest space-y-2 card-elevation-1">
            <Skeleton className="h-5 w-5 rounded-full" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-6 w-24" />
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="p-5 rounded-xl border border-surface-variant bg-surface-container-lowest space-y-4 card-elevation-1">
            <Skeleton className="h-6 w-36" />
            <Skeleton className="h-48 w-full" />
          </div>
        </div>
        <div className="space-y-6">
          <div className="p-5 rounded-xl border border-surface-variant bg-surface-container-lowest space-y-4 card-elevation-1">
            <Skeleton className="h-6 w-28" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
