import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Calendar,
  Building,
  FileText,
  Package,
  DollarSign,
} from "lucide-react";
import { CompraListItem } from "./Interfaces/Interfaces1";
import { formattFechaWithMinutes } from "../Utils/Utils";
import { getEstadoStyles } from "./compras.utils";
import { formattMonedaGT } from "@/utils/formattMoneda";

interface ComprasDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  compra: CompraListItem | null;
}

export function ComprasDetailDialog({
  open,
  onOpenChange,
  compra,
}: ComprasDetailDialogProps) {
  if (!compra) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Detalle de Compra #{compra.id}
            <Badge className={getEstadoStyles(compra.estado)}>
              {compra.estado.replace("_", " ")}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Información General */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Información General</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Fecha:</span>
                    <span>{formattFechaWithMinutes(compra.fecha)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Usuario:</span>
                    <span>{compra.usuario.nombre}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Proveedor:</span>
                    <span>{compra.proveedor?.nombre || "Sin proveedor"}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Requisición:</span>
                    <span className="font-mono text-blue-600">
                      {compra.requisicion?.folio || "—"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Con Factura:</span>
                    <Badge
                      variant={compra.conFactura ? "default" : "secondary"}
                    >
                      {compra.conFactura ? "Sí" : "No"}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Resumen */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Resumen de Compra</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {compra.resumen.items}
                  </div>
                  <div className="text-sm text-muted-foreground">Items</div>
                </div>
                <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {compra.resumen.cantidadTotal}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Cantidad Total
                  </div>
                </div>
                <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {formattMonedaGT(compra.total)}
                  </div>
                  <div className="text-sm text-muted-foreground">Total</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detalles de Productos */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Productos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {compra.detalles.map((detalle, index) => (
                  <div key={detalle.id}>
                    <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium text-sm">
                          {detalle.producto.nombre}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Código: {detalle.producto.codigo}
                        </div>
                      </div>
                      <div className="text-right space-y-1">
                        <div className="text-sm">
                          <span className="font-medium">
                            {detalle.cantidad}
                          </span>{" "}
                          x{" "}
                          <span className="font-mono">
                            {formattMonedaGT(detalle.costoUnitario)}
                          </span>
                        </div>
                        <div className="font-bold text-green-600 dark:text-green-400">
                          {formattMonedaGT(detalle.subtotal)}
                        </div>
                      </div>
                    </div>
                    {index < compra.detalles.length - 1 && (
                      <Separator className="my-2" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Información de Requisición */}
          {compra.requisicion && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">
                  Información de Requisición
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="text-sm">
                      <span className="font-medium">Folio:</span>{" "}
                      <span className="font-mono text-blue-600">
                        {compra.requisicion.folio}
                      </span>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Estado:</span>{" "}
                      <Badge variant="outline">
                        {compra.requisicion.estado}
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm">
                      <span className="font-medium">Fecha:</span>{" "}
                      {formattFechaWithMinutes(compra.requisicion.fecha)}
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Total Líneas:</span>{" "}
                      {compra.requisicion.totalLineas}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
