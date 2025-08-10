import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { VentaReciente } from "../types/dashboard";

interface RecentTransactionsTableProps {
  transaccionesRecientes: VentaReciente[];
  formatearFecha: (fecha: string) => string;
}

export function RecentTransactionsTable({
  transaccionesRecientes,
  formatearFecha,
}: RecentTransactionsTableProps) {
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>Transacciones Recientes</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Fecha y hora</TableHead>
              <TableHead>Monto Total</TableHead>
              <TableHead>Sucursal</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transaccionesRecientes &&
              transaccionesRecientes.map((transaction, index) => (
                <TableRow key={index}>
                  <TableCell>#{transaction.id}</TableCell>
                  <TableCell>
                    {formatearFecha(transaction.fechaVenta)}
                  </TableCell>
                  <TableCell>
                    {new Intl.NumberFormat("es-GT", {
                      style: "currency",
                      currency: "GTQ",
                    }).format(transaction.totalVenta)}
                  </TableCell>
                  <TableCell>{transaction.sucursal.nombre}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
