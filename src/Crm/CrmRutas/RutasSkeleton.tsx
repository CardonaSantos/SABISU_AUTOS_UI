export function RutasSkeleton() {
  return (
    <div className="rounded-md border">
      <div className="p-4">
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <div className="w-full space-y-2">
                <div className="h-4 bg-muted rounded w-1/4 animate-pulse"></div>
                <div className="h-3 bg-muted rounded w-1/6 animate-pulse"></div>
              </div>
              <div className="h-4 bg-muted rounded w-1/6 animate-pulse"></div>
              <div className="h-4 bg-muted rounded w-1/12 animate-pulse"></div>
              <div className="h-6 bg-muted rounded w-1/12 animate-pulse"></div>
              <div className="h-8 bg-muted rounded-full w-8 animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
