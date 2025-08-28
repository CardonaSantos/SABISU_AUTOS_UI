import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  BarChart,
  Bar,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import dayjs from "dayjs";
import { FlujoSucursalRecord } from "../interfaces/FlujoCajaHsitoricoTypes";

export function SucursalCharts({ data }: { data: FlujoSucursalRecord[] }) {
  const formatted = (data ?? []).map((d) => ({
    date: dayjs(d.fecha).format("DD/MM"),
    saldoCaja: d.saldoFinalCaja,
    saldoBanco: d.saldoFinalBanco,
    ingresosCaja: d.ingresosCaja,
    egresosCaja: d.egresosCaja,
    ingresosBanco: d.ingresosBanco,
    egresosBanco: d.egresosBanco,
  }));

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">
            Saldo final — Caja vs Banco
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
            Ingresos/Egresos — Caja & Banco
          </CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={formatted}
              margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="ingresosCaja" name="Ingresos Caja" stackId="caja" />
              <Bar dataKey="egresosCaja" name="Egresos Caja" stackId="caja" />
              <Bar
                dataKey="ingresosBanco"
                name="Ingresos Banco"
                stackId="banco"
              />
              <Bar
                dataKey="egresosBanco"
                name="Egresos Banco"
                stackId="banco"
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
