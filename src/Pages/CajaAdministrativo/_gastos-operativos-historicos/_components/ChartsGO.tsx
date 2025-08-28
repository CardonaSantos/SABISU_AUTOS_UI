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
  Brush,
} from "recharts";
import dayjs from "dayjs";
import { useMemo, useState } from "react";
import { GastoOperativoPorDiaUI } from "../Interfaces/gastosOperativosInterfaces";
import { formattMonedaGT } from "@/utils/formattMoneda";

const palette: Record<string, string> = {
  SALARIO: "#16a34a",
  ENERGIA: "#f59e0b",
  LOGISTICA: "#3b82f6",
  RENTA: "#f43f5e",
  INTERNET: "#6366f1",
  PUBLICIDAD: "#8b5cf6",
  VIATICOS: "#fb923c",
  OTROS: "#a855f7",
  total: "#10b981",
};

const labelMap: Record<string, string> = {
  SALARIO: "Salario",
  ENERGIA: "Energía",
  LOGISTICA: "Logística",
  RENTA: "Renta",
  INTERNET: "Internet",
  PUBLICIDAD: "Publicidad",
  VIATICOS: "Viáticos",
  OTROS: "Otros",
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
            <span className="tabular-nums">
              {formattMonedaGT(p.value ?? 0)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ChartsGO({ porDia }: { porDia: GastoOperativoPorDiaUI[] }) {
  const categories = useMemo(() => {
    const fixed = [
      "SALARIO",
      "ENERGIA",
      "LOGISTICA",
      "RENTA",
      "INTERNET",
      "PUBLICIDAD",
      "VIATICOS",
      "OTROS",
    ];
    // Mantenemos orden fijo, pero filtramos a las que existan en la data
    const hasAny = (k: string) =>
      (porDia ?? []).some((d) => (d as any)[k] && (d as any)[k]! > 0);
    return fixed.filter(hasAny);
  }, [porDia]);

  const data = useMemo(
    () =>
      (porDia ?? []).map((d) => {
        const base: any = {
          date: dayjs(d.fecha).format("DD/MM"),
          total: d.total,
        };
        categories.forEach((k) => {
          base[k] = (d as any)[k] ?? 0;
        });
        return base;
      }),
    [porDia, categories]
  );

  const [hidden, setHidden] = useState<Record<string, boolean>>({});
  const toggle = (k: string) => setHidden((s) => ({ ...s, [k]: !s[k] }));

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">
            Gasto diario por categoría
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
              <YAxis tickFormatter={(v) => formattMonedaGT(v)} width={72} />
              <Tooltip content={<CustomTooltip />} />
              <Legend onClick={(e: any) => e?.dataKey && toggle(e.dataKey)} />
              {categories.map((k) =>
                hidden[k] ? null : (
                  <Bar
                    key={k}
                    dataKey={k}
                    name={labelMap[k] ?? k}
                    fill={palette[k]}
                    radius={[6, 6, 0, 0]}
                  />
                )
              )}
              {/* Línea de total encima */}
              {!hidden["total"] && (
                <Line
                  type="monotone"
                  dataKey="total"
                  name="Total"
                  stroke={palette.total}
                  strokeWidth={2}
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

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">
            Evolución del total diario
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
              <YAxis tickFormatter={(v) => formattMonedaGT(v)} width={72} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="total"
                name="Total"
                stroke={palette.total}
                strokeWidth={3}
                dot={{ r: 3 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
