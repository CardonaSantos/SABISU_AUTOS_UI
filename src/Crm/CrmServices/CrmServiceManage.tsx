"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  PlusCircle,
  Wifi,
  Package,
  MoreVertical,
  Edit,
  Trash2,
  Users,
  // DollarSign,
  CheckCircle,
  XCircle,
  Search,
  Coins,
} from "lucide-react";
import { useStoreCrm } from "../ZustandCrm/ZustandCrmContext";
import axios from "axios";
import { toast } from "sonner";
import ReactSelectComponent from "react-select";
import { motion } from "framer-motion";
import currency from "currency.js";

const formatearMoneda = (monto: number) => {
  return currency(monto, {
    symbol: "Q",
    separator: ",",
    decimal: ".",
    precision: 2,
  }).format();
};

const VITE_CRM_API_URL = import.meta.env.VITE_CRM_API_URL;

// Types
type EstadoServicio = "ACTIVO" | "INACTIVO";

interface TipoServicio {
  id: number;
  nombre: string;
  descripcion: string;
  estado: EstadoServicio;
  creadoEn: string;
  actualizadoEn: string;
}

interface Servicio {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  estado: EstadoServicio;
  tipoServicioId: number;
  empresaId: number;
  creadoEn: string;
  actualizadoEn: string;
  clientesCount?: number; // Optional field for showing linked clients
}

interface NuevoServicio {
  nombre: string;
  descripcion: string;
  precio: number;
  estado: EstadoServicio;
  tipoServicioId: string | null;
  empresaId: number;
}

interface NuevoTipoServicio {
  nombre: string;
  descripcion: string;
  estado: EstadoServicio;
}

