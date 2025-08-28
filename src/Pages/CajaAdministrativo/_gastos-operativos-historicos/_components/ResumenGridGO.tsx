import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import {
  DollarSign,
  Zap,
  Truck,
  Home,
  Wifi,
  Megaphone,
  Briefcase,
  Shapes,
  BadgeDollarSign,
} from "lucide-react";
import { GastoOperativoResumenUI } from "../Interfaces/gastosOperativosInterfaces";

const config = {
  TOTAL: {
    label: "Total General",
    icon: DollarSign,
    color: "bg-emerald-500/15 text-emerald-600",
  },
  SALARIO: {
    label: "Salario",
    icon: BadgeDollarSign,
    color: "bg-emerald-500/15 text-emerald-700",
  },
  ENERGIA: {
    label: "Energía",
    icon: Zap,
    color: "bg-amber-500/15 text-amber-600",
  },
  LOGISTICA: {
    label: "Logística",
    icon: Truck,
    color: "bg-blue-500/15 text-blue-600",
  },
  RENTA: { label: "Renta", icon: Home, color: "bg-rose-500/15 text-rose-600" },
  INTERNET: {
    label: "Internet",
    icon: Wifi,
    color: "bg-indigo-500/15 text-indigo-600",
  },
  PUBLICIDAD: {
    label: "Publicidad",
    icon: Megaphone,
    color: "bg-violet-500/15 text-violet-600",
  },
  VIATICOS: {
    label: "Viáticos",
    icon: Briefcase,
    color: "bg-orange-500/15 text-orange-600",
  },
  OTROS: {
    label: "Otros",
    icon: Shapes,
    color: "bg-purple-500/15 text-purple-600",
  },
} as const;

const order: (keyof typeof config)[] = [
  "TOTAL",
  "SALARIO",
  "ENERGIA",
  "LOGISTICA",
  "RENTA",
  "INTERNET",
  "PUBLICIDAD",
  "VIATICOS",
  "OTROS",
];

export function ResumenGridGO({
  resumen,
}: {
  resumen: GastoOperativoResumenUI;
}) {
  const formatter = new Intl.NumberFormat("es-GT", {
    style: "currency",
    currency: "GTQ",
  });
  const values: Record<string, number> = {
    TOTAL: resumen.totalGeneral ?? 0,
    SALARIO: resumen.SALARIO ?? 0,
    ENERGIA: resumen.ENERGIA ?? 0,
    LOGISTICA: resumen.LOGISTICA ?? 0,
    RENTA: resumen.RENTA ?? 0,
    INTERNET: resumen.INTERNET ?? 0,
    PUBLICIDAD: resumen.PUBLICIDAD ?? 0,
    VIATICOS: resumen.VIATICOS ?? 0,
    OTROS: resumen.OTROS ?? 0,
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {order.map((k, idx) => {
        const { label, icon: Icon, color } = config[k];
        const val = values[k] ?? 0;
        return (
          <motion.div
            key={k}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.04 * idx }}
          >
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="text-lg font-semibold">
                    {formatter.format(val)}
                  </p>
                </div>
                <div className={`p-3 rounded-2xl ${color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
