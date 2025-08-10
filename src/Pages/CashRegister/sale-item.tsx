import { Card, CardContent } from "@/components/ui/card";
import { Calendar, ShoppingCart, Package, Hash } from "lucide-react";
import { VentaWithOutCashRegist } from "./types";
import { formatearFecha, formatCurrency } from "./utils";

interface SaleItemProps {
  sale: VentaWithOutCashRegist;
}

export function SaleItem({ sale }: SaleItemProps) {
  return (
    <Card className="w-full shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        {/* Encabezado */}
        <div className="flex items-center gap-2 mb-4">
          <ShoppingCart className="h-4 w-4 text-primary" />
          <p className="text-sm font-medium">Venta #{sale.id}</p>
        </div>

        {/* Detalles de la venta */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-3 w-3 text-muted-foreground" />
            <span className="text-sm font-medium">Fecha:</span>
            <span className="text-sm">{formatearFecha(sale.fechaVenta)}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Total:</span>
            <span className="text-sm font-semibold text-green-600">
              {formatCurrency(sale.totalVenta)}
            </span>
          </div>
        </div>

        {/* Información del cliente si existe */}
        {sale.nombreClienteFinal && (
          <div className="mb-4 p-2 bg-muted/50 rounded-md">
            <p className="text-xs font-medium text-muted-foreground mb-1">
              Cliente:
            </p>
            <p className="text-sm">{sale.nombreClienteFinal}</p>
            {sale.telefonoClienteFinal && (
              <p className="text-xs text-muted-foreground">
                {sale.telefonoClienteFinal}
              </p>
            )}
          </div>
        )}

        {/* Lista de productos */}
        {sale.productos.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Package className="h-4 w-4 text-muted-foreground" />
              <h4 className="text-sm font-medium">
                Productos ({sale.productos.length})
              </h4>
            </div>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {sale.productos.map((prod) => (
                <div
                  key={prod.producto.id}
                  className="p-2 border rounded-md bg-background flex justify-between items-center"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {prod.producto.nombre || "N/A"}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Hash className="h-3 w-3" />
                      {prod.producto.codigoProducto || "N/A"}
                    </div>
                  </div>
                  <div className="text-sm font-medium text-right">
                    <span className="text-xs text-muted-foreground">Cant:</span>
                    <span className="ml-1">{prod.cantidad}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
