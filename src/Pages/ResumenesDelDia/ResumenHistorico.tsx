"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  CalendarRange,
  Building2,
  RefreshCw,
  Download,
  Banknote,
  TrendingUp,
  TrendingDown,
  Calculator,
  CheckCircle2,
  AlertTriangle,
  Info,
} from "lucide-react";
import {
  ResponsiveContainer,
  Bar,
  Line,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
  Legend,
  ComposedChart,
} from "recharts";
import { toast } from "sonner";
import { getFlujoMensual, getHistoricoData, getSucursales } from "./api";
import dayjs from "dayjs";
import { Sucursal } from "./types";
import { formattMonedaGT } from "@/utils/formattMoneda";
import { formateDateWithMinutes } from "@/Crm/Utils/FormateDate";

// Interfaces TypeScript
interface ResumenDiarioSucursal {
  fecha: string;
  sucursal: { id: number; nombre: string };
  saldoInicio: number;
  totales: {
    ventasEfectivo: number;
    otrosIngresos: number;
    gastosOperativos: number;
    costoVenta: number;
    depositosProveedor: number;
    depositosCierre: number;
    otrosEgresos: number;
  };
  ingresos: number;
  egresos: number;
  saldoFinal: number;
  registros: number;
}

interface TotalesCajaBanco {
  caja: {
    saldoInicio: number;
    ingresos: number;
    egresos: number;
    saldoFinal: number;
    resultadoOperativo: number;
    registros: number;
  };
  banco: {
    ingresos: number;
    egresos: number;
  };
}

interface ResumenHistoricoDia {
  fecha: string;
  items: ResumenDiarioSucursal[];
}

interface ResumenHistoricoResponse {
  desde: string;
  hasta: string;
  dias: ResumenHistoricoDia[];
  totales: TotalesCajaBanco;
}

interface FlujoMensualSeriesPoint {
  fecha: string;
  ingresos: number;
  egresos: number;
  depositoBanco: number;
  pnl: number;
}

interface FlujoMensualResponse {
  mes: string;
  sucursalId: number | null;
  series: FlujoMensualSeriesPoint[];
  totales: TotalesCajaBanco;
}

// Componente de Filtros
const Filters = ({
  onDateRangeChange,
  onSucursalChange,
  onMonthChange,
  onRefresh,
}: {
  onDateRangeChange: (desde: string, hasta: string) => void;
  onSucursalChange: (sucursalId: string) => void;
  onMonthChange: (mes: string) => void;
  onRefresh: () => void;
}) => {
  // Fetch centralizado
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const fetchDataSucursales = async () => {
    try {
      const dt = await getSucursales();
      setSucursales(dt);
    } finally {
    }
  };
  useEffect(() => {
    fetchDataSucursales();
  }, []);

  const [desde, setDesde] = useState("2025-08-01");
  const [hasta, setHasta] = useState("2025-08-16");
  const [sucursal, setSucursal] = useState("todas");
  const [mes, setMes] = useState("2025-08");

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="flex flex-wrap gap-4 p-4 bg-card rounded-lg border"
    >
      <div className="flex items-center gap-2">
        <CalendarRange className="h-4 w-4 text-muted-foreground" />
        <input
          type="date"
          value={desde}
          onChange={(e) => {
            setDesde(e.target.value);
            onDateRangeChange(e.target.value, hasta);
          }}
          className="px-3 py-2 border rounded-md text-sm"
        />
        <span className="text-muted-foreground">hasta</span>
        <input
          type="date"
          value={hasta}
          onChange={(e) => {
            setHasta(e.target.value);
            onDateRangeChange(desde, e.target.value);
          }}
          className="px-3 py-2 border rounded-md text-sm"
        />
      </div>

      <Select
        value={sucursal}
        onValueChange={(value) => {
          setSucursal(value);
          onSucursalChange(value);
        }}
      >
        <SelectTrigger className="w-48">
          <Building2 className="h-4 w-4 mr-2" />
          <SelectValue placeholder="Seleccionar sucursal" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todas">Todas las sucursales</SelectItem>

          {sucursales &&
            sucursales.map((s) => (
              <SelectItem value={String(s.id)}>{s.nombre}</SelectItem>
            ))}
        </SelectContent>
      </Select>

      <Select
        value={mes}
        onValueChange={(value) => {
          setMes(value);
          onMonthChange(value);
        }}
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Mes" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="2025-08">Agosto 2025</SelectItem>
          <SelectItem value="2025-07">Julio 2025</SelectItem>
          <SelectItem value="2025-06">Junio 2025</SelectItem>
        </SelectContent>
      </Select>

      <Button onClick={onRefresh} variant="outline" size="sm">
        <RefreshCw className="h-4 w-4 mr-2" />
        Actualizar
      </Button>
    </motion.div>
  );
};

