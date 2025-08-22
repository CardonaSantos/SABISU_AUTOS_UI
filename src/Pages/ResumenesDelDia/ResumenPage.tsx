"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useResumenDiario } from "./use-resumen-diario";
import { ResumenDiarioFilters } from "./resumen-diario-filters";
import { ResumenDiarioKpis } from "./resumen-diario-kpis";
import { ResumenDiarioTable } from "./resumen-diario-table";
import { ResumenDiarioProgressChart } from "./resumen-diario-chart";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle, RefreshCw, Calendar } from "lucide-react";
import { toast } from "sonner";
import { getSucursales } from "./api";
import { getApiErrorMessageAxios } from "../Utils/UtilsErrorApi";
import { Sucursal } from "./types";

export default function ResumenDiarioPage() {
  const [fecha, setFecha] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [sucursalId, setSucursalId] = useState<number | undefined>();

  const { data, loading, error, refetch } = useResumenDiario({
    fecha,
    sucursalId,
  });
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const getSucursalesData = async () => {
    try {
      const data = await getSucursales();
      setSucursales(data);
    } catch (err) {
      console.error(err);
      toast.error(getApiErrorMessageAxios(err));
    } finally {
    }
  };

  const handleExportAll = () => {
    if (!data?.items) return;

    const headers = [
      "Fecha",
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
      ...data.items.map((item) =>
        [
          item.fecha,
          item.sucursal.nombre,
          item.saldoInicio,
          item.totales.ventasEfectivo,
          item.totales.otrosIngresos,
          item.ingresos,
          item.totales.gastosOperativos,
          item.totales.costoVenta,
          item.totales.depositosProveedor,
          item.totales.depositosCierre,
          item.totales.otrosEgresos,
          item.egresos,
          item.saldoFinal,
          item.registros,
          // item.totales.ventasEfectivo - Anterior
          //   item.totales.costoVenta -
          //   item.totales.gastosOperativos,

          item.totales.ventasEfectivo -
            item.totales.costoVenta -
            item.totales.depositosProveedor - // <-- agrega esto
            item.totales.gastosOperativos,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `resumen-diario-completo-${fecha}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    getSucursalesData();
  }, []);

  console.log("La data es: ", sucursales);

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">
              Caja ▸ Resumen Diario (Admin)
            </h1>
          </div>

          {/* Filters Skeleton */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <Skeleton className="h-10 w-40" />
                <Skeleton className="h-10 w-60" />
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-32" />
              </div>
            </CardContent>
          </Card>

          {/* KPIs Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="pt-6">
                  <Skeleton className="h-4 w-32 mb-2" />
                  <Skeleton className="h-8 w-24" />
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Table Skeleton */}
          <Card>
            <CardContent className="pt-6">
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold mb-6">
            Caja ▸ Resumen Diario (Admin)
          </h1>

          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>Error al cargar los datos: {error}</span>
              <Button onClick={refetch} variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Reintentar
              </Button>
            </AlertDescription>
          </Alert>
        </motion.div>
      </div>
    );
  }

  if (!data?.items || data.items.length === 0) {
    return (
      <div className="container mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <h1 className="text-3xl font-bold">Caja ▸ Resumen Diario (Admin)</h1>

          <ResumenDiarioFilters
            fecha={fecha}
            sucursalId={sucursalId}
            sucursales={sucursales}
            onFechaChange={setFecha}
            onSucursalChange={setSucursalId}
            onRefresh={refetch}
            onExport={handleExportAll}
          />

          <Card>
            <CardContent className="pt-6 text-center py-12">
              <Calendar className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Sin cierres en esta fecha
              </h3>
              <p className="text-gray-500 mb-4">
                No se encontraron registros para {fecha}
                {sucursalId && ` en la sucursal seleccionada`}
              </p>
              <Button
                onClick={() => setFecha(new Date().toISOString().split("T")[0])}
              >
                Ver fecha actual
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }
  console.log("Los items llegando al main resumen page es: ", data);

  return (
    <div className="container mx-auto ">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <h1 className="text-3xl font-bold">Caja ▸ Resumen Diario (Admin)</h1>
        <div className="text-sm text-gray-500">
          {new Date(data.fecha).toLocaleDateString("es-GT", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </motion.div>

      <ResumenDiarioFilters
        fecha={fecha}
        sucursalId={sucursalId}
        sucursales={sucursales}
        onFechaChange={setFecha}
        onSucursalChange={setSucursalId}
        onRefresh={refetch}
        onExport={handleExportAll}
      />

      <ResumenDiarioKpis items={data.items} />

      <ResumenDiarioTable items={data.items} fecha={fecha} />

      <ResumenDiarioProgressChart items={data.items} />
    </div>
  );
}
