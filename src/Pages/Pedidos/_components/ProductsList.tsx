import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ProductoToPedidoList } from "../Interfaces/productsList.interfaces";

type Line = { productoId: number; cantidad: number };

export default function ProductsList({
  productos,
  selectedLines,
  onToggle,
  onQtyChange,
  search,
  setSearch,
}: {
  productos: ProductoToPedidoList[];
  selectedLines: Line[];
  onToggle: (checked: boolean, productId: number) => void;
  onQtyChange: (productId: number, qty: number) => void;
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
}) {
  const getQty = (productId: number) =>
    selectedLines.find((l) => l.productoId === productId)?.cantidad ?? 0;

  const isChecked = (productId: number) =>
    selectedLines.some((l) => l.productoId === productId);

  return (
    <div className="space-y-3">
      {/* 🔎 Buscador */}
      <div className="flex items-center gap-2">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nombre o código…"
          className="max-w-sm"
        />
      </div>

      {/* 🔎 Tabla con scroll */}
      <div className="rounded-md border">
        <div className="max-h-full overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10"></TableHead>
                <TableHead>Producto</TableHead>
                <TableHead>Código</TableHead>
                <TableHead className="text-right">Stock Total</TableHead>
                <TableHead className="w-28 text-center">Cantidad</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {productos.map((p) => {
                const checked = isChecked(p.id);
                const qty = getQty(p.id);

                return (
                  <TableRow key={p.id}>
                    <TableCell>
                      <Checkbox
                        checked={checked}
                        onCheckedChange={(ck) => onToggle(Boolean(ck), p.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{p.nombre}</div>
                      <div className="text-muted-foreground text-xs">
                        {p.descripcion}
                      </div>
                    </TableCell>
                    <TableCell>{p.codigoProducto}</TableCell>
                    <TableCell className="text-right">
                      {p.stockPorSucursal.map((stock) => (
                        <div key={stock.sucursalId}>
                          <span>Sucursal: {stock.sucursalNombre}</span>{" "}
                          <span>Cantidad: {stock.cantidad}</span>
                        </div>
                      ))}
                    </TableCell>
                    <TableCell className="text-center">
                      <Input
                        type="number"
                        inputMode="numeric"
                        min={1}
                        value={qty || ""}
                        onChange={(e) =>
                          onQtyChange(
                            p.id,
                            Math.max(1, Number(e.target.value || 0))
                          )
                        }
                        disabled={!checked}
                        className="h-8 text-center"
                      />
                    </TableCell>
                  </TableRow>
                );
              })}

              {productos.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-6 text-muted-foreground"
                  >
                    Sin resultados…
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
