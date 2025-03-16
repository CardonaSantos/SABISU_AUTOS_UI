"use client";

import type React from "react";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Wifi,
  MoreVertical,
  Edit,
  Trash2,
  Users,
  DollarSign,
  CheckCircle,
  XCircle,
  Search,
  PlusCircle,
  Gauge,
  Save,
  AlertCircle,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useStoreCrm } from "@/Crm/ZustandCrm/ZustandCrmContext";
// import ReactSelectComponent from "react-select";
import axios from "axios";
import { toast } from "sonner";
import currency from "currency.js";

const formatearMoneda = (monto: number) => {
  return currency(monto, {
    symbol: "Q",
    separator: ",",
    decimal: ".",
    precision: 2,
  }).format();
};

// Types
type EstadoServicio = "ACTIVO" | "INACTIVO";
const VITE_CRM_API_URL = import.meta.env.VITE_CRM_API_URL;

interface ClienteServicioInternet {
  id: number;
  clienteId: number;
  servicioInternetId: number;
  // Otros campos que pueda tener la relación
}

interface ServicioInternet {
  id: number;
  nombre: string;
  velocidad?: string;
  precio: number;
  estado: EstadoServicio;
  empresaId: number;
  creadoEn: string;
  actualizadoEn: string;
  clientes?: ClienteServicioInternet[];
  clientesCount?: number; // Campo calculado para mostrar la cantidad de clientes
}

interface NuevoServicioInternet {
  nombre: string;
  velocidad?: string | null;
  precio: number | null;
  estado: EstadoServicio;
  empresaId: number | null;
}

