import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import dayjs from "dayjs";
import { Button } from "@/components/ui/button";
import { useEffect, useMemo, useState } from "react";
import { FlujoEfectivoDetalleUI } from "../Interface/flujoEfectivo";

function medio(det: FlujoEfectivoDetalleUI): {
  label: string;
  icon: string;
  amount: number;
} {
  if (det.deltaCaja && det.deltaCaja !== 0)
    return { label: "Caja", icon: "💵", amount: det.deltaCaja };
  if (det.deltaBanco && det.deltaBanco !== 0)
    return { label: "Banco", icon: "🏦", amount: det.deltaBanco };
  return { label: "-", icon: "", amount: 0 };
}

const classColorByClas = (c: string) => {
  if (c === "VENTA") return "bg-emerald-500/15 text-emerald-700";
  if (c === "COSTO_VENTA") return "bg-orange-500/15 text-orange-700";
  if (c === "GASTO_OPERATIVO") return "bg-rose-500/15 text-rose-700";
  if (c === "DEPOSITO") return "bg-blue-500/15 text-blue-700";
  return "bg-slate-500/15 text-slate-700";
};

export function DetalleTableFE({
  detalle,
}: {
  detalle: FlujoEfectivoDetalleUI[];
}) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return (detalle ?? []).filter((r) =>
      [
        r.sucursal?.nombre,
        r.clasificacion,
        r.motivo,
        r.descripcion ?? "",
        r.referencia ?? "",
      ].some((v) => (v ?? "").toLowerCase().includes(q))
    );
  }, [detalle, search]);

  const totalPages = Math.max(1, Math.ceil((filtered.length ?? 0) / pageSize));
  const start = (page - 1) * pageSize;
  const rows = filtered.slice(start, start + pageSize);

  const formatter = new Intl.NumberFormat("es-GT", {
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
          <CardTitle className="text-base">Detalle de movimientos</CardTitle>
          <div className="flex items-center gap-2 text-sm">
            <input
              className="border rounded-md px-3 py-1.5 w-56"
              placeholder="Buscar (proveedor, motivo, ref)"
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
                <th className="py-2 pr-3">Clasificación</th>
                <th className="py-2 pr-3">Motivo</th>
                <th className="py-2 pr-3">Monto</th>
                <th className="py-2 pr-3">Medio</th>
                <th className="py-2 pr-3">Descripción / Ref</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const m = medio(r);
                const isPos = m.amount > 0;
                const amountStr = `${isPos ? "+" : ""}${formatter.format(
                  m.amount
                )}`;
                return (
                  <tr key={r.id} className="border-b hover:bg-muted/40">
                    <td className="py-2 pr-3 font-medium">
                      {dayjs(r.fecha).format("DD/MM/YYYY HH:mm")}
                    </td>
                    <td className="py-2 pr-3">{r.sucursal?.nombre ?? "-"}</td>
                    <td className="py-2 pr-3">
                      <span
                        className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs ${classColorByClas(
                          r.clasificacion
                        )}`}
                      >
                        {r.clasificacion}
                      </span>
                    </td>
                    <td className="py-2 pr-3">{r.motivo}</td>
                    <td
                      className={`py-2 pr-3 tabular-nums ${
                        isPos ? "text-emerald-600" : "text-rose-600"
                      }`}
                    >
                      {amountStr}
                    </td>
                    <td className="py-2 pr-3">
                      {m.icon} {m.label}
                    </td>
                    <td className="py-2 pr-3">
                      {r.descripcion ?? "-"}
                      {r.referencia ? ` — ${r.referencia}` : ""}
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
