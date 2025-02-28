import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const SkeletonCard = () => {
  return (
    <Card className="w-full max-w-xl shadow-xl">
      {/* Header */}
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Skeleton className="h-6 w-32 rounded" />
        <Skeleton className="h-6 w-6 rounded-full" />
      </CardHeader>

      {/* Contenido del Card */}
      <CardContent>
        <Skeleton className="h-6 w-48 mb-2 rounded" />
        <Skeleton className="h-4 w-40 mb-2 rounded" />
        <Skeleton className="h-4 w-32 mb-2 rounded" />
        <Skeleton className="h-4 w-28 mb-2 rounded" />

        {/* Badge Placeholder */}
        <Skeleton className="h-6 w-20 rounded mt-2" />

        {/* Simulación de lista de cuotas */}
        <div className="mt-4 space-y-2">
          {[...Array(3)].map((_, index) => (
            <Skeleton key={index} className="h-4 w-full rounded" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SkeletonCard;
