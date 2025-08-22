"use client";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { ResumenDiarioSucursal } from "./types";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calculator,
  FileText,
  Banknote,
} from "lucide-react";
import { formattMonedaGT } from "@/utils/formattMoneda";

interface ResumenDiarioKpisProps {
  items: ResumenDiarioSucursal[];
}

export function ResumenDiarioKpis({ items }: ResumenDiarioKpisProps) {
  const totales = items.reduce(
    (acc, it) => {
      const ingresosCaja = it.totales.ventasEfectivo + it.totales.otrosIngresos;
      const egresosCaja =
        it.totales.gastosOperativos +
        it.totales.costoVenta +
        it.totales.depositosProveedor +
        it.totales.otrosEgresos +
        it.totales.depositosCierre; // sigue siendo egreso de caja

      // Caja
      acc.caja.saldoInicio += it.saldoInicio;
      acc.caja.ingresos += ingresosCaja; // o it.ingresos, debería calzar
      acc.caja.egresos += egresosCaja; // o it.egresos, debería calzar
      acc.caja.saldoFinal += it.saldoInicio + ingresosCaja - egresosCaja;
      // acc.caja.resultadoOperativo += antes 18
      //   it.totales.ventasEfectivo -
      //   it.totales.costoVenta -
      //   it.totales.gastosOperativos;
      acc.caja.resultadoOperativo +=
        it.totales.ventasEfectivo -
        it.totales.costoVenta -
        it.totales.depositosProveedor - // <-- agrega esto
        it.totales.gastosOperativos;

      acc.caja.registros += it.registros;

      // Banco (hoy sólo depósitos de cierre)
      acc.banco.ingresos += it.totales.depositosCierre;
      return acc;
    },
    {
      caja: {
        saldoInicio: 0,
        ingresos: 0,
        egresos: 0,
        saldoFinal: 0,
        resultadoOperativo: 0,
        registros: 0,
      },
      banco: { ingresos: 0, egresos: 0 },
    }
  );

  const kpis = [
    {
      title: "Saldo Inicio Total",
      value: totales.caja.saldoInicio,
      icon: DollarSign,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Ingresos Totales (Caja)",
      value: totales.caja.ingresos,
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Egresos Totales (Caja)",
      value: totales.caja.egresos,
      icon: TrendingDown,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      title: "Saldo Final Total (Caja)",
      value: totales.caja.saldoFinal,
      icon: DollarSign,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    // ⭐ Nuevo KPI de Banco
    {
      title: "Ingreso Banco (dep. cierre)",
      value: totales.banco.ingresos,
      icon: Banknote, // import { Banknote } from "lucide-react"
      color: "text-sky-700",
      bgColor: "bg-sky-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {kpis.map((kpi, index) => (
        <motion.div
          key={kpi.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
              <div className={`p-2 rounded-full ${kpi.bgColor}`}>
                <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div
                className={`text-2xl font-bold ${
                  kpi.value < 0 ? "text-red-600" : kpi.color
                }`}
              >
                {kpi.value < 0 ? "−" : ""}
                {formattMonedaGT(Math.abs(kpi.value))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}

      {/* Resultado Operativo Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="md:col-span-2 lg:col-span-1"
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <CardTitle className="text-sm font-medium cursor-help">
                    Resultado Operativo
                  </CardTitle>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Aproximación de P&L del día</p>
                  <p>Ventas - Costo - Gastos Operativos</p>
                  <p>(No incluye depósitos)</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <div className="p-2 rounded-full bg-purple-50">
              <Calculator className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${
                totales.caja.resultadoOperativo < 0
                  ? "text-red-600"
                  : "text-purple-600"
              }`}
            >
              {totales.caja.resultadoOperativo < 0 ? "−" : ""}
              {formattMonedaGT(Math.abs(totales.caja.resultadoOperativo))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Registros Badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="md:col-span-2 lg:col-span-1"
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Turnos Cerrados
            </CardTitle>
            <div className="p-2 rounded-full bg-gray-50">
              <FileText className="h-4 w-4 text-gray-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-gray-900">
                {totales.caja.registros}
              </span>

              <Badge variant="secondary">registros</Badge>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
