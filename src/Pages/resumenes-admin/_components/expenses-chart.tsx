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

interface ExpensesChartProps {
  costosVenta: { caja: number; banco: number };
  gastosOperativos: { caja: number; banco: number };
}

const palette = { caja: "#22c55e", banco: "#3b82f6" };

export function ExpensesChart({
  costosVenta,
  gastosOperativos,
}: ExpensesChartProps) {
  const rows = [
    {
      name: "Costos de Venta",
      caja: costosVenta.caja,
      banco: costosVenta.banco,
    },
    {
      name: "Gastos Operativos",
      caja: gastosOperativos.caja,
      banco: gastosOperativos.banco,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.25, delay: 0.1 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Egresos por rubro y canal</CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={rows}
              margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(v) => formattMonedaGT(v)} width={80} />
              <Tooltip formatter={(v: number) => formattMonedaGT(v)} />
              <Legend />
              <Bar
                dataKey="caja"
                name="Caja"
                fill={palette.caja}
                stackId="a"
                radius={[6, 6, 0, 0]}
              />
              <Bar
                dataKey="banco"
                name="Banco"
                fill={palette.banco}
                stackId="a"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </motion.div>
  );
}
