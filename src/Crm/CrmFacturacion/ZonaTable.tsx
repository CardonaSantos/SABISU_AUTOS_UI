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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import {
  Edit,
  Trash2,
  Users,
  FileText,
  Calendar,
  Bell,
  AlertTriangle,
  Check,
  X,
} from "lucide-react";
import type { FacturacionZona } from "./FacturacionZonaTypes";

interface ZonaTableProps {
  zonas: FacturacionZona[];
  searchTerm: string;
  onEditClick: (zona: FacturacionZona) => void;
  onDeleteClick: (id: number) => void;
}

const ZonaTable: React.FC<ZonaTableProps> = ({
  zonas,
  //   searchTerm,
  onEditClick,
  onDeleteClick,
}) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Configuración</TableHead>
            <TableHead>Notificaciones</TableHead>
            <TableHead className="text-center">Clientes</TableHead>
            <TableHead className="text-center">Facturas</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {zonas.map((zona) => (
            <TableRow key={zona.id}>
              <TableCell className="font-medium">{zona.nombre}</TableCell>
              <TableCell>
                <div className="flex flex-col space-y-1">
                  <div className="flex items-center gap-1">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center">
                            <Calendar className="h-3.5 w-3.5 text-muted-foreground mr-1" />
                            <span className="text-xs">
                              Gen: {zona.diaGeneracionFactura}
                            </span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            Día de generación de factura:{" "}
                            {zona.diaGeneracionFactura}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center ml-2">
                            <Calendar className="h-3.5 w-3.5 text-muted-foreground mr-1" />
                            <span className="text-xs">
                              Pago: {zona.diaPago}
                            </span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Día de pago: {zona.diaPago}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <div className="flex items-center gap-1">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center">
                            <Bell className="h-3.5 w-3.5 text-muted-foreground mr-1" />
                            <span className="text-xs">
                              Rec1: {zona.diaRecordatorio}
                            </span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            Día de primer recordatorio: {zona.diaRecordatorio}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center ml-2">
                            <Bell className="h-3.5 w-3.5 text-muted-foreground mr-1" />
                            <span className="text-xs">
                              Rec2: {zona.diaSegundoRecordatorio}
                            </span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            Día de segundo recordatorio:{" "}
                            {zona.diaSegundoRecordatorio}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <div className="flex items-center gap-1">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center">
                            <AlertTriangle className="h-3.5 w-3.5 text-muted-foreground mr-1" />
                            <span className="text-xs">
                              Corte: {zona.diaCorte || "N/A"}
                            </span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            Día de corte: {zona.diaCorte || "No configurado"}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="mt-2 flex flex-col space-y-1">
                  <div className="flex items-center text-xs">
                    {zona.enviarRecordatorioGeneracion ? (
                      <Check className="h-3.5 w-3.5 text-green-500 mr-1" />
                    ) : (
                      <X className="h-3.5 w-3.5 text-red-500 mr-1" />
                    )}
                    <span>Aviso generación</span>
                  </div>

                  <div className="flex items-center text-xs">
                    {zona.enviarRecordatorio1 ? (
                      <Check className="h-3.5 w-3.5 text-green-500 mr-1" />
                    ) : (
                      <X className="h-3.5 w-3.5 text-red-500 mr-1" />
                    )}
                    <span>Recordatorio 1</span>
                  </div>
                  <div className="flex items-center text-xs">
                    {zona.enviarRecordatorio2 ? (
                      <Check className="h-3.5 w-3.5 text-green-500 mr-1" />
                    ) : (
                      <X className="h-3.5 w-3.5 text-red-500 mr-1" />
                    )}
                    <span>Recordatorio 2</span>
                  </div>

                  <div className="flex items-center text-xs">
                    {zona.enviarAvisoPago ? (
                      <Check className="h-3.5 w-3.5 text-green-500 mr-1" />
                    ) : (
                      <X className="h-3.5 w-3.5 text-red-500 mr-1" />
                    )}
                    <span>Aviso pago</span>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-center">
                <div className="flex flex-col items-center">
                  <Users className="h-4 w-4 text-muted-foreground mb-1" />
                  <span className="font-medium">{zona.clientesCount || 0}</span>
                </div>
              </TableCell>
              <TableCell className="text-center">
                <div className="flex flex-col items-center">
                  <FileText className="h-4 w-4 text-muted-foreground mb-1" />
                  <span className="font-medium">{zona.facturasCount || 0}</span>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEditClick(zona)}
                  >
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Editar</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDeleteClick(zona.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                    <span className="sr-only">Eliminar</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ZonaTable;
