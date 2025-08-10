import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { HistorialSalidaVentaItemDTO } from "./interfaces.interface";
import { formattFecha } from "@/Pages/Utils/Utils";

interface VentasDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  venta: HistorialSalidaVentaItemDTO | null; // <- prop renombrado aquí
}

export default function VentasDetailModal({
  isOpen,
  onClose,
  venta,
}: VentasDetailModalProps) {
  if (!venta) return null;

  const { id, comentario, tipo, fechaCambio, usuario, producto } = venta;
  const detalle = venta.venta;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Detalles de la Venta #{detalle?.id ?? "N/A"}
          </DialogTitle>
          <DialogDescription>
            Información completa del movimiento de stock por venta.
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
              {fechaCambio
                ? format(new Date(fechaCambio), "dd/MM/yyyy HH:mm", {
                    locale: es,
                  })
                : "N/A"}
            </p>
            <p>
              <strong>Tipo:</strong> {tipo?.replace(/_/g, " ") || "N/A"}
            </p>
            <p>
              <strong>Comentario:</strong> {comentario || "N/A"}
            </p>
          </div>

          {/* Producto */}
          <h3 className="font-semibold text-lg mt-4">Producto</h3>
          <div className="grid grid-cols-2 gap-2">
            <p>
              <strong>Nombre:</strong> {producto?.nombre || "N/A"}
            </p>
            <p>
              <strong>Código:</strong> {producto?.codigoProducto || "N/A"}
            </p>
          </div>

          {/* Detalles de la venta */}
          <h3 className="font-semibold text-lg mt-4">Detalles de la Venta</h3>
          <div className="grid grid-cols-2 gap-2">
            <p>
              <strong>ID Venta:</strong> {detalle?.id ?? "N/A"}
            </p>
            <p>
              <strong>Fecha Venta:</strong> {formattFecha(detalle?.fechaVenta)}
            </p>
            <p>
              <strong>Hora Venta:</strong> {formattFecha(detalle?.horaVenta)}
            </p>
            <p>
              <strong>Total:</strong> {detalle?.totalVenta ?? "N/A"}
            </p>
            <p>
              <strong>IMEI:</strong> {detalle?.imei || "N/A"}
            </p>
            <p>
              <strong>Método Pago:</strong>{" "}
              {detalle?.metodoPago
                ? `${detalle.metodoPago.metodoPago} (${detalle.metodoPago.monto})`
                : "N/A"}
            </p>
            <p className="col-span-2">
              <strong>Cliente:</strong> {detalle?.cliente?.nombre || "N/A"}
            </p>
            <p>
              <strong>Teléfono Cliente:</strong>{" "}
              {detalle?.cliente?.telefono || "N/A"}
            </p>
            <p>
              <strong>Dirección Cliente:</strong>{" "}
              {detalle?.cliente?.direccion || "N/A"}
            </p>
          </div>

          {/* Productos vendidos */}
          <h3 className="font-semibold text-lg mt-4">Productos Vendidos</h3>
          <div className="space-y-2">
            {detalle?.productos?.length > 0 ? (
              detalle.productos.map((line) => (
                <div key={line.id} className="grid grid-cols-3 gap-2">
                  <p>
                    <strong>Producto:</strong> {line.producto?.nombre || "N/A"}
                  </p>
                  <p>
                    <strong>Cantidad:</strong> {line.cantidad}
                  </p>
                  <p>
                    <strong>Precio:</strong> {line.precioVenta}
                  </p>
                </div>
              ))
            ) : (
              <p>No hay productos registrados</p>
            )}
          </div>

          {/* Sucursal */}
          <h3 className="font-semibold text-lg mt-4">Sucursal</h3>
          <div className="grid grid-cols-2 gap-2">
            <p>
              <strong>Nombre:</strong> {detalle?.sucursal?.nombre || "N/A"}
            </p>
            <p>
              <strong>Dirección:</strong>{" "}
              {detalle?.sucursal?.direccion || "N/A"}
            </p>
          </div>

          {/* Usuario */}
          <h3 className="font-semibold text-lg mt-4">Usuario</h3>
          <p>
            <strong>Nombre:</strong> {usuario?.nombre || "N/A"} (
            {usuario?.rol || "N/A"})
          </p>
          <p>
            <strong>Correo:</strong> {usuario?.correo || "N/A"}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
