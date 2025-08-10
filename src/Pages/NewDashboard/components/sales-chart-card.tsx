"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { VentasSemanalChart } from "../types/dashboard";

interface SalesChartCardProps {
  ventasSemanalChart: VentasSemanalChart[];
}

export function SalesChartCard({ ventasSemanalChart }: SalesChartCardProps) {
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>Ventas de la Semana</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={ventasSemanalChart}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="dia" />
            <YAxis />
            <Tooltip
              formatter={(value, name) => {
                if (name === "totalVenta") {
                  return [`Q${value}`, "Total Venta"];
                } else if (name === "ventas") {
                  return [`${value} ventas`, "Número de Ventas"];
                }
                return value;
              }}
              labelFormatter={(label) => {
                const dayData = ventasSemanalChart.find((d) => d.dia === label);
                return dayData
                  ? `Fecha: ${new Date(dayData.fecha).toLocaleDateString()}`
                  : label;
              }}
            />
            <Bar dataKey="totalVenta" fill="#8884d8" name="Total Venta" />
            <Bar dataKey="ventas" fill="#82ca9d" name="Número de Ventas" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
