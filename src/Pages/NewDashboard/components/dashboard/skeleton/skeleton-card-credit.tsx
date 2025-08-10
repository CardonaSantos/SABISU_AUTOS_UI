import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function SkeletonCardCredit() {
  return (
    <Card className="w-full max-w-xl shadow-xl">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          <Skeleton className="h-4 w-24" />
        </CardTitle>
        <Skeleton className="h-4 w-4 rounded-full" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-6 w-48 mb-2" />
        <Skeleton className="h-4 w-32 mb-1" />
        <Skeleton className="h-4 w-40 mb-1" />
        <Skeleton className="h-4 w-28 mb-2" />
        <Skeleton className="h-5 w-20 rounded-full" />
      </CardContent>
    </Card>
  )
}
