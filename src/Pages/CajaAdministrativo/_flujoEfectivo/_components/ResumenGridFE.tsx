import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import {
  Wallet,
  Banknote,
  ArrowDownCircle,
  ArrowUpCircle,
  Scale,
  Landmark,
} from "lucide-react";
import { FlujoEfectivoResumenUI } from "../Interface/flujoEfectivo";

export function ResumenGridFE({
  resumen,
}: {
  resumen: FlujoEfectivoResumenUI;
}) {
  const fmt = new Intl.NumberFormat("es-GT", {
    style: "currency",
    currency: "GTQ",
  });
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
    {
      key: "saldoCaja",
      label: "Saldo Neto Caja",
      value: resumen.saldoNetoCaja,
      icon: Wallet,
      color:
        resumen.saldoNetoCaja >= 0
          ? "bg-emerald-500/15 text-emerald-600"
          : "bg-rose-500/15 text-rose-600",
    },
    {
      key: "saldoBanco",
      label: "Saldo Neto Banco",
      value: resumen.saldoNetoBanco,
      icon: Landmark,
      color:
        resumen.saldoNetoBanco >= 0
          ? "bg-emerald-500/15 text-emerald-600"
          : "bg-rose-500/15 text-rose-600",
    },
    {
      key: "saldoTotal",
      label: "Saldo Neto Total",
      value: resumen.saldoNetoTotal,
      icon: Scale,
      color:
        resumen.saldoNetoTotal >= 0
          ? "bg-emerald-500/15 text-emerald-600"
          : "bg-rose-500/15 text-rose-600",
    },
  ];

  return (
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
  );
}
