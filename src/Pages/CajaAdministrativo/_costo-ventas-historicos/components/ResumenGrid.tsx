import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import {
  DollarSign,
  Package,
  Ship,
  Mail,
  Truck,
  Shapes,
  Banknote,
  ReceiptText,
} from "lucide-react";
import { CostoVentaResumenUI } from "../costoVentasHistoricosTypes";

const config = {
  TOTAL: {
    label: "Total General",
    icon: DollarSign,
    color: "bg-emerald-500/15 text-emerald-600",
  },
  MERCADERIA: {
    label: "Mercadería",
    icon: Package,
    color: "bg-green-500/15 text-green-600",
  },
  FLETE: { label: "Flete", icon: Ship, color: "bg-gray-500/15 text-gray-600" },
  ENCOMIENDA: {
    label: "Encomienda",
    icon: Mail,
    color: "bg-orange-500/15 text-orange-600",
  },
  TRANSPORTE: {
    label: "Transporte",
    icon: Truck,
    color: "bg-blue-500/15 text-blue-600",
  },
  OTROS: {
    label: "Otros",
    icon: Shapes,
    color: "bg-purple-500/15 text-purple-600",
  },
} as const;

const order: (keyof typeof config)[] = [
  "TOTAL",
  "MERCADERIA",
  "FLETE",
  "ENCOMIENDA",
  "TRANSPORTE",
  "OTROS",
];

export function ResumenGrid({ resumen }: { resumen: CostoVentaResumenUI }) {
  const fmt = new Intl.NumberFormat("es-GT", {
    style: "currency",
    currency: "GTQ",
  });
  const cat = resumen.porCategoria ?? ({} as any);

  const values: Record<string, number> = {
    TOTAL: resumen.totalGeneral ?? 0,
    MERCADERIA: cat.MERCADERIA ?? 0,
    FLETE: cat.FLETE ?? 0,
    ENCOMIENDA: cat.ENCOMIENDA ?? 0,
    TRANSPORTE: cat.TRANSPORTE ?? 0,
    OTROS: cat.OTROS ?? 0,
  };

  const extras = [
    {
      key: "CANAL_CAJA",
      label: "Por Canal — Caja",
      value: resumen.porCanal?.caja ?? 0,
      icon: Banknote,
      color: "bg-teal-500/15 text-teal-600",
    },
    {
      key: "CANAL_BANCO",
      label: "Por Canal — Banco",
      value: resumen.porCanal?.banco ?? 0,
      icon: Banknote,
      color: "bg-sky-500/15 text-sky-600",
    },
    {
      key: "FACTURA_SI",
      label: "Con Factura",
      value: resumen.porFactura?.conFactura ?? 0,
      icon: ReceiptText,
      color: "bg-emerald-500/15 text-emerald-700",
    },
    {
      key: "FACTURA_NO",
      label: "Sin Factura",
      value: resumen.porFactura?.sinFactura ?? 0,
      icon: ReceiptText,
      color: "bg-amber-500/15 text-amber-700",
    },
  ] as const;

  return (
    <div className="space-y-4">
      {/* Totales por categoría */}
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
                    <p className="text-lg font-semibold">{fmt.format(val)}</p>
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

      {/* KPIs de canal y factura */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {extras.map(({ key, label, value, icon: Icon, color }, idx) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.04 * idx }}
          >
            <Card className="hover:shadow-sm transition-shadow">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="text-lg font-semibold">{fmt.format(value)}</p>
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
