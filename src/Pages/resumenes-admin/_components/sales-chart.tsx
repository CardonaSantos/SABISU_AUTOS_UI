"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import { motion } from "framer-motion";
import { formattMonedaGT } from "@/utils/formattMoneda";

const colors = [
  "#16a34a",
  "#3b82f6",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#10b981",
  "#06b6d4",
  "#f97316",
];

export function SalesChart({ data }: { data: Record<string, number> }) {
  const entries = Object.entries(data ?? {});
  const rows = entries.length
    ? entries.map(([name, value]) => ({ name, value }))
    : [{ name: "Sin datos", value: 0 }];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.25 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Ventas por método</CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip formatter={(v: number) => formattMonedaGT(v)} />
              <Legend />
              <Pie
                data={rows}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={4}
                label
              >
                {rows.map((_, i) => (
                  <Cell key={i} fill={colors[i % colors.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </motion.div>
  );
}
