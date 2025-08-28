import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import dayjs from "dayjs";
import {
  FlujoGlobalRecord,
  FlujoSucursalRecord,
} from "../interfaces/FlujoCajaHsitoricoTypes";

export function SucursalTable({ rows }: { rows: FlujoSucursalRecord[] }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">
          Registros por día (Sucursal)
        </CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="py-2 pr-3">Fecha</th>
              <th className="py-2 pr-3">Saldo Inicio Caja</th>
              <th className="py-2 pr-3">Ingresos Caja</th>
              <th className="py-2 pr-3">Egresos Caja</th>
              <th className="py-2 pr-3">Saldo Final Caja</th>
              <th className="py-2 pr-3">Saldo Inicio Banco</th>
              <th className="py-2 pr-3">Ingresos Banco</th>
              <th className="py-2 pr-3">Egresos Banco</th>
              <th className="py-2 pr-3">Saldo Final Banco</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, idx) => (
              <tr key={idx} className="border-b hover:bg-muted/40">
                <td className="py-2 pr-3 font-medium">
                  {dayjs(r.fecha).format("DD/MM/YYYY")}
                </td>
                <td className="py-2 pr-3">{r.saldoInicioCaja}</td>
                <td className="py-2 pr-3">{r.ingresosCaja}</td>
                <td className="py-2 pr-3">{r.egresosCaja}</td>
                <td className="py-2 pr-3">{r.saldoFinalCaja}</td>
                <td className="py-2 pr-3">{r.saldoInicioBanco}</td>
                <td className="py-2 pr-3">{r.ingresosBanco}</td>
                <td className="py-2 pr-3">{r.egresosBanco}</td>
                <td className="py-2 pr-3">{r.saldoFinalBanco}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}

export function GlobalTable({ rows }: { rows: FlujoGlobalRecord[] }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Registros por día (Global)</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="py-2 pr-3">Fecha</th>
              <th className="py-2 pr-3">Saldo Total Caja</th>
              <th className="py-2 pr-3">Ingresos Total Caja</th>
              <th className="py-2 pr-3">Egresos Total Caja</th>
              <th className="py-2 pr-3">Saldo Total Banco</th>
              <th className="py-2 pr-3">Ingresos Total Banco</th>
              <th className="py-2 pr-3">Egresos Total Banco</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, idx) => (
              <tr key={idx} className="border-b hover:bg-muted/40">
                <td className="py-2 pr-3 font-medium">
                  {dayjs(r.fecha).format("DD/MM/YYYY")}
                </td>
                <td className="py-2 pr-3">{r.saldoTotalCaja}</td>
                <td className="py-2 pr-3">{r.ingresosTotalCaja}</td>
                <td className="py-2 pr-3">{r.egresosTotalCaja}</td>
                <td className="py-2 pr-3">{r.saldoTotalBanco}</td>
                <td className="py-2 pr-3">{r.ingresosTotalBanco}</td>
                <td className="py-2 pr-3">{r.egresosTotalBanco}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
