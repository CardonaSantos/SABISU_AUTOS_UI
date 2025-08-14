"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Calendar,
  User,
  Building2,
  DollarSign,
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  Receipt,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Banknote,
  Hash,
  ImageIcon,
  Package,
} from "lucide-react";
import { RegistroCajaResponse } from "../CajaRegistros/interfaces/registroscajas.interfaces";
import { getRegistroCaja } from "./api";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { formattMonedaGT } from "@/utils/formattMoneda";
import { formateDateWithMinutes } from "@/Crm/Utils/FormateDate";
import { getApiErrorMessageAxios } from "../Utils/UtilsErrorApi";
import { formattFechaWithMinutes } from "../Utils/Utils";

// Animaciones
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 },
  },
};

const tableVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      staggerChildren: 0.05,
    },
  },
};

const rowVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.2 },
  },
};

export default function CajaDetalle() {
  const navigate = useNavigate();
  const { id } = useParams();
  const cajaID = Number(id);

  const [registro, setRegistro] = useState<RegistroCajaResponse | null>(null);

  const getSetData = async () => {
    const data = await getRegistroCaja(cajaID); // lanza error si falla
    setRegistro(data);
  };

  const getData = async () => {
    await toast.promise(getSetData(), {
      error: (err) => getApiErrorMessageAxios(err),
    });
  };

  useEffect(() => {
    if (!Number.isFinite(cajaID) || cajaID <= 0) {
      toast.error("ID de caja inválido");
      navigate(-1);
      return;
    }
    getData();
  }, [cajaID]);

  const onBack = () => navigate(-1);

  const getEstadoBadge = (estado: string) => {
    const variants = {
      ABIERTO: {
        variant: "default" as const,
        icon: AlertCircle,
        color: "text-blue-600",
      },
      CERRADO: {
        variant: "secondary" as const,
        icon: CheckCircle,
        color: "text-green-600",
      },
      ARQUEO: {
        variant: "outline" as const,
        icon: XCircle,
        color: "text-orange-600",
      },
    };

    const config =
      variants[estado as keyof typeof variants] || variants.ABIERTO;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className={`h-3 w-3 ${config.color}`} />
        {estado}
      </Badge>
    );
  };

  const getTipoMovimientoIcon = (tipo: string) => {
    switch (tipo) {
      case "INGRESO":
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case "EGRESO":
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      case "DEPOSITO_BANCO":
        return <Banknote className="h-4 w-4 text-blue-600" />;
      default:
        return <DollarSign className="h-4 w-4 text-gray-600" />;
    }
  };
  console.log("La caja recibida es: ", registro);

  if (!registro) {
    return (
      <div className="">
        <h2>Registro no encontrado</h2>
      </div>
    );
  }
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-background p-2 sm:p-4"
    >
      <div className="mx-auto max-w-7xl space-y-4">
        {/* Header */}
        <motion.div variants={itemVariants} className="flex items-center gap-3">
          {onBack && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="h-8 w-8 p-0"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <div>
            <h1 className="text-xl font-semibold">
              Registro de Caja #{registro.id}
            </h1>
            <p className="text-xs text-muted-foreground">
              {registro?.sucursal?.nombre}
            </p>
          </div>
          <div className="ml-auto">{getEstadoBadge(registro.estado)}</div>
        </motion.div>

        {/* Información General */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <motion.div variants={itemVariants}>
            <Card className="h-full">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium">Apertura</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {formateDateWithMinutes(registro.fechaApertura)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="h-full">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium">Cierre</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {formateDateWithMinutes(registro.fechaCierre)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="h-full">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium">Saldo Inicial</p>
                    <p className="text-sm font-semibold text-green-600">
                      {formattMonedaGT(registro.saldoInicial)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="h-full">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-blue-600" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium">Saldo Final</p>
                    <p className="text-sm font-semibold text-blue-600">
                      {formattMonedaGT(registro.saldoFinal)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Usuarios y Comentarios */}
        <div className="grid gap-4 md:grid-cols-2">
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Usuarios
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-xs font-medium">Apertura</p>
                  <p className="text-xs text-muted-foreground">
                    {registro?.usuarioInicio?.nombre || "N/A"}
                  </p>
                </div>
                <Separator />
                <div>
                  <p className="text-xs font-medium">Cierre</p>
                  <p className="text-xs text-muted-foreground">
                    {registro?.usuarioCierre?.nombre || "N/A"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Receipt className="h-4 w-4" />
                  Comentarios
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-xs font-medium">Inicial</p>
                  <p className="text-xs text-muted-foreground">
                    {registro.comentarioInicial || "Sin comentarios"}
                  </p>
                </div>
                <Separator />
                <div>
                  <p className="text-xs font-medium">Final</p>
                  <p className="text-xs text-muted-foreground">
                    {registro.comentarioFinal || "Sin comentarios"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Resumen de Actividad */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Resumen de Actividad
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <ShoppingCart className="h-6 w-6 mx-auto text-blue-600 mb-1" />
                  <p className="text-lg font-semibold">
                    {registro.ventasLenght}
                  </p>
                  <p className="text-xs text-muted-foreground">Ventas</p>
                </div>
                <div className="text-center">
                  <TrendingUp className="h-6 w-6 mx-auto text-green-600 mb-1" />
                  <p className="text-lg font-semibold">
                    {registro.movimientosLenght}
                  </p>
                  <p className="text-xs text-muted-foreground">Movimientos</p>
                </div>
                <div className="text-center">
                  <Banknote className="h-6 w-6 mx-auto text-purple-600 mb-1" />
                  <p className="text-lg font-semibold">
                    {registro.depositado ? "Sí" : "No"}
                  </p>
                  <p className="text-xs text-muted-foreground">Depositado</p>
                </div>
                <div className="text-center">
                  <DollarSign className="h-6 w-6 mx-auto text-orange-600 mb-1" />
                  <p className="text-lg font-semibold">
                    {formattMonedaGT(
                      registro.saldoFinal - registro.saldoInicial
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground">Diferencia</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Sección de Ventas */}
        {/* Sección de Ventas */}
        {registro.ventas.length > 0 && (
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4" />
                  Ventas ({registro.ventas.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <motion.div
                  variants={tableVariants}
                  className="space-y-3 max-h-96 overflow-y-auto"
                >
                  {registro.ventas.map((venta) => (
                    <motion.div
                      key={venta.id}
                      variants={rowVariants}
                      className="border rounded-lg p-3 hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="text-xs">
                            #{venta.id}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {formattFechaWithMinutes(venta.fechaVenta)}
                          </span>
                          <Badge variant="secondary" className="text-xs">
                            {venta.metodoPago || "N/A"}
                          </Badge>
                          {venta.tipoComprobante && (
                            <Badge variant="outline" className="text-xs">
                              {venta.tipoComprobante}
                            </Badge>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold">
                            {formattMonedaGT(venta.totalVenta)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Cliente:{" "}
                            {typeof venta.cliente === "string"
                              ? venta.cliente
                              : venta.cliente.nombre}
                          </p>
                        </div>
                      </div>

                      {venta.referenciaPago &&
                        venta.referenciaPago !== "N/A" && (
                          <div className="mb-3">
                            <p className="text-xs text-muted-foreground">
                              Referencia:{" "}
                              <span className="font-medium">
                                {venta.referenciaPago}
                              </span>
                            </p>
                          </div>
                        )}

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 mb-2">
                          <Package className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs font-medium">
                            Productos ({venta.productos.length})
                          </span>
                        </div>

                        <div className="grid gap-2">
                          {venta.productos.map((linea) => (
                            <div
                              key={linea.id}
                              className="flex items-center gap-3 p-2 bg-muted/20 rounded border"
                            >
                              <div className="flex-shrink-0">
                                {linea.producto.imagenesProducto.length > 0 ? (
                                  <img
                                    src={
                                      linea.producto.imagenesProducto[0].url ||
                                      "/placeholder.svg"
                                    }
                                    alt={linea.producto.nombre}
                                    className="w-8 h-8 object-cover rounded border"
                                  />
                                ) : (
                                  <div className="w-8 h-8 bg-muted rounded border flex items-center justify-center">
                                    <ImageIcon className="h-4 w-4 text-muted-foreground" />
                                  </div>
                                )}
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <p className="text-xs font-medium truncate">
                                    {linea.producto.nombre}
                                  </p>
                                  {linea.producto.codigoProducto && (
                                    <Badge
                                      variant="outline"
                                      className="text-xs flex items-center gap-1"
                                    >
                                      <Hash className="h-2 w-2" />
                                      {linea.producto.codigoProducto}
                                    </Badge>
                                  )}
                                </div>
                                {linea.producto.descripcion && (
                                  <p className="text-xs text-muted-foreground truncate">
                                    {linea.producto.descripcion}
                                  </p>
                                )}
                                {linea.estado && (
                                  <Badge
                                    variant="secondary"
                                    className="text-xs mt-1"
                                  >
                                    {linea.estado}
                                  </Badge>
                                )}
                              </div>

                              <div className="text-right flex-shrink-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <Badge variant="default" className="text-xs">
                                    {linea.cantidad}x
                                  </Badge>
                                  <span className="text-xs font-medium">
                                    {formattMonedaGT(linea.precioVenta)}
                                  </span>
                                </div>
                                <p className="text-xs font-semibold">
                                  {formattMonedaGT(
                                    linea.cantidad * linea.precioVenta
                                  )}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Sección de Movimientos */}
        {registro.movimientosCaja.length > 0 && (
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Movimientos de Caja ({registro.movimientosCaja.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <motion.div
                  variants={tableVariants}
                  className="overflow-x-auto"
                >
                  <table className="w-full">
                    <thead>
                      <tr className="border-b text-xs">
                        <th className="text-left p-2 font-medium">Tipo</th>
                        <th className="text-left p-2 font-medium">Fecha</th>
                        <th className="text-left p-2 font-medium">
                          Descripción
                        </th>
                        <th className="text-left p-2 font-medium">Categoría</th>
                        <th className="text-left p-2 font-medium">Usuario</th>
                        <th className="text-right p-2 font-medium">Monto</th>
                      </tr>
                    </thead>
                    <tbody>
                      {registro.movimientosCaja.map((movimiento) => (
                        <motion.tr
                          key={movimiento.id}
                          variants={rowVariants}
                          className="border-b hover:bg-muted/50"
                        >
                          <td className="p-2">
                            <div className="flex items-center gap-2">
                              {getTipoMovimientoIcon(movimiento.tipo)}
                              <span className="text-xs">{movimiento.tipo}</span>
                            </div>
                          </td>
                          <td className="p-2 text-xs">
                            {formateDateWithMinutes(movimiento.fecha)}
                          </td>
                          <td className="p-2 text-xs max-w-32 truncate">
                            {movimiento.descripcion || "Sin descripción"}
                          </td>
                          <td className="p-2">
                            {movimiento.categoria && (
                              <Badge variant="secondary" className="text-xs">
                                {movimiento.categoria}
                              </Badge>
                            )}
                          </td>
                          <td className="p-2 text-xs">
                            {movimiento.usuario?.nombre || "N/A"}
                          </td>
                          <td className="p-2 text-xs text-right font-semibold">
                            <span
                              className={
                                movimiento.tipo === "INGRESO"
                                  ? "text-green-600"
                                  : "text-red-600"
                              }
                            >
                              {movimiento.tipo === "INGRESO" ? "+" : "-"}
                              {formattMonedaGT(Math.abs(movimiento.monto))}
                            </span>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
