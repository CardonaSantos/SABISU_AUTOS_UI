"use client";

import { MapPin, Building, Users, Calendar, Clock, Info } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Sector, Municipio } from "./types";

interface SectorDetailsDialogProps {
  sector: Sector;
  municipio?: Municipio;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SectorDetailsDialog({
  sector,
  municipio,
  open,
  onOpenChange,
}: SectorDetailsDialogProps) {
  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            <MapPin className="h-5 w-5 mr-2" />
            {sector.nombre}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-6 py-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="px-2 py-1">
                ID: {sector.id}
              </Badge>
              {municipio && (
                <Badge
                  variant="secondary"
                  className="px-2 py-1 flex items-center"
                >
                  <Building className="h-3 w-3 mr-1" />
                  {municipio.nombre}
                </Badge>
              )}
              <Badge variant="outline" className="px-2 py-1 flex items-center">
                <Users className="h-3 w-3 mr-1" />
                {sector.clientes?.length || 0} clientes
              </Badge>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2 flex items-center">
                <Info className="h-4 w-4 mr-1" />
                Descripción
              </h3>
              <div className="bg-muted/30 p-3 rounded-md text-sm">
                {sector.descripcion ||
                  "No hay descripción disponible para este sector."}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium mb-2 flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Fecha de creación
                </h3>
                <div className="bg-muted/30 p-3 rounded-md text-sm">
                  {formatDate(sector.creadoEn)}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-2 flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  Última actualización
                </h3>
                <div className="bg-muted/30 p-3 rounded-md text-sm">
                  {formatDate(sector.actualizadoEn)}
                </div>
              </div>
            </div>

            {sector.clientes && sector.clientes.length > 0 && (
              <div>
                <h3 className="text-sm font-medium mb-2 flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  Clientes en este sector
                </h3>
                <div className="border rounded-md overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="px-3 py-2 text-left font-medium">ID</th>
                        <th className="px-3 py-2 text-left font-medium">
                          Nombre
                        </th>
                        <th className="px-3 py-2 text-left font-medium">
                          Dirección
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {sector.clientes.map((cliente) => (
                        <tr key={cliente.id} className="border-t">
                          <td className="px-3 py-2">{cliente.id}</td>
                          <td className="px-3 py-2">{cliente.nombre}</td>
                          <td className="px-3 py-2">{cliente.direccion}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="pt-4 flex justify-end">
          <Button onClick={() => onOpenChange(false)}>Cerrar</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
