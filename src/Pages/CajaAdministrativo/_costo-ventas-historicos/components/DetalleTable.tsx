import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import dayjs from "dayjs";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { CostoVentaDetalleUI } from "../costoVentasHistoricosTypes";

function medio(det: CostoVentaDetalleUI): { label: string; icon: string } {
  if (det.deltaCaja && det.deltaCaja !== 0)
    return { label: "Caja", icon: "💵" };
  if (det.deltaBanco && det.deltaBanco !== 0)
    return { label: "Banco", icon: "🏦" };
  return { label: "-", icon: "" };
}

export function DetalleTable({ detalle }: { detalle: CostoVentaDetalleUI[] }) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const totalPages = Math.max(1, Math.ceil((detalle?.length ?? 0) / pageSize));
  const start = (page - 1) * pageSize;
  const rows = (detalle ?? []).slice(start, start + pageSize);

  const formatter = new Intl.NumberFormat("es-GT", {
    style: "currency",
    currency: "GTQ",
  });

  useEffect(() => {
    setPage(1);
  }, [pageSize, detalle]);

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <Card>
        <CardHeader className="pb-2 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <CardTitle className="text-base">Detalle de movimientos</CardTitle>
          <div className="flex items-center gap-2 text-sm">
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
                <th className="py-2 pr-3">Proveedor</th>
                <th className="py-2 pr-3">Motivo</th>
                <th className="py-2 pr-3">Tipo</th>
                <th className="py-2 pr-3">Monto</th>
                <th className="py-2 pr-3">Medio</th>
                <th className="py-2 pr-3">Descripción</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const m = medio(r);
                return (
                  <tr key={r.id} className="border-b hover:bg-muted/40">
                    <td className="py-2 pr-3 font-medium">
                      {dayjs(r.fecha).format("DD/MM/YYYY HH:mm")}
                    </td>
                    <td className="py-2 pr-3">{r.proveedor?.nombre ?? "-"}</td>
                    <td className="py-2 pr-3">{r.motivo}</td>
                    <td className="py-2 pr-3">{r.costoVentaTipo ?? "-"}</td>
                    <td className="py-2 pr-3">{formatter.format(r.monto)}</td>
                    <td className="py-2 pr-3">
                      {m.icon} {m.label}
                    </td>
                    <td className="py-2 pr-3">{r.descripcion}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Paginación */}
          <div className="flex items-center justify-between gap-2 pt-4">
            <p className="text-xs text-muted-foreground">
              Página {page} de {totalPages} — {detalle.length} registros
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
