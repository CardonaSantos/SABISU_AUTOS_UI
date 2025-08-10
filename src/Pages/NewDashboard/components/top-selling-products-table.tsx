import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { MasVendidos } from "../types/dashboard";

interface TopSellingProductsTableProps {
  masVendidos: MasVendidos[];
}

export function TopSellingProductsTable({
  masVendidos,
}: TopSellingProductsTableProps) {
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>Productos Más Vendidos</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Producto</TableHead>
              <TableHead>Ventas</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {masVendidos &&
              masVendidos.map((product, index) => (
                <TableRow key={index}>
                  <TableCell>{product.nombre}</TableCell>
                  <TableCell>{product.totalVentas}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
