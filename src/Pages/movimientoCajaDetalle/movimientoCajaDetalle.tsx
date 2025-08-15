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
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Banknote,
  FileText,
  CreditCard,
} from "lucide-react";
import type { MovimientoCajaDetail } from "./interface";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { formattMonedaGT } from "@/utils/formattMoneda";
import { formateDateWithMinutes } from "@/Crm/Utils/FormateDate";
import { getApiErrorMessageAxios } from "../Utils/UtilsErrorApi";
import { getMovimientoCajaDetail } from "./api";

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

export default function MovimientoCajaDetalle() {
  const navigate = useNavigate();
  const { id } = useParams();
  const movimientoID = Number(id);

  const [movimiento, setMovimiento] = useState<MovimientoCajaDetail | null>(
    null
  );

  const getSetData = async () => {
    const data = await getMovimientoCajaDetail(movimientoID);
    setMovimiento(data);
  };

  const getData = async () => {
    await toast.promise(getSetData(), {
      error: (err) => getApiErrorMessageAxios(err),
    });
  };

  useEffect(() => {
    if (!Number.isFinite(movimientoID) || movimientoID <= 0) {
      toast.error("ID de movimiento inválido");
      navigate(-1);
      return;
    }
    getData();
  }, [movimientoID]);

  const onBack = () => navigate(-1);

  const getTipoBadge = (tipo: string) => {
    const variants = {
      INGRESO: {
        variant: "default" as const,
        icon: TrendingUp,
        color: "text-green-600",
      },
      EGRESO: {
        variant: "destructive" as const,
        icon: TrendingDown,
        color: "text-red-600",
      },
      DEPOSITO_BANCO: {
        variant: "secondary" as const,
        icon: Banknote,
        color: "text-blue-600",
      },
    };

    const config = variants[tipo as keyof typeof variants] || variants.INGRESO;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className={`h-3 w-3 ${config.color}`} />
        {tipo}
      </Badge>
    );
  };

  const getEstadoBadge = (estado: string) => {
    const variants = {
      ABIERTO: {
        variant: "outline" as const,
        icon: AlertCircle,
        color: "text-green-600 ",
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

  if (!movimiento) {
    return (
      <div className="">
        <h2>Movimiento no encontrado</h2>
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
              Movimiento de Caja #{movimiento.id}
            </h1>
            <p className="text-xs text-muted-foreground">
              {movimiento?.caja?.sucursal?.nombre || "Sin sucursal"}
            </p>
          </div>
          <div className="ml-auto">{getTipoBadge(movimiento.tipo)}</div>
        </motion.div>

        {/* Información General del Movimiento */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <motion.div variants={itemVariants}>
            <Card className="h-full">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium">Fecha</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {formateDateWithMinutes(movimiento.fecha)}
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
                  <DollarSign
                    className={`h-4 w-4 ${
                      movimiento.tipo === "INGRESO"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium">Monto</p>
                    <p
                      className={`text-sm font-semibold ${
                        movimiento.tipo === "INGRESO"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {movimiento.tipo === "INGRESO" ? "+" : "-"}
                      {formattMonedaGT(Math.abs(movimiento.monto))}
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
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium">Usuario</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {movimiento.usuario?.nombre || "N/A"}
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
                  <CheckCircle
                    className={`h-4 w-4 ${
                      movimiento.usadoParaCierre
                        ? "text-green-600"
                        : "text-gray-400"
                    }`}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium">Usado para Cierre</p>
                    <p className="text-xs text-muted-foreground">
                      {movimiento.usadoParaCierre ? "Sí" : "No"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Detalles del Movimiento */}
        <div className="grid gap-4 md:grid-cols-2">
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Detalles del Movimiento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-xs font-medium">Categoría</p>
                  <p className="text-xs text-muted-foreground">
                    {movimiento.categoria || "Sin categoría"}
                  </p>
                </div>
                <Separator />
                <div>
                  <p className="text-xs font-medium">Descripción</p>
                  <p className="text-xs text-muted-foreground">
                    {movimiento.descripcion || "Sin descripción"}
                  </p>
                </div>
                {movimiento.referencia && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-xs font-medium">Referencia</p>
                      <p className="text-xs text-muted-foreground">
                        {movimiento.referencia}
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Información Bancaria
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-xs font-medium">Banco</p>
                  <p className="text-xs text-muted-foreground">
                    {movimiento.banco || "N/A"}
                  </p>
                </div>
                {movimiento.numeroBoleta && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-xs font-medium">Número de Boleta</p>
                      <p className="text-xs text-muted-foreground font-mono">
                        {movimiento.numeroBoleta}
                      </p>
                    </div>
                  </>
                )}
                {movimiento.proveedor && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-xs font-medium">Proveedor</p>
                      <p className="text-xs text-muted-foreground">
                        {movimiento.proveedor.nombre}
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Información de la Caja Asociada */}
        {movimiento.caja && (
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Caja Asociada #{movimiento.caja.id}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <div className="space-y-1">
                    <p className="text-xs font-medium">Estado</p>
                    {getEstadoBadge(movimiento.caja.estado)}
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium">Saldo Inicial</p>
                    <p className="text-xs text-green-600 font-semibold">
                      {formattMonedaGT(movimiento.caja.saldoInicial)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium">Saldo Final</p>
                    <p className="text-xs text-blue-600 font-semibold">
                      {formattMonedaGT(movimiento.caja.saldoFinal)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium">Depositado</p>
                    <Badge
                      variant={
                        movimiento.caja.depositado ? "default" : "secondary"
                      }
                    >
                      {movimiento.caja.depositado ? "Sí" : "No"}
                    </Badge>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-xs font-medium mb-2">Fechas</p>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-xs text-muted-foreground">
                          Apertura:
                        </span>
                        <span className="text-xs">
                          {formateDateWithMinutes(
                            movimiento.caja.fechaApertura
                          )}
                        </span>
                      </div>
                      {movimiento.caja.fechaCierre && (
                        <div className="flex justify-between">
                          <span className="text-xs text-muted-foreground">
                            Cierre:
                          </span>
                          <span className="text-xs">
                            {formateDateWithMinutes(
                              movimiento.caja.fechaCierre
                            )}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-medium mb-2">Usuarios</p>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-xs text-muted-foreground">
                          Apertura:
                        </span>
                        <span className="text-xs">
                          {movimiento.caja.usuarioInicio?.nombre || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs text-muted-foreground">
                          Cierre:
                        </span>
                        <span className="text-xs">
                          {movimiento.caja.usuarioCierre?.nombre || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {(movimiento.caja.comentario ||
                  movimiento.caja.comentarioFinal) && (
                  <>
                    <Separator className="my-4" />
                    <div className="space-y-3">
                      {movimiento.caja.comentario && (
                        <div>
                          <p className="text-xs font-medium">
                            Comentario Inicial
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {movimiento.caja.comentario}
                          </p>
                        </div>
                      )}
                      {movimiento.caja.comentarioFinal && (
                        <div>
                          <p className="text-xs font-medium">
                            Comentario Final
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {movimiento.caja.comentarioFinal}
                          </p>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Timestamps */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Información de Sistema
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-xs font-medium">Creado</p>
                  <p className="text-xs text-muted-foreground">
                    {formateDateWithMinutes(movimiento.creadoEn)}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium">Actualizado</p>
                  <p className="text-xs text-muted-foreground">
                    {formateDateWithMinutes(movimiento.actualizadoEn)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
