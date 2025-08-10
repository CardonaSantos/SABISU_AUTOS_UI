// expense-item.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, User, FileText, TrendingDown } from "lucide-react";
import { Movimiento } from "./interface";
import { formatearFecha, formatCurrency } from "./utils";

interface ExpenseItemProps {
  movimiento: Movimiento;
}

export function ExpenseItem({ movimiento }: ExpenseItemProps) {
  return (
    <Card className="border rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <TrendingDown className="h-4 w-4 text-red-500" />
          Egreso
        </CardTitle>
      </CardHeader>
      <CardContent className="text-sm space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex items-center gap-2">
            <Calendar className="h-3 w-3 text-muted-foreground" />
            <span className="font-medium">Registrado:</span>
            {formatearFecha(movimiento.fecha)}
          </div>
          <div className="flex items-center gap-2">
            <User className="h-3 w-3 text-muted-foreground" />
            <span className="font-medium">Por:</span>
            {movimiento.usuarioId
              ? `${movimiento.usuarioId} (${movimiento.usuarioId})`
              : "N/A"}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-medium">Monto:</span>
          <span className="text-red-600 font-semibold">
            {formatCurrency(movimiento.monto)}
          </span>
        </div>

        {movimiento.descripcion && (
          <div className="flex items-start gap-2 pt-2 border-t">
            <FileText className="h-3 w-3 text-muted-foreground mt-0.5" />
            <div>
              <span className="font-medium">Descripción:</span>
              <p className="text-muted-foreground">{movimiento.descripcion}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
