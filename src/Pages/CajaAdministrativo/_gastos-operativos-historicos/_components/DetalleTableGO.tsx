import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import dayjs from "dayjs";
import { Button } from "@/components/ui/button";
import { useEffect, useMemo, useState } from "react";
import { GastoOperativoDetalleUI } from "../Interfaces/gastosOperativosInterfaces";

function canalLabel(det: GastoOperativoDetalleUI): string {
  const c = det.egresoCaja ?? 0;
  const b = det.egresoBanco ?? 0;
  if (c > 0 && b > 0) return "Mixto";
  if (c > 0) return "Caja";
  if (b > 0) return "Banco";
  return "-";
}

export function DetalleTableGO({
  detalle,
}: {
  detalle: GastoOperativoDetalleUI[];
}) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return (detalle ?? []).filter((r) =>
      [
        r.proveedor?.nombre ?? "",
        r.tipo ?? "",
        r.descripcion ?? "",
        r.referencia ?? "",
        r.sucursal?.nombre ?? "",
        r.fechaDia ?? "",
      ].some((v) => (v ?? "").toLowerCase().includes(q))
    );
  }, [detalle, search]);

  const totalPages = Math.max(1, Math.ceil((filtered.length ?? 0) / pageSize));
  const start = (page - 1) * pageSize;
  const rows = filtered.slice(start, start + pageSize);

  const fmt = new Intl.NumberFormat("es-GT", {
    style: "currency",
    currency: "GTQ",
  });

  useEffect(() => {
    setPage(1);
  }, [pageSize, search, detalle]);

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <Card>
        <CardHeader className="pb-2 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <CardTitle className="text-base">
            Detalle de gastos operativos
          </CardTitle>
          <div className="flex items-center gap-2 text-sm">
            <input
              className="border rounded-md px-3 py-1.5 w-56"
              placeholder="Buscar (proveedor, tipo, sucursal, desc, ref)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <label className="text-muted-foreground">Filas:</label>
            <select
              className="border rounded-md px-2 py-1"
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </CardHeader>

        <CardContent className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2 pr-3">Fecha</th>
                <th className="py-2 pr-3">Sucursal</th>
                <th className="py-2 pr-3">Proveedor</th>
                <th className="py-2 pr-3">Tipo</th>
                <th className="py-2 pr-3">Caja</th>
                <th className="py-2 pr-3">Banco</th>
                <th className="py-2 pr-3">Total</th>
                <th className="py-2 pr-3">Canal</th>
                <th className="py-2 pr-3">Factura</th>
                <th className="py-2 pr-3">Descripción / Ref</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const canal = canalLabel(r);
                return (
                  <tr key={r.id} className="border-b hover:bg-muted/40">
                    <td className="py-2 pr-3 font-medium">
                      {dayjs(r.fecha).format("DD/MM/YYYY HH:mm")}
                    </td>
                    <td className="py-2 pr-3">{r.sucursal?.nombre ?? "-"}</td>
                    <td className="py-2 pr-3">{r.proveedor?.nombre ?? "-"}</td>
                    <td className="py-2 pr-3">{r.tipo ?? "-"}</td>
                    <td className="py-2 pr-3 text-rose-600 tabular-nums">
                      {fmt.format(
                        r.egresoCaja ?? Math.max(0, -(r.deltaCaja ?? 0))
                      )}
                    </td>
                    <td className="py-2 pr-3 text-rose-600 tabular-nums">
                      {fmt.format(
                        r.egresoBanco ?? Math.max(0, -(r.deltaBanco ?? 0))
                      )}
                    </td>
                    <td className="py-2 pr-3 font-semibold tabular-nums">
                      {fmt.format(r.monto)}
                    </td>
                    <td className="py-2 pr-3">{canal}</td>
                    <td className="py-2 pr-3">
                      <span
                        className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs ${
                          r.conFactura
                            ? "bg-emerald-500/15 text-emerald-700"
                            : "bg-amber-500/15 text-amber-700"
                        }`}
                      >
                        {r.conFactura ? "Sí" : "No"}
                      </span>
                    </td>
                    <td className="py-2 pr-3">
                      {(r.descripcion ?? "-") +
                        (r.referencia ? ` — ${r.referencia}` : "")}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="flex items-center justify-between gap-2 pt-4">
            <p className="text-xs text-muted-foreground">
              Página {page} de {totalPages} — {filtered.length} registros
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                Siguiente
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
