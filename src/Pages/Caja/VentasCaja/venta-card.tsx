"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DollarSign,
  Package,
  ReceiptText,
  ShoppingCart,
  User,
  Clock,
} from "lucide-react";
import { VentaLigadaACaja } from "./interface";
import { formateDateWithMinutes } from "@/Crm/Utils/FormateDate";
import { formattMonedaGT } from "@/utils/formattMoneda";

interface SaleCardProps {
  sale: VentaLigadaACaja;
}

export function VentaCard({ sale }: SaleCardProps) {
  const formattedTime = formateDateWithMinutes(sale.horaVenta);

  return (
    <Card className="w-full mb-2">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <ShoppingCart className="h-5 w-5 text-primary" />
          Venta #{sale.id}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Total:</span>
            {formattMonedaGT(sale.totalVenta)}
          </div>
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Cliente:</span>{" "}
            {sale.cliente?.nombre || "CF"}
          </div>
          <div className="flex items-center gap-2">
            <ReceiptText className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Comprobante:</span>{" "}
            {sale.tipoComprobante}
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Hora:</span> {formattedTime}
          </div>
        </div>

        <Accordion type="single" collapsible className="w-full mt-4">
          <AccordionItem value={`item-${sale.id}`}>
            <AccordionTrigger className="text-sm text-muted-foreground hover:no-underline">
              Ver detalles de la venta
            </AccordionTrigger>
            <AccordionContent className="pt-2">
              <div className="grid gap-2 text-sm">
                {sale.referenciaPago && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Referencia de Pago:</span>{" "}
                    {sale.referenciaPago}
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <span className="font-medium">Método de Pago:</span>{" "}
                  {sale.metodoPago.metodoPago}
                </div>
                <h4 className="font-semibold mt-3 mb-2 flex items-center gap-2">
                  <Package className="h-4 w-4" /> Productos:
                </h4>
                {sale.productos.length > 0 ? (
                  <ul className="list-disc pl-5 space-y-1">
                    {sale.productos.map((product) => (
                      <li key={product.lineaId}>
                        {product.cantidad}x {product.nombre} (
                        {product.codigoProducto}) -{" "}
                        {formattMonedaGT(product.precioVenta)} c/u
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground">
                    No hay productos registrados para esta venta.
                  </p>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
