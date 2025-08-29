"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { motion } from "framer-motion";
import { formattMonedaGT } from "@/utils/formattMoneda";

interface ComparisonChartProps {
  netoCajaOperativo: number;
  efectivoVentas: number;
}

export function ComparisonChart({
  netoCajaOperativo,
  efectivoVentas,
}: ComparisonChartProps) {
  const data = [
    { name: "Neto Caja Operativo", value: netoCajaOperativo },
    { name: "Efectivo Ventas", value: efectivoVentas },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.25, delay: 0.2 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Comparativo Caja vs Ventas</CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(v) => formattMonedaGT(v)} width={80} />
              <Tooltip formatter={(v: number) => formattMonedaGT(v)} />
              <Legend />
              <Bar
                dataKey="value"
                name="Monto (GTQ)"
                fill="#10b981"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </motion.div>
  );
}
