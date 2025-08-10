"use client";

import { useState } from "react";
import dayjs from "dayjs";
import { ChevronDown, ChevronUp, FileText, Wrench } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Reparacion } from "../types/dashboard";
import { CloseRepairDialog } from "./close-repair-dialog";
import { UpdateRepairDialog } from "./update-repair-dialog";
import { Link } from "react-router-dom";

interface ReparacionCardProps {
  reparacion: Reparacion;
  getReparacionesRegis: () => Promise<void>;
  userID: number;
  sucursalId: number | null;
}

export function ReparacionCard({
  reparacion,
  getReparacionesRegis,
  userID,
  sucursalId,
}: ReparacionCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [openCloseDialog, setOpenCloseDialog] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "RECIBIDO":
      case "PENDIENTE":
        return "bg-yellow-500";
      case "EN_PROCESO":
      case "ESPERANDO_PIEZAS":
        return "bg-blue-500";
      case "REPARADO":
        return "bg-green-500";
      case "ENTREGADO":
      case "FINALIZADO":
        return "bg-purple-500";
      case "NO_REPARABLE":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          <span className="font-bold">Reparación #{reparacion.id}</span>
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          aria-expanded={isExpanded}
          aria-label={isExpanded ? "Collapse details" : "Expand details"}
        >
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-2">
          <Badge className={getStatusColor(reparacion.estado)}>
            {reparacion.estado}
          </Badge>
          <span className="text-sm text-gray-500">
            {dayjs(reparacion.fechaRecibido).format("DD/MM/YYYY")}
          </span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link to={`/reparacion-comprobante/${reparacion.id}`}>
                  <FileText className="w-4 h-4" />
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Imprimir comprobante</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <p className="text-sm font-semibold mb-1">
          {reparacion.producto
            ? reparacion.producto.nombre
            : reparacion.productoExterno}
        </p>
        <p className="text-sm mb-2">
          Cliente: <strong>{reparacion.cliente.nombre}</strong>
        </p>
        {isExpanded && (
          <div className="mt-2 space-y-2 text-sm">
            <p>Problemas: {reparacion.problemas}</p>
            <p>Observaciones: {reparacion.observaciones || "N/A"}</p>
            <p>Sucursal: {reparacion.sucursal.nombre}</p>
            <p>Usuario: {reparacion.usuario.nombre}</p>
          </div>
        )}
        <Button
          onClick={() => setOpenUpdateDialog(true)}
          type="button"
          className="w-full mt-4"
          size="sm"
        >
          <Wrench className="mr-2 h-4 w-4" />
          Actualizar Reparación
        </Button>

        <UpdateRepairDialog
          reparacion={reparacion}
          open={openUpdateDialog}
          onOpenChange={setOpenUpdateDialog}
          getReparacionesRegis={getReparacionesRegis}
          setOpenClose={setOpenCloseDialog}
        />

        <CloseRepairDialog
          reparacion={reparacion}
          open={openCloseDialog}
          onOpenChange={setOpenCloseDialog}
          getReparacionesRegis={getReparacionesRegis}
          userID={userID}
          sucursalId={sucursalId}
        />
      </CardContent>
    </Card>
  );
}
