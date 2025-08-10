"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { HistorialStockEliminacionItem } from "./interface.interface";

interface EliminacionesDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  eliminacion: HistorialStockEliminacionItem | null;
}

export default function EliminacionesDetailModal({
  isOpen,
  onClose,
  eliminacion,
}: EliminacionesDetailModalProps) {
  if (!eliminacion) return null;

  const {
    id,
    comentario,
    tipo,
    fechaCambio,
    usuario,
    sucursal,
    producto,
    eliminacionStock,
  } = eliminacion;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Detalles de la Eliminación #{eliminacionStock.id}
          </DialogTitle>
          <DialogDescription>
            Información completa del registro de eliminación de stock.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 text-sm">
          {/* Movimiento */}
          <div className="grid grid-cols-2 gap-2">
            <p>
              <strong>ID Movimiento:</strong> {id}
            </p>
            <p>
              <strong>Fecha Cambio:</strong>{" "}
              {format(new Date(fechaCambio), "dd/MM/yyyy HH:mm", {
                locale: es,
              })}
            </p>
            <p>
              <strong>Tipo:</strong> {tipo.replace(/_/g, " ")}
            </p>
            <p>
              <strong>Comentario:</strong> {comentario || "N/A"}
            </p>
          </div>

          {/* Producto */}
          <h3 className="font-semibold text-lg mt-4">Producto</h3>
          <div className="grid grid-cols-2 gap-2">
            <p>
              <strong>Nombre:</strong> {producto.nombre}
            </p>
            <p>
              <strong>Código:</strong> {producto.codigoProducto}
            </p>
            <p className="col-span-2">
              <strong>Descripción:</strong> {producto.descripcion}
            </p>
          </div>

          {/* Detalles de la Eliminación */}
          <h3 className="font-semibold text-lg mt-4">
            Datos de la Eliminación
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <p>
              <strong>ID Eliminación:</strong> {eliminacionStock.id}
            </p>
            <p>
              <strong>Fecha Creación:</strong>{" "}
              {format(
                new Date(eliminacionStock.createdAt),
                "dd/MM/yyyy HH:mm",
                {
                  locale: es,
                }
              )}
            </p>
            <p>
              <strong>Cantidad Eliminada:</strong>{" "}
              {eliminacionStock.cantidadStockEliminada}
            </p>
            <p>
              <strong>Stock Restante:</strong> {eliminacionStock.stockRestante}
            </p>
            <p className="col-span-2">
              <strong>Motivo:</strong> {eliminacionStock.motivo}
            </p>
          </div>

          {/* Usuario y Sucursal del Movimiento */}
          <h3 className="font-semibold text-lg mt-4">Usuario y Sucursal</h3>
          <div className="grid grid-cols-2 gap-2">
            <p>
              <strong>Usuario Movimiento:</strong> {usuario.nombre} (
              {usuario.rol})
            </p>
            <p>
              <strong>Correo Usuario:</strong> {usuario.correo}
            </p>
            <p>
              <strong>Sucursal:</strong> {sucursal.nombre}
            </p>
            <p>
              <strong>Dirección:</strong> {sucursal.direccion}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
