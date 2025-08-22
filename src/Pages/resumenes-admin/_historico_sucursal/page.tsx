"use client";

import type React from "react";
import { useEffect, useMemo, useState } from "react";
import {
  Calendar,
  TrendingUp,
  TrendingDown,
  DollarSign,
  CreditCard,
  Building2,
  AlertTriangle,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { format } from "date-fns";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import tz from "dayjs/plugin/utc";
import { TZGT } from "@/Pages/Utils/Utils";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getHistoricoGlobal } from "../api/api";
import { es } from "date-fns/locale";
dayjs.extend(utc);
dayjs.extend(tz);
dayjs.locale("es");

interface HistoricoSucursalResponse {
  rango: {
    from: string;
    to: string;
    tz: string;
  };
  sucursalId: number;
  days: Array<{
    fecha: string;
    snapshotId: number;
    caja: {
      inicio: number;
      ingresos: number;
      egresos: number;
      final: number;
    };
    banco: {
      inicio: number;
      ingresos: number;
      egresos: number;
      final: number;
    };
    ventas: {
      total: number;
      cantidad: number;
      efectivo: number;
      porMetodo: Record<string, number>;
    };
    egresos: {
      costosVenta: number;
      gastosOperativos: number;
      depositosCajaABanco: number;
    };
    depositos: {
      totalMonto: number;
      totalCantidad: number;
    };
    flags: {
      sinSnapshot: boolean;
      descuadreCajaVsEfectivo: boolean;
    };
    warnings: string[];
  }>;
  periodSummary: {
    caja: {
      inicio: number;
      ingresos: number;
      egresos: number;
      final: number;
    };
    banco: {
      inicio: number;
      ingresos: number;
      egresos: number;
      final: number;
    };
    ventas: {
      total: number;
      cantidad: number;
      efectivo: number;
    };
    egresos: {
      costosVenta: number;
      gastosOperativos: number;
      depositosCajaABanco: number;
    };
    depositos: {
      totalMonto: number;
      totalCantidad: number;
    };
    alerts: string[];
  };
}

const currency = (n: number) =>
  n?.toLocaleString("es-GT", {
    style: "currency",
    currency: "GTQ",
    maximumFractionDigits: 2,
  }) ?? "Q0.00";

const formatCompact = (n: number) => {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
};

type RangeTuple = [Date | null, Date | null];

