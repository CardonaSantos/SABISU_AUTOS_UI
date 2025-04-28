"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, EllipsisVertical, Trash2 } from "lucide-react";
import type { FacturaInternet } from "./CustomerDetails"; // Asumiendo que tienes tus interfaces en este archivo
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

interface FacturaToDeleter {
  id: number;
  estado: string;
  fechaEmision: string;
  fechaVencimiento: string;
}

// Función para formatear fechas
const formatearFecha = (fechaISO: string) => {
  const fecha = new Date(fechaISO);
  return `${fecha.getDate()}/${fecha.getMonth() + 1}/${fecha.getFullYear()}`;
};

// Función para formatear moneda
const formatearMoneda = (monto: number) => {
  return monto.toFixed(0);
};

// Función para determinar el color de fila según el tipo de transacción
const getRowColor = (esPago: boolean) => {
  return esPago
    ? "bg-primary/10 dark:bg-primary/20 border-l-4 border-primary"
    : "hover:bg-muted/50 dark:hover:bg-muted/20";
};

interface HistorialPagosProps {
  facturas: FacturaInternet[];
  nombreCliente: string;

  setFacturaAction: (value: FacturaToDeleter) => void;
  setOpenDeleteFactura: (value: boolean) => void;
}

export function HistorialPagos({
  facturas,
  setFacturaAction,
  setOpenDeleteFactura,
}: HistorialPagosProps) {
  // Preparar los datos para la tabla
  const transacciones = facturas.map((factura) => {
    // Factura principal
    const facturaRow = {
      fecha: factura.fechaEmision,
      canal: "SISTEMA AUTO",
      tipoPago: factura?.pagos[0]?.metodoPago ?? "N/A",
      referencia: factura.id.toString(),
      detalle: `FACTURA ${new Date(factura.fechaVencimiento)
        .toLocaleString("default", { month: "long" })
        .toUpperCase()} ${new Date(factura.fechaVencimiento).getFullYear()}`,
      cobro: factura.monto,
      pago:
        factura.pagos?.reduce((total, pago) => total + pago.montoPagado, 0) ||
        0,
      saldo:
        factura.monto -
        (factura.pagos?.reduce((total, pago) => total + pago.montoPagado, 0) ||
          0),
      esPago: false, // Solo es pago cuando no es una factura original
      id: factura.id,
      estado: factura.estado,
      fechaEmision: factura.fechaEmision,
      fechaVencimiento: factura.fechaVencimiento,
      pagos: factura.pagos, // Mantén los pagos asociados a la factura
    };

    return facturaRow;
  });

  transacciones.sort(
    (a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
  );

  // Calcular saldos acumulados
  let saldoAcumulado = 0;
  transacciones.forEach((t) => {
    saldoAcumulado = saldoAcumulado + t.cobro - t.pago;
    t.saldo = saldoAcumulado;
  });

  return (
    <Card className="shadow-sm h-full border dark:border-gray-800">
      <CardHeader className="pb-2 pt-3 bg-muted/30 dark:bg-gray-900/40">
        <CardTitle className="text-sm flex items-center justify-between">
          <div className="flex items-center">
            <CreditCard className="h-4 w-4 mr-1.5 text-primary" />
            <span className="font-medium">Historial de Facturación</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="max-h-60 overflow-y-auto">
          <Table className="w-full text-[11px] [&_th]:py-1.5 [&_td]:py-1 [&_th]:text-[11px] [&_td]:text-[11px] [&_th]:px-2 [&_td]:px-2">
            <TableHeader className="sticky top-0 bg-muted/80 dark:bg-gray-900/80 backdrop-blur-sm z-10">
              <TableRow className="border-b dark:border-gray-800">
                <TableHead className="font-medium w-[60px] text-[11px]">
                  Fecha
                </TableHead>
                <TableHead className="font-medium w-[80px] text-[11px]">
                  Canal
                </TableHead>
                <TableHead className="font-medium w-[70px] text-[11px]">
                  Estado
                </TableHead>
                <TableHead className="font-medium w-[70px] text-[11px]">
                  Tipo Pago
                </TableHead>
                <TableHead className="font-medium w-[60px] text-[11px]">
                  Ref.
                </TableHead>
                <TableHead className="font-medium w-[100px] text-[11px]">
                  Detalle
                </TableHead>
                <TableHead className="font-medium text-right w-[60px] text-[11px]">
                  Cobro
                </TableHead>
                <TableHead className="font-medium text-right w-[60px] text-[11px]">
                  Pago
                </TableHead>
                <TableHead className="font-medium text-right w-[60px] text-[11px]">
                  Saldo
                </TableHead>
                <TableHead className="font-medium text-center w-[40px] text-[11px]">
                  <span className="sr-only">Acciones</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transacciones.map((t) => (
                <TableRow
                  key={t.id}
                  className={`${getRowColor(!!t.pago)} transition-colors`}
                >
                  <TableCell className="whitespace-nowrap font-medium text-[11px]">
                    {formatearFecha(t.fecha)}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-[11px]">
                    <div className="flex items-center gap-1">
                      <span className="truncate">{t.canal}</span>
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-[11px]">
                    <Badge
                      variant={t.estado === "PAGADA" ? "default" : "outline"}
                      className={`px-1.5 py-0 text-[8px] ${
                        t.estado === "PAGADA"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                      }`}
                    >
                      {t.estado}
                    </Badge>
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-[11px]">
                    {t.tipoPago && (
                      <div className="flex items-center gap-1">
                        <span className="truncate">{t.tipoPago}</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-[11px]">
                    {t.referencia}
                  </TableCell>

                  {/* Ajustamos la columna de "Detalle" */}
                  <TableCell className="truncate text-[11px]" title={t.detalle}>
                    <Link
                      className="text-primary hover:underline dark:text-blue-300"
                      to={`/crm/facturacion/pago-factura/${t.id}`}
                    >
                      <p className="text-[11px]">{t.detalle}</p>
                    </Link>
                  </TableCell>

                  <TableCell className="text-right font-medium whitespace-nowrap text-[11px]">
                    {t.cobro > 0 ? (
                      <span className="text-red-600 dark:text-red-400">
                        {formatearMoneda(t.cobro)}
                      </span>
                    ) : (
                      ""
                    )}
                  </TableCell>
                  <TableCell className="text-right font-medium whitespace-nowrap text-[11px]">
                    {t.pago > 0 ? (
                      <span className="text-green-600 dark:text-green-400">
                        {formatearMoneda(t.pago)}
                      </span>
                    ) : (
                      ""
                    )}
                  </TableCell>
                  <TableCell className="text-right font-medium whitespace-nowrap text-[11px]">
                    <span
                      className={
                        t.saldo > 0
                          ? "text-red-600 dark:text-red-400"
                          : "text-green-600 dark:text-green-400"
                      }
                    >
                      {formatearMoneda(t.saldo)}
                    </span>
                  </TableCell>

                  {/* Columna de acciones con el botón de elipsis */}
                  <TableCell className="text-center p-0 text-[11px]">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 rounded-full hover:bg-muted dark:hover:bg-gray-800"
                        >
                          <EllipsisVertical className="h-3.5 w-3.5" />
                          <span className="sr-only">Acciones</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-36">
                        <DropdownMenuItem
                          onClick={() => {
                            const facturaSeleccionada = {
                              id: t.id,
                              estado: t.estado,
                              fechaEmision: t.fechaEmision,
                              fechaVencimiento: t.fechaVencimiento,
                            };

                            setFacturaAction(facturaSeleccionada);
                            setOpenDeleteFactura(true);
                          }}
                          className="text-red-600 dark:text-red-400 focus:text-red-700 dark:focus:text-red-300"
                        >
                          <Trash2 className="h-3.5 w-3.5 mr-2" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
