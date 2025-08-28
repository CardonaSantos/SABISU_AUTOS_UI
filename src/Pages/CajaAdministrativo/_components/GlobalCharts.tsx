import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  AreaChart,
  Area,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import dayjs from "dayjs";
import { FlujoGlobalRecord } from "../interfaces/FlujoCajaHsitoricoTypes";

export function GlobalCharts({ data }: { data: FlujoGlobalRecord[] }) {
  const formatted = (data ?? []).map((d) => ({
    date: dayjs(d.fecha).format("DD/MM"),
    saldoCaja: d.saldoTotalCaja,
    saldoBanco: d.saldoTotalBanco,
    ingresosCaja: d.ingresosTotalCaja,
    egresosCaja: d.egresosTotalCaja,
  }));

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">
            Saldo total — Caja vs Banco
          </CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={formatted}
              margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="saldoCaja"
                name="Saldo Caja"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="saldoBanco"
                name="Saldo Banco"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">
            Ingresos vs Egresos — Caja (Global)
          </CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={formatted}
              margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area
                type="monotone"
                dataKey="ingresosCaja"
                name="Ingresos Caja"
                stackId="1"
              />
              <Area
                type="monotone"
                dataKey="egresosCaja"
                name="Egresos Caja"
                stackId="1"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
