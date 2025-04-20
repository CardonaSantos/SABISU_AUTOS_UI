"use client";

import type React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { toast } from "sonner";
import currency from "currency.js";

// Icons
import {
  Search,
  AlertCircle,
  Loader2,
  Plus,
  Filter,
  RefreshCw,
  Download,
  Wifi,
  WifiOff,
} from "lucide-react";

// UI Components
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";

// Custom Components
import ServicioTable from "./ServicioTable";
import CreateServicioDialog from "./CreateServiceDialog";
import EditServicioDialog from "./EditServicioDialog";
import DeleteServicioDialog from "./DeleteServicioDialog";
import { useStoreCrm } from "@/Crm/ZustandCrm/ZustandCrmContext";
import type {
  ServicioInternet,
  NuevoServicioInternet,
  // ServicioInternetEditable
} from "./servicio-internet.types";

const VITE_CRM_API_URL = import.meta.env.VITE_CRM_API_URL;

const formatearMoneda = (monto: number) => {
  return currency(monto, {
    symbol: "Q",
    separator: ",",
    decimal: ".",
    precision: 2,
  }).format();
};

const ServicioInternetManage: React.FC = () => {
  const empresaId = useStoreCrm((state) => state.empresaId) ?? 0;

  const [servicios, setServicios] = useState<ServicioInternet[]>([]);
  const [searchServicio, setSearchServicio] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [nuevoServicio, setNuevoServicio] = useState<NuevoServicioInternet>({
    nombre: "",
    velocidad: "",
    precio: 0,
    estado: "ACTIVO",
    empresaId: empresaId,
  });

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingServicio, setEditingServicio] =
    useState<ServicioInternet | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deleteServicioId, setDeleteServicioId] = useState<number | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const getServiciosInternet = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `${VITE_CRM_API_URL}/servicio-internet/get-servicios-internet`
      );
      if (response.status === 200) {
        setServicios(response.data);
      }
    } catch (error) {
      console.error("Error al cargar servicios de internet:", error);
      setError(
        "No se pudieron conseguir los datos de los servicios. Intente nuevamente."
      );
      toast.error("Error al cargar servicios");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getServiciosInternet();
  }, []);

  const handleSubmitServicio = async (servicioData: NuevoServicioInternet) => {
    setIsLoading(true);
    setError(null);

    try {
      const dataToSend = {
        nombre: servicioData.nombre.trim(),
        velocidad: servicioData.velocidad?.trim(),
        precio: servicioData.precio,
        estado: servicioData.estado,
        empresaId: empresaId,
      };

      const response = await axios.post(
        `${VITE_CRM_API_URL}/servicio-internet`,
        dataToSend
      );

      if (response.status === 201) {
        toast.success("Nuevo Servicio de Internet Creado");
        getServiciosInternet();
        setIsCreateDialogOpen(false);

        setNuevoServicio({
          nombre: "",
          velocidad: "",
          precio: 0,
          estado: "ACTIVO",
          empresaId: empresaId,
        });
      }
    } catch (error) {
      console.error("Error al crear servicio de internet:", error);
      setError("Error al crear el servicio de internet. Intente nuevamente.");
      toast.error("Error al crear servicio");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = (servicio: ServicioInternet) => {
    setEditingServicio(servicio);
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = async (updatedServicio: ServicioInternet) => {
    setIsLoading(true);
    setError(null);

    try {
      const dataToSend = {
        nombre: updatedServicio.nombre.trim(),
        velocidad: updatedServicio.velocidad?.trim(),
        precio: updatedServicio.precio,
        estado: updatedServicio.estado,
        empresaId: empresaId,
      };

      const response = await axios.patch(
        `${VITE_CRM_API_URL}/servicio-internet/update-servicio-wifi/${updatedServicio.id}`,
        dataToSend
      );

      if (response.status === 200) {
        toast.success("Servicio de internet actualizado");
        setServicios(
          servicios.map((s) =>
            s.id === updatedServicio.id ? updatedServicio : s
          )
        );
        setIsEditDialogOpen(false);
        setEditingServicio(null);
        getServiciosInternet();
      }
    } catch (error) {
      console.error("Error al actualizar servicio de internet:", error);
      setError(
        "Error al actualizar el servicio de internet. Intente nuevamente."
      );
      toast.error("Error al actualizar servicio");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (id: number) => {
    setDeleteServicioId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteServicioId === null) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.delete(
        `${VITE_CRM_API_URL}/servicio-internet/remove-servicio/${deleteServicioId}`
      );

      if (response.status === 200) {
        toast.success("Servicio de internet eliminado");
        setServicios(servicios.filter((s) => s.id !== deleteServicioId));
        setIsDeleteDialogOpen(false);
        setDeleteServicioId(null);
      }
    } catch (error) {
      console.error("Error al eliminar servicio de internet:", error);
      setError(
        "Error al eliminar el servicio de internet. Intente nuevamente."
      );
      toast.error("Error al eliminar servicio");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredServicios = servicios.filter(
    (servicio) =>
      servicio.nombre.toLowerCase().includes(searchServicio.toLowerCase()) ||
      servicio.velocidad?.toLowerCase().includes(searchServicio.toLowerCase())
  );

  const totalServicios = servicios.length;
  const serviciosActivos = servicios.filter(
    (s) => s.estado === "ACTIVO"
  ).length;
  const totalClientes = servicios.reduce(
    (acc, servicio) => acc + (servicio.clientesCount || 0),
    0
  );
  const ingresosMensuales = servicios.reduce(
    (acc, servicio) => acc + servicio.precio * (servicio.clientesCount || 0),
    0
  );

  return (
    <div className="container mx-auto py-4 space-y-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        {/* Header con título y acciones */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Servicios de Internet
            </h1>
            <p className="text-muted-foreground">
              Gestione los planes de internet disponibles para sus clientes
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar servicios..."
                className="pl-8 w-full sm:w-[250px]"
                value={searchServicio}
                onChange={(e) => setSearchServicio(e.target.value)}
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                  <span className="sr-only">Filtrar</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setSearchServicio("")}>
                  Limpiar filtros
                </DropdownMenuItem>
                <DropdownMenuItem onClick={getServiciosInternet}>
                  Actualizar datos
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              onClick={() => setIsCreateDialogOpen(true)}
              className="w-full sm:w-auto"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Plan
            </Button>
          </div>
        </div>

        {/* Mensajes de error */}
        {error && (
          <Alert variant="destructive" className="animate-in fade-in-50">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Total Planes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? <Skeleton className="h-8 w-16" /> : totalServicios}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Planes de internet configurados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Planes Activos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  serviciosActivos
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Planes disponibles para clientes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Total Clientes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? <Skeleton className="h-8 w-16" /> : totalClientes}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Clientes con planes asignados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Ingresos Mensuales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? (
                  <Skeleton className="h-8 w-24" />
                ) : (
                  formatearMoneda(ingresosMensuales)
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Facturación mensual estimada
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabla de servicios de internet */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Wifi className="h-5 w-5" />
                  Planes de Internet
                </CardTitle>
                <CardDescription>
                  Lista de planes de internet configurados en el sistema
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={getServiciosInternet}
                >
                  <RefreshCw className="h-3.5 w-3.5 mr-1" />
                  Actualizar
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-3.5 w-3.5 mr-1" />
                  Exportar
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading && servicios.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">
                  Cargando planes de internet...
                </p>
              </div>
            ) : servicios.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <div className="rounded-full bg-muted p-4">
                  <WifiOff className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-lg font-medium">
                    No hay planes de internet
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-md">
                    No se encontraron planes de internet. Cree un nuevo plan
                    para comenzar.
                  </p>
                  <Button
                    onClick={() => setIsCreateDialogOpen(true)}
                    className="mt-2"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Nuevo Plan
                  </Button>
                </div>
              </div>
            ) : filteredServicios.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <div className="rounded-full bg-muted p-4">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-lg font-medium">
                    No se encontraron resultados
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-md">
                    No se encontraron planes que coincidan con "{searchServicio}
                    ". Intente con otro término.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => setSearchServicio("")}
                    className="mt-2"
                  >
                    Limpiar búsqueda
                  </Button>
                </div>
              </div>
            ) : (
              <ServicioTable
                servicios={filteredServicios}
                formatearMoneda={formatearMoneda}
                onEditClick={handleEditClick}
                onDeleteClick={handleDeleteClick}
              />
            )}
          </CardContent>
        </Card>

        {/* Diálogo para CREAR servicio */}
        <CreateServicioDialog
          isOpen={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          initialData={nuevoServicio}
          onSubmit={handleSubmitServicio}
          isLoading={isLoading}
          empresaId={empresaId}
        />

        {/* Diálogo para EDITAR servicio */}
        <EditServicioDialog
          isOpen={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          servicio={editingServicio}
          onSave={handleSaveEdit}
          isLoading={isLoading}
        />

        {/* Diálogo para ELIMINAR servicio */}
        <DeleteServicioDialog
          isOpen={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onConfirmDelete={handleConfirmDelete}
          isLoading={isLoading}
        />
      </motion.div>
    </div>
  );
};

export default ServicioInternetManage;
