import { useCallback, useEffect, useState } from "react";
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
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
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
  Package,
  ShoppingCart,
} from "lucide-react";
import { formattMoneda } from "../Utils/Utils";

const RequisitionBuilder = () => {
  const sucursalId = useStore((state) => state.sucursalId) ?? 0;
  const usuarioId = useStore((state) => state.userId) ?? 0;

  const [alerts, setAlerts] = useState<StockAlertItem[]>([]);
  const [selected, setSelected] = useState<Record<number, number>>({});
  // const [observaciones, setObservaciones] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [requisiciones, setRequisiciones] = useState<RequisitionResponse[]>([]);
  const [isLoadingRequisiciones, setIsLoadingRequisiciones] =
    useState<boolean>(false);
  //PAGINACION
  // Calcular paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(alerts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAlerts = alerts.slice(startIndex, endIndex);
  // Calcular estadísticas
  const selectedCount = Object.keys(selected).length;
  const totalSelectedQty = Object.values(selected).reduce(
    (acc, qty) => acc + qty,
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

  const getRequisiciones = () => {
    setIsLoadingRequisiciones(true);
    getRequisicionesRegist()
      .then((data) => setRequisiciones(data))
      .catch((error) => {
        console.log("El error es: ", error);
        toast.info("No se encontraron requisiciones");
        if (axios.isAxiosError(error) && error.response) {
          const { status, data } = error.response;

          if (status === 422 && data.code === "NO_REQUISICIONES") {
            toast.info("No se encontraron requisiciones");
          }
        }
      })
      .finally(() => setIsLoadingRequisiciones(false));
  };

  useEffect(() => {
    getRequisiciones();
  }, []);

  /* ---------- Paso A: obtener alertas ---------- */
  const fetchAlerts = async () => {
    if (!sucursalId || loading) return;

    const MIN_DELAY = 600; // ms que quieres mostrar el icono
    setLoading(true);

    try {
      // espera **a la vez** la API y el retardo
      const [data] = await Promise.all([
        fetchStockAlerts(sucursalId),
        new Promise((r) => setTimeout(r, MIN_DELAY)),
      ]);

      await getRequisiciones();

      setAlerts(data);
      setSelected(
        Object.fromEntries(data.map((a) => [a.productoId, a.cantidadSugerida]))
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
        ? /* des-seleccionar */
          (() => {
            const { [prodId]: _omit, ...rest } = prev;
            return rest;
          })()
        : /* volver a seleccionar con la sugerida de la alerta */
          {
            ...prev,
            [prodId]: alerts.find((a) => a.productoId === prodId)!
              .cantidadSugerida,
          }
    );

  const updateQty = (prodId: number, qty: number) =>
    setSelected((prev) => ({ ...prev, [prodId]: qty }));

  const handleCreate = useCallback(async () => {
    if (submitting || Object.keys(selected).length === 0) return;

    const dto: CreateRequisitionDto = {
      sucursalId,
      usuarioId,
      // observaciones,
      lineas: Object.entries(selected).map(([id, qty]) => ({
        productoId: Number(id),
        cantidadSugerida: qty,
      })),
    };

    const MIN_DELAY = 600; // ms para que se note el spinner
    const start = Date.now();
    setSubmitting(true);

    try {
      await createRequisition(dto);

      // garantiza al menos MIN_DELAY ms de spinner
      const elapsed = Date.now() - start;
      if (elapsed < MIN_DELAY) {
        await new Promise((r) => setTimeout(r, MIN_DELAY - elapsed));
      }

      toast.success("Requisición creada");
      setSelected({}); // limpia selección
      await fetchAlerts(); // refresca las alertas si lo necesitas
    } catch (err) {
      console.error(err);
      toast.error("Error al crear la requisición");
    } finally {
      setSubmitting(false);
    }
  }, [sucursalId, usuarioId, selected, submitting]);

  const totalSelectedCost = alerts.reduce((acc, item) => {
    const qty = selected[item.productoId] ?? 0;
    return acc + (item.precioCosto ?? 0) * qty;
  }, 0);

  console.log("Las requisiciones son: ", alerts);

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
        />
      </TabsContent>
      <TabsContent value="gRequisicion">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
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
                disabled={submitting || Object.keys(selected).length === 0}
                onClick={handleCreate}
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="h-4 w-4 text-orange-500" />
                        <div>
                          <p className="text-2xl font-bold">{alerts.length}</p>
                          <p className="text-xs text-muted-foreground">
                            Productos en alerta
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center space-x-2">
                        <ShoppingCart className="h-4 w-4 text-blue-500" />
                        <div>
                          <p className="text-2xl font-bold">{selectedCount}</p>
                          <p className="text-xs text-muted-foreground">
                            Productos seleccionados
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center space-x-2">
                        <Package className="h-4 w-4 text-green-500" />
                        <div>
                          <p className="text-2xl font-bold">
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
                    <CardContent className="pt-6">
                      <div className="flex items-center space-x-2">
                        <Package className="h-4 w-4 text-green-500" />
                        <div>
                          <p className="text-2xl font-bold">
                            {formattMoneda(totalSelectedCost)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Costo total a solicitar
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Tabla con scroll horizontal */}
                <ScrollArea className="w-full whitespace-nowrap rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]">
                          <span className="sr-only">Seleccionar</span>
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
                                  value={selected[a.productoId]}
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
                                      (selected[a.productoId] ?? 0)
                                  )
                                : "N/A"}
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
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>

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
    </Tabs>
  );
};

export default RequisitionBuilder;
