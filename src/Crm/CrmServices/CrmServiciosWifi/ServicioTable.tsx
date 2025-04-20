"use client";

import type React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Edit,
  Trash2,
  Users,
  CheckCircle,
  XCircle,
  Gauge,
  DollarSign,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Importación centralizada de tipos
import type { ServicioTableProps } from "./servicio-internet.types";

const ServicioTable: React.FC<ServicioTableProps> = ({
  servicios,
  formatearMoneda,
  onEditClick,
  onDeleteClick,
}) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Velocidad</TableHead>
            <TableHead className="text-right">Precio</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-center">Clientes</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {servicios.map((servicio) => (
            <TableRow key={servicio.id}>
              <TableCell className="font-medium">{servicio.nombre}</TableCell>
              <TableCell>
                <div className="flex items-center">
                  <Gauge className="h-4 w-4 text-muted-foreground mr-2" />
                  <span>{servicio.velocidad || "No especificada"}</span>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end">
                  <DollarSign className="h-4 w-4 text-muted-foreground mr-1" />
                  <span className="font-medium">
                    {formatearMoneda(servicio.precio)}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    servicio.estado === "ACTIVO" ? "default" : "destructive"
                  }
                  className="flex items-center w-fit"
                >
                  {servicio.estado === "ACTIVO" ? (
                    <CheckCircle className="mr-1 h-3 w-3" />
                  ) : (
                    <XCircle className="mr-1 h-3 w-3" />
                  )}
                  {servicio.estado}
                </Badge>
              </TableCell>
              <TableCell className="text-center">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center justify-center">
                        <Users className="h-4 w-4 text-muted-foreground mr-1" />
                        <span className="font-medium">
                          {servicio.clientesCount || 0}
                        </span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        Clientes usando este plan: {servicio.clientesCount || 0}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEditClick(servicio)}
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Editar</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Editar plan</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onDeleteClick(servicio.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                          <span className="sr-only">Eliminar</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Eliminar plan</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ServicioTable;
