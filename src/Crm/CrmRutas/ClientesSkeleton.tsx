import { Card, CardContent } from "@/components/ui/card";

interface ClientesSkeletonProps {
  viewMode?: "grid" | "list";
}

export function ClientesSkeleton({ viewMode = "grid" }: ClientesSkeletonProps) {
  if (viewMode === "grid") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(9)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex items-center space-x-4 mb-4">
                <div className="h-10 w-10 rounded-full bg-muted animate-pulse"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-muted rounded w-3/4 animate-pulse"></div>
                  <div className="h-3 bg-muted rounded w-1/2 animate-pulse"></div>
                </div>
                <div className="h-4 w-4 bg-muted rounded animate-pulse"></div>
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex">
                  <div className="h-4 w-4 bg-muted rounded mr-2 animate-pulse"></div>
                  <div className="h-4 bg-muted rounded w-full animate-pulse"></div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="h-6 bg-muted rounded w-16 animate-pulse"></div>
                <div className="space-y-2 text-right">
                  <div className="h-4 bg-muted rounded w-16 animate-pulse"></div>
                  <div className="h-3 bg-muted rounded w-12 animate-pulse"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-md border overflow-hidden">
      <div className="p-4">
        <div className="space-y-3">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="flex items-center space-x-4 p-2 border-b pb-3"
            >
              <div className="h-4 w-4 bg-muted rounded animate-pulse"></div>
              <div className="flex items-center gap-3 flex-1">
                <div className="h-9 w-9 rounded-full bg-muted animate-pulse"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-muted rounded w-1/3 animate-pulse"></div>
                  <div className="h-3 bg-muted rounded w-1/4 animate-pulse"></div>
                </div>
              </div>
              <div className="hidden md:block h-4 bg-muted rounded w-1/4 animate-pulse"></div>
              <div className="hidden md:block h-6 bg-muted rounded w-16 animate-pulse"></div>
              <div className="space-y-2 w-20">
                <div className="h-4 bg-muted rounded w-full animate-pulse"></div>
                <div className="h-3 bg-muted rounded w-2/3 animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
