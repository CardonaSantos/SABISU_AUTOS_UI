import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { HistorialStockDTO } from "../DtoGenerico";

interface RequisicionDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  requisicion: HistorialStockDTO | null;
}

export default function RequisicionDetailsModal({
  isOpen,
  onClose,
  requisicion,
}: RequisicionDetailsModalProps) {
  if (!requisicion) return null;

  const req = requisicion.requisicion;
  const producto = requisicion.producto;
  const usuario = requisicion.usuario;
  const sucursal = requisicion.sucursal;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalles de la Requisición</DialogTitle>
          <DialogDescription>
            Información completa del movimiento de stock por requisición.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 text-sm">
          <div className="grid grid-cols-2 gap-2">
            <p>
              <strong>ID Movimiento:</strong> {requisicion.id}
            </p>
            <p>
              <strong>Fecha Cambio:</strong>{" "}
              {requisicion.fechaCambio
                ? format(
                    new Date(requisicion.fechaCambio),
                    "dd/MM/yyyy HH:mm",
                    {
                      locale: es,
                    }
                  )
                : "N/A"}
            </p>
            <p>
              <strong>Tipo:</strong>{" "}
              {requisicion.tipo?.replace(/_/g, " ") || "N/A"}
            </p>
            <p>
              <strong>Comentario:</strong> {requisicion.comentario || "N/A"}
            </p>
          </div>

          <h3 className="font-semibold text-lg mt-4">
            Información del Producto
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <p>
              <strong>Nombre:</strong> {producto?.nombre || "N/A"}
            </p>
            <p>
              <strong>Código Producto:</strong>{" "}
              {producto?.codigoProducto || "N/A"}
            </p>
            <p>
              <strong>Código Proveedor:</strong>{" "}
              {producto?.codigoProveedor || "N/A"}
            </p>
            <p className="col-span-2">
              <strong>Descripción:</strong> {producto?.descripcion || "N/A"}
            </p>
            <p className="col-span-2">
              <strong>Categorías:</strong>{" "}
              {producto?.categorias?.map((cat: any) => cat.nombre).join(", ") ||
                "N/A"}
            </p>
          </div>

          <h3 className="font-semibold text-lg mt-4">
            Detalles de la Requisición
          </h3>
          {req ? (
            <div className="grid grid-cols-2 gap-2">
              <p>
                <strong>ID Requisición:</strong> {req.id}
              </p>
              <p>
                <strong>Folio:</strong> {req.folio || "N/A"}
              </p>
              <p>
                <strong>Estado:</strong> {req.estado || "N/A"}
              </p>
              <p>
                <strong>Fecha Requisición:</strong>{" "}
                {req.fecha
                  ? format(new Date(req.fecha), "dd/MM/yyyy", { locale: es })
                  : "N/A"}
              </p>
              <p>
                <strong>Fecha Recepción:</strong>{" "}
                {req.fechaRecepcion
                  ? format(new Date(req.fechaRecepcion), "dd/MM/yyyy", {
                      locale: es,
                    })
                  : "N/A"}
              </p>
              <p>
                <strong>Ingresada a Stock:</strong>{" "}
                {req.ingresadaAStock ? "Sí" : "No"}
              </p>
              <p>
                <strong>Sucursal Requisición:</strong>{" "}
                {req.sucursal?.nombre || "N/A"}
              </p>
              <p className="col-span-2">
                <strong>Observaciones:</strong> {req.observaciones || "N/A"}
              </p>
              <p>
                <strong>Usuario Requisición:</strong>{" "}
                {req.usuario?.nombre || "N/A"} ({req.usuario?.rol || "N/A"})
              </p>
            </div>
          ) : (
            <p>No hay detalles de requisición disponibles.</p>
          )}

          <h3 className="font-semibold text-lg mt-4">
            Información del Usuario y Sucursal
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <p>
              <strong>Usuario Movimiento:</strong> {usuario?.nombre || "N/A"} (
              {usuario?.rol || "N/A"})
            </p>
            <p>
              <strong>Correo Usuario:</strong> {usuario?.correo || "N/A"}
            </p>
            <p>
              <strong>Sucursal Movimiento:</strong> {sucursal?.nombre || "N/A"}
            </p>
            <p>
              <strong>Dirección Sucursal:</strong>{" "}
              {sucursal?.direccion || "N/A"}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
