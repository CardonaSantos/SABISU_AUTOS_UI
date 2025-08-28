import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  fetchStockAlerts,
  createRequisition,
  getRequisicionesRegist,
} from "./requisicion.api";
import { StockAlertItem, CreateRequisitionDto } from "./utils";
import { toast } from "sonner";
import { useStore } from "@/components/Context/ContextSucursal";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RequisicionesMap from "./RequisicionesMap";
import { RequisitionResponse } from "./requisicion.interfaces";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axios from "axios";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  AlertTriangle,
  LoaderCircle,
  MessageCircleWarning,
  Package,
  Search,
  ShoppingCart,
} from "lucide-react";
import { formattMoneda } from "../Utils/Utils";
import { AdvancedDialog } from "@/utils/components/AdvancedDialog";
import dayjs from "dayjs";
import "dayjs/locale/es";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
dayjs.locale("es");

type SelectedLine = {
  cantidad: number;
  fechaExpiracion: Date | null;
};

const RequisitionBuilder = () => {
  const sucursalId = useStore((state) => state.sucursalId) ?? 0;
  const usuarioId = useStore((state) => state.userId) ?? 0;
  const [openGenerateReq, setOpenGenerateReq] = useState<boolean>(false);
  const [alerts, setAlerts] = useState<StockAlertItem[]>([]);
  const [selected, setSelected] = useState<Record<number, SelectedLine>>({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [requisiciones, setRequisiciones] = useState<RequisitionResponse[]>([]);
  const [isLoadingRequisiciones, setIsLoadingRequisiciones] =
    useState<boolean>(false);
  const [inputFilter, setInputFilter] = useState<string>("");
  //FILTRADO
  const filtrados = useMemo(() => {
    const q = inputFilter.toLowerCase().trim();
    if (!q) return alerts;

    return alerts.filter((a) => {
      const codigo = String(a.codigoProducto).toLowerCase();
      const nombre = a.nombre.toLowerCase();

      const matchesCodeOrName = codigo.includes(q) || nombre.includes(q);

      return matchesCodeOrName;
    });
  }, [inputFilter, alerts]);

  //PAGINACION
  // Calcular paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filtrados.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAlerts = filtrados.slice(startIndex, endIndex);

  // Calcular estadísticas
  const selectedCount = Object.keys(selected).length;
  const totalSelectedQty = Object.values(selected).reduce(
    (acc, qty) => acc + qty.cantidad,
    0
  );
  // Función para obtener el nivel de alerta
  const getAlertLevel = (stockActual: number, stockMinimo: number) => {
    const percentage = (stockActual / stockMinimo) * 100;
    if (percentage <= 25) return { level: "critical", color: "destructive" };
    if (percentage <= 50) return { level: "high", color: "destructive" };
    if (percentage <= 75) return { level: "medium", color: "secondary" };
    return { level: "low", color: "outline" };
  };
  // Dentro de tu componente:

  const getRequisiciones = async () => {
    setIsLoadingRequisiciones(true);
    try {
      const data = await getRequisicionesRegist();
      setRequisiciones([...data]); //
    } catch (error: unknown) {
      console.error("Error al cargar requisiciones:", error);

      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const code = (error.response?.data as any)?.code;

        if (status === 422 && code === "NO_REQUISICIONES") {
          toast.info("No hay requisiciones registradas");
        } else {
          toast.error("Error al obtener requisiciones");
        }
      } else {
        toast.error("Error desconocido al obtener requisiciones");
      }
    } finally {
      setIsLoadingRequisiciones(false);
    }
  };

  useEffect(() => {
    getRequisiciones();
  }, []); // al no depender de nada más, cadena vacía

  /* ---------- Paso A: obtener alertas ---------- */
  const fetchAlerts = async () => {
    if (!sucursalId || loading) return;

    const MIN_DELAY = 600; // ms que quieres mostrar el icono
    setLoading(true);

    try {
      const [data] = await Promise.all([
        fetchStockAlerts(sucursalId),
        new Promise((r) => setTimeout(r, MIN_DELAY)),
      ]);

      await getRequisiciones();

      setAlerts(data);
      setSelected(
        Object.fromEntries(
          data.map((a) => [
            a.productoId,
            { cantidad: a.cantidadSugerida, fechaExpiracion: null },
          ])
        )
      );
    } catch {
      toast.error("No se pudo obtener alertas de stock");
    } finally {
      setLoading(false); // nunca antes de los 600 ms
    }
  };

  const toggle = (prodId: number) =>
    setSelected((prev) =>
      prodId in prev
        ? (() => {
            const { [prodId]: _, ...rest } = prev;
            return rest;
          })()
        : {
            ...prev,
            [prodId]: {
              cantidad: alerts.find((a) => a.productoId === prodId)!
                .cantidadSugerida,
              fechaExpiracion: null, // o new Date()
            },
          }
    );

  const updateQty = (prodId: number, qty: number) =>
    setSelected((prev) => ({
      ...prev,
      [prodId]: { ...prev[prodId], cantidad: qty },
    }));

  const updateDate = (prodId: number, date: Date | null) => {
    setSelected((prev) => ({
      ...prev,
      [prodId]: { ...prev[prodId], fechaExpiracion: date },
    }));
  };

  const handleCreate = useCallback(async () => {
    if (submitting || Object.keys(selected).length === 0) return;

    const dto: CreateRequisitionDto = {
      sucursalId,
      usuarioId,
      // proveedorId: parseInt(proveedorSelected),
      lineas: Object.entries(selected).map(([id, qty]) => ({
        productoId: Number(id),
        cantidadSugerida: qty.cantidad,
        fechaExpiracion: qty.fechaExpiracion,
      })),
    };

    const MIN_DELAY = 600; // ms para que se note el spinner
    const start = Date.now();
    setSubmitting(true);

    try {
      await createRequisition(dto);
      const elapsed = Date.now() - start;
      if (elapsed < MIN_DELAY) {
        await new Promise((r) => setTimeout(r, MIN_DELAY - elapsed));
      }
      toast.success("Requisición creada");
      setSelected({});
      await fetchAlerts();
      setOpenGenerateReq(false);
      handleCheckAll();
    } catch (err) {
      console.error(err);
      toast.error("Error al crear la requisición");
    } finally {
      setSubmitting(false);
    }
  }, [sucursalId, usuarioId, selected, submitting]);

  const totalSelectedCost = alerts.reduce((acc, item) => {
    const cantidad = selected[item.productoId]?.cantidad ?? 0;
    return acc + (item.precioCosto ?? 0) * cantidad;
  }, 0);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputFilter(e.target.value);
  };

  console.log("Las requisiciones son: ", alerts);
  console.log("Los seleccionados son: ", selected);
  // Fuera del return:
  const handleCheckAll = () => {
    // Suponiendo que quieres seleccionar todos los alertas visibles:
    const lista = alerts; // o filtrados, o currentAlerts, según contexto
    const allSelected = Object.keys(selected).length === lista.length;

    if (allSelected) {
      // Deseleccionar todo
      setSelected({});
    } else {
      // Seleccionar todos: construimos un nuevo Record
      const nuevo: Record<number, SelectedLine> = {};
      lista.forEach((a) => {
        nuevo[a.productoId] = {
          cantidad: a.cantidadSugerida,
          fechaExpiracion: null,
        };
      });
      setSelected(nuevo);
    }
  };

  return (
    <Tabs defaultValue="requisiciones" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="requisiciones">Requisiciones</TabsTrigger>
        <TabsTrigger value="gRequisicion">Generar Requisicion</TabsTrigger>
      </TabsList>
      <TabsContent value="requisiciones">
        <RequisicionesMap
          getRequisiciones={getRequisiciones}
          isLoadingRequisiciones={isLoadingRequisiciones}
          setIsLoadingRequisiciones={setIsLoadingRequisiciones}
          requisiciones={requisiciones}
          fetchAlerts={fetchAlerts}
        />
      </TabsContent>
      <TabsContent value="gRequisicion">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-lg">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              <span>Productos con alerta de stock</span>
            </CardTitle>
            <div className="flex justify-between">
              <CardDescription>
                Selecciona los productos que necesitan reabastecimiento y ajusta
                las cantidades según sea necesario.
              </CardDescription>

              <Button
                disabled={loading}
                onClick={fetchAlerts}
                aria-busy={loading}
              >
                {loading ? (
                  <>
                    Buscando…
                    <LoaderCircle className="animate-spin ml-2" />
                  </>
                ) : (
                  "Buscar alertas de stock"
                )}
              </Button>

              <Button
                type="button"
                disabled={submitting || Object.keys(selected).length === 0}
                onClick={() => setOpenGenerateReq(true)}
                aria-busy={submitting}
              >
                {submitting ? (
                  <>
                    Generando…
                    <LoaderCircle className="animate-spin ml-2" />
                  </>
                ) : (
                  "Generar requisición"
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {alerts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Package className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  No hay alertas de stock
                </h3>
                <p className="text-muted-foreground text-center">
                  Todos los productos tienen stock suficiente según sus niveles
                  mínimos.
                </p>
              </div>
            ) : (
              <>
                {/* Estadísticas */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                  <Card>
                    <CardContent className="p-3">
                      {" "}
                      {/* antes pt-6 ahora p-3 */}
                      <div className="flex items-center space-x-1">
                        {" "}
                        {/* gap más pequeño */}
                        <AlertTriangle className="h-3 w-3 text-orange-500" />{" "}
                        {/* icono más pequeño */}
                        <div>
                          <p className="text-base font-semibold">
                            {alerts.length}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Productos en alerta
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-3">
                      <div className="flex items-center space-x-1">
                        <ShoppingCart className="h-3 w-3 text-blue-500" />
                        <div>
                          <p className="text-base font-semibold">
                            {selectedCount}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Productos seleccionados
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-3">
                      <div className="flex items-center space-x-1">
                        <Package className="h-3 w-3 text-green-500" />
                        <div>
                          <p className="text-base font-semibold">
                            {totalSelectedQty}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Unidades a solicitar
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-3">
                      <div className="flex items-center space-x-1">
                        <Package className="h-3 w-3 text-green-500" />
                        <div>
                          <p className="text-base font-semibold">
                            {formattMoneda(totalSelectedCost)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Costo total
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="pb-6">
                  <div className="relative w-full max-w-sm">
                    <Search
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                      size={16}
                    />
                    <Input
                      onChange={handleFilterChange}
                      placeholder="Buscar..."
                      className="pl-10 pr-3"
                    />
                  </div>
                </div>

                <div className="w-full min-h-[240px] max-h-[600px] overflow-y-auto">
                  <Table className="table-fixed">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px] text-center">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Checkbox
                                checked={
                                  Object.keys(selected).length ===
                                  currentAlerts.length
                                }
                                onCheckedChange={handleCheckAll}
                                aria-label="Seleccionar todos"
                              />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Seleccionar todos</p>
                            </TooltipContent>
                          </Tooltip>
                        </TableHead>
                        <TableHead className="min-w-[200px]">
                          Producto
                        </TableHead>
                        <TableHead className="text-center min-w-[100px]">
                          Stock Actual
                        </TableHead>
                        <TableHead className="text-center min-w-[100px]">
                          Stock Mínimo
                        </TableHead>
                        <TableHead className="text-center min-w-[120px]">
                          Cantidad a Pedir
                        </TableHead>

                        <TableHead className="text-center min-w-[120px]">
                          Precio Costo
                        </TableHead>

                        <TableHead className="text-center min-w-[120px]">
                          Total por pedir
                        </TableHead>

                        <TableHead className="text-center min-w-[100px] text-sm">
                          F. exp.
                        </TableHead>

                        <TableHead className="text-center min-w-[100px]">
                          Nivel de Alerta
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentAlerts.map((a) => {
                        const checked = a.productoId in selected;
                        const alertInfo = getAlertLevel(
                          a.stockActual,
                          a.stockMinimo
                        );

                        return (
                          <TableRow
                            key={a.productoId}
                            className={checked ? "bg-muted/50" : ""}
                          >
                            <TableCell>
                              <Checkbox
                                checked={checked}
                                onCheckedChange={() => toggle(a.productoId)}
                                aria-label={`Seleccionar ${a.nombre}`}
                              />
                            </TableCell>
                            <TableCell className="font-medium">
                              <div className="flex items-center space-x-2">
                                <Package className="h-4 w-4 text-muted-foreground" />
                                <span>{a.nombre}</span>
                                {a.tieneSolicitudPendiente ? (
                                  <>
                                    <Popover>
                                      <PopoverTrigger asChild>
                                        <MessageCircleWarning className="text-red-500 hover:cursor-pointer" />
                                      </PopoverTrigger>
                                      <PopoverContent className="w-80">
                                        <div className="grid gap-4">
                                          <div className="space-y-2">
                                            <h4 className="text-sm">
                                              Este producto tiene las siguientes
                                              requisiciones pendientes
                                            </h4>
                                            {
                                              <ul className="text-xs">
                                                {a.foliosPendientes.map(
                                                  (item, index) => (
                                                    <li key={index}>
                                                      • {item}
                                                    </li>
                                                  )
                                                )}
                                              </ul>
                                            }
                                          </div>
                                        </div>
                                      </PopoverContent>
                                    </Popover>
                                  </>
                                ) : null}
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge variant="outline" className="font-mono">
                                {a.stockActual}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge variant="secondary" className="font-mono">
                                {a.stockMinimo}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-center">
                              {checked ? (
                                <Input
                                  type="number"
                                  min={1}
                                  value={selected[a.productoId]?.cantidad ?? ""}
                                  onChange={(e) =>
                                    updateQty(
                                      a.productoId,
                                      Number(e.target.value)
                                    )
                                  }
                                  className="w-20 text-center"
                                  aria-label={`Cantidad para ${a.nombre}`}
                                />
                              ) : (
                                <Badge variant="default" className="font-mono">
                                  {a.cantidadSugerida}
                                </Badge>
                              )}
                            </TableCell>

                            <TableCell className="text-center">
                              {a?.precioCosto
                                ? formattMoneda(a?.precioCosto)
                                : "N/A"}
                            </TableCell>

                            <TableCell className="text-center">
                              {a.precioCosto
                                ? formattMoneda(
                                    a.precioCosto *
                                      (selected[a?.productoId]?.cantidad ?? 0)
                                  )
                                : "N/A"}
                            </TableCell>
                            <TableCell className="text-center py-1 px-2">
                              {checked ? (
                                <Input
                                  type="date"
                                  className="w-32 text-black dark:text-white text-center text-sm p-1 border rounded"
                                  value={
                                    selected[a.productoId]?.fechaExpiracion
                                      ? dayjs(
                                          selected[a.productoId].fechaExpiracion
                                        )
                                          .tz("America/Guatemala")
                                          .format("YYYY-MM-DD")
                                      : ""
                                  }
                                  onChange={(e) => {
                                    const val = e.target.value; // "2025-07-16" o ""
                                    if (!val) {
                                      updateDate(a.productoId, null);
                                    } else {
                                      const [year, month, day] = val
                                        .split("-")
                                        .map((n) => parseInt(n, 10));
                                      const date = dayjs
                                        .tz(
                                          `${year}-${month}-${day}`,
                                          "YYYY-M-D",
                                          "America/Guatemala"
                                        )
                                        .startOf("day")
                                        .toDate();
                                      updateDate(a.productoId, date);
                                    }
                                  }}
                                />
                              ) : (
                                <span>-</span>
                              )}
                            </TableCell>

                            <TableCell className="text-center">
                              <Badge variant={alertInfo.color as any}>
                                {alertInfo.level === "critical" && "Crítico"}
                                {alertInfo.level === "high" && "Alto"}
                                {alertInfo.level === "medium" && "Medio"}
                                {alertInfo.level === "low" && "Bajo"}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>

                {/* Paginación */}
                {totalPages > 1 && (
                  <div className="mt-4">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              if (currentPage > 1) {
                                setCurrentPage(currentPage - 1);
                              }
                            }}
                            className={
                              currentPage <= 1
                                ? "pointer-events-none opacity-50"
                                : ""
                            }
                          />
                        </PaginationItem>

                        {Array.from(
                          { length: totalPages },
                          (_, i) => i + 1
                        ).map((page) => {
                          if (
                            page === 1 ||
                            page === totalPages ||
                            (page >= currentPage - 1 && page <= currentPage + 1)
                          ) {
                            return (
                              <PaginationItem key={page}>
                                <PaginationLink
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setCurrentPage(page);
                                  }}
                                  isActive={currentPage === page}
                                >
                                  {page}
                                </PaginationLink>
                              </PaginationItem>
                            );
                          } else if (
                            page === currentPage - 2 ||
                            page === currentPage + 2
                          ) {
                            return (
                              <PaginationItem key={page}>
                                <PaginationEllipsis />
                              </PaginationItem>
                            );
                          }
                          return null;
                        })}

                        <PaginationItem>
                          <PaginationNext
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              if (currentPage < totalPages) {
                                setCurrentPage(currentPage + 1);
                              }
                            }}
                            className={
                              currentPage >= totalPages
                                ? "pointer-events-none opacity-50"
                                : ""
                            }
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>

                    <div className="flex items-center justify-between mt-2">
                      <p className="text-sm text-muted-foreground">
                        Mostrando {startIndex + 1} a{" "}
                        {Math.min(endIndex, alerts.length)} de {alerts.length}{" "}
                        productos
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Página {currentPage} de {totalPages}
                      </p>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </TabsContent>
      <AdvancedDialog
        title="¿Generar requisición de productos?"
        description="Se creará una solicitud de requisición para los productos seleccionados."
        onOpenChange={setOpenGenerateReq}
        open={openGenerateReq}
        icon="alert"
        type="info"
        confirmButton={{
          label: "Sí, generar requisición",
          disabled: submitting,
          loading: submitting,
          loadingText: "Generando requisición...",
          onClick: () => handleCreate(),
        }}
        cancelButton={{
          label: "Cancelar",
          onClick: () => setOpenGenerateReq(false),
          disabled: submitting,
          loadingText: "Cancelando...",
        }}
      />
    </Tabs>
  );
};

export default RequisitionBuilder;
