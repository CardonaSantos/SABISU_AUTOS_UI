"use client";

import type React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { toast } from "sonner";
import type {
  FacturacionZona,
  NuevaFacturacionZona,
} from "./FacturacionZonaTypes";

// Icons
import {
  Search,
  AlertCircle,
  Loader2,
  Plus,
  Filter,
  RefreshCw,
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
import ZonaTable from "./ZonaTable";
import EditZonaDialog from "./EditZonaDialogProps";
import DeleteZonaDialog from "./DeleteZonaDialog";
import CreateZonaDialog from "./CreateZonaDialog";
import { useStoreCrm } from "../ZustandCrm/ZustandCrmContext";

const VITE_CRM_API_URL = import.meta.env.VITE_CRM_API_URL;

const FacturacionZonaManage: React.FC = () => {
  // State para zonas de facturación
  const [zonas, setZonas] = useState<FacturacionZona[]>([]);
  const [searchZona, setSearchZona] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const empresaId = useStoreCrm((state) => state.empresaId) ?? 0;

  // State para formulario
  const [nuevaZona, setNuevaZona] = useState<NuevaFacturacionZona>({
    nombre: "",
    empresaId: empresaId,
    diaGeneracionFactura: 10,
    enviarRecordatorioGeneracion: false,
    diaPago: 20,
    enviarAvisoPago: false,
    diaRecordatorio: 5,
    enviarRecordatorio1: false,
    diaSegundoRecordatorio: 15,
    enviarRecordatorio2: false,
    horaRecordatorio: "08:00:00",
    enviarRecordatorio: true,
    diaCorte: 25,
    suspenderTrasFacturas: 2,
    // whatsapp: false,
    // email: false,
    // sms: false,
    // llamada: false,
    // telegram: false,
  });

  // State para diálogos
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingZona, setEditingZona] = useState<FacturacionZona | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deleteZonaId, setDeleteZonaId] = useState<number | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Cargar datos
  useEffect(() => {
    fetchZonas();
  }, []);

  // Función para cargar zonas de facturación
  const fetchZonas = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${VITE_CRM_API_URL}/facturacion-zona`);

      if (response.status === 200) {
        setZonas(response.data);
      }
    } catch (err) {
      console.error("Error al cargar zonas de facturación:", err);
      setError("Error al cargar las zonas de facturación. Intente nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  // Submit handlers
  const handleSubmitZona = async (zonaData: NuevaFacturacionZona) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `${VITE_CRM_API_URL}/facturacion-zona`,
        zonaData
      );

      if (response.status === 201) {
        toast.success("Nueva Zona de Facturación Creada");
        fetchZonas();
        setIsCreateDialogOpen(false);
      }

      // Reset form
      setNuevaZona({
        nombre: "",
        empresaId: empresaId,
        diaGeneracionFactura: 10,
        enviarRecordatorioGeneracion: false,
        diaPago: 20,
        enviarAvisoPago: false,
        diaRecordatorio: 5,
        enviarRecordatorio1: false,
        diaSegundoRecordatorio: 15,
        enviarRecordatorio2: false,
        horaRecordatorio: "08:00:00",
        enviarRecordatorio: true,
        diaCorte: 25,
        suspenderTrasFacturas: 2,
        // whatsapp: false,
        // email: false,
        // sms: false,
        // llamada: false,
        // telegram: false,
      });
    } catch (err) {
      toast.error("Error al crear zona");
      console.error("Error al crear zona de facturación:", err);
      setError("Error al crear la zona de facturación. Intente nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  // Edit handlers
  const handleEditClick = (zona: FacturacionZona) => {
    setEditingZona(zona);
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = async (updatedZona: FacturacionZona) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.patch(
        `${VITE_CRM_API_URL}/facturacion-zona/update-zona-facturacion`,
        updatedZona
      );

      if (response.status === 200) {
        toast.success("Zona de Facturación Actualizada");
        setZonas(zonas.map((z) => (z.id === updatedZona.id ? updatedZona : z)));
        setIsEditDialogOpen(false);
        setEditingZona(null);
      }
    } catch (err) {
      toast.error("Error al actualizar zona");
      console.error("Error al actualizar zona de facturación:", err);
      setError(
        "Error al actualizar la zona de facturación. Intente nuevamente."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Delete handlers
  const handleDeleteClick = (id: number) => {
    setDeleteZonaId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteZonaId === null) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.delete(
        `${VITE_CRM_API_URL}/facturacion-zona/${deleteZonaId}`
      );

      if (response.status === 200) {
        toast.success("Zona de Facturación Eliminada");
        setZonas(zonas.filter((z) => z.id !== deleteZonaId));
        setIsDeleteDialogOpen(false);
        setDeleteZonaId(null);
      }
    } catch (err) {
      toast.error("Error al eliminar zona");
      console.error("Error al eliminar zona de facturación:", err);
      setError("Error al eliminar la zona de facturación. Intente nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  // Filter zonas based on search
  const filteredZonas = zonas.filter((zona) =>
    zona.nombre.toLowerCase().includes(searchZona.toLowerCase())
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
              Zonas de Facturación
            </h1>
            <p className="text-muted-foreground">
              Gestione las zonas de facturación para sus clientes
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar zonas..."
                className="pl-8 w-full sm:w-[250px]"
                value={searchZona}
                onChange={(e) => setSearchZona(e.target.value)}
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
                <DropdownMenuItem onClick={() => setSearchZona("")}>
                  Limpiar filtros
                </DropdownMenuItem>
                <DropdownMenuItem onClick={fetchZonas}>
                  Actualizar datos
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              onClick={() => setIsCreateDialogOpen(true)}
              className="w-full sm:w-auto"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nueva Zona
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Zonas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? <Skeleton className="h-8 w-16" /> : zonas.length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Zonas de facturación configuradas
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
                {isLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  zonas.reduce(
                    (acc, zona) => acc + (zona.clientesCount || 0),
                    0
                  )
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Clientes asignados a zonas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Total Facturas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  zonas.reduce(
                    (acc, zona) => acc + (zona.facturasCount || 0),
                    0
                  )
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Facturas generadas en todas las zonas
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabla de zonas de facturación */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <CardTitle className="flex items-center gap-2">
                  Zonas de Facturación
                </CardTitle>
                <CardDescription>
                  Lista de zonas de facturación configuradas en el sistema
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={fetchZonas}>
                  <RefreshCw className="h-3.5 w-3.5 mr-1" />
                  Actualizar
                </Button>
                {/* <Button variant="outline" size="sm">
                  <Download className="h-3.5 w-3.5 mr-1" />
                  Exportar
                </Button> */}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading && zonas.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">
                  Cargando zonas de facturación...
                </p>
              </div>
            ) : zonas.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <div className="rounded-full bg-muted p-4">
                  <AlertCircle className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-lg font-medium">
                    No hay zonas de facturación
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-md">
                    No se encontraron zonas de facturación. Cree una nueva zona
                    para comenzar.
                  </p>
                  <Button
                    onClick={() => setIsCreateDialogOpen(true)}
                    className="mt-2"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Nueva Zona
                  </Button>
                </div>
              </div>
            ) : filteredZonas.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <div className="rounded-full bg-muted p-4">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-lg font-medium">
                    No se encontraron resultados
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-md">
                    No se encontraron zonas que coincidan con "{searchZona}".
                    Intente con otro término.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => setSearchZona("")}
                    className="mt-2"
                  >
                    Limpiar búsqueda
                  </Button>
                </div>
              </div>
            ) : (
              <ZonaTable
                zonas={filteredZonas}
                searchTerm={searchZona}
                onEditClick={handleEditClick}
                onDeleteClick={handleDeleteClick}
              />
            )}
          </CardContent>
        </Card>

        {/* Diálogo para CREAR zona */}
        <CreateZonaDialog
          isOpen={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          initialData={nuevaZona}
          onSubmit={handleSubmitZona}
          isLoading={isLoading}
        />

        {/* Diálogo para EDITAR zona */}
        <EditZonaDialog
          isOpen={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          zona={editingZona}
          onSave={handleSaveEdit}
          isLoading={isLoading}
        />

        {/* Diálogo para ELIMINAR zona */}
        <DeleteZonaDialog
          isOpen={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onConfirmDelete={handleConfirmDelete}
          isLoading={isLoading}
        />
      </motion.div>
    </div>
  );
};

export default FacturacionZonaManage;
