import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ReactSelectComponent from "react-select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Calendar,
  TrendingUp,
  Package,
  MapPin,
  User,
  DollarSign,
  ShoppingCart,
  BarChart3,
  Eye,
  Plus,
  FileText,
  Building,
  AlertTriangle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  CreateSalesSummaryPayload,
  DataAuto,
  DtoCreateSummary,
  ResumenPeriodo,
  SalesSummaryResponse,
  SucursalInfo,
} from "./utils";
import {
  createAutoSummary,
  createSummarySales,
  deleteSummarySales,
  getSucursales,
  getSummarySales,
} from "./summary.api";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useStore } from "@/components/Context/ContextSucursal";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import currency from "currency.js";
import axios from "axios";
import { ConfirmDialog } from "../Utils/ConfirmDialog";
dayjs.extend(utc);
dayjs.extend(timezone);

interface OptionSelect {
  value: string;
  label: string;
}
const ZONA = "America/Guatemala";

export function SummarySales() {
  const sucursalId = useStore((state) => state.sucursalId) ?? 0;
  const userId = useStore((state) => state.userId) ?? 0;

  const [openCreate, setOpenCreate] = useState(false);
  const [sucursales, setSucursales] = useState<SucursalInfo[]>([]);
  const [resumenes, setResumenes] = useState<SalesSummaryResponse[]>([]);
  const [createSummary, setCreateSummary] = useState<CreateSalesSummaryPayload>(
    {
      periodo: ResumenPeriodo.DIARIO,
      titulo: "",
      fechaInicio: new Date(), // o new Date().toISOString()
      fechaFin: new Date(), // lo mismo
      totalVentas: 0,
      totalTransacciones: 0,
      unidadesVendidas: 0,
      // opcionales:
      sucursalId: undefined,
      usuarioId: undefined,
      ticketPromedio: undefined,
      productoTopId: undefined,
      observaciones: undefined,
    }
  );

  //LOADERS
  const [isLoadingSucursales, setIsLoadingSucursales] = useState(false);
  const [isLoadingResumenes, setIsLoadingResumenes] = useState(false);

  const handleChange = (d: Date | null, where: "Inicio" | "Fin") => {
    // setDate(d);
    if (d && where === "Inicio") {
      const Inicio = dayjs(d).tz(ZONA).toDate();
      setCreateSummary((previaData) =>
        previaData
          ? {
              ...previaData,
              fechaInicio: Inicio,
            }
          : previaData
      );
    } else {
      const Final = dayjs(d).tz(ZONA).toDate();
      setCreateSummary((previaData) =>
        previaData
          ? {
              ...previaData,
              fechaFin: Final,
            }
          : previaData
      );
    }
  };

  const optionsSucursales: OptionSelect[] = sucursales.map((sucursal) => ({
    value: sucursal.id.toString(),
    label: sucursal.nombre,
  }));

  const getResumenes = async () => {
    // Cargar resumenes de ventas
    setIsLoadingResumenes(true);
    getSummarySales()
      .then((data) => setResumenes(data))
      .catch((err) => {
        console.error("Error al conseguir resumenes:", err);
        toast.error("No se pudieron cargar los reportes de ventas.");
      })
      .finally(() => setIsLoadingResumenes(false));
  };

  useEffect(() => {
    // Cargar sucursales
    setIsLoadingSucursales(true);
    getSucursales()
      .then((data) => setSucursales(data))
      .catch((err) => {
        console.error("Error al cargar sucursales:", err);
        toast.error("No se pudieron cargar las sucursales.");
      })
      .finally(() => setIsLoadingSucursales(false));
    getResumenes();
  }, []);

  const handleSelectSucursal = (value: OptionSelect | null) => {
    if (value) {
      setCreateSummary((previaData) =>
        previaData
          ? {
              ...previaData,
              sucursalId: parseInt(value.value, 10),
            }
          : previaData
      );
    }
  };

  const [submiting, setIsSubmitting] = useState(false);
  async function handleSubmit() {
    if (!createSummary.fechaInicio || !createSummary.fechaFin) {
      toast.error("Selecciona fecha de inicio y fin.");
      return;
    }
    if (dayjs(createSummary.fechaInicio).isAfter(createSummary.fechaFin)) {
      toast.error("La fecha de inicio no puede ser posterior a la de fin.");
      return;
    }
    if (!createSummary.sucursalId) {
      toast.error("Selecciona una sucursal.");
      return;
    }

    // Construcción del payload
    const payload: DtoCreateSummary = {
      titulo: createSummary.titulo,
      observaciones: createSummary.observaciones,
      sucursalId: createSummary.sucursalId!,
      fechaInicio: dayjs(createSummary.fechaInicio)
        .tz(ZONA)
        .format("YYYY-MM-DD"),
      fechaFin: dayjs(createSummary.fechaFin).tz(ZONA).format("YYYY-MM-DD"),
      usuarioId: userId,
    };

    try {
      setIsSubmitting(true);
      await createSummarySales(payload);
      toast.success("Resumen generado exitosamente.");
      setOpenCreate(false);
      const data = await getSummarySales();
      setResumenes(data);

      // aquí podrías refrescar lista de resúmenes
    } catch (error) {
      console.error("Error al crear resumen:", error);
      toast.error("Ocurrió un error al generar el resumen.");

      if (axios.isAxiosError(error) && error.response) {
        const { status, data } = error.response;

        if (status === 422 && data.code === "NO_SALES") {
          toast.info("No se encontraron ventas en este rango de fechas");
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  const generateAutoReport = useCallback(
    async (period: Period) => {
      const dto: DataAuto = {
        periodo: period,
        sucursalId,
        usuarioId: userId,
      };

      setIsSubmitting(true);
      try {
        await createAutoSummary(dto);
        toast.success("Resumen de ventas generado exitosamente.");
        const data = await getSummarySales();
        setResumenes(data);
      } catch (err: any) {
        if (axios.isAxiosError(err) && err.response) {
          const { status, data } = err.response;

          if (status === 422 && data.code === "NO_SALES") {
            return toast.info(
              data.message || "No se encontraron ventas en este rango."
            );
          }
        }
        console.error("Error al generar auto summary:", err);
        toast.error("Error al generar el resumen.");
      } finally {
        setIsSubmitting(false);
      }
    },
    [sucursalId, userId]
  );

  function formatDate(value: string) {
    return dayjs(value).format("DD [de] MMMM [de] YYYY");
  }

  function formatCurrency(value: string | number) {
    const formattedCurrency = currency(value, {
      symbol: "Q ",
      separator: ",", // miles: punto
      decimal: ".", // decimal: coma
      precision: 2, // 2 dígitos decimales
      pattern: "Q#", // dónde va el símbolo: '# Q ' o 'Q #'
    }).format();
    return formattedCurrency;
  }

  // Función para obtener color del badge según el período
  const getPeriodoBadgeVariant = (periodo: string) => {
    switch (periodo) {
      case "DIARIO":
        return "default";
      case "SEMANAL":
        return "secondary";
      case "MENSUAL":
        return "outline";
      case "CUSTOM":
        return "destructive";
      default:
        return "default";
    }
  };
  const [selectedResumen, setSelectedResumen] =
    useState<SalesSummaryResponse | null>(null);
  const [openDetails, setOpenDetails] = useState(false);

  const handleViewDetails = (resumen: SalesSummaryResponse) => {
    setSelectedResumen(resumen);
    setOpenDetails(true);
  };

  const productosUnificados = new Map();
  selectedResumen?.detalles.forEach((detalle) => {
    const clave = detalle.producto.id;
    const existente = productosUnificados.get(clave);

    if (existente) {
      existente.cantidadVendida += detalle.cantidadVendida;
      existente.montoVenta += detalle.montoVenta;
    } else {
      productosUnificados.set(clave, {
        ...detalle,
        id: clave,
      });
    }
  });
  const [dialogState, setDialogState] = useState<{
    open: boolean;
    period: Period | null;
  }>({ open: false, period: null });

  const openAutoDialog = (p: Period) => {
    setDialogState({ open: true, period: p });
  };

  const closeAutoDialog = () => {
    setDialogState({ open: false, period: null });
  };

  const handleAutoConfirm = (period: Period) => {
    generateAutoReport(period);
    closeAutoDialog();
  };

  const itemsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);

  // Calcular datos de paginación
  const { paginatedData, totalPages, startIndex, endIndex } = useMemo(() => {
    const sortedResumenes = resumenes.sort(
      (a, b) => new Date(b.creadoEn).getTime() - new Date(a.creadoEn).getTime()
    );

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedData = sortedResumenes.slice(startIndex, endIndex);
    const totalPages = Math.ceil(sortedResumenes.length / itemsPerPage);

    return {
      paginatedData,
      totalPages,
      startIndex: startIndex + 1,
      endIndex: Math.min(endIndex, sortedResumenes.length),
    };
  }, [resumenes, currentPage]);

  // Generar números de página para mostrar
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("ellipsis");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("ellipsis");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("ellipsis");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("ellipsis");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll suave hacia arriba
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const [isDeletingSumm, setIsDeletingSumm] = useState<boolean>();
  const [openDel, setOpenDel] = useState<boolean>(false);
  const handleDelete = async (id: number) => {
    setIsDeletingSumm(true);
    await deleteSummarySales(id)
      .then(() => {})
      .catch((error) => {
        console.log("El error es: ", error);
        toast.info("No se pudo eliminar el registro");
      })
      .finally(() => {
        setIsDeletingSumm(false);
        setOpenDel(false);
      });

    await getResumenes();
    toast.success("Eliminación de registro completada");
    setOpenDetails(false);
    setOpenDel(false);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Resúmenes de Ventas
          </h1>
          <p className="text-muted-foreground">
            Gestiona y visualiza los reportes de ventas por períodos
          </p>
        </div>
        <Button onClick={() => setOpenCreate(true)} className="w-fit">
          <Plus className="mr-2 h-4 w-4" />
          Crear nuevo resumen
        </Button>
      </div>

      {/* Loading State */}
      {isLoadingResumenes ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="space-y-2">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="h-3 bg-muted rounded"></div>
                <div className="h-3 bg-muted rounded w-5/6"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        /* Resúmenes Grid */
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {paginatedData
            .sort(
              (a, b) =>
                new Date(b.creadoEn).getTime() - new Date(a.creadoEn).getTime()
            )
            .map((resumen) => (
              <Card
                key={resumen.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg line-clamp-1">
                        {resumen.titulo || `Resumen #${resumen.id}`}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={getPeriodoBadgeVariant(resumen.periodo)}
                        >
                          {resumen.periodo}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          ID: {resumen.id}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {formatDate(resumen.fechaInicio)} -{" "}
                      {formatDate(resumen.fechaFin)}
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Métricas principales */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium">
                          Total Ventas
                        </span>
                      </div>
                      <p className="text-lg font-bold text-green-600">
                        {formatCurrency(resumen.totalVentas)}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <ShoppingCart className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium">
                          Transacciones
                        </span>
                      </div>
                      <p className="text-lg font-bold text-blue-600">
                        {resumen.totalTransacciones}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-orange-600" />
                        <span className="text-sm font-medium">Unidades</span>
                      </div>
                      <p className="text-lg font-bold text-orange-600">
                        {resumen.unidadesVendidas}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <BarChart3 className="h-4 w-4 text-purple-600" />
                        <span className="text-sm font-medium">
                          Ticket Prom.
                        </span>
                      </div>
                      <p className="text-lg font-bold text-purple-600">
                        {formatCurrency(resumen.ticketPromedio)}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  {/* Información adicional */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">
                        {resumen.sucursal.nombre}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>{resumen?.usuario?.nombre}</span>
                      <Badge variant="outline" className="text-xs">
                        {resumen?.usuario?.rol}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Top:</span>
                      <span className="truncate">
                        {resumen.productoTop.nombre}
                      </span>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleViewDetails(resumen)}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Ver detalles
                  </Button>
                </CardContent>
              </Card>
            ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoadingResumenes && resumenes.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              No hay resúmenes disponibles
            </h3>
            <p className="text-muted-foreground mb-4">
              Crea tu primer resumen de ventas para comenzar
            </p>
            <Button onClick={() => setOpenCreate(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Crear resumen
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Paginación */}
      {!isLoadingResumenes && resumenes.length > 0 && totalPages > 1 && (
        <div className="flex flex-col items-center gap-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  className={
                    currentPage === 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>

              {getPageNumbers().map((page, index) => (
                <PaginationItem key={index}>
                  {page === "ellipsis" ? (
                    <PaginationEllipsis />
                  ) : (
                    <PaginationLink
                      onClick={() => handlePageChange(page as number)}
                      isActive={currentPage === page}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    handlePageChange(Math.min(totalPages, currentPage + 1))
                  }
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>

          {/* Información adicional de paginación */}
          <div className="text-sm text-muted-foreground text-center">
            <span className="hidden sm:inline">
              Mostrando {startIndex} - {endIndex} de {resumenes.length}{" "}
              resultados
            </span>
            <span className="sm:hidden">
              {startIndex}-{endIndex} de {resumenes.length}
            </span>
          </div>
        </div>
      )}

      {/* Dialog de detalles */}
      <Dialog open={openDetails} onOpenChange={setOpenDetails}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {selectedResumen?.titulo || `Resumen #${selectedResumen?.id}`}
            </DialogTitle>
            <DialogDescription>
              Detalles completos del resumen de ventas
            </DialogDescription>
          </DialogHeader>

          {selectedResumen && (
            <ScrollArea className="max-h-[70vh]">
              <div className="space-y-6">
                {/* Información general */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Período
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Tipo:
                        </span>
                        <Badge
                          variant={getPeriodoBadgeVariant(
                            selectedResumen.periodo
                          )}
                        >
                          {selectedResumen.periodo}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Inicio:
                        </span>
                        <span className="text-sm font-medium">
                          {formatDate(selectedResumen.fechaInicio)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Fin:
                        </span>
                        <span className="text-sm font-medium">
                          {formatDate(selectedResumen.fechaFin)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Creado:
                        </span>
                        <span className="text-sm font-medium">
                          {formatDate(selectedResumen.creadoEn)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Sucursal y Usuario
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div>
                        <span className="text-sm text-muted-foreground">
                          Sucursal:
                        </span>
                        <p className="font-medium">
                          {selectedResumen.sucursal.nombre}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {selectedResumen.sucursal.direccion}
                        </p>
                      </div>
                      <Separator />
                      <div>
                        <span className="text-sm text-muted-foreground">
                          Usuario:
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {selectedResumen?.usuario?.nombre}
                          </span>
                          <Badge variant="outline">
                            {selectedResumen?.usuario?.rol}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Métricas */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Métricas de Ventas
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="dark:bg-zinc-800 text-center p-4 bg-green-50 rounded-lg">
                        <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-green-600">
                          {formatCurrency(selectedResumen.totalVentas)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Total Ventas
                        </p>
                      </div>

                      <div className="dark:bg-zinc-800 text-center p-4 bg-blue-50 rounded-lg">
                        <ShoppingCart className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-blue-600">
                          {selectedResumen.totalTransacciones}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Transacciones
                        </p>
                      </div>

                      <div className="dark:bg-zinc-800 text-center p-4 bg-orange-50 rounded-lg">
                        <Package className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-orange-600">
                          {selectedResumen.unidadesVendidas}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Unidades
                        </p>
                      </div>

                      <div className=" dark:bg-zinc-800 text-center p-4 bg-purple-50 rounded-lg">
                        <BarChart3 className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-purple-600">
                          {formatCurrency(selectedResumen.ticketPromedio)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Ticket Promedio
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Producto Top */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Producto Más Vendido
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                      <Package className="h-12 w-12 text-muted-foreground" />
                      <div className="flex-1">
                        <h4 className="font-semibold">
                          {selectedResumen.productoTop.nombre}
                        </h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          {selectedResumen.productoTop.descripcion}
                        </p>
                        <div className="flex gap-4 text-sm">
                          <span>
                            <strong>Código:</strong>{" "}
                            {selectedResumen.productoTop.codigoProducto}
                          </span>
                          <span>
                            <strong>Proveedor:</strong>{" "}
                            {selectedResumen.productoTop.codigoProveedor}
                          </span>

                          <span>
                            <strong>Cantida Vendida:</strong>{" "}
                            {selectedResumen.cantidadProductoTop}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Detalles de productos */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      Detalles de Productos
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible>
                      <AccordionItem value="item-1">
                        <AccordionTrigger>
                          Detalles de los productos vendidos
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="rounded-md border">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Producto</TableHead>
                                  <TableHead>Código</TableHead>
                                  <TableHead className="text-right">
                                    Cantidad
                                  </TableHead>
                                  <TableHead className="text-right">
                                    Monto
                                  </TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {Array.from(productosUnificados.values()).map(
                                  (detalle) => (
                                    <TableRow key={detalle.id}>
                                      <TableCell className="font-medium">
                                        {detalle.producto.nombre}
                                      </TableCell>
                                      <TableCell className="text-muted-foreground">
                                        {detalle.producto.codigoProducto}
                                      </TableCell>
                                      <TableCell className="text-right">
                                        {detalle.cantidadVendida}
                                      </TableCell>
                                      <TableCell className="text-right font-medium">
                                        {formatCurrency(detalle.montoVenta)}
                                      </TableCell>
                                    </TableRow>
                                  )
                                )}
                              </TableBody>
                            </Table>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                </Card>

                {/* Observaciones */}
                {selectedResumen.observaciones && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Observaciones
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm leading-relaxed">
                        {selectedResumen.observaciones}
                      </p>
                    </CardContent>
                  </Card>
                )}
                <div className="">
                  <Button
                    variant={"destructive"}
                    onClick={() => setOpenDel(true)}
                  >
                    Eliminar registro
                  </Button>
                </div>
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        bgIcon="bg-rose-500"
        icon={<AlertTriangle />}
        description="Esta acción no se puede deshacer."
        warning="El registro será eliminado completamente de su base de datos"
        title="Eliminación de registro de resumen de venta"
        onConfirm={() => {
          if (selectedResumen?.id !== undefined) {
            handleDelete(selectedResumen.id);
          } else {
            toast.error("No se pudo eliminar el registro: ID no válido.");
          }
        }}
        isLoading={isDeletingSumm}
        open={openDel}
        onOpenChange={setOpenDel}
      />

      <Dialog open={openCreate} onOpenChange={setOpenCreate}>
        <DialogContent className="sm:max-w-lg overflow-y-auto max-h-[100vh]">
          <DialogHeader>
            <DialogTitle className="text-sm">
              Generar un reporte de ventas
            </DialogTitle>
            <p className="text-sm">
              El reporte se guardará en la base de datos y estará disponible
              para consulta.
            </p>
          </DialogHeader>

          <Tabs defaultValue="manual" className="w-full">
            <TabsList className="grid grid-cols-2 h-10">
              <TabsTrigger value="auto">Automático</TabsTrigger>
              <TabsTrigger value="manual">Manual</TabsTrigger>
            </TabsList>

            <TabsContent value="auto" className="">
              <p className="mb-2 text-sm font-medium text-gray-600 text-center py-3">
                Generar reporte automáticamente:
              </p>

              <div className="flex justify-between flex-wrap gap-3">
                <Button
                  className="bg-blue-500 text-white border-2 shadow-md"
                  variant="outline"
                  size="sm"
                  onClick={() => openAutoDialog("DIARIO")}
                >
                  Día
                </Button>
                <Button
                  className="bg-yellow-500 text-white border-2 shadow-md"
                  variant="outline"
                  size="sm"
                  onClick={() => openAutoDialog("SEMANAL")}
                >
                  Semana
                </Button>
                <Button
                  className="bg-rose-500 text-white border-2 shadow-md"
                  variant="outline"
                  size="sm"
                  onClick={() => openAutoDialog("MENSUAL")}
                >
                  Mes
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="manual" className="py-4">
              <Card>
                <CardContent>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSubmit();
                    }}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {/* Fecha Inicio */}
                      <div className="flex flex-col space-y-1 mt-3">
                        <Label className="" htmlFor="fechaInicio">
                          Fecha de inicio
                        </Label>
                        <DatePicker
                          id="fechaInicio"
                          selected={
                            createSummary.fechaInicio
                              ? new Date(createSummary.fechaInicio)
                              : null
                          }
                          onChange={(date) => handleChange(date, "Inicio")}
                          dateFormat="yyyy-MM-dd"
                          className="border rounded px-3 py-2 text-sm text-black font-semibold"
                          placeholderText="YYYY-MM-DD"
                        />
                      </div>

                      {/* Fecha Fin */}
                      <div className="flex flex-col space-y-1 mt-3">
                        <Label htmlFor="fechaFin">Fecha de fin</Label>
                        <DatePicker
                          id="fechaFin"
                          selected={
                            createSummary.fechaFin
                              ? new Date(createSummary.fechaFin)
                              : null
                          }
                          onChange={(date) => handleChange(date, "Fin")}
                          dateFormat="yyyy-MM-dd"
                          className="border rounded px-3 py-2 text-sm text-black font-semibold"
                          placeholderText="YYYY-MM-DD"
                        />
                      </div>

                      {/* Título (opcional) */}
                      <div className="flex flex-col space-y-1 sm:col-span-2">
                        <Label htmlFor="titulo">Título del reporte</Label>
                        <Input
                          id="titulo"
                          className="h-10"
                          placeholder="Ej. Ventas semana 22"
                          value={createSummary.titulo || ""}
                          onChange={(
                            e: React.ChangeEvent<HTMLInputElement>
                          ) => {
                            setCreateSummary((previaData) =>
                              previaData
                                ? {
                                    ...previaData,
                                    titulo: e.target.value,
                                  }
                                : previaData
                            );
                          }}
                        />
                      </div>

                      {/* Observaciones (opcional) */}
                      <div className="flex flex-col space-y-1 sm:col-span-2">
                        <Label htmlFor="observaciones">Observaciones</Label>
                        <Textarea
                          id="observaciones"
                          className="h-10"
                          placeholder="Ej. Ventas semana 22"
                          value={createSummary.observaciones || ""}
                          onChange={(
                            e: React.ChangeEvent<HTMLTextAreaElement>
                          ) => {
                            setCreateSummary((previaData) =>
                              previaData
                                ? {
                                    ...previaData,
                                    observaciones: e.target.value,
                                  }
                                : previaData
                            );
                          }}
                        />
                      </div>

                      {/* Sucursal */}
                      <div className="flex flex-col space-y-1 sm:col-span-2">
                        <Label htmlFor="sucursal">Sucursal</Label>
                        {isLoadingSucursales ? "Cargando sucursales..." : null}
                        <ReactSelectComponent
                          inputId="sucursal"
                          options={optionsSucursales}
                          isClearable
                          placeholder="Selecciona una sucursal"
                          className="text-sm text-black "
                          value={
                            createSummary.sucursalId
                              ? {
                                  value: createSummary.sucursalId.toString(),
                                  label:
                                    sucursales.find(
                                      (s) => s.id === createSummary.sucursalId
                                    )?.nombre || "",
                                }
                              : null
                          }
                          onChange={handleSelectSucursal}
                        />
                      </div>
                    </div>
                  </form>
                </CardContent>
                <CardFooter className="flex justify-between space-x-2">
                  <Button
                    variant="destructive"
                    type="button"
                    onClick={() => setOpenCreate(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    type="submit"
                    disabled={submiting}
                  >
                    {submiting ? "Generando..." : "Generar"}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      <AutoConfirmDialog
        open={dialogState.open}
        period={dialogState.period}
        onClose={closeAutoDialog}
        onConfirm={handleAutoConfirm}
      />
    </div>
  );
}
type Period = "DIARIO" | "SEMANAL" | "MENSUAL";
interface AutoConfirmDialogProps {
  open: boolean;
  period: Period | null;
  onConfirm: (period: Period) => void;
  onClose: () => void;
}

function AutoConfirmDialog({
  open,
  period,
  onConfirm,
  onClose,
}: AutoConfirmDialogProps) {
  if (!period) return null;
  const label =
    period === "DIARIO"
      ? "un día"
      : period === "SEMANAL"
      ? "una semana"
      : "un mes";

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Confirmar generación</DialogTitle>
          <DialogDescription>
            ¿Deseas generar un reporte automático para <strong>{label}</strong>?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={() => onConfirm(period)}>Confirmar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
