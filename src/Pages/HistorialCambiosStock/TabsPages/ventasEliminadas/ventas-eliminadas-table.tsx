"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import type {
  HistorialStockEliminacionVentaItem,
  HistorialStockEliminacionVentaResponse,
} from "./interfaces.interface";

interface PropsVentaEliminada {
  data?: HistorialStockEliminacionVentaResponse;
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onViewDetails: (item: HistorialStockEliminacionVentaItem) => void;
}

export default function VentasEliminadasTable({
  data,
  isLoading,
  currentPage,
  totalPages,
  onPageChange,
  onViewDetails,
}: PropsVentaEliminada) {
  const items: HistorialStockEliminacionVentaItem[] = data?.data ?? [];

  return (
    <div className="space-y-4">
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID Movimiento</TableHead>
              <TableHead>Fecha Cambio</TableHead>
              <TableHead>Usuario</TableHead>
              <TableHead>Producto</TableHead>
              <TableHead className="text-right">Cant. Anterior</TableHead>
              <TableHead className="text-right">Cant. Nueva</TableHead>
              <TableHead>Sucursal</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  Cargando historial de ventas eliminadas...
                </TableCell>
              </TableRow>
            ) : items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  No se encontraron ventas eliminadas.
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.id}</TableCell>
                  <TableCell>
                    {format(new Date(item.fechaCambio), "dd/MM/yyyy HH:mm", {
                      locale: es,
                    })}
                  </TableCell>
                  <TableCell>{item.usuario.nombre}</TableCell>
                  <TableCell>{item.producto.nombre}</TableCell>
                  <TableCell className="text-right">
                    {item.cantidadAnterior}
                  </TableCell>
                  <TableCell className="text-right">
                    {item.cantidadNueva}
                  </TableCell>
                  <TableCell>{item.sucursal.nombre}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewDetails(item)}
                    >
                      Ver Detalles
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      {/* Pagination Controls */}
      {!isLoading && items.length > 0 && (
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            <ChevronLeftIcon className="h-4 w-4 mr-2" /> Anterior
          </Button>
          <span className="text-sm font-medium">
            Página {currentPage} de {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
          >
            Siguiente <ChevronRightIcon className="h-4 w-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
}
