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
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreVertical,
  Edit,
  Trash2,
  Users,
  FileText,
  Bell,
  Calendar,
  WifiOff,
  AlertCircle,
} from "lucide-react";
import type { FacturacionZona } from "./FacturacionZonaTypes";

interface ZonaTableProps {
  zonas: FacturacionZona[];
  searchTerm: string;
  onEditClick: (zona: FacturacionZona) => void;
  onDeleteClick: (id: number) => void;
}

export const ZonaTable: React.FC<ZonaTableProps> = ({
  zonas,
  searchTerm,
  onEditClick,
  onDeleteClick,
}) => {
  if (zonas.length === 0) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>No hay zonas disponibles</AlertTitle>
        <AlertDescription>
          {searchTerm
            ? `No se encontraron resultados para "${searchTerm}"`
            : "No se encontraron zonas de facturación. Cree una nueva utilizando el formulario."}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="rounded-md border overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="text-[12px]">
              <TableHead>Nombre</TableHead>
              <TableHead className="hidden md:table-cell">
                Facturación
              </TableHead>
              <TableHead className="hidden md:table-cell">Pago</TableHead>
              <TableHead className="hidden md:table-cell">Clientes</TableHead>
              <TableHead className="hidden md:table-cell">Facturas</TableHead>
              <TableHead className="hidden md:table-cell">
                Fecha Corte
              </TableHead>
              <TableHead className="w-[80px]">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {zonas.map((zona) => (
              <TableRow key={zona.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{zona.nombre}</div>
                    <div className="text-sm text-muted-foreground md:hidden">
                      Facturación: día {zona.diaGeneracionFactura}, Pago: día{" "}
                      {zona.diaPago}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="flex flex-col">
                    <span>
                      <Calendar className="inline h-3 w-3 mr-1" />
                      Día {zona.diaGeneracionFactura}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="flex flex-col">
                    <span>
                      <Calendar className="inline h-3 w-3 mr-1" />
                      Día {zona.diaPago}
                    </span>
                    {zona.enviarRecordatorio && (
                      <span className="text-xs text-muted-foreground">
                        <Bell className="inline h-3 w-3 mr-1" />
                        Recordatorio: día {zona.diaRecordatorio} y{" "}
                        {zona.diaSegundoRecordatorio}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{zona.clientesCount || 0}</span>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="flex items-center gap-1">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span>{zona.facturasCount || 0}</span>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="flex items-center gap-1">
                    <WifiOff className="h-4 w-4 text-muted-foreground" />
                    <span>{zona.diaCorte || "N/A"}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">Abrir menú</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        className="flex items-center gap-2"
                        onClick={() => onEditClick(zona)}
                      >
                        <Edit className="h-4 w-4" />
                        <span>Editar</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="flex items-center gap-2 text-destructive"
                        onClick={() => onDeleteClick(zona.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>Eliminar</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
