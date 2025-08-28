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
import { CostosVentaPorDiaUI } from "../costoVentasHistoricosTypes";

const GTQ = new Intl.NumberFormat("es-GT", {
  style: "currency",
  currency: "GTQ",
});

const palette = {
  mercaderia: "#22c55e", // verde
  fletes: "#9ca3af", // gris
  encomiendas: "#f59e0b", // naranja
  transporte: "#3b82f6", // azul
  otros: "#8b5cf6", // morado
  total: "#10b981", // línea total (emerald)
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

export function ChartsCV({ porDia }: { porDia: CostosVentaPorDiaUI[] }) {
  const data = useMemo(
    () =>
      (porDia ?? []).map((d) => ({
        date: dayjs(d.fecha).format("DD/MM"),
        total: d.total,
        mercaderia: d.mercaderia,
        fletes: d.fletes,
        encomiendas: d.encomiendas,
        transporte: d.transporte,
        otros: d.otros,
      })),
    [porDia]
  );

  // Permitir ocultar series desde la leyenda (clic)
  const [hidden, setHidden] = useState<Record<string, boolean>>({});
  const toggle = (k: string) => setHidden((s) => ({ ...s, [k]: !s[k] }));
  const isHidden = (k: string) => !!hidden[k];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
      {/* Combo: Barras agrupadas + línea de Total (comparación clara) */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">
            Comparativo diario por categoría + Total
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

              {!isHidden("mercaderia") && (
                <Bar
                  dataKey="mercaderia"
                  name="Mercadería"
                  fill={palette.mercaderia}
                  radius={[6, 6, 0, 0]}
                />
              )}
              {!isHidden("fletes") && (
                <Bar
                  dataKey="fletes"
                  name="Fletes"
                  fill={palette.fletes}
                  radius={[6, 6, 0, 0]}
                />
              )}
              {!isHidden("encomiendas") && (
                <Bar
                  dataKey="encomiendas"
                  name="Encomiendas"
                  fill={palette.encomiendas}
                  radius={[6, 6, 0, 0]}
                />
              )}
              {!isHidden("transporte") && (
                <Bar
                  dataKey="transporte"
                  name="Transporte"
                  fill={palette.transporte}
                  radius={[6, 6, 0, 0]}
                />
              )}
              {!isHidden("otros") && (
                <Bar
                  dataKey="otros"
                  name="Otros"
                  fill={palette.otros}
                  radius={[6, 6, 0, 0]}
                />
              )}

              {!isHidden("total") && (
                <Line
                  type="monotone"
                  dataKey="total"
                  name="Total"
                  stroke={palette.total}
                  strokeWidth={2}
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

      {/* 100% apilado para ver proporciones (lectura de composición) */}
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

              {!isHidden("mercaderia") && (
                <Area
                  type="monotone"
                  dataKey="mercaderia"
                  name="Mercadería"
                  stackId="1"
                  fill={palette.mercaderia}
                  stroke={palette.mercaderia}
                  fillOpacity={0.35}
                />
              )}
              {!isHidden("fletes") && (
                <Area
                  type="monotone"
                  dataKey="fletes"
                  name="Fletes"
                  stackId="1"
                  fill={palette.fletes}
                  stroke={palette.fletes}
                  fillOpacity={0.35}
                />
              )}
              {!isHidden("encomiendas") && (
                <Area
                  type="monotone"
                  dataKey="encomiendas"
                  name="Encomiendas"
                  stackId="1"
                  fill={palette.encomiendas}
                  stroke={palette.encomiendas}
                  fillOpacity={0.35}
                />
              )}
              {!isHidden("transporte") && (
                <Area
                  type="monotone"
                  dataKey="transporte"
                  name="Transporte"
                  stackId="1"
                  fill={palette.transporte}
                  stroke={palette.transporte}
                  fillOpacity={0.35}
                />
              )}
              {!isHidden("otros") && (
                <Area
                  type="monotone"
                  dataKey="otros"
                  name="Otros"
                  stackId="1"
                  fill={palette.otros}
                  stroke={palette.otros}
                  fillOpacity={0.35}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
