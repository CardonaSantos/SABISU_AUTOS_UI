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
import { HistorialAjusteStockItemDTO } from "./interfaces.interface";

interface AjustesDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  ajuste: HistorialAjusteStockItemDTO | null;
}

export default function AjustesDetailModal({
  isOpen,
  onClose,
  ajuste,
}: AjustesDetailModalProps) {
  if (!ajuste) return null;

  const {
    id,
    comentario,

    tipo,
    fechaCambio,
    usuario,
    sucursal,
    producto,
    ajusteStock,
  } = ajuste;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalles del Ajuste #{ajusteStock.id}</DialogTitle>
          <DialogDescription>
            Información completa del ajuste de stock.
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

          {/* Detalles del Ajuste */}
          <h3 className="font-semibold text-lg mt-4">Datos del Ajuste</h3>
          <div className="grid grid-cols-2 gap-2">
            <p>
              <strong>ID Ajuste:</strong> {ajusteStock.id}
            </p>
            <p>
              <strong>Fecha Hora:</strong>{" "}
              {format(new Date(ajusteStock.fechaHora), "dd/MM/yyyy HH:mm", {
                locale: es,
              })}
            </p>
            <p>
              <strong>Cantidad Ajustada:</strong> {ajusteStock.cantidadAjustada}
            </p>
            <p>
              <strong>Tipo Ajuste:</strong> {ajusteStock.tipoAjuste}
            </p>
            <p className="col-span-2">
              <strong>Descripción:</strong> {ajusteStock.descripcion}
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

          {/* Registro de Stock */}
          <h3 className="font-semibold text-lg mt-4">Registro de Stock</h3>
          <div className="grid grid-cols-2 gap-2">
            <p>
              <strong>ID Stock:</strong> {ajusteStock.stock.id}
            </p>
            <p>
              <strong>Fecha Ingreso:</strong>{" "}
              {format(new Date(ajusteStock.stock.fechaIngreso), "dd/MM/yyyy", {
                locale: es,
              })}
            </p>
            <p>
              <strong>Vencimiento:</strong>{" "}
              {ajusteStock.stock.fechaVencimiento
                ? format(
                    new Date(ajusteStock.stock.fechaVencimiento),
                    "dd/MM/yyyy",
                    { locale: es }
                  )
                : "N/A"}
            </p>
            <p>
              <strong>Cantidad Inicial:</strong>{" "}
              {ajusteStock.stock.cantidadInicial ?? "N/A"}
            </p>
            <p>
              <strong>Creado En:</strong>{" "}
              {format(
                new Date(ajusteStock.stock.creadoEn),
                "dd/MM/yyyy HH:mm",
                { locale: es }
              )}
            </p>
            <p>
              <strong>Actualizado En:</strong>{" "}
              {format(
                new Date(ajusteStock.stock.actualizadoEn),
                "dd/MM/yyyy HH:mm",
                { locale: es }
              )}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
