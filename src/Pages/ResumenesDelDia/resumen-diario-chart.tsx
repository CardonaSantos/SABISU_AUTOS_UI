"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ResumenDiarioSucursal } from "./types";
import { formattMonedaGT } from "@/utils/formattMoneda";

interface ResumenDiarioChartProps {
  items: ResumenDiarioSucursal[];
}

export function ResumenDiarioChart({ items }: ResumenDiarioChartProps) {
  const maxValue = Math.max(
    1,
    ...items.map((it) => Math.max(it.ingresos, it.egresos))
  );

  const pct = (part: number, total: number) =>
    total > 0 ? (part / total) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>
            <p className="text-base">Flujo de Efectivo por Sucursal</p>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {items.map((item, index) => {
              const {
                ventasEfectivo,
                otrosIngresos,
                gastosOperativos,
                costoVenta,
                depositosProveedor,
                depositosCierre,
                otrosEgresos,
              } = item.totales;

              return (
                <motion.div
                  key={`${item.sucursal.id}-chart`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                  className="space-y-2"
                >
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">{item.sucursal.nombre}</h4>
                    <div className="text-sm text-gray-500 flex items-center gap-3">
                      <span>Neto caja: {formattMonedaGT(item.saldoFinal)}</span>
                      {depositosCierre > 0 && (
                        <span className="inline-flex items-center gap-1 text-sky-700">
                          <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span>
                          Banco +{formattMonedaGT(depositosCierre)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Ingresos (Caja) */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-green-600">Ingresos (Caja)</span>
                      <span className="font-medium">
                        {formattMonedaGT(item.ingresos)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <motion.div
                        className="h-3 flex"
                        initial={{ width: 0 }}
                        animate={{
                          width: `${(item.ingresos / maxValue) * 100}%`,
                        }}
                        transition={{ delay: 1 + index * 0.1, duration: 0.8 }}
                      >
                        <div
                          className="bg-green-600"
                          style={{
                            width: `${pct(ventasEfectivo, item.ingresos)}%`,
                          }}
                        />
                        <div
                          className="bg-green-400"
                          style={{
                            width: `${pct(otrosIngresos, item.ingresos)}%`,
                          }}
                        />
                      </motion.div>
                    </div>
                  </div>

                  {/* Egresos (Caja) */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-red-600">Egresos (Caja)</span>
                      <span className="font-medium">
                        {formattMonedaGT(item.egresos)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <motion.div
                        className="h-3 flex"
                        initial={{ width: 0 }}
                        animate={{
                          width: `${(item.egresos / maxValue) * 100}%`,
                        }}
                        transition={{ delay: 1.2 + index * 0.1, duration: 0.8 }}
                      >
                        <div
                          className="bg-red-700"
                          style={{
                            width: `${pct(gastosOperativos, item.egresos)}%`,
                          }}
                        />
                        <div
                          className="bg-red-600"
                          style={{ width: `${pct(costoVenta, item.egresos)}%` }}
                        />
                        <div
                          className="bg-rose-400"
                          style={{
                            width: `${pct(depositosProveedor, item.egresos)}%`,
                          }}
                        />
                        <div
                          className="bg-red-400"
                          style={{
                            width: `${pct(depositosCierre, item.egresos)}%`,
                          }}
                        />
                        <div
                          className="bg-red-300"
                          style={{
                            width: `${pct(otrosEgresos, item.egresos)}%`,
                          }}
                        />
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Leyenda */}
          <div className="mt-6 grid grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <div className="font-medium text-green-600">Ingresos (Caja)</div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-600 rounded" />
                <span>Ventas Efectivo</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded" />
                <span>Otros Ingresos</span>
              </div>
            </div>
            <div className="space-y-1">
              <div className="font-medium text-red-600">Egresos (Caja)</div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-700 rounded" />
                <span>Gastos Operativos</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-600 rounded" />
                <span>Costo de Venta</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-rose-400 rounded" />
                <span>Depósito a Proveedor</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-400 rounded" />
                <span>Depósitos de Cierre</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-300 rounded" />
                <span>Otros Egresos</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
