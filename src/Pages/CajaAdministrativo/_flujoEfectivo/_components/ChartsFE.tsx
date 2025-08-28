import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ComposedChart,
  Line,
  Bar,
  Brush,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import dayjs from "dayjs";
import { useMemo, useState } from "react";
import {
  FlujoEfectivoPorDiaUI,
  FlujoEfectivoResumenUI,
} from "../Interface/flujoEfectivo";

const GTQ = new Intl.NumberFormat("es-GT", {
  style: "currency",
  currency: "GTQ",
});
const palette = {
  ingresos: "#16a34a",
  egresos: "#ef4444",
  lineaCaja: "#22c55e",
  lineaBanco: "#3b82f6",
  lineaTotal: "#9333ea",
  caja: "#10b981",
  banco: "#3b82f6",
};

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

export function ChartsFE({
  porDia,
  resumen,
}: {
  porDia: FlujoEfectivoPorDiaUI[];
  resumen: FlujoEfectivoResumenUI;
}) {
  const data = useMemo(
    () =>
      (porDia ?? []).map((d) => ({
        date: dayjs(d.fecha).format("DD/MM"),
        ingresosCaja: d.ingresosCaja,
        egresosCaja: d.egresosCaja,
        ingresosBanco: d.ingresosBanco,
        egresosBanco: d.egresosBanco,
        saldoFinalCaja: d.saldoFinalCaja,
        saldoFinalBanco: d.saldoFinalBanco,
        saldoFinalTotal: d.saldoFinalTotal,
      })),
    [porDia]
  );

  const egresosPie = useMemo(
    () => [
      {
        name: "Egresos Caja",
        value: Math.abs(resumen.egresosCaja),
        color: palette.caja,
      },
      {
        name: "Egresos Banco",
        value: Math.abs(resumen.egresosBanco),
        color: palette.banco,
      },
    ],
    [resumen.egresosCaja, resumen.egresosBanco]
  );

  const [hidden, setHidden] = useState<Record<string, boolean>>({});
  const toggle = (k: string) => setHidden((s) => ({ ...s, [k]: !s[k] }));

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
      {/* Evolución de saldos (tendencias) */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">
            Evolución de saldos (Caja, Banco, Total)
          </CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={data}
              margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis tickFormatter={(v) => GTQ.format(v)} width={72} />
              <Tooltip content={<CustomTooltip />} />
              <Legend onClick={(e: any) => e?.dataKey && toggle(e.dataKey)} />
              {!hidden["saldoFinalCaja"] && (
                <Line
                  type="monotone"
                  dataKey="saldoFinalCaja"
                  name="Saldo Caja"
                  stroke={palette.lineaCaja}
                  strokeWidth={2}
                  dot={{ r: 2 }}
                />
              )}
              {!hidden["saldoFinalBanco"] && (
                <Line
                  type="monotone"
                  dataKey="saldoFinalBanco"
                  name="Saldo Banco"
                  stroke={palette.lineaBanco}
                  strokeWidth={2}
                  dot={{ r: 2 }}
                />
              )}
              {!hidden["saldoFinalTotal"] && (
                <Line
                  type="monotone"
                  dataKey="saldoFinalTotal"
                  name="Saldo Total"
                  stroke={palette.lineaTotal}
                  strokeWidth={3}
                  dot={{ r: 2.5 }}
                />
              )}
              {data.length > 12 && (
                <Brush dataKey="date" height={16} className="fill-muted" />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Comparativo ingresos vs egresos (Caja/Banco) */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">
            Ingresos y Egresos por día (Caja/Banco)
          </CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={data}
              margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis tickFormatter={(v) => GTQ.format(v)} width={72} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar
                dataKey="ingresosCaja"
                name="Ingresos Caja"
                fill={palette.ingresos}
                radius={[6, 6, 0, 0]}
              />
              <Bar
                dataKey="egresosCaja"
                name="Egresos Caja"
                fill={palette.egresos}
                radius={[6, 6, 0, 0]}
              />
              <Bar
                dataKey="ingresosBanco"
                name="Ingresos Banco"
                fill="#34d399"
                radius={[6, 6, 0, 0]}
              />
              <Bar
                dataKey="egresosBanco"
                name="Egresos Banco"
                fill="#f87171"
                radius={[6, 6, 0, 0]}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Insight: composición de egresos por medio */}
      <Card className="xl:col-span-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">
            Composición de egresos por medio
          </CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip formatter={(v: number) => GTQ.format(v)} />
              <Legend />
              <Pie
                data={egresosPie}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={4}
                label
              >
                {egresosPie.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
