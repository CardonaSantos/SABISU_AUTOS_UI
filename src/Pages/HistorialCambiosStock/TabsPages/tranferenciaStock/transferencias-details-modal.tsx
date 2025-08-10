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
import type { HistorialStockTransferenciaItem } from "./interfaces.interface";

interface TransferenciasDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  transferencia: HistorialStockTransferenciaItem | null;
}

export default function TransferenciasDetailModal({
  isOpen,
  onClose,
  transferencia,
}: TransferenciasDetailModalProps) {
  if (!transferencia) return null;

  const {
    id,
    comentario,
    cantidadAnterior,
    cantidadNueva,
    tipo,
    fechaCambio,
    usuario,
    sucursal, // Sucursal donde se registra el historial
    producto,
    transferenciaProducto,
  } = transferencia;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Detalles de la Transferencia #{transferenciaProducto.id}
          </DialogTitle>
          <DialogDescription>
            Información completa del registro de transferencia de stock.
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

          {/* Detalles de la Transferencia */}
          <h3 className="font-semibold text-lg mt-4">
            Datos de la Transferencia
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <p>
              <strong>ID Transferencia:</strong> {transferenciaProducto.id}
            </p>
            <p>
              <strong>Fecha Transferencia:</strong>{" "}
              {format(
                new Date(transferenciaProducto.fechaTransferencia),
                "dd/MM/yyyy HH:mm",
                {
                  locale: es,
                }
              )}
            </p>
            <p>
              <strong>Cantidad Transferida:</strong>{" "}
              {transferenciaProducto.cantidad}
            </p>
            <p>
              <strong>Sucursal Origen:</strong>{" "}
              {transferenciaProducto.sucursalOrigen.nombre}
            </p>
            <p>
              <strong>Sucursal Destino:</strong>{" "}
              {transferenciaProducto.sucursalDestino.nombre}
            </p>
            <p>
              <strong>Usuario Encargado:</strong>{" "}
              {transferenciaProducto.usuarioEncargado.nombre} (
              {transferenciaProducto.usuarioEncargado.rol})
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
