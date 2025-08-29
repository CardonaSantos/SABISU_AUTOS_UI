import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ComposedChart,
  Bar,
  Line,
  AreaChart,
  Area,
  Brush,
} from "recharts";
import dayjs from "dayjs";
import { useMemo, useState } from "react";
import { CostoVentaPorDiaUI } from "../costoVentasHistoricosTypes";

const GTQ = new Intl.NumberFormat("es-GT", {
  style: "currency",
  currency: "GTQ",
});

const palette = {
  MERCADERIA: "#22c55e", // verde
  FLETE: "#9ca3af", // gris
  ENCOMIENDA: "#f59e0b", // naranja
  TRANSPORTE: "#3b82f6", // azul
  OTROS: "#8b5cf6", // morado
  total: "#10b981", // línea total
  caja: "#0ea5e9", // celeste
  banco: "#22c55e", // verde
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

export function ChartsCV({ porDia }: { porDia: CostoVentaPorDiaUI[] }) {
  const categories = [
    "MERCADERIA",
    "FLETE",
    "ENCOMIENDA",
    "TRANSPORTE",
    "OTROS",
  ] as const;

  const data = useMemo(
    () =>
      (porDia ?? []).map((d) => {
        const base: any = {
          date: dayjs(d.fecha).format("DD/MM"),
          total: d.total,
          caja: d.caja ?? 0,
          banco: d.banco ?? 0,
        };
        categories.forEach((k) => (base[k] = (d as any)[k] ?? 0));
        return base;
      }),
    [porDia]
  );

  const [hidden, setHidden] = useState<Record<string, boolean>>({});
  const toggle = (k: string) => setHidden((s) => ({ ...s, [k]: !s[k] }));
  const isHidden = (k: string) => !!hidden[k];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
      {/* Comparativo diario por categoría + líneas por canal + total */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">
            Comparativo diario (categoría / canal)
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

              {categories.map((k) =>
                isHidden(k) ? null : (
                  <Bar
                    key={k}
                    dataKey={k}
                    name={k}
                    fill={(palette as any)[k]}
                    radius={[6, 6, 0, 0]}
                  />
                )
              )}

              {!isHidden("caja") && (
                <Line
                  type="monotone"
                  dataKey="caja"
                  name="Caja"
                  stroke={palette.caja}
                  strokeWidth={2}
                  dot={{ r: 2 }}
                />
              )}
              {!isHidden("banco") && (
                <Line
                  type="monotone"
                  dataKey="banco"
                  name="Banco"
                  stroke={palette.banco}
                  strokeWidth={2}
                  dot={{ r: 2 }}
                />
              )}
              {!isHidden("total") && (
                <Line
                  type="monotone"
                  dataKey="total"
                  name="Total"
                  stroke={palette.total}
                  strokeWidth={3}
                  dot={{ r: 3 }}
                />
              )}

              {data.length > 12 && (
                <Brush dataKey="date" height={16} className="fill-muted" />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Participación porcentual por día (stack 100%) */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">
            Participación porcentual por día
          </CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              stackOffset="expand"
              margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis
                tickFormatter={(v) => `${Math.round(v * 100)}%`}
                width={56}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend onClick={(e: any) => e?.dataKey && toggle(e.dataKey)} />

              {categories.map((k) =>
                isHidden(k) ? null : (
                  <Area
                    key={k}
                    type="monotone"
                    dataKey={k}
                    name={k}
                    stackId="1"
                    fill={(palette as any)[k]}
                    stroke={(palette as any)[k]}
                    fillOpacity={0.35}
                  />
                )
              )}
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
