"use client";

import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";

import {
  FlujoCajaGlobalUI,
  FlujoCajaSucursalUI,
  SucursalOption,
} from "./interfaces/FlujoCajaHsitoricoTypes";
import { FiltersBar } from "./_components/FiltersBar";
import { SucursalCharts } from "./_components/SucursalCharts";
import { GlobalTable, SucursalTable } from "./_components/FlujoTable";
import { GlobalCharts } from "./_components/GlobalCharts";
import { getFlujoGlobal, getFlujoSucursal } from "./API/apiFlujoSucursal";
import useGetSucursales from "@/hooks/getSucursales/use-sucursales";

// Configurar TZ Guatemala
const TZGT = "America/Guatemala";
dayjs.extend(utc);
dayjs.extend(timezone);

export default function FlujoHistoricoPage() {
  // Filtros
  const [range, setRange] = useState<{ from: Date | null; to: Date | null }>(
    () => ({
      from: dayjs().tz(TZGT).subtract(6, "day").startOf("day").toDate(),
      to: dayjs().tz(TZGT).endOf("day").toDate(),
    })
  );
  const [sucursal, setSucursal] = useState<SucursalOption | null>(null);

  const { data } = useGetSucursales();
  const optionsSucursales: SucursalOption[] =
    data?.map((s) => ({
      label: s.nombre,
      value: s.id,
    })) ?? [];

  // Data
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sucursalRows, setSucursalRows] = useState<FlujoCajaSucursalUI>([]);
  const [globalRows, setGlobalRows] = useState<FlujoCajaGlobalUI>([]);

  // Helpers
  const fromISO = useMemo(
    () =>
      range.from
        ? dayjs(range.from).tz(TZGT).startOf("day").toISOString()
        : null,
    [range.from]
  );
  const toISO = useMemo(
    () =>
      range.to ? dayjs(range.to).tz(TZGT).endOf("day").toISOString() : null,
    [range.to]
  );

  const fetchAll = async () => {
    if (!fromISO || !toISO) return;
    try {
      setLoading(true);
      setError(null);

      // Global
      const global = await getFlujoGlobal({ from: fromISO, to: toISO });
      setGlobalRows(global);

      // Sucursal (solo si hay seleccion)
      if (sucursal) {
        const rows = await getFlujoSucursal({
          sucursalId: sucursal.value,
          from: fromISO,
          to: toISO,
        });
        setSucursalRows(rows);
      } else {
        setSucursalRows([]);
      }
    } catch (err: any) {
      setError(err?.message ?? "Error al cargar datos");
    } finally {
      setLoading(false);
    }
  };

  // Refetch al cambiar filtros
  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromISO, toISO, sucursal?.value]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Caja histórico</h1>
      </div>

      <FiltersBar
        from={range.from}
        to={range.to}
        onChangeRange={(from, to) => setRange({ from, to })}
        sucursal={sucursal}
        sucursalesOptions={optionsSucursales}
        onChangeSucursal={setSucursal}
        onRefresh={fetchAll}
      />

      {loading && (
        <div className="grid grid-cols-1 gap-4">
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-80 w-full" />
        </div>
      )}

      {error && (
        <Card className="p-4 flex items-center gap-2 text-destructive">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </Card>
      )}

      {!loading && !error && (
        <Tabs defaultValue="sucursal" className="w-full">
          <TabsList className="grid grid-cols-2 w-full md:w-auto">
            <TabsTrigger value="sucursal">Por sucursal</TabsTrigger>
            <TabsTrigger value="global">Global</TabsTrigger>
          </TabsList>

          <TabsContent value="sucursal" className="space-y-4">
            {sucursal ? (
              <>
                <SucursalCharts data={sucursalRows} />
                <SucursalTable rows={sucursalRows} />
              </>
            ) : (
              <Card className="p-6 text-sm text-muted-foreground">
                Seleccione una sucursal para ver el detalle por día.
              </Card>
            )}
          </TabsContent>

          <TabsContent value="global" className="space-y-4">
            <GlobalCharts data={globalRows} />
            <GlobalTable rows={globalRows} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
