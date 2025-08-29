import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ComposedChart,
  Bar,
  Brush,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import dayjs from "dayjs";
import { useMemo, useState } from "react";
import { FlujoSucursalDiaUI } from "../interfaces/interface2";

// Paleta estética consistente
const palette = {
  lineaCaja: "#22c55e", // verde
  lineaBanco: "#3b82f6", // azul
  lineaTotal: "#9333ea", // morado

  ingCaja: "#16a34a",
  egrCaja: "#ef4444",
  ingBanco: "#34d399",
  egrBanco: "#f59e0b",

  variacion: "#0ea5e9", // celeste
};

const GTQ = new Intl.NumberFormat("es-GT", {
  style: "currency",
  currency: "GTQ",
});

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border bg-background/95 p-2 text-xs shadow-sm">
      <p className="mb-1 font-medium">{label}</p>
      <ul className="space-y-0.5">
        {payload.map((p: any) => (
          <li
            key={p.dataKey}
            className="flex items-center justify-between gap-6"
          >
            <span className="flex items-center gap-2">
              <span
                className="inline-block h-2.5 w-2.5 rounded-sm"
                style={{ background: p.color }}
              />
              {p.name}
            </span>
            <span className="tabular-nums">{GTQ.format(p.value ?? 0)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SucursalCharts({ data }: { data: FlujoSucursalDiaUI[] }) {
  const rows = useMemo(
    () =>
      (data ?? []).map((d) => ({
        date: dayjs(d.fechaDia).format("DD/MM"),
        saldoCaja: d.saldoFinalCaja,
        saldoBanco: d.saldoFinalBanco,
        saldoTotal: d.saldoFinalTotal,
        ingresosCaja: d.ingresosCaja,
        egresosCaja: d.egresosCaja,
        ingresosBanco: d.ingresosBanco,
        egresosBanco: d.egresosBanco,
        variacionNeta: d.variacionNetaDia,
      })),
    [data]
  );

  const [hidden, setHidden] = useState<Record<string, boolean>>({});
  const toggle = (k: string) => setHidden((s) => ({ ...s, [k]: !s[k] }));

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
      {/* Líneas: saldos finales (Caja, Banco y Total) */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">
            Saldo final — Caja vs Banco vs Total
          </CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={rows}
              margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis tickFormatter={(v) => GTQ.format(v)} width={72} />
              <Tooltip content={<CustomTooltip />} />
              <Legend onClick={(e: any) => e?.dataKey && toggle(e.dataKey)} />
              {!hidden["saldoCaja"] && (
                <Line
                  type="monotone"
                  dataKey="saldoCaja"
                  name="Saldo Caja"
                  stroke={palette.lineaCaja}
                  strokeWidth={2}
                  dot={{ r: 2 }}
                />
              )}
              {!hidden["saldoBanco"] && (
                <Line
                  type="monotone"
                  dataKey="saldoBanco"
                  name="Saldo Banco"
                  stroke={palette.lineaBanco}
                  strokeWidth={2}
                  dot={{ r: 2 }}
                />
              )}
              {!hidden["saldoTotal"] && (
                <Line
                  type="monotone"
                  dataKey="saldoTotal"
                  name="Saldo Total"
                  stroke={palette.lineaTotal}
                  strokeWidth={3}
                  dot={{ r: 2.5 }}
                />
              )}
              {rows.length > 12 && (
                <Brush dataKey="date" height={16} className="fill-muted" />
              )}
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Barras: ingresos/egresos por canal + línea de variación */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">
            Ingresos / Egresos — Caja & Banco (por día)
          </CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={rows}
              margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis tickFormatter={(v) => GTQ.format(v)} width={72} />
              <Tooltip content={<CustomTooltip />} />
              <Legend onClick={(e: any) => e?.dataKey && toggle(e.dataKey)} />

              {!hidden["ingresosCaja"] && (
                <Bar
                  dataKey="ingresosCaja"
                  name="Ingresos Caja"
                  fill={palette.ingCaja}
                  radius={[6, 6, 0, 0]}
                />
              )}
              {!hidden["egresosCaja"] && (
                <Bar
                  dataKey="egresosCaja"
                  name="Egresos Caja"
                  fill={palette.egrCaja}
                  radius={[6, 6, 0, 0]}
                />
              )}
              {!hidden["ingresosBanco"] && (
                <Bar
                  dataKey="ingresosBanco"
                  name="Ingresos Banco"
                  fill={palette.ingBanco}
                  radius={[6, 6, 0, 0]}
                />
              )}
              {!hidden["egresosBanco"] && (
                <Bar
                  dataKey="egresosBanco"
                  name="Egresos Banco"
                  fill={palette.egrBanco}
                  radius={[6, 6, 0, 0]}
                />
              )}
              {!hidden["variacionNeta"] && (
                <Line
                  type="monotone"
                  dataKey="variacionNeta"
                  name="Variación neta día"
                  stroke={palette.variacion}
                  strokeWidth={2}
                  dot={{ r: 2 }}
                />
              )}
              {rows.length > 12 && (
                <Brush dataKey="date" height={16} className="fill-muted" />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
