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
import type { HistorialStockEliminacionVentaItem } from "./interfaces.interface";

interface VentasEliminadasDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  ventaEliminada: HistorialStockEliminacionVentaItem | null;
}

export default function VentasEliminadasDetailModal({
  isOpen,
  onClose,
  ventaEliminada,
}: VentasEliminadasDetailModalProps) {
  if (!ventaEliminada) return null;

  const {
    id,
    comentario,

    tipo,
    fechaCambio,
    usuario,
    sucursal,
    producto,
    eliminacionVenta,
  } = ventaEliminada;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Detalles de la Eliminación de Venta #{eliminacionVenta.id}
          </DialogTitle>
          <DialogDescription>
            Información completa del registro de eliminación de venta.
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

          {/* Detalles de la Eliminación de Venta */}
          <h3 className="font-semibold text-lg mt-4">
            Datos de la Eliminación de Venta
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <p>
              <strong>ID Eliminación:</strong> {eliminacionVenta.id}
            </p>
            <p>
              <strong>Fecha Eliminación:</strong>{" "}
              {format(
                new Date(eliminacionVenta.fechaEliminacion),
                "dd/MM/yyyy HH:mm",
                {
                  locale: es,
                }
              )}
            </p>
            <p>
              <strong>Motivo:</strong> {eliminacionVenta.motivo}
            </p>
            <p>
              <strong>Cliente:</strong>{" "}
              {eliminacionVenta.cliente
                ? eliminacionVenta.cliente.nombre
                : "N/A (Cliente no registrado)"}
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
