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
    {
      name: "Neto Caja Operativo",
      value: netoCajaOperativo,
    },
    {
      name: "Efectivo Ventas",
      value: efectivoVentas,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: 0.4 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Comparativo Caja vs Ventas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  formatter={(value) => formattMonedaGT(Number(value))}
                />
                <Bar dataKey="value" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
