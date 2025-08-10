import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { type GarantiaDto, EstadoGarantia } from "./../interfacesTable";
import {
  Calendar,
  User,
  Package,
  Tag,
  ClipboardList,
  ArrowRightLeft,
  Building2,
} from "lucide-react";
import { formattFecha } from "@/Pages/Utils/Utils";

interface WarrantyDetailDialogProps {
  warranty: GarantiaDto | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const getEstadoGarantiaDisplayName = (estado: EstadoGarantia) => {
  if (estado === EstadoGarantia.RECIBIDO) {
    return "Recibido";
  }
  return estado.replace(/_/g, " "); // Replace underscores with spaces for better readability
};

export function WarrantyDetailDialog({
  warranty,
  isOpen,
  onOpenChange,
}: WarrantyDetailDialogProps) {
  if (!warranty) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ClipboardList className="h-6 w-6" />
            Detalles de Garantía #{warranty.id}
          </DialogTitle>
          <DialogDescription>
            Información completa sobre la garantía del producto.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Package className="h-5 w-5" />
                Información General
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2 text-sm">
              <p>
                <span className="font-semibold">Estado:</span>{" "}
                <Badge variant="secondary">
                  {getEstadoGarantiaDisplayName(warranty.estado)}
                </Badge>
              </p>
              <p className="flex items-center gap-1">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="font-semibold">Fecha de Recepción:</span>{" "}
                {formattFecha(warranty.fechaRecepcion)}
              </p>
              <p>
                <span className="font-semibold">Cantidad Devuelta:</span>{" "}
                {warranty.cantidadDevuelta}
              </p>
              <p className="flex items-center gap-1">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-semibold">Cliente:</span>{" "}
                {warranty.cliente.nombre} (ID: {warranty.cliente.id})
              </p>
              <p className="flex items-center gap-1">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span className="font-semibold">Proveedor:</span>{" "}
                {warranty.proveedor?.nombre || "N/A"}
              </p>
              <p className="flex items-center gap-1">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-semibold">Usuario Recibe:</span>{" "}
                {warranty.usuarioRecibe?.nombre || "N/A"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Tag className="h-5 w-5" />
                Detalles del Producto
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2 text-sm">
              <p>
                <span className="font-semibold">Nombre:</span>{" "}
                {warranty.producto.nombre}
              </p>
              <p>
                <span className="font-semibold">Código:</span>{" "}
                {warranty.producto.codigo}
              </p>
              <p>
                <span className="font-semibold">Descripción:</span>{" "}
                {warranty.producto.descripcion || "Sin descripción"}
              </p>
              <p>
                <span className="font-semibold">ID de Venta:</span>{" "}
                {warranty.ventaId}
              </p>
              <p className="flex items-center gap-1">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="font-semibold">Fecha de Venta:</span>{" "}
                {formattFecha(warranty.venta.fechaVenta)}
              </p>
            </CardContent>
          </Card>
        </div>

        <Separator className="my-6" />

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <ClipboardList className="h-5 w-5" />
              Registros de Garantía
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            {warranty.registros.length > 0 ? (
              warranty.registros.map((registro) => (
                <div
                  key={registro.id}
                  className="border rounded-md p-4 grid gap-2 text-sm bg-muted/20"
                >
                  <p className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-semibold">Fecha:</span>{" "}
                    {formattFecha(registro.fechaRegistro)}
                  </p>
                  <p>
                    <span className="font-semibold">Estado:</span>{" "}
                    <Badge variant="outline">
                      {getEstadoGarantiaDisplayName(registro.estado)}
                    </Badge>
                  </p>
                  <p>
                    <span className="font-semibold">Acciones Realizadas:</span>{" "}
                    {registro.accionesRealizadas || "N/A"}
                  </p>
                  <p>
                    <span className="font-semibold">Conclusión:</span>{" "}
                    {registro.conclusion || "N/A"}
                  </p>
                  <p className="flex items-center gap-1">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-semibold">Usuario:</span>{" "}
                    {registro.usuario?.nombre || "N/A"}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">
                No hay registros de garantía disponibles.
              </p>
            )}
          </CardContent>
        </Card>

        <Separator className="my-6" />

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <ArrowRightLeft className="h-5 w-5" />
              Movimientos de Stock
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            {warranty.movimientoStock.length > 0 ? (
              warranty.movimientoStock.map((movimiento) => (
                <div
                  key={movimiento.id}
                  className="border rounded-md p-4 grid gap-2 text-sm bg-muted/20"
                >
                  <p className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-semibold">Fecha de Cambio:</span>{" "}
                    {formattFecha(movimiento.fechaCambio)}
                  </p>
                  <p>
                    <span className="font-semibold">Cantidad Anterior:</span>{" "}
                    {movimiento.cantidadAnterior}
                  </p>
                  <p>
                    <span className="font-semibold">Cantidad Nueva:</span>{" "}
                    {movimiento.cantidadNueva}
                  </p>
                  <p className="flex items-center gap-1">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-semibold">Usuario:</span>{" "}
                    {movimiento.usuario.nombre}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">
                No hay movimientos de stock disponibles.
              </p>
            )}
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
