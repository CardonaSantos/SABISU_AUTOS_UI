"use client";

import type React from "react";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Receipt,
  CreditCard,
  Building2,
  Zap,
  Wifi,
  Users,
  ShoppingCart,
  Banknote,
  ArrowRightLeft,
  PiggyBank,
  AlertCircle,
} from "lucide-react";
import { formattMonedaGT } from "@/utils/formattMoneda";
import { ResumenDiarioSucursal } from "./types";

interface ResumenDiarioProgressChartProps {
  items: ResumenDiarioSucursal[];
}

export function ResumenDiarioProgressChart({
  items = [],
}: ResumenDiarioProgressChartProps) {
  if (!items || items.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 text-center py-12">
          <AlertCircle className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No hay datos disponibles
          </h3>
          <p className="text-gray-500">
            No se encontraron registros para mostrar en las barras de progreso
          </p>
        </CardContent>
      </Card>
    );
  }

  const COLORS = {
    ingresos: {
      INGRESO: "#10b981", // emerald-500
      ABONO: "#34d399", // emerald-400
      TRANSFERENCIA: "#6ee7b7", // emerald-300
      ventasEfectivo: "#059669", // emerald-600
    },
    egresos: {
      EGRESO: "#ef4444", // red-500
      DEPOSITO_BANCO: "#06b6d4", // cyan-500
      RETIRO: "#dc2626", // red-600
      CHEQUE: "#8b5cf6", // violet-500
      AJUSTE: "#64748b", // slate-500
      DEVOLUCION: "#f59e0b", // amber-500
      OTRO: "#6b7280", // gray-500
    },
    categorias: {
      GASTO_OPERATIVO: "#ef4444", // red-500
      COSTO_VENTA: "#f97316", // orange-500
      DEPOSITO_PROVEEDOR: "#8b5cf6", // violet-500
      DEPOSITO_CIERRE: "#06b6d4", // cyan-500
    },
    gastosOperativos: {
      SALARIO: "#ef4444", // red-500
      ENERGIA: "#f59e0b", // amber-500
      INTERNET: "#06b6d4", // cyan-500
      AGUA: "#0ea5e9", // sky-500
      TELEFONO: "#8b5cf6", // violet-500
      ALQUILER: "#dc2626", // red-600
      MANTENIMIENTO: "#64748b", // slate-500
      OTROS: "#6b7280", // gray-500
    },
  };

  const ICONS = {
    INGRESO: Receipt,
    ABONO: PiggyBank,
    TRANSFERENCIA: ArrowRightLeft,
    EGRESO: ArrowDownRight,
    DEPOSITO_BANCO: Banknote,
    SALARIO: Users,
    ENERGIA: Zap,
    INTERNET: Wifi,
    ventasEfectivo: ShoppingCart,
  };

  const getIcon = (type: string) => {
    const IconComponent = ICONS[type as keyof typeof ICONS] || Receipt;
    return IconComponent;
  };

  const calculateMaxValue = (data: Array<{ monto: number }>) => {
    if (!data || data.length === 0) return 100;
    const maxMonto = Math.max(...data.map((d) => d.monto));
    return maxMonto > 0 ? maxMonto : 100;
  };

  const ProgressBarItem = ({
    label,
    value,
    maxValue,
    color,
    icon: Icon,
    cantidad,
    delay = 0,
  }: {
    label: string;
    value: number;
    maxValue: number;
    color: string;
    icon: any;
    cantidad: number;
    delay?: number;
  }) => {
    const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0;

    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay, duration: 0.5 }}
        className="space-y-2"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="p-1.5 rounded-md"
              style={{ backgroundColor: `${color}20`, color }}
            >
              <Icon className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium text-gray-700">{label}</span>
            <Badge variant="outline" className="text-xs">
              {cantidad} mov.
            </Badge>
          </div>
          <span className="text-sm font-bold" style={{ color }}>
            {formattMonedaGT(value)}
          </span>
        </div>
        <div className="relative">
          <Progress value={0} className="h-2 bg-gray-100" />
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ delay: delay + 0.2, duration: 0.8, ease: "easeOut" }}
            className="absolute top-0 left-0 h-2 rounded-full"
            style={{ backgroundColor: color }}
          />
        </div>
      </motion.div>
    );
  };

  const SectionCard = ({
    title,
    icon: Icon,
    children,
    delay = 0,
  }: {
    title: string;
    icon: any;
    children: React.ReactNode;
    delay?: number;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6 }}
    >
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Icon className="w-5 h-5" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">{children}</CardContent>
      </Card>
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
      className="space-y-6"
    >
      {items.map((item, index) => {
        const netFlow = item.ingresos - item.egresos;
        const isPositive = netFlow >= 0;

        const ingresosData = Object.entries(
          item.breakdown?.ingresosPorTipo || {}
        )
          .filter(([_, data]) => data && data.monto > 0)
          .map(([tipo, data]) => ({
            label: tipo.charAt(0) + tipo.slice(1).toLowerCase(),
            monto: data.monto,
            cantidad: data.cantidad,
            color:
              COLORS.ingresos[tipo as keyof typeof COLORS.ingresos] ||
              "#10b981",
            icon: getIcon(tipo),
          }));

        // Agregar ventas en efectivo si existe
        if (
          item.breakdown?.ventasEfectivo &&
          item.breakdown.ventasEfectivo > 0
        ) {
          ingresosData.unshift({
            label: "Ventas Efectivo",
            monto: item.breakdown.ventasEfectivo,
            cantidad: 1,
            color: COLORS.ingresos.ventasEfectivo,
            icon: getIcon("ventasEfectivo"),
          });
        }

        const egresosData = Object.entries(item.breakdown?.porTipo || {})
          .filter(
            ([tipo, data]) =>
              data &&
              (tipo === "EGRESO" ||
                tipo === "DEPOSITO_BANCO" ||
                tipo === "RETIRO" ||
                tipo === "CHEQUE" ||
                tipo === "AJUSTE" ||
                tipo === "DEVOLUCION" ||
                tipo === "OTRO") &&
              data.monto > 0
          )
          .map(([tipo, data]) => ({
            label: tipo
              .replace("_", " ")
              .toLowerCase()
              .replace(/\b\w/g, (l) => l.toUpperCase()),
            monto: data.monto,
            cantidad: data.cantidad,
            color:
              COLORS.egresos[tipo as keyof typeof COLORS.egresos] || "#ef4444",
            icon: getIcon(tipo),
          }));

        const gastosOperativosData = Object.entries(
          item.breakdown?.gastosOperativosPorTipo || {}
        )
          .filter(([_, data]) => data && data.monto > 0)
          .map(([tipo, data]) => ({
            label: tipo.charAt(0) + tipo.slice(1).toLowerCase(),
            monto: data.monto,
            cantidad: data.cantidad,
            color:
              COLORS.gastosOperativos[
                tipo as keyof typeof COLORS.gastosOperativos
              ] || "#ef4444",
            icon: getIcon(tipo),
          }));

        const categoriasData = Object.entries(
          item.breakdown?.porCategoria || {}
        )
          .filter(([_, data]) => data && data.monto > 0)
          .map(([categoria, data]) => ({
            label: categoria
              .replace("_", " ")
              .toLowerCase()
              .replace(/\b\w/g, (l) => l.toUpperCase()),
            monto: data.monto,
            cantidad: data.cantidad,
            color:
              COLORS.categorias[categoria as keyof typeof COLORS.categorias] ||
              "#64748b",
            icon: Receipt,
          }));

        const maxIngresos = calculateMaxValue(ingresosData);
        const maxEgresos = calculateMaxValue(egresosData);
        const maxGastos = calculateMaxValue(gastosOperativosData);
        const maxCategorias = calculateMaxValue(categoriasData);

        return (
          <motion.div
            key={`${item.sucursal.id}-progress-charts`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9 + index * 0.1 }}
            className="space-y-6"
          >
            {/* Header con información de la sucursal */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-blue-600" />
                    {item.sucursal.nombre}
                  </CardTitle>
                  <div className="flex items-center gap-4">
                    <Badge
                      variant={isPositive ? "default" : "destructive"}
                      className="flex items-center gap-1"
                    >
                      {isPositive ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                      Flujo: {formattMonedaGT(netFlow)}
                    </Badge>
                    <div className="text-sm text-muted-foreground">
                      {item.registros} registro{item.registros !== 1 ? "s" : ""}
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center justify-center gap-1 text-green-600 mb-1">
                      <ArrowUpRight className="w-4 h-4" />
                      <span className="text-sm font-medium">Ingresos</span>
                    </div>
                    <div className="text-lg font-bold text-green-700">
                      {formattMonedaGT(item.ingresos)}
                    </div>
                  </div>

                  <div className="text-center p-3 bg-red-50 rounded-lg border border-red-200">
                    <div className="flex items-center justify-center gap-1 text-red-600 mb-1">
                      <ArrowDownRight className="w-4 h-4" />
                      <span className="text-sm font-medium">Egresos</span>
                    </div>
                    <div className="text-lg font-bold text-red-700">
                      {formattMonedaGT(item.egresos)}
                    </div>
                  </div>

                  <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-center gap-1 text-blue-600 mb-1">
                      <DollarSign className="w-4 h-4" />
                      <span className="text-sm font-medium">Saldo Final</span>
                    </div>
                    <div className="text-lg font-bold text-blue-700">
                      {formattMonedaGT(item.saldoFinal)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Grid de secciones con barras de progreso */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Ingresos */}
              {ingresosData.length > 0 && (
                <SectionCard
                  title="Desglose de Ingresos"
                  icon={TrendingUp}
                  delay={1.0 + index * 0.1}
                >
                  {ingresosData.map((ingreso, idx) => (
                    <ProgressBarItem
                      key={`ingreso-${idx}`}
                      label={ingreso.label}
                      value={ingreso.monto}
                      maxValue={maxIngresos}
                      color={ingreso.color}
                      icon={ingreso.icon}
                      cantidad={ingreso.cantidad}
                      delay={1.2 + index * 0.1 + idx * 0.1}
                    />
                  ))}
                </SectionCard>
              )}

              {/* Egresos */}
              {egresosData.length > 0 && (
                <SectionCard
                  title="Desglose de Egresos"
                  icon={TrendingDown}
                  delay={1.1 + index * 0.1}
                >
                  {egresosData.map((egreso, idx) => (
                    <ProgressBarItem
                      key={`egreso-${idx}`}
                      label={egreso.label}
                      value={egreso.monto}
                      maxValue={maxEgresos}
                      color={egreso.color}
                      icon={egreso.icon}
                      cantidad={egreso.cantidad}
                      delay={1.3 + index * 0.1 + idx * 0.1}
                    />
                  ))}
                </SectionCard>
              )}

              {/* Gastos Operativos */}
              {gastosOperativosData.length > 0 && (
                <SectionCard
                  title="Gastos Operativos"
                  icon={Receipt}
                  delay={1.2 + index * 0.1}
                >
                  {gastosOperativosData.map((gasto, idx) => (
                    <ProgressBarItem
                      key={`gasto-${idx}`}
                      label={gasto.label}
                      value={gasto.monto}
                      maxValue={maxGastos}
                      color={gasto.color}
                      icon={gasto.icon}
                      cantidad={gasto.cantidad}
                      delay={1.4 + index * 0.1 + idx * 0.1}
                    />
                  ))}
                </SectionCard>
              )}

              {/* Categorías */}
              {categoriasData.length > 0 && (
                <SectionCard
                  title="Por Categoría"
                  icon={CreditCard}
                  delay={1.3 + index * 0.1}
                >
                  {categoriasData.map((categoria, idx) => (
                    <ProgressBarItem
                      key={`categoria-${idx}`}
                      label={categoria.label}
                      value={categoria.monto}
                      maxValue={maxCategorias}
                      color={categoria.color}
                      icon={categoria.icon}
                      cantidad={categoria.cantidad}
                      delay={1.5 + index * 0.1 + idx * 0.1}
                    />
                  ))}
                </SectionCard>
              )}
            </div>

            {/* Movimientos principales */}
            {item.breakdown?.top && item.breakdown.top.length > 0 && (
              <SectionCard
                title="Movimientos Principales"
                icon={CreditCard}
                delay={1.4 + index * 0.1}
              >
                <div className="space-y-3">
                  {item.breakdown.top.slice(0, 5).map((mov, idx) => (
                    <motion.div
                      key={mov.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.6 + index * 0.1 + idx * 0.1 }}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-2 h-8 rounded-full"
                          style={{
                            backgroundColor:
                              COLORS.egresos[
                                mov.tipo as keyof typeof COLORS.egresos
                              ] ||
                              COLORS.ingresos[
                                mov.tipo as keyof typeof COLORS.ingresos
                              ] ||
                              "#6b7280",
                          }}
                        />
                        <div>
                          <div className="font-medium text-sm">
                            {mov.descripcion || mov.tipo}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {mov.categoria && `${mov.categoria} • `}
                            {new Date(mov.fecha).toLocaleDateString("es-GT")}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div
                          className={`font-bold ${
                            mov.tipo.includes("INGRESO") ||
                            mov.tipo === "VENTA" ||
                            mov.tipo === "ABONO"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {mov.tipo.includes("INGRESO") ||
                          mov.tipo === "VENTA" ||
                          mov.tipo === "ABONO"
                            ? "+"
                            : "-"}
                          {formattMonedaGT(Math.abs(mov.monto))}
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {mov.tipo}
                        </Badge>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </SectionCard>
            )}
          </motion.div>
        );
      })}
    </motion.div>
  );
}
