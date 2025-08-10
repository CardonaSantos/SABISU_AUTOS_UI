// deposit-item.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Calendar, CreditCard, User, FileText } from "lucide-react";
import { Movimiento, TipoMovimientoCaja } from "./interface";
import { formatearFecha, formatCurrency } from "./utils";

interface DepositItemProps {
  movimiento: Movimiento;
}

export function DepositItem({ movimiento }: DepositItemProps) {
  // Asegurarnos de que es un depósito de banco
  const isDepositoBanco = movimiento.tipo === TipoMovimientoCaja.DEPOSITO_BANCO;

  return (
    <Card className="border rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <CreditCard className="h-4 w-4 text-primary" />
          {isDepositoBanco ? "Depósito Banco" : movimiento.categoria}
          {movimiento.referencia && (
            <>
              {" "}
              • Ref:{" "}
              <span className="text-primary">{movimiento.referencia}</span>
            </>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-sm space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex items-center gap-2">
            <span className="font-medium">Monto:</span>
            <span className="text-green-600 font-semibold">
              {formatCurrency(movimiento.monto)}
            </span>
          </div>
          {movimiento.banco && (
            <div className="flex items-center gap-2">
              <Building2 className="h-3 w-3 text-muted-foreground" />
              <span className="font-medium">Banco:</span> {movimiento.banco}
            </div>
          )}
          {movimiento.numeroBoleta && (
            <div className="flex items-center gap-2">
              <span className="font-medium">Boleta:</span>{" "}
              {movimiento.numeroBoleta}
            </div>
          )}
          <div className="flex items-center gap-2">
            <Calendar className="h-3 w-3 text-muted-foreground" />
            <span className="font-medium">Fecha:</span>
            {formatearFecha(movimiento.fecha)}
          </div>
          {/* Si has incluido usuario en el include del endpoint */}
          <div className="flex items-center gap-2">
            <User className="h-3 w-3 text-muted-foreground" />
            <span className="font-medium">Registrado por:</span>
            {movimiento.usuarioId
              ? `${movimiento.usuarioId} (${movimiento.usuarioId})`
              : "N/A"}
          </div>
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

        {typeof movimiento.usadoParaCierre === "boolean" && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-2 border-t">
            <Badge
              variant={movimiento.usadoParaCierre ? "default" : "secondary"}
              className="w-fit"
            >
              {movimiento.usadoParaCierre ? "Usado para cierre" : "Disponible"}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