const CrmServiceManage: React.FC = () => {
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [tiposServicio, setTiposServicio] = useState<TipoServicio[]>([]);
  const empresaID = useStoreCrm((state) => state.empresaId) ?? 0;

  const [tipoServicioSelected, setTipoServicioSelected] = useState<
    string | null
  >(null);

  // State for forms
  const [nuevoServicio, setNuevoServicio] = useState<NuevoServicio>({
    nombre: "".trim(),
    descripcion: "".trim(),
    precio: 0,
    estado: "ACTIVO",
    tipoServicioId: tipoServicioSelected?.toString() || null,
    empresaId: empresaID,
  });
  console.log(nuevoServicio);
  console.log("LOS SERVICIOS OTROS SON:", servicios);

  const [nuevoTipoServicio, setNuevoTipoServicio] = useState<NuevoTipoServicio>(
    {
      nombre: "",
      descripcion: "",
      estado: "ACTIVO",
    }
  );

  // State for search
  const [searchServicio, setSearchServicio] = useState("");
  const [searchTipoServicio, setSearchTipoServicio] = useState("");

  // Mock data loading - would be replaced with actual API calls
  useEffect(() => {}, []);

  const getTiposServicio = async () => {
    try {
      const response = await axios.get(`${VITE_CRM_API_URL}/tipo-servicio`);

      if (response.status === 200) {
        setTiposServicio(response.data);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error al conseguir tipos de servicios");
    }
  };

  const getServicios = async () => {
    try {
      const response = await axios.get(`${VITE_CRM_API_URL}/servicio`);
      if (response.status === 200) {
        setServicios(response.data);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error al conseguir servicios");
    }
  };

  useEffect(() => {
    getTiposServicio();
    getServicios();
  }, []);
  console.log("lista de tipos", tiposServicio);

  interface OptionSelected {
    value: string;
    label: string;
  }

  const optionsTiposServicios: OptionSelected[] = tiposServicio.map((s) => ({
    value: s.id.toString(),
    label: s.nombre,
  }));

  const handleSelectTipo = (option: OptionSelected | null) => {
    const newValue = option ? option.value : null;
    setTipoServicioSelected(newValue);
    setNuevoServicio((prev) => ({
      ...prev,
      tipoServicioId: newValue,
    }));
  };

  // Handlers for form inputs
  const handleServicioChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNuevoServicio((prev) => ({
      ...prev,
      [name]: name === "precio" ? Number.parseFloat(value) || 0 : value,
    }));
  };

  const handleTipoServicioChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNuevoTipoServicio((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEstadoTipoServicioSelect = (value: string) => {
    setNuevoTipoServicio((prev) => ({
      ...prev,
      estado: value as EstadoServicio,
    }));
  };

  // Submit handlers
  const handleSubmitServicio = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Creating service:", nuevoServicio);

    if (!nuevoServicio.tipoServicioId) {
      toast.info("Seleccione un tipo para el servicio");
      return;
    }

    if (!nuevoServicio.precio || nuevoServicio.precio <= 0) {
      toast.info("Seleccione un precio valido para el servicio");
      return;
    }

    if (!nuevoServicio.nombre) {
      toast.info("Añada un nombre para su servicio");
    }

    const dataToSend = {
      nombre: nuevoServicio.nombre.trim(),
      descripcion: nuevoServicio.descripcion.trim(),
      precio: nuevoServicio.precio,
      estado: "ACTIVO",
      tipoServicioId: parseInt(nuevoServicio.tipoServicioId),
      empresaId: Number(nuevoServicio.empresaId),
    };

    try {
      const response = await axios.post(
        `${VITE_CRM_API_URL}/servicio`,
        dataToSend
      );
      if (response.status === 201) {
        toast.success("Servicio creado");
        getServicios();
        // Reset form
        setNuevoServicio({
          nombre: "",
          descripcion: "",
          precio: 0,
          estado: "ACTIVO",
          tipoServicioId: null,
          empresaId: empresaID,
        });
        setTipoServicioSelected(null);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error al crear servicio");
    }
  };

  const handleSubmitTipoServicio = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nuevoTipoServicio.nombre) {
      toast.info("Ingrese un nombre valido");
      return;
    }

    if (!nuevoTipoServicio.descripcion) {
      toast.info("Ingrese una descripcion valido");
      return;
    }

    try {
      const dataToSend = {
        nombre: nuevoTipoServicio.nombre.trim(),
        descripcion: nuevoTipoServicio.descripcion.trim(),
        estado: nuevoTipoServicio.estado.trim(),
      };
      const response = await axios.post(
        `${VITE_CRM_API_URL}/tipo-servicio`,
        dataToSend
      );

      if (response.status === 201) {
        toast.success("Nuevo tipo de servicio creado");
        setNuevoTipoServicio({
          descripcion: "",
          estado: "ACTIVO",
          nombre: "",
        });
        getTiposServicio();
      }
    } catch (error) {}
  };

  // Filter services and service types based on search
  const filteredServicios = servicios.filter(
    (servicio) =>
      servicio.nombre.toLowerCase().includes(searchServicio.toLowerCase()) ||
      servicio.descripcion?.toLowerCase().includes(searchServicio.toLowerCase())
  );

  const filteredTiposServicio = tiposServicio.filter(
    (tipo) =>
      tipo.nombre.toLowerCase().includes(searchTipoServicio.toLowerCase()) ||
      tipo.descripcion.toLowerCase().includes(searchTipoServicio.toLowerCase())
  );

  // Get service type name by ID
  const getTipoServicioNombre = (id: number) => {
    const tipo = tiposServicio.find((t) => t.id === id);
    return tipo ? tipo.nombre : "Desconocido";
  };

  return (
    <div className="container mx-auto py-1 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-xl font-bold tracking-tight">
          Gestión de Servicios
        </h2>

        <Tabs defaultValue="servicios" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:w-auto">
            <TabsTrigger value="servicios" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              <span>Otros Servicios</span>
            </TabsTrigger>
            <TabsTrigger value="tipos" className="flex items-center gap-2">
              <Wifi className="h-4 w-4" />
              <span>Tipos de Servicio Etiquetas</span>
            </TabsTrigger>
          </TabsList>

          {/* Servicios Tab */}
          <TabsContent value="servicios" className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Form for creating services */}
              <Card className="w-full md:w-1/3">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <PlusCircle className="h-5 w-5" />
                    Crear Nuevo Servicio
                  </CardTitle>
                </CardHeader>
                <form onSubmit={handleSubmitServicio}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="nombre">Nombre</Label>
                      <Input
                        id="nombre"
                        name="nombre"
                        placeholder="Ej: Internet 24 Mbps"
                        value={nuevoServicio.nombre}
                        onChange={handleServicioChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="descripcion">Descripción</Label>
                      <Textarea
                        id="descripcion"
                        name="descripcion"
                        placeholder="Descripción del servicio"
                        rows={2} // Número de filas iniciales
                        className="h-[60px] resize-none" // Altura fija y deshabilitar redimensionamiento
                        value={nuevoServicio.descripcion}
                        onChange={handleServicioChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="precio">Precio</Label>
                      <div className="relative">
                        <Coins className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
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
                      <Label htmlFor="tipoServicio">Tipo de Servicio</Label>
                      <ReactSelectComponent
                        isClearable
                        className="text-sm text-black"
                        options={optionsTiposServicios}
                        onChange={handleSelectTipo}
                        value={
                          tipoServicioSelected
                            ? {
                                value: tipoServicioSelected,
                                label:
                                  tiposServicio.find(
                                    (t) =>
                                      t.id.toString() === tipoServicioSelected
                                  )?.nombre || "",
                              }
                            : null
                        }
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" className="w-full">
                      Crear Servicio
                    </Button>
                  </CardFooter>
                </form>
              </Card>

              {/* Table of services */}
              <Card className="w-full md:w-2/3">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Package className="h-5 w-5" />
                    Servicios Existentes
                  </CardTitle>
                  <CardDescription>
                    Lista de servicios disponibles en el sistema
                  </CardDescription>
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar servicios..."
                      className="pl-8"
                      value={searchServicio}
                      onChange={(e) => setSearchServicio(e.target.value)}
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border overflow-hidden">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Nombre</TableHead>
                            <TableHead className="hidden md:table-cell">
                              Tipo
                            </TableHead>
                            <TableHead className="text-right">Precio</TableHead>
                            <TableHead className="hidden md:table-cell">
                              Estado
                            </TableHead>
                            <TableHead className="hidden md:table-cell">
                              Clientes
                            </TableHead>
                            <TableHead className="w-[50px]"></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredServicios.length === 0 ? (
                            <TableRow>
                              <TableCell
                                colSpan={6}
                                className="text-center text-muted-foreground py-6"
                              >
                                No se encontraron servicios
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
                                      {getTipoServicioNombre(
                                        servicio.tipoServicioId
                                      )}
                                    </div>
                                    <div className="text-sm text-muted-foreground truncate max-w-[200px] hidden sm:block">
                                      {servicio.descripcion}
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                  {getTipoServicioNombre(
                                    servicio.tipoServicioId
                                  )}
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
                                      <DropdownMenuItem className="flex items-center gap-2">
                                        <Edit className="h-4 w-4" />
                                        <span>Editar</span>
                                      </DropdownMenuItem>
                                      <DropdownMenuItem className="flex items-center gap-2 text-destructive">
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
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Tipos de Servicio Tab */}
          <TabsContent value="tipos" className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Form for creating service types */}
              <Card className="w-full md:w-1/3">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <PlusCircle className="h-5 w-5" />
                    Crear Nuevo Tipo de Servicio
                  </CardTitle>
                </CardHeader>
                <form onSubmit={handleSubmitTipoServicio}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="tipoNombre">Nombre</Label>
                      <Input
                        id="tipoNombre"
                        name="nombre"
                        placeholder="Ej: Internet"
                        value={nuevoTipoServicio.nombre}
                        onChange={handleTipoServicioChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tipoDescripcion">Descripción</Label>
                      <Textarea
                        id="tipoDescripcion"
                        name="descripcion"
                        placeholder="Descripción del tipo de servicio"
                        value={nuevoTipoServicio.descripcion}
                        onChange={handleTipoServicioChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tipoEstado">Estado</Label>
                      <Select
                        onValueChange={handleEstadoTipoServicioSelect}
                        defaultValue={nuevoTipoServicio.estado}
                      >
                        <SelectTrigger id="tipoEstado">
                          <SelectValue placeholder="Seleccione un estado" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ACTIVO">Activo</SelectItem>
                          {/* <SelectItem value="INACTIVO">Inactivo</SelectItem> */}
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" className="w-full">
                      Crear Tipo de Servicio
                    </Button>
                  </CardFooter>
                </form>
              </Card>

              {/* Table of service types */}
              <Card className="w-full md:w-2/3">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Wifi className="h-5 w-5" />
                    Tipos de Servicio Existentes
                  </CardTitle>
                  <CardDescription>
                    Lista de tipos de servicio disponibles en el sistema
                  </CardDescription>
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar tipos de servicio..."
                      className="pl-8"
                      value={searchTipoServicio}
                      onChange={(e) => setSearchTipoServicio(e.target.value)}
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border overflow-hidden">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Nombre</TableHead>
                            <TableHead className="hidden md:table-cell">
                              Descripción
                            </TableHead>
                            <TableHead className="hidden md:table-cell">
                              Estado
                            </TableHead>
                            <TableHead className="w-[50px]"></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredTiposServicio.length === 0 ? (
                            <TableRow>
                              <TableCell
                                colSpan={4}
                                className="text-center text-muted-foreground py-6"
                              >
                                No se encontraron tipos de servicio
                              </TableCell>
                            </TableRow>
                          ) : (
                            filteredTiposServicio.map((tipo) => (
                              <TableRow key={tipo.id}>
                                <TableCell>
                                  <div className="font-medium">
                                    {tipo.nombre}
                                  </div>
                                  <div className="text-sm text-muted-foreground md:hidden">
                                    {tipo.estado === "ACTIVO"
                                      ? "Activo"
                                      : "Inactivo"}
                                  </div>
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                  <div className="truncate max-w-[300px]">
                                    {tipo.descripcion}
                                  </div>
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                  <Badge
                                    variant={
                                      tipo.estado === "ACTIVO"
                                        ? "default"
                                        : "destructive"
                                    }
                                  >
                                    {tipo.estado === "ACTIVO" ? (
                                      <CheckCircle className="mr-1 h-3 w-3" />
                                    ) : (
                                      <XCircle className="mr-1 h-3 w-3" />
                                    )}
                                    {tipo.estado}
                                  </Badge>
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
                                      <DropdownMenuItem className="flex items-center gap-2">
                                        <Edit className="h-4 w-4" />
                                        <span>Editar</span>
                                      </DropdownMenuItem>
                                      <DropdownMenuItem className="flex items-center gap-2 text-destructive">
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
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default CrmServiceManage;
