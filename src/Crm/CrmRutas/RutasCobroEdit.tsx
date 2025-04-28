"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useStoreCrm } from "../ZustandCrm/ZustandCrmContext";
import axios from "axios";
import { toast } from "sonner";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

// Icons
import {
  Users,
  MapPin,
  Search,
  ArrowUpDown,
  Loader2,
  Filter,
  AlertCircle,
  FileText,
  Phone,
  ChevronLeft,
  Save,
  Trash,
  UserCheck,
  Home,
  Info,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Check,
} from "lucide-react";

// Custom Components
import { SelectCobradores } from "./SelectCobradores";
import { SelectZonaFacturacion } from "./SelectZonaFacturacion";

// Types
import {
  type ClienteInternet,
  EstadoCliente,
  type FacturacionZona,
  type OptionSelected,
  type Ruta,
  EstadoRuta,
} from "./rutas-types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const VITE_CRM_API_URL = import.meta.env.VITE_CRM_API_URL;
const ITEMS_PER_PAGE = 10;

export function RutasCobroEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const empresaId = useStoreCrm((state) => state.empresaId) ?? 0;

  // Estados para la ruta
  const [ruta, setRuta] = useState<Ruta | null>(null);
  const [isLoadingRuta, setIsLoadingRuta] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("informacion");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Estados para la edición de información básica
  const [nombreRuta, setNombreRuta] = useState("");
  const [cobradorId, setCobradorId] = useState<string | null>(null);
  const [observaciones, setObservaciones] = useState("");
  const [estadoRuta, setEstadoRuta] = useState<EstadoRuta>(EstadoRuta.ACTIVO);

  // Estados para la gestión de clientes
  const [clientesActuales, setClientesActuales] = useState<ClienteInternet[]>(
    []
  );
  const [clientesDisponibles, setClientesDisponibles] = useState<
    ClienteInternet[]
  >([]);
  const [selectedClientesIds, setSelectedClientesIds] = useState<string[]>([]);
  const [clientesToRemove, setClientesToRemove] = useState<string[]>([]);

  // Estados para la paginación y filtrado de clientes disponibles
  const [currentPage, setCurrentPage] = useState(1);
  const [totalClientes, setTotalClientes] = useState(0);
  const [searchCliente, setSearchCliente] = useState("");
  const [clienteFilter, setClienteFilter] = useState<EstadoCliente | "TODOS">(
    "TODOS"
  );
  const [zonaFacturacionId, setZonaFacturacionId] = useState<string | null>("");
  const [facturacionZona, setFacturacionZona] = useState<FacturacionZona[]>([]);
  const [sortBy, setSortBy] = useState<"nombre" | "saldo">("nombre");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [showFilters, setShowFilters] = useState(false);
  const [isLoadingClientes, setIsLoadingClientes] = useState(false);

  // Cargar datos de la ruta
  useEffect(() => {
    if (id) {
      fetchRuta(Number.parseInt(id));
      fetchZonaF();
    }
  }, [id]);

  // Cargar clientes disponibles cuando se cambia a la pestaña de clientes
  useEffect(() => {
    if (activeTab === "clientes") {
      fetchClientesDisponibles();
    }
  }, [
    activeTab,
    currentPage,
    searchCliente,
    clienteFilter,
    zonaFacturacionId,
    sortBy,
    sortDirection,
  ]);

  // Función para cargar datos de la ruta
  const fetchRuta = async (rutaId: number) => {
    setIsLoadingRuta(true);
    try {
      console.log("BUSCANDO LA RUTA");

      const response = await axios.get(
        `${VITE_CRM_API_URL}/ruta-cobro/get-one-ruta-to-edit/${rutaId}`
      );
      if (response.status === 200) {
        const rutaData = response.data;
        setRuta(rutaData);

        // Inicializar estados con los datos de la ruta
        setNombreRuta(rutaData.nombreRuta);
        setCobradorId(
          rutaData.cobradorId ? rutaData.cobradorId.toString() : null
        );
        setObservaciones(rutaData.observaciones || "");
        setEstadoRuta(rutaData.estadoRuta);
        setClientesActuales(rutaData.clientes);
        setSelectedClientesIds(
          rutaData.clientes.map((c: ClienteInternet) => c.id.toString())
        );
      }
    } catch (err) {
      console.error("Error al cargar la ruta:", err);
      toast.error("Error al cargar los datos de la ruta");
      navigate("/crm/rutas-cobro");
    } finally {
      setIsLoadingRuta(false);
    }
  };

  // Función para cargar zonas de facturación
  const fetchZonaF = async () => {
    try {
      const response = await axios.get(
        `${VITE_CRM_API_URL}/facturacion-zona/get-zonas-facturacion-to-ruta`
      );
      if (response.status === 200) {
        setFacturacionZona(response.data);
      }
    } catch (err) {
      console.error("Error al cargar zonas de facturación:", err);
    }
  };

  const fetchClientesDisponibles = async () => {
    setIsLoadingClientes(true);
    try {
      // En un entorno real, esta llamada incluiría parámetros de paginación, filtros y ordenamiento
      const response = await axios.get(
        `${VITE_CRM_API_URL}/internet-customer/get-customers-ruta`
      );

      if (response.status === 200) {
        // Filtrar clientes que ya están en la ruta
        const clientesIds = clientesActuales.map((c) => c.id.toString());
        let availableClientes = response.data.filter(
          (c: ClienteInternet) => !clientesIds.includes(c.id.toString())
        );

        // Aplicar filtros adicionales
        availableClientes = availableClientes
          .filter(
            (cliente: ClienteInternet) =>
              cliente.nombre
                .toLowerCase()
                .includes(searchCliente.toLowerCase()) ||
              (cliente.apellidos &&
                cliente.apellidos
                  .toLowerCase()
                  .includes(searchCliente.toLowerCase())) ||
              (cliente.direccion &&
                cliente.direccion
                  .toLowerCase()
                  .includes(searchCliente.toLowerCase()))
          )
          .filter(
            (cliente: ClienteInternet) =>
              clienteFilter === "TODOS" ||
              cliente.estadoCliente === clienteFilter
          )
          .filter((cliente: ClienteInternet) =>
            zonaFacturacionId
              ? cliente.facturacionZona.toString() === zonaFacturacionId
              : true
          )
          .sort((a: ClienteInternet, b: ClienteInternet) => {
            if (sortBy === "nombre") {
              return sortDirection === "asc"
                ? a.nombre.localeCompare(b.nombre)
                : b.nombre.localeCompare(a.nombre);
            } else {
              const saldoA = a.saldoPendiente || 0;
              const saldoB = b.saldoPendiente || 0;
              return sortDirection === "asc"
                ? saldoA - saldoB
                : saldoB - saldoA;
            }
          });

        setTotalClientes(availableClientes.length);

        // Paginar los resultados
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const paginatedData = availableClientes.slice(
          startIndex,
          startIndex + ITEMS_PER_PAGE
        );

        setClientesDisponibles(paginatedData);
      }
    } catch (err) {
      console.error("Error al cargar clientes disponibles:", err);
      toast.error("Error al cargar clientes disponibles");
    } finally {
      setIsLoadingClientes(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ruta) return;

    setIsSubmitting(true);
    try {
      if (!nombreRuta.trim()) {
        throw new Error("El nombre de la ruta es obligatorio");
      }

      if (selectedClientesIds.length === 0) {
        throw new Error("Debe seleccionar al menos un cliente para la ruta");
      }

      const dataToUpdate = {
        nombreRuta,
        cobradorId: cobradorId ? Number.parseInt(cobradorId) : null,
        empresaId,
        estadoRuta,
        observaciones,
        clientes: selectedClientesIds.map((id) => Number.parseInt(id)),
      };

      console.log("La data para actualizar la ruta es: ", dataToUpdate);

      const response = await axios.patch(
        `${VITE_CRM_API_URL}/ruta-cobro/update-one-ruta/${ruta.id}`,
        dataToUpdate
      );

      if (response.status === 200) {
        toast.success("Ruta actualizada exitosamente");
        fetchRuta(ruta.id);
        setActiveTab("informacion");
      }
    } catch (err: any) {
      console.error("Error al actualizar la ruta:", err);
      toast.error(err.message || "Error al actualizar la ruta de cobro");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteRuta = async () => {
    if (!ruta) return;

    setIsSubmitting(true);
    try {
      const response = await axios.delete(
        `${VITE_CRM_API_URL}/ruta-cobro/delete-one-ruta/${ruta.id}`
      );

      if (response.status === 200) {
        toast.success("Ruta eliminada exitosamente");
        navigate("/crm/ruta");
      }
    } catch (err) {
      console.error("Error al eliminar la ruta:", err);
      toast.error("Error al eliminar la ruta");
    } finally {
      setIsSubmitting(false);
      setShowDeleteDialog(false);
    }
  };

  const handleClienteSelect = (clienteId: string, checked: boolean) => {
    if (checked) {
      setSelectedClientesIds((prev) => [...prev, clienteId]);
    } else {
      setSelectedClientesIds((prev) => prev.filter((id) => id !== clienteId));

      // Si el cliente estaba en la lista original, añadirlo a la lista de clientes a eliminar
      if (clientesActuales.some((c) => c.id.toString() === clienteId)) {
        setClientesToRemove((prev) => [...prev, clienteId]);
      }
    }
  };

  // Función para quitar un cliente de la ruta
  const handleRemoveCliente = (clienteId: string) => {
    setSelectedClientesIds((prev) => prev.filter((id) => id !== clienteId));
    setClientesToRemove((prev) => [...prev, clienteId]);
  };

  const handleRestoreCliente = (clienteId: string) => {
    // 1) Lo quitamos de la lista de eliminados
    setClientesToRemove((prev) => prev.filter((id) => id !== clienteId));
    // 2) Lo volvemos a seleccionar (si no está ya)
    setSelectedClientesIds((prev) =>
      prev.includes(clienteId) ? prev : [...prev, clienteId]
    );
  };

  // Función para cambiar ordenamiento
  const toggleSort = (field: "nombre" | "saldo") => {
    if (sortBy === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortDirection("asc");
    }
    setCurrentPage(1); // Volver a la primera página al cambiar el ordenamiento
  };

  const handleSelecZona = (option: OptionSelected | null) => {
    const newValue = option ? option.value : null;
    setZonaFacturacionId(newValue);
    setCurrentPage(1); // Volver a la primera página al cambiar el filtro
  };

  // Calcular el número total de páginas
  const totalPages = Math.ceil(totalClientes / ITEMS_PER_PAGE);

  // Generar array de páginas para la paginación
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      // Si hay pocas páginas, mostrar todas
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Mostrar siempre la primera página
      pages.push(1);

      // Calcular el rango de páginas alrededor de la página actual
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      // Ajustar si estamos cerca del inicio
      if (currentPage <= 3) {
        endPage = Math.min(totalPages - 1, 4);
      }

      // Ajustar si estamos cerca del final
      if (currentPage >= totalPages - 2) {
        startPage = Math.max(2, totalPages - 3);
      }

      // Añadir elipsis después de la primera página si es necesario
      if (startPage > 2) {
        pages.push("ellipsis1");
      }

      // Añadir páginas del rango calculado
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      // Añadir elipsis antes de la última página si es necesario
      if (endPage < totalPages - 1) {
        pages.push("ellipsis2");
      }

      // Mostrar siempre la última página
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const clearFilters = () => {
    setSearchCliente("");
    setClienteFilter("TODOS");
    setZonaFacturacionId("");
    setCurrentPage(1);
  };

  // Obtener el color del badge según el estado
  const getEstadoBadgeColor = (estado: EstadoRuta) => {
    switch (estado) {
      case EstadoRuta.ACTIVO:
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case EstadoRuta.PENDIENTE:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case EstadoRuta.COMPLETADO:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case EstadoRuta.INACTIVO:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
      default:
        return "";
    }
  };

  // Obtener el color del badge según el estado del cliente
  const getClienteEstadoBadgeColor = (estado: EstadoCliente) => {
    switch (estado) {
      case EstadoCliente.ACTIVO:
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case EstadoCliente.MOROSO:
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      case EstadoCliente.SUSPENDIDO:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case EstadoCliente.ATRASADO:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
      default:
        return "";
    }
  };

  // Obtener el icono según el estado
  const getEstadoIcon = (estado: EstadoRuta) => {
    switch (estado) {
      case EstadoRuta.ACTIVO:
        return <CheckCircle className="h-3.5 w-3.5 mr-1" />;
      case EstadoRuta.PENDIENTE:
        return <Clock className="h-3.5 w-3.5 mr-1" />;
      case EstadoRuta.COMPLETADO:
        return <Check className="h-3.5 w-3.5 mr-1" />;
      case EstadoRuta.INACTIVO:
        return <XCircle className="h-3.5 w-3.5 mr-1" />;
      default:
        return null;
    }
  };

  // Formatear fecha
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-GT", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Calcular el total a cobrar
  const totalACobrar = clientesActuales
    .filter((cliente) => selectedClientesIds.includes(cliente.id.toString()))
    .reduce((sum, cliente) => sum + (cliente.saldoPendiente || 0), 0);

  if (isLoadingRuta) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-48" />
        </div>
        <Skeleton className="h-[600px] w-full" />
      </div>
    );
  }

  if (!ruta) {
    return (
      <div className="p-8 text-center">
        <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Ruta no encontrada</h2>
        <p className="text-muted-foreground mb-6">
          No se pudo encontrar la ruta solicitada.
        </p>
        <Button onClick={() => navigate("/crm/rutas-cobro")}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          Volver a Rutas de Cobro
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold px-2">Editar Ruta de Cobro</h1>
          </div>
          <p className="text-muted-foreground px-2">
            Modifique la información de la ruta y gestione sus clientes
          </p>
        </div>
        <div className="flex items-center gap-2 py-2 px-2">
          <Button
            variant="outline"
            onClick={() => setShowDeleteDialog(true)}
            className="text-destructive"
          >
            <Trash className="h-4 w-4 mr-2" />
            Eliminar
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Guardar Cambios
              </>
            )}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:w-auto">
          <TabsTrigger value="informacion" className="flex items-center gap-2">
            <Info className="h-4 w-4" />
            <span>Información</span>
          </TabsTrigger>
          <TabsTrigger value="clientes" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>Gestionar Clientes</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="informacion" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="h-5 w-5 " />
                Información de la Ruta
              </CardTitle>
              <CardDescription>
                Modifique los datos básicos de la ruta de cobro
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="nombreRuta" className="text-base">
                      Nombre de la Ruta{" "}
                      <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="nombreRuta"
                      value={nombreRuta}
                      onChange={(e) => setNombreRuta(e.target.value)}
                      className="text-base"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cobrador" className="text-base">
                      Cobrador Asignado
                    </Label>
                    <SelectCobradores
                      value={cobradorId}
                      onChange={setCobradorId}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="estado" className="text-base">
                      Estado de la Ruta
                    </Label>
                    <Select
                      value={estadoRuta}
                      onValueChange={(value) =>
                        setEstadoRuta(value as EstadoRuta)
                      }
                    >
                      <SelectTrigger id="estado">
                        <SelectValue placeholder="Seleccionar estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={EstadoRuta.ACTIVO}>
                          Activo
                        </SelectItem>
                        <SelectItem value={EstadoRuta.PENDIENTE}>
                          Pendiente
                        </SelectItem>
                        <SelectItem value={EstadoRuta.COMPLETADO}>
                          Completado
                        </SelectItem>
                        <SelectItem value={EstadoRuta.INACTIVO}>
                          Inactivo
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="observaciones" className="text-base">
                      Observaciones
                    </Label>
                    <Textarea
                      id="observaciones"
                      value={observaciones}
                      onChange={(e) => setObservaciones(e.target.value)}
                      rows={3}
                      className="resize-none text-base"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-muted rounded-lg space-y-3">
                    <h3 className="font-medium">Información Adicional</h3>

                    <div className="flex items-center gap-2">
                      <Badge
                        className={`${getEstadoBadgeColor(
                          ruta.estadoRuta
                        )} flex items-center`}
                      >
                        {getEstadoIcon(ruta.estadoRuta)}
                        {ruta.estadoRuta}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span>Creada: {formatDate(ruta.fechaCreacion)}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span>
                        Actualizada: {formatDate(ruta.fechaActualizacion)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-primary" />
                      <span>Clientes: {ruta.clientes.length}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <FileText className="h-4 w-4 " />
                      <span>Total a cobrar: Q{totalACobrar.toFixed(2)}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span>Cobrado: Q{ruta?.montoCobrado ?? 0}</span>
                    </div>
                  </div>

                  {ruta.cobrador && (
                    <div className="p-4 bg-muted rounded-lg space-y-3">
                      <h3 className="font-medium">Cobrador Actual</h3>
                      <div className="flex items-center gap-2">
                        <UserCheck className="h-4 w-4 " />
                        <span className="font-medium">
                          {ruta.cobrador.nombre} {ruta.cobrador.apellidos || ""}
                        </span>
                      </div>
                      {ruta.cobrador.telefono && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>{ruta.cobrador.telefono}</span>
                        </div>
                      )}
                      {/* <div className="flex items-center gap-2 text-sm">
                        <Info className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>{ruta.cobrador.email}</span>
                      </div> */}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clientes" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Clientes actuales */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Clientes en la Ruta
                </CardTitle>
                <CardDescription>
                  {clientesActuales.length} cliente
                  {clientesActuales.length !== 1 ? "s" : ""} asignados
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[500px]">
                  <div className="p-4 space-y-3">
                    {clientesActuales.length === 0 ? (
                      <div className="text-center text-muted-foreground py-8">
                        No hay clientes asignados a esta ruta
                      </div>
                    ) : (
                      clientesActuales.map((cliente) => {
                        const isSelected = selectedClientesIds.includes(
                          cliente.id.toString()
                        );
                        const isRemoved = clientesToRemove.includes(
                          cliente.id.toString()
                        );

                        return (
                          <div
                            key={cliente.id}
                            className={`p-3 rounded-md border ${
                              isSelected
                                ? "bg-background"
                                : "bg-muted/50 opacity-50"
                            } ${
                              isRemoved
                                ? "border-destructive/30"
                                : "border-transparent"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="font-medium">
                                {cliente.nombre} {cliente.apellidos || ""}
                              </div>
                              <Badge
                                className={getClienteEstadoBadgeColor(
                                  cliente.estadoCliente
                                )}
                              >
                                {cliente.estadoCliente}
                              </Badge>
                            </div>

                            {cliente.telefono && (
                              <div className="flex items-center gap-2 mt-1 text-sm">
                                <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                                <span>{cliente.telefono}</span>
                              </div>
                            )}

                            {cliente.direccion && (
                              <div className="flex items-start gap-2 mt-1 text-sm">
                                <Home className="h-3.5 w-3.5 text-muted-foreground mt-0.5" />
                                <span className="line-clamp-2">
                                  {cliente.direccion}
                                </span>
                              </div>
                            )}

                            <div className="flex items-center justify-between mt-2">
                              <div className="text-sm">
                                <span className="font-medium">
                                  Saldo: Q
                                  {cliente.saldoPendiente?.toFixed(2) || "0.00"}
                                </span>
                              </div>

                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 px-2 text-destructive hover:text-destructive"
                                onClick={() => {
                                  isRemoved
                                    ? handleRestoreCliente(
                                        cliente.id.toString()
                                      )
                                    : handleRemoveCliente(
                                        cliente.id.toString()
                                      );
                                }}
                              >
                                {isRemoved ? "Removido" : "Quitar"}
                              </Button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
              <CardFooter className="flex flex-col gap-4 pt-4">
                <div className="w-full p-4 bg-muted rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Clientes seleccionados:</span>
                    <Badge variant="outline">
                      {selectedClientesIds.length}
                    </Badge>
                  </div>
                  <div className="font-medium text-sm">
                    Total a cobrar:{" "}
                    <span className="">Q{totalACobrar.toFixed(2)}</span>
                  </div>
                </div>
              </CardFooter>
            </Card>

            {/* Clientes disponibles */}
            <Card className="lg:col-span-2">
              <CardHeader className="pb-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Añadir Clientes
                  </CardTitle>

                  <div className="flex items-center gap-2">
                    <div className="relative w-full sm:w-auto">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Buscar clientes..."
                        className="pl-8 w-full sm:w-[200px]"
                        value={searchCliente}
                        onChange={(e) => {
                          setSearchCliente(e.target.value);
                          setCurrentPage(1);
                        }}
                      />
                    </div>

                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setShowFilters(!showFilters)}
                      className="h-9 w-9"
                    >
                      <Filter className="h-4 w-4" />
                      <span className="sr-only">Mostrar filtros</span>
                    </Button>
                  </div>
                </div>

                {/* Filtros expandibles */}
                {showFilters && (
                  <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                    <div className="flex flex-col sm:flex-row gap-4 items-end">
                      <div className="space-y-2 w-full sm:w-auto">
                        <Label htmlFor="estado-filter">
                          Estado del cliente
                        </Label>
                        <Select
                          onValueChange={(value) => {
                            setClienteFilter(value as EstadoCliente | "TODOS");
                            setCurrentPage(1);
                          }}
                          value={clienteFilter}
                        >
                          <SelectTrigger
                            id="estado-filter"
                            className="w-full sm:w-[160px]"
                          >
                            <SelectValue placeholder="Todos los estados" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="TODOS">Todos</SelectItem>
                            <SelectItem value={EstadoCliente.ACTIVO}>
                              Activos
                            </SelectItem>
                            <SelectItem value={EstadoCliente.MOROSO}>
                              Morosos
                            </SelectItem>
                            <SelectItem value={EstadoCliente.SUSPENDIDO}>
                              Suspendidos
                            </SelectItem>
                            <SelectItem value={EstadoCliente.SUSPENDIDO}>
                              Inactivos
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2 w-full sm:w-auto sm:flex-1">
                        <Label htmlFor="zona-filter">Zona de facturación</Label>
                        <SelectZonaFacturacion
                          zonas={facturacionZona}
                          value={zonaFacturacionId}
                          onChange={handleSelecZona}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </CardHeader>

              <CardContent>
                {isLoadingClientes ? (
                  <div className="rounded-md border">
                    <div className="p-4">
                      <div className="space-y-3">
                        {[...Array(5)].map((_, i) => (
                          <div key={i} className="flex items-center space-x-4">
                            <div className="h-4 w-4 bg-muted rounded animate-pulse"></div>
                            <div className="w-full space-y-2">
                              <div className="h-4 bg-muted rounded w-1/4 animate-pulse"></div>
                              <div className="h-3 bg-muted rounded w-1/6 animate-pulse"></div>
                            </div>
                            <div className="h-4 bg-muted rounded w-1/6 animate-pulse"></div>
                            <div className="h-4 bg-muted rounded w-1/12 animate-pulse"></div>
                            <div className="h-6 bg-muted rounded w-1/12 animate-pulse"></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : clientesDisponibles.length === 0 ? (
                  <div className="bg-muted/50 rounded-lg p-8 text-center">
                    <div className="flex justify-center mb-4">
                      <div className="bg-muted rounded-full p-3">
                        <Search className="h-6 w-6 text-muted-foreground" />
                      </div>
                    </div>
                    <h3 className="text-lg font-medium mb-1">
                      No se encontraron clientes disponibles
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Intente con otros criterios de búsqueda o limpie los
                      filtros
                    </p>
                    <Button variant="outline" onClick={clearFilters}>
                      Limpiar filtros
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="rounded-md border overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[50px]">
                              <span className="sr-only">Seleccionar</span>
                            </TableHead>
                            <TableHead>
                              <div
                                className="flex items-center gap-1 cursor-pointer"
                                onClick={() => toggleSort("nombre")}
                              >
                                Cliente
                                <ArrowUpDown className="h-3.5 w-3.5" />
                              </div>
                            </TableHead>
                            <TableHead className="hidden md:table-cell">
                              Contacto
                            </TableHead>
                            <TableHead className="hidden md:table-cell">
                              Estado
                            </TableHead>
                            <TableHead>
                              <div
                                className="flex items-center gap-1 cursor-pointer"
                                onClick={() => toggleSort("saldo")}
                              >
                                Saldo
                                <ArrowUpDown className="h-3.5 w-3.5" />
                              </div>
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {clientesDisponibles.map((cliente) => (
                            <TableRow
                              key={cliente.id}
                              className={
                                selectedClientesIds.includes(
                                  cliente.id.toString()
                                )
                                  ? "bg-primary/5"
                                  : ""
                              }
                            >
                              <TableCell>
                                <Checkbox
                                  checked={selectedClientesIds.includes(
                                    cliente.id.toString()
                                  )}
                                  onCheckedChange={(checked) =>
                                    handleClienteSelect(
                                      cliente.id.toString(),
                                      checked === true
                                    )
                                  }
                                />
                              </TableCell>
                              <TableCell>
                                <div className="font-medium">
                                  {cliente.nombre} {cliente.apellidos || ""}
                                </div>
                                <div className="flex items-start gap-1 text-sm text-muted-foreground md:hidden">
                                  <MapPin className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                                  <span className="truncate max-w-[200px]">
                                    {cliente.direccion || "No disponible"}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell className="hidden md:table-cell">
                                <div className="space-y-1">
                                  {cliente.telefono && (
                                    <div className="flex items-center gap-1 text-sm">
                                      <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                                      <span>{cliente.telefono}</span>
                                    </div>
                                  )}
                                  <div className="flex items-start gap-1 text-sm">
                                    <MapPin className="h-3.5 w-3.5 mt-0.5 text-muted-foreground flex-shrink-0" />
                                    <span className="truncate max-w-[200px]">
                                      {cliente.direccion || "No disponible"}
                                    </span>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="hidden md:table-cell">
                                <Badge
                                  className={getClienteEstadoBadgeColor(
                                    cliente.estadoCliente
                                  )}
                                >
                                  {cliente.estadoCliente}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="font-medium">
                                  Q
                                  {cliente.saldoPendiente?.toFixed(2) || "0.00"}
                                </div>
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <FileText className="h-3 w-3" />
                                  {cliente.facturasPendientes || 0} facturas
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    {/* Paginación */}
                    {totalPages > 1 && (
                      <div className="mt-4 flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                          Mostrando {(currentPage - 1) * ITEMS_PER_PAGE + 1} -{" "}
                          {Math.min(
                            currentPage * ITEMS_PER_PAGE,
                            totalClientes
                          )}{" "}
                          de {totalClientes} clientes
                        </div>

                        <Pagination>
                          <PaginationContent>
                            <PaginationItem>
                              <PaginationPrevious
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  if (currentPage > 1)
                                    setCurrentPage(currentPage - 1);
                                }}
                                className={
                                  currentPage === 1
                                    ? "pointer-events-none opacity-50"
                                    : ""
                                }
                              />
                            </PaginationItem>

                            {getPageNumbers().map((page, index) =>
                              page === "ellipsis1" || page === "ellipsis2" ? (
                                <PaginationItem key={`ellipsis-${index}`}>
                                  <PaginationEllipsis />
                                </PaginationItem>
                              ) : (
                                <PaginationItem key={page}>
                                  <PaginationLink
                                    href="#"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      setCurrentPage(Number(page));
                                    }}
                                    isActive={currentPage === page}
                                  >
                                    {page}
                                  </PaginationLink>
                                </PaginationItem>
                              )
                            )}

                            <PaginationItem>
                              <PaginationNext
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  if (currentPage < totalPages)
                                    setCurrentPage(currentPage + 1);
                                }}
                                className={
                                  currentPage === totalPages
                                    ? "pointer-events-none opacity-50"
                                    : ""
                                }
                              />
                            </PaginationItem>
                          </PaginationContent>
                        </Pagination>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Diálogo de confirmación de eliminación */}

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmar Eliminación</DialogTitle>
            <DialogDescription>
              ¿Está seguro que desea eliminar esta plantilla? Esta acción no se
              puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Advertencia</AlertTitle>
              <AlertDescription>
                Si elimina esta plantilla, no podrá utilizarla para generar
                nuevos contratos.
              </AlertDescription>
            </Alert>
          </div>
          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() => setShowDeleteDialog(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteRuta}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Eliminando...
                </>
              ) : (
                "Eliminar"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
