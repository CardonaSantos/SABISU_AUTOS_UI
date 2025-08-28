import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, Package, Ship, Mail, Truck, Shapes } from "lucide-react";
import { CostosVentaResumenUI } from "../costoVentasHistoricosTypes";

const items = (resumen: CostosVentaResumenUI) => [
  {
    key: "total",
    label: "Total General",
    value: resumen.totalGeneral,
    icon: DollarSign,
    color: "bg-emerald-500/15 text-emerald-600",
  },
  {
    key: "mercaderia",
    label: "Mercadería",
    value: resumen.mercaderia,
    icon: Package,
    color: "bg-green-500/15 text-green-600",
  },
  {
    key: "fletes",
    label: "Fletes",
    value: resumen.fletes,
    icon: Ship,
    color: "bg-gray-500/15 text-gray-600",
  },
  {
    key: "encomiendas",
    label: "Encomiendas",
    value: resumen.encomiendas,
    icon: Mail,
    color: "bg-orange-500/15 text-orange-600",
  },
  {
    key: "transporte",
    label: "Transporte",
    value: resumen.transporte,
    icon: Truck,
    color: "bg-blue-500/15 text-blue-600",
  },
  {
    key: "otros",
    label: "Otros",
    value: resumen.otros,
    icon: Shapes,
    color: "bg-purple-500/15 text-purple-600",
  },
];

export function ResumenGrid({ resumen }: { resumen: CostosVentaResumenUI }) {
  const formatter = new Intl.NumberFormat("es-GT", {
    style: "currency",
    currency: "GTQ",
  });
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {items(resumen).map(({ key, label, value, icon: Icon, color }, idx) => (
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
                <p className="text-lg font-semibold">
                  {formatter.format(value)}
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
