"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ResumenDiarioSucursal } from "./types";
import { Eye, Download } from "lucide-react";
interface ResumenDiarioTableProps {
  items: ResumenDiarioSucursal[];
  fecha: string;
}

export function ResumenDiarioTable({ items, fecha }: ResumenDiarioTableProps) {
  const [sortField, setSortField] = useState<
    keyof ResumenDiarioSucursal | null
  >(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const handleSort = (field: keyof ResumenDiarioSucursal) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedItems = [...items].sort((a, b) => {
    if (!sortField) return 0;

    let aValue = a[sortField];
    let bValue = b[sortField];

    if (typeof aValue === "object" && aValue !== null && "nombre" in aValue) {
      aValue = aValue.nombre;
      bValue = (bValue as any).nombre;
    }

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
    }

    return 0;
  });

  const exportCSV = (item?: ResumenDiarioSucursal) => {
    const dataToExport = item ? [item] : items;
    const headers = [
      "Sucursal",
      "Saldo Inicio",
      "Ventas Efectivo",
      "Otros Ingresos",
      "Ingresos Total",
      "Gasto Operativo",
      "Costo Venta",
      "Dep. Proveedor",
      "Dep. Cierre",
      "Otros Egresos",
      "Egresos Total",
      "Saldo Final",
      "Registros",
      "Resultado Operativo",
    ];

    const csvContent = [
      headers.join(","),
      ...dataToExport.map((row) =>
        [
          row.sucursal.nombre,
          row.saldoInicio,
          row.totales.ventasEfectivo,
          row.totales.otrosIngresos,
          row.ingresos,
          row.totales.gastosOperativos,
          row.totales.costoVenta,
          row.totales.depositosProveedor,
          row.totales.depositosCierre,
          row.totales.otrosEgresos,
          row.egresos,
          row.saldoFinal,
          row.registros,
          // row.totales.ventasEfectivo - antes 18
          //   row.totales.costoVenta -
          //   row.totales.gastosOperativos,

          row.totales.ventasEfectivo -
            row.totales.costoVenta -
            row.totales.depositosProveedor - // <-- agrega esto
            row.totales.gastosOperativos,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `resumen-diario-${fecha}${item ? `-${item.sucursal.nombre}` : ""}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatCompact = (amount: number) => {
    if (amount === 0) return "0";
    if (Math.abs(amount) >= 1000) {
      return `${(amount / 1000).toFixed(1)}k`;
    }
    return amount.toFixed(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between py-3">
          <CardTitle className="text-base">Resumen por Sucursal</CardTitle>
          <Button
            onClick={() => exportCSV()}
            variant="outline"
            size="sm"
            className="text-xs"
          >
            <Download className="w-3 h-3 mr-1" />
            Exportar
          </Button>
        </CardHeader>
        <CardContent className="p-3">
          <div className="w-full">
            <Table className="text-xs">
              <TableHeader>
                <TableRow className="border-b">
                  <TableHead
                    className="cursor-pointer hover:bg-gray-50 p-2 w-32"
                    onClick={() => handleSort("sucursal" as any)}
                  >
                    <div className="text-xs font-medium">Sucursal</div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-gray-50 text-right p-1 w-16"
                    onClick={() => handleSort("saldoInicio")}
                  >
                    <div className="text-xs">
                      Saldo
                      <br />
                      Inicio
                    </div>
                  </TableHead>
                  <TableHead className="text-right p-1 w-16">
                    <div className="text-xs">
                      Ventas
                      <br />
                      Efect.
                    </div>
                  </TableHead>
                  <TableHead className="text-right p-1 w-16">
                    <div className="text-xs">
                      Otros
                      <br />
                      Ingr.
                    </div>
                  </TableHead>
                  <TableHead className="text-right text-green-600 font-semibold p-1 w-16">
                    <div className="text-xs">
                      Total
                      <br />
                      Ingr.
                    </div>
                  </TableHead>
                  <TableHead className="text-right p-1 w-16">
                    <div className="text-xs">
                      Gasto
                      <br />
                      Oper.
                    </div>
                  </TableHead>
                  <TableHead className="text-right p-1 w-16">
                    <div className="text-xs">
                      Costo
                      <br />
                      Venta
                    </div>
                  </TableHead>
                  <TableHead className="text-right p-1 w-16">
                    <div className="text-xs">
                      Dep.
                      <br />
                      Prov.
                    </div>
                  </TableHead>
                  <TableHead className="text-right p-1 w-16">
                    <div className="text-xs">
                      Dep.
                      <br />
                      Cierre
                    </div>
                  </TableHead>
                  <TableHead className="text-right p-1 w-16">
                    <div className="text-xs">
                      Otros
                      <br />
                      Egr.
                    </div>
                  </TableHead>
                  <TableHead className="text-right text-red-600 font-semibold p-1 w-16">
                    <div className="text-xs">
                      Total
                      <br />
                      Egr.
                    </div>
                  </TableHead>
                  <TableHead className="text-right text-blue-600 font-semibold p-1 w-16">
                    <div className="text-xs">
                      Saldo
                      <br />
                      Final
                    </div>
                  </TableHead>
                  <TableHead className="text-center p-1 w-12">
                    <div className="text-xs">Reg.</div>
                  </TableHead>

                  <TableHead className="text-center p-1 w-16">
                    <div className="text-xs">Acc.</div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedItems.map((item, index) => {
                  // const resultadoOperativo = Antes
                  //   item.totales.ventasEfectivo -
                  //   item.totales.costoVenta -
                  //   item.totales.gastosOperativos;

                  const resultadoOperativo =
                    item.totales.ventasEfectivo -
                    item.totales.costoVenta -
                    item.totales.depositosProveedor - // <-- agrega esto
                    item.totales.gastosOperativos;

                  return (
                    <motion.tr
                      key={`${item.sucursal.id}-${item.fecha}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + index * 0.05 }}
                      className="hover:bg-gray-50 border-b"
                    >
                      <TableCell className="font-medium p-2">
                        <div className="space-y-1">
                          <div className="text-xs font-semibold">
                            {item.sucursal.nombre}
                          </div>
                          <div className="text-[10px] text-gray-500">
                            ID: {item.sucursal.id}
                          </div>
                          <Badge
                            variant={
                              resultadoOperativo >= 0
                                ? "default"
                                : "destructive"
                            }
                            className="text-[9px] px-1 py-0 h-4"
                          >
                            P&L: {resultadoOperativo < 0 ? "−" : ""}Q
                            {formatCompact(Math.abs(resultadoOperativo))}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-right p-1 text-xs">
                        Q{formatCompact(item.saldoInicio)}
                      </TableCell>
                      <TableCell className="text-right p-1 text-xs">
                        Q{formatCompact(item.totales.ventasEfectivo)}
                      </TableCell>
                      <TableCell className="text-right p-1 text-xs">
                        Q{formatCompact(item.totales.otrosIngresos)}
                      </TableCell>
                      <TableCell className="text-right font-semibold text-green-600 p-1 text-xs">
                        Q{formatCompact(item.ingresos)}
                      </TableCell>
                      <TableCell className="text-right p-1 text-xs">
                        Q{formatCompact(item.totales.gastosOperativos)}
                      </TableCell>
                      <TableCell className="text-right p-1 text-xs">
                        Q{formatCompact(item.totales.costoVenta)}
                      </TableCell>
                      <TableCell className="text-right p-1 text-xs">
                        Q{formatCompact(item.totales.depositosProveedor)}
                      </TableCell>
                      <TableCell className="text-right p-1 text-xs">
                        Q{formatCompact(item.totales.depositosCierre)}
                      </TableCell>
                      <TableCell className="text-right p-1 text-xs">
                        Q{formatCompact(item.totales.otrosEgresos)}
                      </TableCell>
                      <TableCell className="text-right font-semibold text-red-600 p-1 text-xs">
                        Q{formatCompact(item.egresos)}
                      </TableCell>
                      <TableCell
                        className={`text-right font-semibold p-1 text-xs ${
                          item.saldoFinal < 0 ? "text-red-600" : "text-blue-600"
                        }`}
                      >
                        {item.saldoFinal < 0 ? "−" : ""}Q
                        {formatCompact(Math.abs(item.saldoFinal))}
                      </TableCell>
                      <TableCell className="text-center p-1">
                        <Badge
                          variant="secondary"
                          className="text-[9px] px-1 py-0 h-4"
                        >
                          {item.registros}
                        </Badge>
                      </TableCell>

                      <TableCell className="text-center p-1">
                        <div className="flex items-center justify-center space-x-0.5">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                          >
                            <Eye className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => exportCSV(item)}
                          >
                            <Download className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </motion.tr>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
