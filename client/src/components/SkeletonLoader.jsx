const Skeleton = ({ className = "" }) => {
  return (
    <div className={`animate-pulse bg-gray-200 rounded-xl ${className}`}></div>
  );
};

export const DashboardSkeleton = () => (
  <div className="space-y-6">
    <Skeleton className="h-40 w-full" />
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32" />)}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Skeleton className="h-64" />
      <Skeleton className="h-64 lg:col-span-2" />
    </div>
  </div>
);

export const TableSkeleton = () => (
  <div className="card space-y-4">
    <Skeleton className="h-8 w-1/4 mb-6" />
    {[1, 2, 3, 4, 5].map(i => (
      <Skeleton key={i} className="h-12 w-full" />
    ))}
  </div>
);

export default Skeleton;
