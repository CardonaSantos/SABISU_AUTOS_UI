import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import {
  Wallet,
  Banknote,
  ArrowDownCircle,
  ArrowUpCircle,
  Scale,
  Landmark,
  ArrowLeftRight,
  ArrowRightLeft,
} from "lucide-react";
import { FlujoEfectivoResumenUI } from "../Interface/flujoEfectivo";
import { Button } from "@/components/ui/button";

type NetMode = "con" | "sin";

export function ResumenGridFE({
  resumen,
}: {
  resumen: FlujoEfectivoResumenUI;
}) {
  const [mode, setMode] = useState<NetMode>("con");

  const fmt = useMemo(
    () =>
      new Intl.NumberFormat("es-GT", {
        style: "currency",
        currency: "GTQ",
      }),
    []
  );

  const netCaja =
    mode === "con"
      ? resumen.saldoNetoCaja_conTransfers
      : resumen.saldoNetoCaja_sinTransfers;
  const netBanco =
    mode === "con"
      ? resumen.saldoNetoBanco_conTransfers
      : resumen.saldoNetoBanco_sinTransfers;
  const netTotal =
    mode === "con"
      ? resumen.saldoNetoTotal_conTransfers
      : resumen.saldoNetoTotal_sinTransfers;

  const items = [
    {
      key: "ingCaja",
      label: "Ingresos Caja",
      value: resumen.ingresosCaja,
      icon: ArrowDownCircle,
      color: "bg-emerald-500/15 text-emerald-600",
    },
    {
      key: "ingBanco",
      label: "Ingresos Banco",
      value: resumen.ingresosBanco,
      icon: Landmark,
      color: "bg-emerald-500/15 text-emerald-600",
    },
    {
      key: "egrCaja",
      label: "Egresos Caja",
      value: resumen.egresosCaja,
      icon: ArrowUpCircle,
      color: "bg-rose-500/15 text-rose-600",
    },
    {
      key: "egrBanco",
      label: "Egresos Banco",
      value: resumen.egresosBanco,
      icon: Banknote,
      color: "bg-rose-500/15 text-rose-600",
    },
    // Transferencias (visibles siempre)
    {
      key: "tCAB",
      label: "Transfer Caja → Banco",
      value: resumen.transferCajaABanco,
      icon: ArrowLeftRight,
      color: "bg-sky-500/15 text-sky-600",
    },
    {
      key: "tBAC",
      label: "Transfer Banco → Caja",
      value: resumen.transferBancoACaja,
      icon: ArrowRightLeft,
      color: "bg-indigo-500/15 text-indigo-600",
    },
    // Netos (dependen del modo)
    {
      key: "saldoCaja",
      label:
        mode === "con" ? "Saldo Neto Caja (con transf.)" : "Saldo Neto Caja",
      value: netCaja,
      icon: Wallet,
      color:
        netCaja >= 0
          ? "bg-emerald-500/15 text-emerald-600"
          : "bg-rose-500/15 text-rose-600",
    },
    {
      key: "saldoBanco",
      label:
        mode === "con" ? "Saldo Neto Banco (con transf.)" : "Saldo Neto Banco",
      value: netBanco,
      icon: Landmark,
      color:
        netBanco >= 0
          ? "bg-emerald-500/15 text-emerald-600"
          : "bg-rose-500/15 text-rose-600",
    },
    {
      key: "saldoTotal",
      label:
        mode === "con" ? "Saldo Neto Total (con transf.)" : "Saldo Neto Total",
      value: netTotal,
      icon: Scale,
      color:
        netTotal >= 0
          ? "bg-emerald-500/15 text-emerald-600"
          : "bg-rose-500/15 text-rose-600",
    },
  ];

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-end gap-2">
        <span className="text-xs text-muted-foreground">Netos:</span>
        <div className="inline-flex rounded-md border p-0.5">
          <Button
            size="sm"
            variant={mode === "con" ? "default" : "ghost"}
            onClick={() => setMode("con")}
          >
            con transf.
          </Button>
          <Button
            size="sm"
            variant={mode === "sin" ? "default" : "ghost"}
            onClick={() => setMode("sin")}
          >
            sin transf.
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {items.map(({ key, label, value, icon: Icon, color }, idx) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.04 * idx }}
          >
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p
                    className={`text-lg font-semibold ${
                      value < 0 ? "text-rose-600" : ""
                    }`}
                  >
                    {fmt.format(value)}
                  </p>
                </div>
                <div className={`p-3 rounded-2xl ${color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
