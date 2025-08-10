// interface.ts
export interface Movimiento {
  id: number;
  registroCajaId: number;
  fecha: string;
  tipo: TipoMovimientoCaja;
  categoria: CategoriaMovimiento;
  monto: number;
  descripcion?: string;
  referencia?: string;
  banco?: string;
  numeroBoleta?: string;
  usadoParaCierre?: boolean;
  proveedorId?: number;
  usuarioId: number;
  creadoEn: string;
  actualizadoEn: string;
}

// TransactionAccordion.tsx
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CreditCard, TrendingDown, ShoppingCart } from "lucide-react";
import { DepositItem } from "./deposit-item";
import { ExpenseItem } from "./expense-item";
import { SaleItem } from "./sale-item";
import { CategoriaMovimiento, TipoMovimientoCaja } from "./interface";
import { VentaWithOutCashRegist } from "./types";

interface TransactionAccordionProps {
  movimientos: Movimiento[];
  ventas: VentaWithOutCashRegist[];
}

export function TransactionAccordion({
  movimientos,
  ventas,
}: TransactionAccordionProps) {
  const depositos = movimientos.filter(
    (m) => m.tipo === TipoMovimientoCaja.DEPOSITO_BANCO
  );
  const egresos = movimientos.filter(
    (m) => m.tipo === TipoMovimientoCaja.EGRESO
  );

  return (
    <div className="mt-8 space-y-4">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="deposits">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-green-600" />
              <h3 className="text-lg font-semibold">
                Depósitos ({depositos.length})
              </h3>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 p-4">
              {depositos.length > 0 ? (
                depositos.map((d) => <DepositItem key={d.id} movimiento={d} />)
              ) : (
                <div className="text-center py-8">
                  <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">
                    No hay depósitos registrados.
                  </p>
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="expenses">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-red-600" />
              <h3 className="text-lg font-semibold">
                Egresos ({egresos.length})
              </h3>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 p-4">
              {egresos.length > 0 ? (
                egresos.map((e) => <ExpenseItem key={e.id} movimiento={e} />)
              ) : (
                <div className="text-center py-8">
                  <TrendingDown className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">
                    No hay egresos registrados.
                  </p>
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="sales">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold">
                Ventas ({ventas.length})
              </h3>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 p-4">
              {ventas.length > 0 ? (
                ventas.map((v) => <SaleItem key={v.id} sale={v} />)
              ) : (
                <div className="text-center py-8">
                  <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">
                    No hay ventas registradas.
                  </p>
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