// Componente de KPIs
const KPIs = ({
  totales,
  loading,
}: {
  totales: TotalesCajaBanco | null;
  loading: boolean;
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!totales) return null;

  const kpis = [
    {
      title: "Saldo Inicio",
      value: totales.caja.saldoInicio,
      icon: Calculator,
      tooltip: "Saldo inicial de caja al inicio del período",
    },
    {
      title: "Ingresos",
      value: totales.caja.ingresos,
      icon: TrendingUp,
      tooltip: "Total de ingresos en efectivo del período",
    },
    {
      title: "Egresos",
      value: totales.caja.egresos,
      icon: TrendingDown,
      tooltip: "Total de egresos y gastos del período",
    },
    {
      title: "Saldo Final",
      value: totales.caja.saldoFinal,
      icon: Banknote,
      tooltip: "Saldo final de caja al cierre del período",
    },
    {
      title: "Resultado Operativo",
      value: totales.caja.resultadoOperativo,
      icon: Calculator,
      tooltip: "Resultado operativo (ventas - costos - gastos)",
    },
    {
      title: "Ingreso Banco",
      value: totales.banco.ingresos,
      icon: Building2,
      tooltip: "Total de depósitos bancarios del período",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {kpis.map((kpi, index) => (
        <motion.div
          key={kpi.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: index * 0.05 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                {kpi.title}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">{kpi.tooltip}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardTitle>
              <kpi.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formattMonedaGT(kpi.value)}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

// Componente de Gráfica Mensual
const MonthlyChart = ({
  data,
  loading,
}: {
  data: FlujoMensualSeriesPoint[];
  loading: boolean;
}) => {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-80 w-full" />
        </CardContent>
      </Card>
    );
  }

  const chartData = data.filter((d) => d.ingresos > 0 || d.egresos > 0);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Flujo de Caja Mensual</CardTitle>
          <CardDescription>
            Ingresos vs Egresos, Depósitos Bancarios y P&L
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="fecha"
                tickFormatter={(value) => new Date(value).getDate().toString()}
              />
              <YAxis tickFormatter={(value) => formattMonedaGT(value)} />
              <RechartsTooltip
                formatter={(value: number) => formattMonedaGT(value)}
                labelFormatter={(label) =>
                  `Fecha: ${formateDateWithMinutes(label)}`
                }
              />
              <Legend />
              <Bar
                dataKey="ingresos"
                fill="hsl(var(--chart-1))"
                name="Ingresos"
              />
              <Bar
                dataKey="egresos"
                fill="hsl(var(--chart-2))"
                name="Egresos"
              />
              <Line
                type="monotone"
                dataKey="depositoBanco"
                stroke="hsl(var(--chart-3))"
                name="Depósito Banco"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="pnl"
                stroke="hsl(var(--chart-4))"
                name="P&L"
                strokeWidth={2}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Componente de Tabla por Días
const DaysTable = ({
  dias,
  loading,
}: {
  dias: ResumenHistoricoDia[];
  loading: boolean;
}) => {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const diasConDatos = dias.filter((dia) => dia.items.length > 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Resumen por Días</CardTitle>
          <CardDescription>Detalle diario por sucursal</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {diasConDatos.map((dia) => {
              const totalDia = dia.items.reduce(
                (acc, item) => ({
                  ingresos: acc.ingresos + item.ingresos,
                  egresos: acc.egresos + item.egresos,
                  saldoFinal: acc.saldoFinal + item.saldoFinal,
                }),
                { ingresos: 0, egresos: 0, saldoFinal: 0 }
              );

              const isBalanced = Math.abs(totalDia.saldoFinal) < 0.01;

              return (
                <AccordionItem key={dia.fecha} value={dia.fecha}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center justify-between w-full pr-4">
                      <div className="flex items-center gap-4">
                        <span className="font-medium">
                          {formateDateWithMinutes(dia.fecha)}
                        </span>
                        <Badge variant={isBalanced ? "default" : "destructive"}>
                          {isBalanced ? (
                            <>
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              OK
                            </>
                          ) : (
                            <>
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Atención
                            </>
                          )}
                        </Badge>
                      </div>
                      <div className="flex gap-4 text-sm text-muted-foreground">
                        <span>
                          Ingresos: {formattMonedaGT(totalDia.ingresos)}
                        </span>
                        <span>
                          Egresos: {formattMonedaGT(totalDia.egresos)}
                        </span>
                        <span>
                          Saldo: {formattMonedaGT(totalDia.saldoFinal)}
                        </span>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-2">Sucursal</th>
                            <th className="text-right p-2">Saldo Inicio</th>
                            <th className="text-right p-2">Ventas</th>
                            <th className="text-right p-2">Otros Ingresos</th>
                            <th className="text-right p-2">Ingresos</th>
                            <th className="text-right p-2">Gasto Oper.</th>
                            <th className="text-right p-2">Costo Venta</th>
                            <th className="text-right p-2">Dep. Proveedor</th>
                            <th className="text-right p-2">Dep. Cierre</th>
                            <th className="text-right p-2">Otros Egresos</th>
                            <th className="text-right p-2">Egresos</th>
                            <th className="text-right p-2">Saldo Final</th>
                            <th className="text-right p-2">Registros</th>
                          </tr>
                        </thead>
                        <tbody>
                          {dia.items.map((item) => (
                            <motion.tr
                              key={`${item.fecha}-${item.sucursal.id}`}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.1 }}
                              className="border-b hover:bg-muted/50"
                            >
                              <td className="p-2 font-medium">
                                {item.sucursal.nombre}
                              </td>
                              <td className="p-2 text-right">
                                {formattMonedaGT(item.saldoInicio)}
                              </td>
                              <td className="p-2 text-right">
                                {formattMonedaGT(item.totales.ventasEfectivo)}
                              </td>
                              <td className="p-2 text-right">
                                {formattMonedaGT(item.totales.otrosIngresos)}
                              </td>
                              <td className="p-2 text-right font-medium">
                                {formattMonedaGT(item.ingresos)}
                              </td>
                              <td className="p-2 text-right">
                                {formattMonedaGT(item.totales.gastosOperativos)}
                              </td>
                              <td className="p-2 text-right">
                                {formattMonedaGT(item.totales.costoVenta)}
                              </td>
                              <td className="p-2 text-right">
                                {formattMonedaGT(
                                  item.totales.depositosProveedor
                                )}
                              </td>
                              <td className="p-2 text-right">
                                {formattMonedaGT(item.totales.depositosCierre)}
                              </td>
                              <td className="p-2 text-right">
                                {formattMonedaGT(item.totales.otrosEgresos)}
                              </td>
                              <td className="p-2 text-right font-medium">
                                {formattMonedaGT(item.egresos)}
                              </td>
                              <td className="p-2 text-right font-medium">
                                {formattMonedaGT(item.saldoFinal)}
                              </td>
                              <td className="p-2 text-right">
                                {item.registros}
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Componente principal
export default function ResumenHistoricoPage() {
  const [loading, setLoading] = useState(false);

  const [historicoData, setHistoricoData] =
    useState<ResumenHistoricoResponse | null>(null);
  const [flujoMensualData, setFlujoMensualData] =
    useState<FlujoMensualResponse | null>(null);

  // === Filtros controlados ===
  const [filtros, setFiltros] = useState<{
    desde: string; // YYYY-MM-DD
    hasta: string; // YYYY-MM-DD
    mes: string; // YYYY-MM
    sucursalId?: number;
  }>(() => ({
    desde: dayjs().startOf("month").format("YYYY-MM-DD"),
    hasta: dayjs().format("YYYY-MM-DD"),
    mes: dayjs().format("YYYY-MM"),
  }));

  // Handlers que solo actualizan filtros
  const handleDateRangeChange = (desde: string, hasta: string) =>
    setFiltros((f) => ({ ...f, desde, hasta }));

  const handleSucursalChange = (sucursalId: string) =>
    setFiltros((f) => ({
      ...f,
      sucursalId: sucursalId ? Number(sucursalId) : undefined,
    }));

  const handleMonthChange = (mes: string) => setFiltros((f) => ({ ...f, mes }));

  // Fetch centralizado
  const fetchData = async () => {
    setLoading(true);
    try {
      const [historico, flujo] = await Promise.all([
        getHistoricoData({
          desde: filtros.desde,
          hasta: filtros.hasta,
          sucursalId: filtros.sucursalId,
        }),
        getFlujoMensual({
          mes: filtros.mes,
          sucursalId: filtros.sucursalId,
        }),
      ]);
      setHistoricoData(historico);
      setFlujoMensualData(flujo);
    } catch (err: any) {
      toast.error(err?.message ?? "Error al cargar datos");
    } finally {
      setLoading(false);
    }
  };

  // Carga inicial y cada vez que cambien filtros
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtros.desde, filtros.hasta, filtros.mes, filtros.sucursalId]);

  const handleRefresh = () => {
    fetchData();
  };

  const handleExportCSV = () => {
    if (!historicoData) return;
    const rows: (string | number)[][] = [
      [
        "Fecha",
        "Sucursal",
        "Saldo Inicio",
        "Ventas Efectivo",
        "Otros Ingresos",
        "Ingresos",
        "Gastos Operativos",
        "Costo Venta",
        "Depósitos Proveedor",
        "Depósitos Cierre",
        "Otros Egresos",
        "Egresos",
        "Saldo Final",
        "Registros",
      ],
    ];
    historicoData.dias.forEach((dia) => {
      dia.items.forEach((item) => {
        rows.push([
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
        ]);
      });
    });
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `resumen-historico-${historicoData.desde}-${historicoData.hasta}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <TooltipProvider>
      <div className="container mx-auto p-6 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Caja ▸ Resumen Histórico</h1>
              <p className="text-muted-foreground">
                Panel administrativo de análisis histórico de caja
              </p>
            </div>
            <Button onClick={handleExportCSV} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exportar CSV
            </Button>
          </div>
        </motion.div>

        <Filters
          onDateRangeChange={handleDateRangeChange}
          onSucursalChange={handleSucursalChange}
          onMonthChange={handleMonthChange}
          onRefresh={handleRefresh}
        />

        <KPIs totales={historicoData?.totales || null} loading={loading} />

        <MonthlyChart data={flujoMensualData?.series || []} loading={loading} />

        <DaysTable dias={historicoData?.dias || []} loading={loading} />

        {!loading && (!historicoData || historicoData.dias.length === 0) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="text-center py-12"
          >
            <Calculator className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">
              No hay datos disponibles
            </h3>
            <p className="text-muted-foreground">
              No se encontraron registros para el rango de fechas seleccionado.
            </p>
          </motion.div>
        )}
      </div>
    </TooltipProvider>
  );
}