const ServicioInternetManage: React.FC = () => {
  //STORE DE ZUSSTAND
  const empresaId = useStoreCrm((state) => state.empresaId) ?? 0;
  // State for services
  const [servicios, setServicios] = useState<ServicioInternet[]>([]);
  const [searchServicio, setSearchServicio] = useState("");

  // State for form
  const [nuevoServicio, setNuevoServicio] = useState<NuevoServicioInternet>({
    nombre: "",
    velocidad: "",
    precio: 0,
    estado: "ACTIVO",
    empresaId: empresaId,
  });

  // State for editing
  const [editingServicio, setEditingServicio] =
    useState<ServicioInternet | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // State for delete confirmation
  const [deleteServicioId, setDeleteServicioId] = useState<number | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const getServiciosInternet = async () => {
    try {
      const response = await axios.get(
        `${VITE_CRM_API_URL}/servicio-internet/get-servicios-internet`
      );
      if (response.status === 200) {
        setServicios(response.data);
      }
    } catch (error) {
      console.log(error);
      toast.info("No se pudieron conseguir los datos de los servicios");
    }
  };

  // Mock data loading - would be replaced with actual API calls
  useEffect(() => {
    getServiciosInternet();
  }, []);

  // Handlers for form inputs
  const handleServicioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (editingServicio) {
      setEditingServicio((prev) => ({
        ...prev!,
        [name]: name === "precio" ? Number.parseFloat(value) || 0 : value,
      }));
    } else {
      setNuevoServicio((prev) => ({
        ...prev,
        [name]: name === "precio" ? Number.parseFloat(value) || 0 : value,
      }));
    }
  };

  // Handlers for select inputs
  const handleEstadoServicioSelect = (value: string) => {
    if (editingServicio) {
      setEditingServicio((prev) => ({
        ...prev!,
        estado: value as EstadoServicio,
      }));
    } else {
      setNuevoServicio((prev) => ({
        ...prev,
        estado: value as EstadoServicio,
      }));
    }
  };

  const handleSubmitServicio = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Creating internet service:", nuevoServicio);

    try {
      const dataToSend = {
        nombre: nuevoServicio.nombre.trim(),
        velocidad: nuevoServicio.velocidad?.trim(),
        precio: nuevoServicio.precio,
        estado: nuevoServicio.estado,
        empresaId: empresaId,
      };

      const response = await axios.post(
        `${VITE_CRM_API_URL}/servicio-internet`,
        dataToSend
      );
      if (response.status === 201) {
        toast.success("Nuevo Servicio de Internet Creado");
        // Reset form
        setNuevoServicio({
          nombre: "",
          velocidad: "",
          precio: 0,
          estado: "ACTIVO",
          empresaId: 1,
        });
        getServiciosInternet();
      }
    } catch (error) {
      console.log(error);
      toast.error("Error al crear servicio de internet");
    }
  };

  const handleEditClick = (servicio: ServicioInternet) => {
    setEditingServicio(servicio);
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editingServicio) return;

    console.log("Updating internet service:", editingServicio);

    setServicios(
      servicios.map((s) =>
        s.id === editingServicio.id
          ? { ...editingServicio, actualizadoEn: new Date().toISOString() }
          : s
      )
    );
    setIsEditDialogOpen(false);
    setEditingServicio(null);
  };

  const handleDeleteClick = (id: number) => {
    setDeleteServicioId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteServicioId === null) return;

    console.log("Deleting internet service with ID:", deleteServicioId);

    setServicios(servicios.filter((s) => s.id !== deleteServicioId));

    setIsDeleteDialogOpen(false);
    setDeleteServicioId(null);
  };

  // Filter services based on search
  const filteredServicios = servicios.filter(
    (servicio) =>
      servicio.nombre.toLowerCase().includes(searchServicio.toLowerCase()) ||
      servicio.velocidad?.toLowerCase().includes(searchServicio.toLowerCase())
  );

  return (
    <div className="container mx-auto py-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Servicios de Internet
            </h1>
            <p className="text-muted-foreground">
              Gestione los planes de internet disponibles para sus clientes
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar servicios..."
                className="pl-8 w-full sm:w-[250px]"
                value={searchServicio}
                onChange={(e) => setSearchServicio(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
          {/* Form for creating internet services */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PlusCircle className="h-5 w-5" />
                Crear Nuevo Plan de Internet
              </CardTitle>
              <CardDescription>
                Complete el formulario para crear un nuevo plan de internet
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmitServicio}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre del Plan</Label>
                  <Input
                    id="nombre"
                    name="nombre"
                    placeholder="Ej: Plan Básico Internet"
                    value={nuevoServicio.nombre}
                    onChange={handleServicioChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="velocidad">Velocidad</Label>
                  <div className="relative">
                    <Gauge className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="velocidad"
                      name="velocidad"
                      className="pl-8"
                      placeholder="Ej: 20 Mbps"
                      value={nuevoServicio.velocidad || ""}
                      onChange={handleServicioChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="precio">Precio</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="precio"
                      name="precio"
                      type="number"
                      className="pl-8"
                      placeholder="0.00"
                      value={nuevoServicio.precio || ""}
                      onChange={handleServicioChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="estado">Estado</Label>
                  <Select
                    onValueChange={handleEstadoServicioSelect}
                    defaultValue={nuevoServicio.estado}
                  >
                    <SelectTrigger id="estado">
                      <SelectValue placeholder="Seleccione un estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ACTIVO">Activo</SelectItem>
                      <SelectItem value="INACTIVO">Inactivo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full">
                  Crear Plan de Internet
                </Button>
              </CardFooter>
            </form>
          </Card>

          {/* Table of internet services */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wifi className="h-5 w-5" />
                Planes de Internet Disponibles
              </CardTitle>
              <CardDescription>
                Lista de planes de internet configurados en el sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              {servicios.length === 0 ? (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>No hay planes disponibles</AlertTitle>
                  <AlertDescription>
                    No se encontraron planes de internet. Cree uno nuevo
                    utilizando el formulario.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="rounded-md border overflow-hidden">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nombre</TableHead>
                          <TableHead className="hidden md:table-cell">
                            Velocidad
                          </TableHead>
                          <TableHead className="text-right">Precio</TableHead>
                          <TableHead className="hidden md:table-cell">
                            Estado
                          </TableHead>
                          <TableHead className="hidden md:table-cell">
                            Clientes
                          </TableHead>
                          <TableHead className="w-[80px]">Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredServicios.length === 0 ? (
                          <TableRow>
                            <TableCell
                              colSpan={6}
                              className="text-center text-muted-foreground py-6"
                            >
                              No se encontraron resultados para "
                              {searchServicio}"
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredServicios.map((servicio) => (
                            <TableRow key={servicio.id}>
                              <TableCell>
                                <div>
                                  <div className="font-medium">
                                    {servicio.nombre}
                                  </div>
                                  <div className="text-sm text-muted-foreground md:hidden">
                                    {servicio.velocidad}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="hidden md:table-cell">
                                {servicio.velocidad}
                              </TableCell>
                              <TableCell className="text-right font-medium">
                                {formatearMoneda(servicio.precio)}
                              </TableCell>
                              <TableCell className="hidden md:table-cell">
                                <Badge
                                  variant={
                                    servicio.estado === "ACTIVO"
                                      ? "default"
                                      : "destructive"
                                  }
                                >
                                  {servicio.estado === "ACTIVO" ? (
                                    <CheckCircle className="mr-1 h-3 w-3" />
                                  ) : (
                                    <XCircle className="mr-1 h-3 w-3" />
                                  )}
                                  {servicio.estado}
                                </Badge>
                              </TableCell>
                              <TableCell className="hidden md:table-cell">
                                <div className="flex items-center gap-1">
                                  <Users className="h-4 w-4 text-muted-foreground" />
                                  <span>{servicio.clientesCount || 0}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8"
                                    >
                                      <MoreVertical className="h-4 w-4" />
                                      <span className="sr-only">
                                        Abrir menú
                                      </span>
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem
                                      className="flex items-center gap-2"
                                      onClick={() => handleEditClick(servicio)}
                                    >
                                      <Edit className="h-4 w-4" />
                                      <span>Editar</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      className="flex items-center gap-2 text-destructive"
                                      onClick={() =>
                                        handleDeleteClick(servicio.id)
                                      }
                                    >
                                      <Trash2 className="h-4 w-4" />
                                      <span>Eliminar</span>
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Editar Plan de Internet</DialogTitle>
              <DialogDescription>
                Modifique los detalles del plan de internet y guarde los
                cambios.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-nombre">Nombre del Plan</Label>
                <Input
                  id="edit-nombre"
                  name="nombre"
                  value={editingServicio?.nombre || ""}
                  onChange={handleServicioChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-velocidad">Velocidad</Label>
                <div className="relative">
                  <Gauge className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="edit-velocidad"
                    name="velocidad"
                    className="pl-8"
                    value={editingServicio?.velocidad || ""}
                    onChange={handleServicioChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-precio">Precio</Label>
                <div className="relative">
                  <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="edit-precio"
                    name="precio"
                    type="number"
                    className="pl-8"
                    value={editingServicio?.precio || ""}
                    onChange={handleServicioChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-estado">Estado</Label>
                <Select
                  onValueChange={handleEstadoServicioSelect}
                  value={editingServicio?.estado}
                >
                  <SelectTrigger id="edit-estado">
                    <SelectValue placeholder="Seleccione un estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVO">Activo</SelectItem>
                    <SelectItem value="INACTIVO">Inactivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button onClick={handleSaveEdit} className="gap-2">
                <Save className="h-4 w-4" />
                Guardar Cambios
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Confirmar Eliminación</DialogTitle>
              <DialogDescription>
                ¿Está seguro que desea eliminar este plan de internet? Esta
                acción no se puede deshacer.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Advertencia</AlertTitle>
                <AlertDescription>
                  Si hay clientes asociados a este plan, se perderá la relación
                  con ellos.
                </AlertDescription>
              </Alert>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button variant="destructive" onClick={handleConfirmDelete}>
                Eliminar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>
    </div>
  );
};

export default ServicioInternetManage;
