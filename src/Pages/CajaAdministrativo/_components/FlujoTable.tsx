import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import dayjs from "dayjs";
import { FlujoGlobalDiaUI, FlujoSucursalDiaUI } from "../interfaces/interface2";

// Formateo moneda
const fmt = new Intl.NumberFormat("es-GT", {
  style: "currency",
  currency: "GTQ",
});

// Validaciones rápidas por fila (útil para auditoría)
const okSucursal = (r: FlujoSucursalDiaUI) => {
  const cajaOk =
    r.saldoFinalCaja === r.saldoInicioCaja + r.ingresosCaja - r.egresosCaja;
  const bancoOk =
    r.saldoFinalBanco === r.saldoInicioBanco + r.ingresosBanco - r.egresosBanco;
  const varOk =
    r.variacionNetaDia ===
    r.ingresosCaja - r.egresosCaja + (r.ingresosBanco - r.egresosBanco);
  return cajaOk && bancoOk && varOk;
};

export function SucursalTable({ rows }: { rows: FlujoSucursalDiaUI[] }) {
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
              <th className="py-2 pr-3">Saldo Inicio Total</th>
              <th className="py-2 pr-3">Saldo Final Total</th>
              <th className="py-2 pr-3">Variación Neta</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, idx) => {
              const ok = okSucursal(r);
              return (
                <tr
                  key={idx}
                  className={`border-b hover:bg-muted/40 ${
                    ok ? "" : "bg-amber-50"
                  }`}
                  title={ok ? "" : "Posible inconsistencia en saldos/variación"}
                >
                  <td className="py-2 pr-3 font-medium">
                    {dayjs(r.fechaDia).format("DD/MM/YYYY")}
                  </td>
                  <td className="py-2 pr-3">{fmt.format(r.saldoInicioCaja)}</td>
                  <td className="py-2 pr-3 text-emerald-700">
                    {fmt.format(r.ingresosCaja)}
                  </td>
                  <td className="py-2 pr-3 text-rose-700">
                    {fmt.format(r.egresosCaja)}
                  </td>
                  <td className="py-2 pr-3">{fmt.format(r.saldoFinalCaja)}</td>
                  <td className="py-2 pr-3">
                    {fmt.format(r.saldoInicioBanco)}
                  </td>
                  <td className="py-2 pr-3 text-emerald-700">
                    {fmt.format(r.ingresosBanco)}
                  </td>
                  <td className="py-2 pr-3 text-rose-700">
                    {fmt.format(r.egresosBanco)}
                  </td>
                  <td className="py-2 pr-3">{fmt.format(r.saldoFinalBanco)}</td>
                  <td className="py-2 pr-3">
                    {fmt.format(r.saldoInicioTotal)}
                  </td>
                  <td className="py-2 pr-3 font-semibold">
                    {fmt.format(r.saldoFinalTotal)}
                  </td>
                  <td
                    className={`py-2 pr-3 font-medium ${
                      r.variacionNetaDia >= 0
                        ? "text-emerald-700"
                        : "text-rose-700"
                    }`}
                  >
                    {fmt.format(r.variacionNetaDia)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}

export function GlobalTable({ rows }: { rows: FlujoGlobalDiaUI[] }) {
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
              <th className="py-2 pr-3">Saldo Total</th>
              <th className="py-2 pr-3">Variación Neta</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, idx) => (
              <tr key={idx} className="border-b hover:bg-muted/40">
                <td className="py-2 pr-3 font-medium">
                  {dayjs(r.fechaDia).format("DD/MM/YYYY")}
                </td>
                <td className="py-2 pr-3">{fmt.format(r.saldoTotalCaja)}</td>
                <td className="py-2 pr-3 text-emerald-700">
                  {fmt.format(r.ingresosTotalCaja)}
                </td>
                <td className="py-2 pr-3 text-rose-700">
                  {fmt.format(r.egresosTotalCaja)}
                </td>
                <td className="py-2 pr-3">{fmt.format(r.saldoTotalBanco)}</td>
                <td className="py-2 pr-3 text-emerald-700">
                  {fmt.format(r.ingresosTotalBanco)}
                </td>
                <td className="py-2 pr-3 text-rose-700">
                  {fmt.format(r.egresosTotalBanco)}
                </td>
                <td className="py-2 pr-3 font-semibold">
                  {fmt.format(r.saldoTotal)}
                </td>
                <td
                  className={`py-2 pr-3 font-medium ${
                    r.movimientoNetoTotal >= 0
                      ? "text-emerald-700"
                      : "text-rose-700"
                  }`}
                >
                  {fmt.format(r.movimientoNetoTotal)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
