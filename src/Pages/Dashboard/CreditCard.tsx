import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ChevronDown, ChevronUp, Coins } from "lucide-react";
import { CreditoRegistro } from "../VentaCuotas/CreditosType";
import { PaymentForm } from "./PaymentForm";
import dayjs from "dayjs";
import { Badge } from "@/components/ui/badge";

interface VentaCuotaCardProps {
  ventaCuota: CreditoRegistro;
}

export const VentaCuotaCard: React.FC<VentaCuotaCardProps> = ({
  ventaCuota,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  function totalConInteres(totalVenta: number, interes: number) {
    const montoInteres = totalVenta * (interes / 100);
    // Total con interés
    const montoTotalConInteres = totalVenta + montoInteres;
    return montoTotalConInteres;
  }

  function formatearMoneda(cantidad: number) {
    return new Intl.NumberFormat("es-GT", {
      style: "currency",
      currency: "GTQ",
    }).format(cantidad);
  }

  let diaInicio = dayjs(ventaCuota.fechaContrato);
  let diasEntrePagos = ventaCuota.diasEntrePagos;
  const cuotasFechas = [];

  for (let index = 0; index < ventaCuota.cuotasTotales; index++) {
    const fechaAPagar = diaInicio.add(diasEntrePagos, "day");
    // cuotasFechas.push(fechaAPagar.format("YYYY-MMMM-DD"));
    cuotasFechas.push(fechaAPagar.format("D [de] MMMM [de] YYYY"));
    diaInicio = fechaAPagar;
  }
  console.log("Las fechas a pagar cada x días son: ", cuotasFechas);

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Crédito #{ventaCuota.id}
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          aria-expanded={isExpanded}
          aria-label={isExpanded ? "Collapse details" : "Expand details"}
        >
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {formatearMoneda(
            totalConInteres(ventaCuota.totalVenta, ventaCuota.interes)
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          Cliente: {ventaCuota.cliente.nombre}
        </p>
        {isExpanded && (
          <div className="mt-4 space-y-2">
            <p className="text-sm">
              Cuota Inicial: {formatearMoneda(ventaCuota.cuotaInicial)}
            </p>
            <p className="text-sm">
              Cuotas Totales: {ventaCuota.cuotasTotales}
            </p>

            <p className="text-sm">
              Cuotas Pagadas: {ventaCuota.cuotas.length}
            </p>

            <p className="text-sm">
              Fecha Inicio:{" "}
              {new Date(ventaCuota.fechaInicio).toLocaleDateString()}
            </p>

            <p className="text-sm font-semibold text-gray-800 dark:text-white">
              Fechas para pagar: {cuotasFechas.join(", ")}
            </p>
            <Badge>{ventaCuota.estado}</Badge>
            <p className="text-sm">Sucursal: {ventaCuota.sucursal.nombre}</p>
            <p className="text-sm">Vendedor: {ventaCuota.usuario.nombre}</p>
          </div>
        )}
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full mt-4" size="sm">
              <Coins className="mr-2 h-4 w-4" />
              Registrar Cuota
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Registrar Pago de Cuota</DialogTitle>
            </DialogHeader>
            <PaymentForm ventaCuotaId={ventaCuota.id} />
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};
