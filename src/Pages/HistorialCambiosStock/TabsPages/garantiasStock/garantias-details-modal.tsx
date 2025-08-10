import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { HistorialStockDTO } from "../DtoGenerico";

interface GarantiasDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  garantia: HistorialStockDTO | null;
}

export default function GarantiasDetailsModal({
  isOpen,
  onClose,
  garantia,
}: GarantiasDetailsModalProps) {
  // Aseguramos que exista la garantía y su detalle
  if (!garantia || !garantia.garantia) return null;

  const {
    id: movId,
    fechaCambio,
    tipo,
    comentario,
    usuario,
    sucursal,
    producto,
  } = garantia;
  // Asumimos que garantia.garantia está definido (lo guardamos en info)
  const info = garantia.garantia;

  const formatDate = (dateStr?: string) =>
    dateStr
      ? format(new Date(dateStr), "dd/MM/yyyy HH:mm", { locale: es })
      : "N/A";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalles de Garantía</DialogTitle>
          <DialogDescription>
            Información completa del movimiento de stock y datos de la garantía.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 text-sm">
          {/* === MOVIMIENTO === */}
          <section className="grid grid-cols-2 gap-4">
            <p>
              <strong>ID Movimiento:</strong> {movId}
            </p>
            <p>
              <strong>Fecha Cambio:</strong> {formatDate(fechaCambio)}
            </p>
            <p>
              <strong>Tipo Movimiento:</strong> {tipo.replace(/_/g, " ")}
            </p>
            <p>
              <strong>Comentario:</strong> {comentario || "N/A"}
            </p>
          </section>

          {/* === PRODUCTO === */}
          <section>
            <h3 className="text-lg font-semibold border-t pt-4">
              Información del Producto
            </h3>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <p>
                <strong>Nombre:</strong> {producto.nombre}
              </p>
              <p>
                <strong>Código:</strong> {producto.codigoProducto}
              </p>
              <p>
                <strong>Código Proveedor:</strong>{" "}
                {producto.codigoProveedor ?? "N/A"}
              </p>
              <p className="col-span-2">
                <strong>Descripción:</strong> {producto.descripcion ?? "N/A"}
              </p>
              <p className="col-span-2">
                <strong>Categorías:</strong>{" "}
                {producto.categorias?.map((c: any) => c.nombre).join(", ") ||
                  "N/A"}
              </p>
            </div>
          </section>

          {/* === DATOS DE LA GARANTÍA === */}
          <section>
            <h3 className="text-lg font-semibold border-t pt-4">
              Detalles de la Garantía
            </h3>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <p>
                <strong>ID Garantía:</strong> {info.id}
              </p>
              <p>
                <strong>Fecha Recepción:</strong>{" "}
                {formatDate(info.fechaRecepcion)}
              </p>
              <p>
                <strong>Cantidad Devuelta:</strong> {info.cantidadDevuelta}
              </p>
              <p>
                <strong>Estado Garantía:</strong>{" "}
                {info.estado.replace(/_/g, " ")}
              </p>
              <p className="col-span-2">
                <strong>Cliente:</strong> {info.cliente.nombre} (ID{" "}
                {info.cliente.id})
              </p>
              <p className="col-span-2">
                <strong>Comentario Garantía:</strong> {info.comentario || "N/A"}
              </p>
              <p className="col-span-2">
                <strong>Descripción Problema:</strong>{" "}
                {info.descripcionProblema}
              </p>
              <p className="col-span-2">
                <strong>Usuario Recibe:</strong>{" "}
                {info.usuarioRecibe?.nombre || "N/A"}
              </p>
            </div>
          </section>

          {/* === USUARIO & SUCURSAL MOVIMIENTO === */}
          <section>
            <h3 className="text-lg font-semibold border-t pt-4">
              Usuario y Sucursal Movimiento
            </h3>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <p>
                <strong>Usuario:</strong> {usuario.nombre} ({usuario.rol})
              </p>
              <p>
                <strong>Correo:</strong> {usuario.correo}
              </p>
              <p>
                <strong>Sucursal:</strong> {sucursal.nombre}
              </p>
              <p>
                <strong>Dirección:</strong> {sucursal.direccion}
              </p>
            </div>
          </section>
        </div>

        <DialogFooter className="pt-4">
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
