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
import type { HistorialEntregaStockItem } from "./interfaces.interface";

interface EntregasDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  entrega: HistorialEntregaStockItem | null;
}

export default function EntregasDetailModal({
  isOpen,
  onClose,
  entrega,
}: EntregasDetailModalProps) {
  if (!entrega) return null;

  const {
    id,
    comentario,
    cantidadAnterior,
    cantidadNueva,
    tipo,
    fechaCambio,
    usuario,
    sucursal,
    producto,
    entregaStock,
  } = entrega;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalles de la Entrega #{entregaStock.id}</DialogTitle>
          <DialogDescription>
            Información completa del registro de entrega de stock.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 text-sm">
          {/* Movimiento de Historial */}
          <div className="grid grid-cols-2 gap-2">
            <p>
              <strong>ID Movimiento Historial:</strong> {id}
            </p>
            <p>
              <strong>Fecha Cambio Historial:</strong>{" "}
              {format(new Date(fechaCambio), "dd/MM/yyyy HH:mm", {
                locale: es,
              })}
            </p>
            <p>
              <strong>Tipo:</strong> {tipo.replace(/_/g, " ")}
            </p>
            <p>
              <strong>Comentario Historial:</strong> {comentario || "N/A"}
            </p>
            <p>
              <strong>Cantidad Anterior (Historial):</strong> {cantidadAnterior}
            </p>
            <p>
              <strong>Cantidad Nueva (Historial):</strong> {cantidadNueva}
            </p>
            <p>
              <strong>Sucursal de Registro:</strong> {sucursal.nombre}
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
            {producto.categorias && producto.categorias.length > 0 && (
              <p className="col-span-2">
                <strong>Categorías:</strong>{" "}
                {producto.categorias.map((cat) => cat.nombre).join(", ")}
              </p>
            )}
          </div>

          {/* Detalles de la Entrega */}
          <h3 className="font-semibold text-lg mt-4">Datos de la Entrega</h3>
          <div className="grid grid-cols-2 gap-2">
            <p>
              <strong>ID Entrega:</strong> {entregaStock.id}
            </p>
            <p>
              <strong>Fecha Entrega:</strong>{" "}
              {format(new Date(entregaStock.fechaEntrega), "dd/MM/yyyy HH:mm", {
                locale: es,
              })}
            </p>
            <p>
              <strong>Monto Total:</strong> $
              {entregaStock.montoTotal.toFixed(2)}
            </p>
            <p>
              <strong>Sucursal de Entrega:</strong>{" "}
              {entregaStock.sucursal.nombre}
            </p>
            <p>
              <strong>Proveedor:</strong> {entregaStock.proveedor.nombre}
            </p>
            <p>
              <strong>Usuario Recibido:</strong>{" "}
              {entregaStock.usuarioRecibido.nombre} (
              {entregaStock.usuarioRecibido.rol})
            </p>
          </div>

          {/* Usuario del Movimiento de Historial */}
          <h3 className="font-semibold text-lg mt-4">
            Usuario del Registro de Historial
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <p>
              <strong>Nombre:</strong> {usuario.nombre}
            </p>
            <p>
              <strong>Correo:</strong> {usuario.correo}
            </p>
            <p>
              <strong>Rol:</strong> {usuario.rol}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