function HistoricoSucursal() {
  const [dateRange, setDateRange] = useState<RangeTuple>([
    dayjs().tz(TZGT).subtract(1, "day").startOf("day").toDate(),
    dayjs().tz(TZGT).startOf("day").toDate(),
  ]);

  const [startDate, endDate] = dateRange;
  const handleSelectRange = (update: [Date | null, Date | null] | null) => {
    if (!update) {
      setDateRange([null, null]);
      return;
    }
    const [start, end] = update;
    setDateRange([start, end]);
  };

  // Cuando necesites enviar al server:
  const fromISO = startDate
    ? dayjs(startDate).tz(TZGT).format("YYYY-MM-DD")
    : null;

  const toISOExclusive = endDate
    ? dayjs(endDate).tz(TZGT).format("YYYY-MM-DD")
    : null;

  const [loading, setLoading] = useState(false);
  const [historico, setHistorico] = useState<HistoricoSucursalResponse | null>(
    null
  );
  console.log(loading);

  async function fetchData() {
    if (!startDate || !endDate) {
      return;
    }
    try {
      setLoading(true);
      const dt = await getHistoricoGlobal(fromISO, toISOExclusive);
      setHistorico(dt);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  console.log("El inicio y fin son: ", startDate, endDate);

  useEffect(() => {
    if (dateRange[0] && dateRange[1]) {
      console.log("Buscando...");

      const timeoutId = setTimeout(() => {
        fetchData();
      }, 500); // Debounce for 500ms
      return () => clearTimeout(timeoutId);
    }
  }, [dateRange[0], dateRange[1]]);

  const trendData = useMemo(() => {
    if (!historico?.days?.length) return [];
    return historico.days.map((d) => ({
      fecha: format(new Date(d.fecha), "dd/MM"),
      cajaFinal: d.caja?.final ?? 0,
      bancoFinal: d.banco?.final ?? 0,
      total: (d.caja?.final ?? 0) + (d.banco?.final ?? 0),
    }));
  }, [historico]);

  const flowData = useMemo(() => {
    if (!historico?.days?.length) return [];
    return historico.days.map((d) => ({
      fecha: format(new Date(d.fecha), "dd/MM"),
      ingresos: (d.caja?.ingresos ?? 0) + (d.banco?.ingresos ?? 0),
      egresos: (d.caja?.egresos ?? 0) + (d.banco?.egresos ?? 0),
      ventas: d.ventas?.total ?? 0,
    }));
  }, [historico]);

  const ventasPorMetodo = useMemo(() => {
    if (!historico?.days?.length) return [];
    const acc: Record<string, number> = {};
    for (const day of historico.days) {
      const metodos = day.ventas?.porMetodo ?? {};
      for (const [metodo, monto] of Object.entries(metodos)) {
        acc[metodo] = (acc[metodo] ?? 0) + (monto ?? 0);
      }
    }
    return Object.entries(acc)
      .map(([name, value]) => ({ name, value }))
      .filter((item) => item.value > 0);
  }, [historico]);

  const egresosData = useMemo(() => {
    if (!historico?.periodSummary?.egresos) return [];
    const {
      costosVenta = 0,
      gastosOperativos = 0,
      depositosCajaABanco = 0,
    } = historico.periodSummary.egresos;
    return [
      { name: "Costos Venta", value: costosVenta, icon: "📦" },
      { name: "Gastos Op.", value: gastosOperativos, icon: "⚙️" },
      { name: "Depósitos", value: depositosCajaABanco, icon: "🏦" },
    ].filter((item) => item.value > 0);
  }, [historico]);

  const pieColors = [
    "#3B82F6",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#8B5CF6",
    "#06B6D4",
  ];

  const hasAlerts = (historico?.periodSummary?.alerts?.length ?? 0) > 0;

  return (
    <div className="space-y-4 p-4 max-w-7xl mx-auto">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calendar className="h-5 w-5" />
            Filtros de Período
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <DatePicker
              locale={es}
              selectsRange
              startDate={startDate ?? undefined}
              endDate={endDate ?? undefined}
              onChange={handleSelectRange}
              onChangeRaw={(e) => {
                if (e) e.preventDefault();
              }}
              isClearable
              dateFormat="dd/MM/yyyy"
              placeholderText="Selecciona rango"
              // — estilizado del input —
              className="h-10 w-[280px] sm:w-[320px] rounded-md border border-input bg-background pl-9 pr-9 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 focus:ring-offset-2"
              // — estilizado del calendario / popper —
              calendarClassName="rounded-md border bg-popover p-2 text-popover-foreground shadow-md"
              popperClassName="z-50"
              popperPlacement="bottom-start"
              showPopperArrow={false}
              dayClassName={() =>
                "rounded-md text-sm hover:bg-accent hover:text-accent-foreground"
              }
            />
            {/* X de limpiar no invade el texto */}
            <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground/70">
              {/* espacio reservado para el botón clear del react-datepicker */}
            </span>
          </div>
        </CardContent>
      </Card>

      {historico && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <KpiCard
            title="Caja Final"
            value={currency(historico.periodSummary?.caja?.final ?? 0)}
            icon={<DollarSign className="h-5 w-5 text-green-600" />}
            trend={
              historico.periodSummary?.caja?.final >
              historico.periodSummary?.caja?.inicio
            }
          />
          <KpiCard
            title="Banco Final"
            value={currency(historico.periodSummary?.banco?.final ?? 0)}
            icon={<Building2 className="h-5 w-5 text-blue-600" />}
            trend={
              historico.periodSummary?.banco?.final >
              historico.periodSummary?.banco?.inicio
            }
          />
          <KpiCard
            title="Ventas Totales"
            value={currency(historico.periodSummary?.ventas?.total ?? 0)}
            sub={`${
              historico.periodSummary?.ventas?.cantidad ?? 0
            } transacciones`}
            icon={<CreditCard className="h-5 w-5 text-purple-600" />}
          />
          <KpiCard
            title="Depósitos"
            value={currency(
              historico.periodSummary?.depositos?.totalMonto ?? 0
            )}
            sub={`${
              historico.periodSummary?.depositos?.totalCantidad ?? 0
            } depósitos`}
            icon={<TrendingUp className="h-5 w-5 text-orange-600" />}
          />
        </div>
      )}

      {hasAlerts && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <div className="space-y-1">
                {historico?.periodSummary?.alerts?.map((alert, i) => (
                  <p key={i} className="text-sm text-orange-800">
                    {alert}
                  </p>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {historico && (
        <div className="grid lg:grid-cols-2 gap-4">
          {/* Combined Cash Flow */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Flujo de Efectivo</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={flowData}>
                  <defs>
                    <linearGradient id="ingresos" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="egresos" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="fecha" tick={{ fontSize: 12 }} />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    tickFormatter={formatCompact}
                  />
                  <Tooltip formatter={(v: number) => currency(v)} />
                  <Area
                    type="monotone"
                    dataKey="ingresos"
                    stroke="#10B981"
                    fill="url(#ingresos)"
                  />
                  <Area
                    type="monotone"
                    dataKey="egresos"
                    stroke="#EF4444"
                    fill="url(#egresos)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Balance Trend */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Balance Total</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={trendData}>
                  <XAxis dataKey="fecha" tick={{ fontSize: 12 }} />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    tickFormatter={formatCompact}
                  />
                  <Tooltip formatter={(v: number) => currency(v)} />
                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke="#8B5CF6"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Payment Methods */}
          {ventasPorMetodo.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Métodos de Pago</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={ventasPorMetodo}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={2}
                    >
                      {ventasPorMetodo.map((_, i) => (
                        <Cell key={i} fill={pieColors[i % pieColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v: number) => currency(v)} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-2 text-xs text-muted-foreground">
                  Efectivo:{" "}
                  {currency(historico.periodSummary?.ventas?.efectivo ?? 0)}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Expenses */}
          {egresosData.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Egresos del Período</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={egresosData} layout="horizontal">
                    <XAxis
                      type="number"
                      tick={{ fontSize: 12 }}
                      tickFormatter={formatCompact}
                    />
                    <YAxis
                      dataKey="name"
                      type="category"
                      tick={{ fontSize: 12 }}
                      width={80}
                    />
                    <Tooltip formatter={(v: number) => currency(v)} />
                    <Bar dataKey="value" fill="#8B5CF6" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {historico && historico.days.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Detalle Diario</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="py-2 pr-3 font-medium">Fecha</th>
                    <th className="py-2 pr-3 font-medium">Caja</th>
                    <th className="py-2 pr-3 font-medium">Banco</th>
                    <th className="py-2 pr-3 font-medium">Ventas</th>
                    <th className="py-2 pr-3 font-medium">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {historico.days.map((d) => (
                    <tr key={d.fecha} className="border-b hover:bg-muted/50">
                      <td className="py-2 pr-3 font-medium">
                        {format(new Date(d.fecha), "dd/MM")}
                      </td>
                      <td className="py-2 pr-3">
                        <div className="space-y-1">
                          <div className="font-medium">
                            {currency(d.caja?.final ?? 0)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            +{currency(d.caja?.ingresos ?? 0)} -
                            {currency(d.caja?.egresos ?? 0)}
                          </div>
                        </div>
                      </td>
                      <td className="py-2 pr-3">
                        <div className="space-y-1">
                          <div className="font-medium">
                            {currency(d.banco?.final ?? 0)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            +{currency(d.banco?.ingresos ?? 0)} -
                            {currency(d.banco?.egresos ?? 0)}
                          </div>
                        </div>
                      </td>
                      <td className="py-2 pr-3">
                        <div className="space-y-1">
                          <div className="font-medium">
                            {currency(d.ventas?.total ?? 0)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {d.ventas?.cantidad ?? 0} trans.
                          </div>
                        </div>
                      </td>
                      <td className="py-2 pr-3">
                        <div className="flex flex-wrap gap-1">
                          {d.flags?.sinSnapshot && (
                            <Badge variant="secondary" className="text-xs">
                              Sin snapshot
                            </Badge>
                          )}
                          {d.flags?.descuadreCajaVsEfectivo && (
                            <Badge variant="destructive" className="text-xs">
                              Descuadre
                            </Badge>
                          )}
                          {!d.flags?.sinSnapshot &&
                            !d.flags?.descuadreCajaVsEfectivo && (
                              <Badge
                                variant="default"
                                className="text-xs bg-green-100 text-green-800"
                              >
                                OK
                              </Badge>
                            )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default HistoricoSucursal;

function KpiCard({
  title,
  value,
  sub,
  icon,
  trend,
}: {
  title: string;
  value: string;
  sub?: string;
  icon?: React.ReactNode;
  trend?: boolean;
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-lg font-semibold">{value}</p>
            {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
          </div>
          <div className="flex flex-col items-center gap-1">
            {icon}
            {trend !== undefined &&
              (trend ? (
                <TrendingUp className="h-3 w-3 text-green-500" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500" />
              ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
