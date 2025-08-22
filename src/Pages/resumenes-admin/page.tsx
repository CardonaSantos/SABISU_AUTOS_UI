"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { RefreshCw, AlertTriangle, Option } from "lucide-react";

import { fetchResumen, getSucursalesArray } from "./api/api";
import type { ResumenDiarioAdminResponse } from "./interfaces/resumen";

import { KPICard } from "./_components/kpi-card";
import { SalesChart } from "./_components/sales-chart";
import { ExpensesChart } from "./_components/expenses-chart";
import { ComparisonChart } from "./_components/comparison-chart";
import { DepositsTable } from "./_components/deposits-table";
import { DashboardSkeleton } from "./_components/loading-skeleton";
import { formattFecha, TZGT } from "../Utils/Utils";
import { formattMonedaGT } from "@/utils/formattMoneda";
import { formatPercentage } from "./format";
import dayjs from "dayjs";
import DatePicker from "react-datepicker";
import { toast } from "sonner";
import { getApiErrorMessageAxios } from "../Utils/UtilsErrorApi";
import ReactSelectComponent from "react-select";
import { Label } from "@/components/ui/label";
import { es } from "date-fns/locale";
interface Option {
  value: string;
  label: string;
}

interface Sucursal {
  id: number;
  nombre: string;
}
export default function ResumenDiarioPage() {
  //funcion generadora del dia de hoy, calleable
  const todayStr = () => dayjs().tz(TZGT).format("YYYY-MM-DD");
  const [data, setData] = useState<ResumenDiarioAdminResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  //React Select Component
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const options: Option[] = sucursales.map((s) => ({
    label: `${s.nombre}`,
    value: s.id.toString(),
  }));
  const [sucursalSelected, setSucursalSelected] = useState<Option | null>(null);
  const [date, setDate] = useState<string>(todayStr());

  const handleSelectComponent = (optionSelected: Option | null) => {
    setSucursalSelected(optionSelected);
  };

  // Handler
  const handleChange = (selected: Date | null) => {
    if (!selected) {
      setDate(todayStr()); //sino hay, vuelve a hoy
      return;
    }
    setDate(dayjs(selected).tz(TZGT).format("YYYY-MM-DD"));
  };

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!sucursalSelected || !date || date === undefined) return;

      const result = await fetchResumen(String(sucursalSelected.value), date);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  const getSucursales = async () => {
    try {
      const dt = await getSucursalesArray();
      setSucursales(dt);

      if (dt.length > 0 && !sucursalSelected) {
        setSucursalSelected({
          label: dt[0].nombre,
          value: dt[0].id.toString(),
        });
      }
    } catch (error) {
      console.log("El error generado es: ", error);
      toast.error(getApiErrorMessageAxios(error));
    }
  };

  useEffect(() => {
    getSucursales();
  }, []);

  useEffect(() => {
    if (sucursalSelected && date) {
      loadData();
    }
  }, [sucursalSelected, date]);

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  // Calculations
  const utilidadOperativa =
    data.ventas.total -
    data.egresos.costosVenta.total -
    data.egresos.gastosOperativos.total;
  const margenOperativo =
    data.ventas.total > 0 ? utilidadOperativa / data.ventas.total : 0;
  console.log("La data del servicio admin resumen diario es: ", data);

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-2"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold">
              Resumen Diario – Sucursal #{data.sucursalId}
            </h1>
            <p className="text-muted-foreground">{formattFecha(data.fecha)}</p>
          </div>
          <Button onClick={loadData} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refrescar
          </Button>
        </div>
      </motion.div>

      <div className="">
        <h2>Filtros</h2>

        <div className="flex flex-col gap-2">
          <Label className="font-medium">Selecciona una fecha:</Label>
          <DatePicker
            isClearable={false}
            locale={es}
            selected={dayjs.tz(date, "YYYY-MM-DD", TZGT).toDate()}
            onChange={handleChange}
            dateFormat="dd/MM/yyyy"
            placeholderText="dd/mm/yyyy"
            className="border rounded p-2 text-black font-semibold"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label className="font-medium" htmlFor="Sucursal">
            Seleccionar sucursal:
          </Label>
          <ReactSelectComponent
            id="Sucursal"
            options={options}
            onChange={handleSelectComponent}
            value={sucursalSelected}
            isClearable
            isSearchable
            placeholder="Seleccione una sucursal"
          />
        </div>
        <div className="">
          <span>Sucursal seleccionada: {sucursalSelected?.label}</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <KPICard
          title="Caja Final"
          value={data.caja.final}
          subtitle={`Inicio: ${formattMonedaGT(
            data.caja.inicio
          )} | Ingresos: ${formattMonedaGT(
            data.caja.ingresos
          )} | Egresos: ${formattMonedaGT(data.caja.egresos)}`}
          index={0}
        />
        <KPICard
          title="Banco Final"
          value={data.banco.final}
          subtitle={`Inicio: ${formattMonedaGT(
            data.banco.inicio
          )} | Ingresos: ${formattMonedaGT(
            data.banco.ingresos
          )} | Egresos: ${formattMonedaGT(data.banco.egresos)}`}
          index={1}
        />
        <KPICard
          title="Ventas del Día"
          value={data.ventas.total}
          subtitle={`${
            data.ventas.cantidad
          } transacciones | Ticket promedio: ${formattMonedaGT(
            data.ventas.ticketPromedio
          )}`}
          index={2}
        />
        <KPICard
          title="Utilidad Operativa"
          value={utilidadOperativa}
          subtitle={`Margen: ${formatPercentage(margenOperativo)}`}
          badge={{
            text: utilidadOperativa >= 0 ? "Positiva" : "Negativa",
            variant: utilidadOperativa >= 0 ? "default" : "destructive",
          }}
          index={3}
        />
        <KPICard
          title="Depósitos de Cierre"
          value={data.depositos.totalMonto}
          subtitle={`${data.depositos.totalCantidad} depósitos`}
          index={4}
        />
        <KPICard
          title="Cuadre Caja vs Efectivo"
          value={data.comparativos.variacionCajaVsVentasEfectivo}
          subtitle={`Neto Caja: ${formattMonedaGT(
            data.comparativos.netoCajaOperativo
          )} | Efectivo: ${formattMonedaGT(data.comparativos.efectivoVentas)}`}
          badge={{
            text: data.comparativos.alertas.length > 0 ? "Alerta" : "OK",
            variant:
              data.comparativos.alertas.length > 0 ? "destructive" : "default",
          }}
          index={5}
        />
      </div>

      {/* Alerts */}
      {data.comparativos.alertas.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
        >
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-1">
                {data.comparativos.alertas.map((alerta, index) => (
                  <div key={index}>{alerta}</div>
                ))}
              </div>
            </AlertDescription>
          </Alert>
        </motion.div>
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalesChart data={data.ventas.porMetodo} />
        <ExpensesChart
          costosVenta={data.egresos.costosVenta.total}
          gastosOperativos={data.egresos.gastosOperativos.total}
        />
        <ComparisonChart
          netoCajaOperativo={data.comparativos.netoCajaOperativo}
          efectivoVentas={data.comparativos.efectivoVentas}
        />

        {/* Expenses Detail Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Detalle de Egresos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Costos de Venta</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    Caja: {formattMonedaGT(data.egresos.costosVenta.caja)}
                  </div>
                  <div>
                    Banco: {formattMonedaGT(data.egresos.costosVenta.banco)}
                  </div>
                  <div>
                    Pago Proveedor (Caja):{" "}
                    {formattMonedaGT(
                      data.egresos.costosVenta.pagoProveedor.caja
                    )}
                  </div>
                  <div>
                    Pago Proveedor (Banco):{" "}
                    {formattMonedaGT(
                      data.egresos.costosVenta.pagoProveedor.banco
                    )}
                  </div>
                </div>
              </div>
              <Separator />
              <div>
                <h4 className="font-semibold mb-2">Gastos Operativos</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    Caja: {formattMonedaGT(data.egresos.gastosOperativos.caja)}
                  </div>
                  <div>
                    Banco:{" "}
                    {formattMonedaGT(data.egresos.gastosOperativos.banco)}
                  </div>
                </div>
              </div>
              <Separator />
              <div>
                <h4 className="font-semibold mb-2">Depósitos Caja → Banco</h4>
                <div className="text-sm">
                  {formattMonedaGT(data.egresos.depositosCajaABanco)}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Deposits Table */}
      <DepositsTable deposits={data.depositos.porCuenta} />

      {/* Cierre Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.6 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Estado del Cierre</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Badge
                  variant={data.cierre.huboCierre ? "default" : "secondary"}
                >
                  {data.cierre.huboCierre ? "Cierre Realizado" : "Sin Cierre"}
                </Badge>
                {data.cierre.huboCierre && (
                  <span className="text-sm text-muted-foreground">
                    Monto depositado:{" "}
                    {formattMonedaGT(data.cierre.montoDepositadoCierre)}
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
