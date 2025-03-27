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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  MapPin,
  Users,
  User,
  Search,
  Plus,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Loader2,
  AlertCircle,
  Check,
  ArrowUpDown,
  MapPinned,
  Route,
  UserCheck,
  // Building,
  Phone,
  Home,
  Info,
  Play,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import axios from "axios";
const VITE_CRM_API_URL = import.meta.env.VITE_CRM_API_URL;
import ReactSelectComponent from "react-select";
import { toast } from "sonner";
import { useStoreCrm } from "../ZustandCrm/ZustandCrmContext";
import { Link } from "react-router-dom";
// Enums
enum EstadoRuta {
  ACTIVO = "ACTIVO",
  INACTIVO = "INACTIVO",
  COMPLETADO = "COMPLETADO",
  PENDIENTE = "PENDIENTE",
}

enum EstadoCliente {
  ACTIVO = "ACTIVO",
  INACTIVO = "INACTIVO",
  SUSPENDIDO = "SUSPENDIDO",
  MOROSO = "MOROSO",
}

// Interfaces
interface Empresa {
  id: number;
  nombre: string;
}

interface Ubicacion {
  id: number;
  latitud: number;
  longitud: number;
  direccion?: string;
}

interface Usuario {
  id: number;
  nombre: string;
  apellidos?: string;
  email: string;
  telefono?: string;
  rol: string;
}

interface ClienteInternet {
  id: number;
  nombre: string;
  apellidos?: string;
  telefono?: string;
  direccion?: string;
  dpi?: string;
  estadoCliente: EstadoCliente;
  empresaId?: number;
  empresa?: Empresa;
  ubicacion?: Ubicacion;
  saldoPendiente?: number;
  facturasPendientes?: number;
  facturacionZona: number;
}

interface Ruta {
  id: number;
  nombreRuta: string;
  cobradorId?: number;
  cobrador?: Usuario;
  empresaId: number;
  empresa: Empresa;
  clientes: ClienteInternet[];
  cobrados: number;
  montoCobrado: number;
  estadoRuta: EstadoRuta;
  fechaCreacion: string;
  fechaActualizacion: string;
  observaciones?: string;
  diasCobro?: string[];
}

interface CreateRutaDto {
  nombreRuta: string;
  cobradorId?: string | null;
  EmpresaId: number;
  clientesIds: string[];
  observaciones?: string;
  // diasCobro?: string[];
}

interface OptionSelected {
  value: string;
  label: string;
}

interface FacturacionZona {
  id: number;
  creadoEn: string; // Puedes usar Date si lo prefieres como objeto de fecha
  actualizadoEn: string; // Puedes usar Date si lo prefieres como objeto de fecha
  nombreRuta: string;
  diaPago: number; // Asegúrate de que el tipo de `diaPago` sea correcto según tu base de datos
  diaGeneracionFactura: number; // Asegúrate de que el tipo de `diaGeneracionFactura` sea correcto
  diaCorte: number; // Asegúrate de que el tipo de `diaCorte` sea correcto
  facturas: number;
  clientes: number;
}

// Componente principal
const RutasCobroManage: React.FC = () => {
  // Estados
  const empresaId = useStoreCrm((state) => state.empresaId) ?? 0;
  const [rutas, setRutas] = useState<Ruta[]>([]);
  const [clientes, setClientes] = useState<ClienteInternet[]>([]);
  const [cobradores, setCobradores] = useState<Usuario[]>([]);
  const [selectedClientes, setSelectedClientes] = useState<string[]>([]);
  const [searchCliente, setSearchCliente] = useState("");
  const [searchRuta, setSearchRuta] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedRuta, setSelectedRuta] = useState<Ruta | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [rutaToDelete, setRutaToDelete] = useState<number | null>(null);
  const [clienteFilter, setClienteFilter] = useState<EstadoCliente | "TODOS">(
    "TODOS"
  );

  const [zonaFacturacionId, setZonaFacturacionId] = useState<string | null>("");

  const [sortBy, setSortBy] = useState<"nombre" | "saldo">("nombre");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  console.log("las rutas son: ", rutas);
  console.log(error);

  // Estado para el formulario de creación de ruta
  const [nuevaRuta, setNuevaRuta] = useState<CreateRutaDto>({
    nombreRuta: "",
    EmpresaId: empresaId,
    clientesIds: selectedClientes.map((c) => c),
    // diasCobro: [],
    cobradorId: "",
    observaciones: "",
  });
  const [facturacionZona, setFacturacionZona] = useState<FacturacionZona[]>([]);
  const fetchZonaF = async () => {
    try {
      const response = await axios.get(
        `${VITE_CRM_API_URL}/facturacion-zona/get-zonas-facturacion-to-ruta`
      );
      if (response.status === 200) {
        setFacturacionZona(response.data);
      }
    } catch (err) {
      console.error("Error al cargar rutas:", err);
      toast.info("Error al cargar datos de zona");
    }
  };
  // Cargar datos iniciales
  useEffect(() => {
    fetchRutas();
    fetchClientes();
    fetchCobradores();
    fetchZonaF();
  }, []);

  // Función para cargar rutas
  const fetchRutas = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${VITE_CRM_API_URL}/ruta-cobro/get-rutas-cobros`
      );
      if (response.status === 200) {
        setRutas(response.data);
        setIsLoading(false);
      }
    } catch (err) {
      console.error("Error al cargar rutas:", err);
      setError("Error al cargar las rutas de cobro. Intente nuevamente.");
      setIsLoading(false);
    }
  };

  console.log("Las rutas consegudas son: ", rutas);
  console.log("los clientes son: ", clientes);

  // Función para cargar clientes
  const fetchClientes = async () => {
    try {
      // En un entorno real, esto sería una llamada a la API
      const response = await axios.get(
        `${VITE_CRM_API_URL}/internet-customer/get-customers-ruta`
      );

      if (response.status === 200) {
        setClientes(response.data);
      }
      // setClientes(response.data)

      // Mock data para demostración
      // const mockClientes: ClienteInternet[] = [
      //   {
      //     id: 1,
      //     nombre: "Juan",
      //     apellidos: "Pérez",
      //     telefono: "5555-1234",
      //     direccion: "Zona 1, Calle Principal",
      //     estadoCliente: EstadoCliente.ACTIVO,
      //     empresaId: 1,
      //     saldoPendiente: 250,
      //     facturasPendientes: 1,
      //   },
      //   {
      //     id: 2,
      //     nombre: "María",
      //     apellidos: "López",
      //     telefono: "5555-5678",
      //     direccion: "Zona 2, Avenida Central",
      //     estadoCliente: EstadoCliente.ACTIVO,
      //     empresaId: 1,
      //     saldoPendiente: 300,
      //     facturasPendientes: 1,
      //   },
      //   {
      //     id: 3,
      //     nombre: "Roberto",
      //     apellidos: "Gómez",
      //     telefono: "5555-9012",
      //     direccion: "Zona 3, Calle 5",
      //     estadoCliente: EstadoCliente.MOROSO,
      //     empresaId: 1,
      //     saldoPendiente: 500,
      //     facturasPendientes: 2,
      //   },
      //   {
      //     id: 4,
      //     nombre: "Ana",
      //     apellidos: "Martínez",
      //     telefono: "5555-3456",
      //     direccion: "Zona 3, Avenida 2",
      //     estadoCliente: EstadoCliente.ACTIVO,
      //     empresaId: 1,
      //     saldoPendiente: 250,
      //     facturasPendientes: 1,
      //   },
      //   {
      //     id: 5,
      //     nombre: "Pedro",
      //     apellidos: "Sánchez",
      //     telefono: "5555-7890",
      //     direccion: "Zona 4, Calle 10",
      //     estadoCliente: EstadoCliente.ACTIVO,
      //     empresaId: 1,
      //     saldoPendiente: 250,
      //     facturasPendientes: 1,
      //   },
      //   {
      //     id: 6,
      //     nombre: "Laura",
      //     apellidos: "Díaz",
      //     telefono: "5555-2345",
      //     direccion: "Zona 5, Calle 3",
      //     estadoCliente: EstadoCliente.ACTIVO,
      //     empresaId: 1,
      //     saldoPendiente: 250,
      //     facturasPendientes: 1,
      //   },
      //   {
      //     id: 7,
      //     nombre: "Miguel",
      //     apellidos: "Hernández",
      //     telefono: "5555-6789",
      //     direccion: "Zona 5, Avenida 8",
      //     estadoCliente: EstadoCliente.SUSPENDIDO,
      //     empresaId: 1,
      //     saldoPendiente: 750,
      //     facturasPendientes: 3,
      //   },
      //   {
      //     id: 8,
      //     nombre: "Carmen",
      //     apellidos: "Flores",
      //     telefono: "5555-0123",
      //     direccion: "Zona 6, Calle 7",
      //     estadoCliente: EstadoCliente.ACTIVO,
      //     empresaId: 1,
      //     saldoPendiente: 250,
      //     facturasPendientes: 1,
      //   },
      //   {
      //     id: 9,
      //     nombre: "José",
      //     apellidos: "Torres",
      //     telefono: "5555-4567",
      //     direccion: "Zona 6, Avenida 4",
      //     estadoCliente: EstadoCliente.MOROSO,
      //     empresaId: 1,
      //     saldoPendiente: 500,
      //     facturasPendientes: 2,
      //   },
      //   {
      //     id: 10,
      //     nombre: "Lucía",
      //     apellidos: "Ramírez",
      //     telefono: "5555-8901",
      //     direccion: "Zona 7, Calle 2",
      //     estadoCliente: EstadoCliente.ACTIVO,
      //     empresaId: 1,
      //     saldoPendiente: 250,
      //     facturasPendientes: 1,
      //   },
      // ];

      // setClientes(mockClientes);
    } catch (err) {
      console.error("Error al cargar clientes:", err);
    }
  };

  // Función para cargar cobradores
  const fetchCobradores = async () => {
    try {
      // En un entorno real, esto sería una llamada a la API
      const response = await axios.get(
        `${VITE_CRM_API_URL}/user/get-users-to-rutas`
      );
      setCobradores(response.data);
    } catch (err) {
      console.error("Error al cargar cobradores:", err);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setNuevaRuta((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleClienteSelect = (clienteId: string, checked: boolean) => {
    if (checked) {
      setSelectedClientes((prev) => [...prev, clienteId]);
    } else {
      setSelectedClientes((prev) => prev.filter((id) => id !== clienteId));
    }
  };

  const handleSubmitRuta = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Validaciones
      if (!nuevaRuta.nombreRuta.trim()) {
        throw new Error("El nombre de la ruta es obligatorio");
      }

      if (nuevaRuta.clientesIds.length === 0) {
        throw new Error("Debe seleccionar al menos un cliente para la ruta");
      }

      if (!nuevaRuta.EmpresaId) {
        throw new Error("Debe seleccionar una empresa");
      }
      const dataToSend = {
        nombreRuta: nuevaRuta.nombreRuta,
        cobradorId: Number(nuevaRuta.cobradorId),
        empresaId: nuevaRuta.EmpresaId,
        clientes: nuevaRuta.clientesIds.map((c) => parseInt(c)),
        observaciones: nuevaRuta.observaciones,
      };

      console.log("La data a enviar es: ", dataToSend);

      const response = await axios.post(
        `${VITE_CRM_API_URL}/ruta-cobro`,
        dataToSend
      );
      if (response.status === 201) {
        toast.success("Ruta creada");
        setNuevaRuta({
          clientesIds: [],
          EmpresaId: empresaId,
          nombreRuta: "",
          cobradorId: "",
          observaciones: "",
        });
        setIsSubmitting(false);
        fetchRutas();
      }
    } catch (err: any) {
      console.error("Error al crear ruta:", err);
      toast.error("Revise sus datos antes de enviar");
      setError(
        err.message || "Error al crear la ruta de cobro. Intente nuevamente."
      );
      setIsSubmitting(false);
    }
  };

  // Función para ver detalles de una ruta
  const handleViewRuta = (ruta: Ruta) => {
    setSelectedRuta(ruta);
    setIsViewDialogOpen(true);
  };

  // Función para eliminar una ruta
  const handleDeleteClick = (rutaId: number) => {
    setRutaToDelete(rutaId);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (rutaToDelete === null) return;

    setIsSubmitting(true);

    try {
      // En un entorno real, esto sería una llamada a la API
      // await axios.delete(`/api/rutas-cobro/${rutaToDelete}`)

      // Mock para demostración
      setTimeout(() => {
        setRutas(rutas.filter((r) => r.id !== rutaToDelete));
        setIsDeleteDialogOpen(false);
        setRutaToDelete(null);
        setSuccess("Ruta eliminada correctamente");
        setIsSubmitting(false);

        // Limpiar mensaje de éxito después de 3 segundos
        setTimeout(() => {
          setSuccess(null);
        }, 3000);
      }, 800);
    } catch (err) {
      console.error("Error al eliminar ruta:", err);
      setError("Error al eliminar la ruta. Intente nuevamente.");
      setIsSubmitting(false);
    }
  };

  // Función para formatear fechas
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-GT", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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
      case EstadoCliente.INACTIVO:
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

  // Filtrar clientes según búsqueda y estado
  const filteredClientes = clientes
    .filter(
      (cliente) =>
        cliente.nombre.toLowerCase().includes(searchCliente.toLowerCase()) ||
        (cliente.apellidos &&
          cliente.apellidos
            .toLowerCase()
            .includes(searchCliente.toLowerCase())) ||
        (cliente.direccion &&
          cliente.direccion.toLowerCase().includes(searchCliente.toLowerCase()))
    )
    .filter(
      (cliente) =>
        clienteFilter === "TODOS" || cliente.estadoCliente === clienteFilter
    )
    .filter((cliente) =>
      zonaFacturacionId
        ? cliente.facturacionZona.toString() === zonaFacturacionId
        : true
    );
  console.log("La nueva data de ruta es: ", nuevaRuta);
  console.log("Clientes seleccionados: ", selectedClientes);

  const filteredRutas = rutas.filter(
    (ruta) =>
      ruta.nombreRuta.toLowerCase().includes(searchRuta.toLowerCase()) ||
      (ruta.cobrador &&
        `${ruta.cobrador.nombre} ${ruta.cobrador.apellidos || ""}`
          .toLowerCase()
          .includes(searchRuta.toLowerCase())) ||
      (ruta.observaciones &&
        ruta.observaciones.toLowerCase().includes(searchRuta.toLowerCase()))
  );

  // Cambiar ordenamiento
  const toggleSort = (field: "nombre" | "saldo") => {
    if (sortBy === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortDirection("asc");
    }
  };

  //opciones para select
  const optionsCobradores: OptionSelected[] = cobradores.map((c) => ({
    value: c.id.toString(),
    label: `${c.nombre} ${c.apellidos}`,
  }));

  const optionsZonasFacturacion: OptionSelected[] = facturacionZona.map(
    (c) => ({
      value: c.id.toString(),
      label: `${c.nombreRuta} Facturas: ${c.facturas} Clientes: ${c.clientes}`,
    })
  );

  const handleSelectCobrador = (optionSelected: OptionSelected | null) => {
    const newValue = optionSelected ? optionSelected.value : null;
    setNuevaRuta((prev) => ({
      ...prev,
      cobradorId: newValue,
    }));
  };

  const handleSelecZona = (option: OptionSelected | null) => {
    const newValue = option ? option.value : null;
    setZonaFacturacionId(newValue);
  };

  useEffect(() => {
    setNuevaRuta((prev) => ({
      ...prev,
      clientesIds: selectedClientes,
    }));
  }, [selectedClientes]); // Esto se ejecutará cuando selectedClientes cambie

  return (
    <div className="container mx-auto ">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between ">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Route className="h-6 w-6" />
            Rutas de Cobro
          </h1>
          <p className="text-muted-foreground">
            Gestione las rutas de cobro para sus clientes
          </p>
        </div>
      </div>

      {/* Mensajes de error y éxito */}

      {success && (
        <Alert className="bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-900/30">
          <CheckCircle className="h-4 w-4" />
          <AlertTitle>Éxito</AlertTitle>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="crear" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:w-auto">
          <TabsTrigger value="crear" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <span>Crear Ruta</span>
          </TabsTrigger>
          <TabsTrigger value="rutas" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>Rutas Existentes</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab de Crear Ruta */}
        <TabsContent value="crear" className="space-y-1">
          <form onSubmit={handleSubmitRuta}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MapPinned className="h-5 w-5" />
                    Datos de la Ruta
                  </CardTitle>
                  <CardDescription>
                    Ingrese la información básica de la ruta de cobro
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="nombreRuta">Nombre de la Ruta</Label>
                    <Input
                      id="nombreRuta"
                      name="nombreRuta"
                      placeholder="Ej: Ruta Centro Huehuetenango"
                      value={nuevaRuta.nombreRuta}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cobrador">Cobrador (Opcional)</Label>
                    <ReactSelectComponent
                      className="text-sm text-black"
                      options={optionsCobradores}
                      onChange={handleSelectCobrador}
                      isClearable
                      value={
                        nuevaRuta.cobradorId
                          ? {
                              value: nuevaRuta.cobradorId,
                              label:
                                cobradores.find(
                                  (c) =>
                                    c.id.toString() === nuevaRuta.cobradorId
                                )?.nombre || "",
                            }
                          : null
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="observaciones">
                      Observaciones (Opcional)
                    </Label>
                    <Textarea
                      id="observaciones"
                      name="observaciones"
                      placeholder="Ej: Cobrar preferentemente en horario de mañana"
                      value={nuevaRuta.observaciones || ""}
                      onChange={handleInputChange}
                      rows={3}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={
                      isSubmitting ||
                      !nuevaRuta.nombreRuta ||
                      nuevaRuta.clientesIds.length === 0
                    }
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creando...
                      </>
                    ) : (
                      <>Crear Ruta de Cobro</>
                    )}
                  </Button>
                </CardFooter>
              </Card>

              {/* Selección de clientes */}
              <Card className="lg:col-span-2">
                <CardHeader className="pb-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Clientes
                      </CardTitle>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <div className="relative w-full sm:w-auto">
                        {" "}
                        {/* Ajustamos el ancho de la búsqueda */}
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Buscar clientes..."
                          className="pl-8 w-full"
                          value={searchCliente}
                          onChange={(e) => setSearchCliente(e.target.value)}
                        />
                      </div>
                      <div className="flex gap-2 w-full sm:w-auto">
                        {" "}
                        {/* Ajustamos el contenedor para Select y ReactSelectComponent */}
                        <Select
                          onValueChange={(value) =>
                            setClienteFilter(value as EstadoCliente | "TODOS")
                          }
                          defaultValue="TODOS"
                        >
                          <SelectTrigger className="w-full sm:w-[160px]">
                            <SelectValue placeholder="Filtrar por" />
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
                            <SelectItem value={EstadoCliente.INACTIVO}>
                              Inactivos
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        {/* Selector de zona de facturación */}
                        <ReactSelectComponent
                          className="text-black text-sm w-full sm:w-[250px]"
                          options={optionsZonasFacturacion}
                          onChange={handleSelecZona}
                          isClearable
                          value={
                            zonaFacturacionId
                              ? {
                                  value: zonaFacturacionId,
                                  label:
                                    facturacionZona.find(
                                      (c) =>
                                        c.id.toString() === zonaFacturacionId
                                    )?.nombreRuta || "",
                                }
                              : null
                          }
                        />
                      </div>
                    </div>
                  </div>
                </CardHeader>

                {/* Selección de clientes */}
                <Card className="lg:col-span-2">
                  <CardContent>
                    <div className="rounded-md border overflow-hidden">
                      <div className="overflow-x-auto">
                        <ScrollArea className="h-96 rounded-md border">
                          <div className="p-4">
                            <h4 className="mb-4 text-sm font-medium leading-none">
                              Tags
                            </h4>
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead className="w-[50px]">
                                    <span className="sr-only">Seleccionar</span>
                                  </TableHead>
                                  <TableHead>
                                    <Button
                                      variant="ghost"
                                      className="flex items-center gap-1 p-0 h-auto font-medium"
                                      onClick={() => toggleSort("nombre")}
                                    >
                                      Cliente
                                      <ArrowUpDown className="h-3 w-3" />
                                    </Button>
                                  </TableHead>
                                  <TableHead className="hidden md:table-cell">
                                    Dirección
                                  </TableHead>
                                  <TableHead className="hidden md:table-cell">
                                    Estado
                                  </TableHead>
                                  <TableHead>
                                    <Button
                                      variant="ghost"
                                      className="flex items-center gap-1 p-0 h-auto font-medium"
                                      onClick={() => toggleSort("saldo")}
                                    >
                                      Saldo
                                      <ArrowUpDown className="h-3 w-3" />
                                    </Button>
                                  </TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {filteredClientes.length === 0 ? (
                                  <TableRow>
                                    <TableCell
                                      colSpan={5}
                                      className="text-center text-muted-foreground py-6"
                                    >
                                      No se encontraron clientes
                                    </TableCell>
                                  </TableRow>
                                ) : (
                                  filteredClientes.map((cliente) => (
                                    <TableRow key={cliente.id}>
                                      <TableCell>
                                        <Checkbox
                                          checked={selectedClientes.includes(
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
                                          {cliente.nombre}{" "}
                                          {cliente.apellidos || ""}
                                        </div>
                                        <div className="text-sm text-muted-foreground md:hidden">
                                          {cliente.telefono}
                                        </div>
                                      </TableCell>
                                      <TableCell className="hidden md:table-cell">
                                        <div className="flex items-start gap-1">
                                          <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                                          <span className="truncate max-w-[200px]">
                                            {cliente.direccion ||
                                              "No disponible"}
                                          </span>
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
                                          {cliente.saldoPendiente?.toFixed(2) ||
                                            "0.00"}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                          {cliente.facturasPendientes || 0}{" "}
                                          facturas
                                        </div>
                                      </TableCell>
                                    </TableRow>
                                  ))
                                )}
                              </TableBody>
                            </Table>
                          </div>
                        </ScrollArea>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        {selectedClientes.length} clientes seleccionados
                      </div>
                      <div className="text-sm font-medium">
                        Total a cobrar: Q
                        {clientes
                          .filter((c) =>
                            selectedClientes.includes(c.id.toString())
                          )
                          .reduce(
                            (sum, cliente) =>
                              sum + (cliente.saldoPendiente || 0),
                            0
                          )
                          .toFixed(2)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Card>
            </div>
          </form>
        </TabsContent>

        {/* Tab de Rutas Existentes */}
        <TabsContent value="rutas" className="space-y-1">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Rutas de Cobro Existentes
                </CardTitle>
                <div className="relative w-full sm:w-auto">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar rutas..."
                    className="pl-8 w-full sm:w-[250px]"
                    value={searchRuta}
                    onChange={(e) => setSearchRuta(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : rutas.length === 0 ? (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>Sin rutas</AlertTitle>
                  <AlertDescription>
                    No hay rutas de cobro registradas. Cree una nueva utilizando
                    la pestaña "Crear Ruta".
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
                            Cobrador
                          </TableHead>
                          <TableHead className="hidden md:table-cell">
                            Clientes
                          </TableHead>
                          <TableHead className="hidden md:table-cell">
                            Estado
                          </TableHead>
                          <TableHead className="w-[80px]">Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredRutas.length === 0 ? (
                          <TableRow>
                            <TableCell
                              colSpan={6}
                              className="text-center text-muted-foreground py-6"
                            >
                              No se encontraron resultados para "{searchRuta}"
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredRutas.map((ruta) => (
                            <TableRow key={ruta.id}>
                              <TableCell>
                                <div className="font-medium">
                                  {ruta.nombreRuta}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  Creada: {formatDate(ruta.fechaCreacion)}
                                </div>
                              </TableCell>
                              <TableCell className="hidden md:table-cell">
                                {ruta.cobrador ? (
                                  <div className="flex items-center gap-1">
                                    <User className="h-4 w-4 text-muted-foreground" />
                                    <span>
                                      {ruta.cobrador.nombre}{" "}
                                      {ruta.cobrador.apellidos || ""}
                                    </span>
                                  </div>
                                ) : (
                                  <span className="text-muted-foreground">
                                    Sin asignar
                                  </span>
                                )}
                              </TableCell>
                              <TableCell className="hidden md:table-cell">
                                <div className="flex items-center gap-1">
                                  <Users className="h-4 w-4 text-muted-foreground" />
                                  <span>{ruta.clientes.length}</span>
                                </div>
                              </TableCell>

                              <TableCell className="hidden md:table-cell">
                                <Badge
                                  className={`${getEstadoBadgeColor(
                                    ruta.estadoRuta
                                  )} flex items-center`}
                                >
                                  {getEstadoIcon(ruta.estadoRuta)}
                                  {ruta.estadoRuta}
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
                                    <Link to={`/crm/cobros-en-ruta/${ruta.id}`}>
                                      <DropdownMenuItem
                                        className="flex items-center gap-2 hover:cursor-pointer"
                                        onClick={() => handleViewRuta(ruta)}
                                      >
                                        <Play className="h-4 w-4" />
                                        <span>Iniciar Ruta</span>
                                      </DropdownMenuItem>
                                    </Link>

                                    <DropdownMenuItem
                                      className="flex items-center gap-2"
                                      onClick={() => handleViewRuta(ruta)}
                                    >
                                      <Eye className="h-4 w-4" />
                                      <span>Ver detalles</span>
                                    </DropdownMenuItem>

                                    <DropdownMenuItem className="flex items-center gap-2">
                                      <Edit className="h-4 w-4" />
                                      <span>Editar</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      className="flex items-center gap-2 text-destructive"
                                      onClick={() => handleDeleteClick(ruta.id)}
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
        </TabsContent>
      </Tabs>

      {/* Diálogo de detalles de ruta */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MapPinned className="h-5 w-5" />
              {selectedRuta?.nombreRuta}
            </DialogTitle>
            <DialogDescription>Detalles de la ruta de cobro</DialogDescription>
          </DialogHeader>
          {selectedRuta && (
            <div className="py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Información General
                    </h3>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge
                          className={`${getEstadoBadgeColor(
                            selectedRuta.estadoRuta
                          )} flex items-center`}
                        >
                          {getEstadoIcon(selectedRuta.estadoRuta)}
                          {selectedRuta.estadoRuta}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span>
                          Creada: {formatDate(selectedRuta.fechaCreacion)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span>
                          Actualizada:{" "}
                          {formatDate(selectedRuta.fechaActualizacion)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Cobrador Asignado
                    </h3>
                    {selectedRuta.cobrador ? (
                      <div className="mt-2 p-3 bg-muted rounded-md">
                        <div className="flex items-center gap-2">
                          <UserCheck className="h-4 w-4 text-primary" />
                          <span className="font-medium">
                            {selectedRuta.cobrador.nombre}{" "}
                            {selectedRuta.cobrador.apellidos || ""}
                          </span>
                        </div>
                        {selectedRuta.cobrador.telefono && (
                          <div className="flex items-center gap-2 mt-1 text-sm">
                            <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                            <span>{selectedRuta.cobrador.telefono}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 mt-1 text-sm">
                          <Info className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>{selectedRuta.cobrador.email}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-2 text-muted-foreground">
                        No hay cobrador asignado a esta ruta
                      </div>
                    )}
                  </div>

                  {selectedRuta.observaciones && (
                    <>
                      <Separator />

                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">
                          Observaciones
                        </h3>
                        <div className="mt-2 p-3 bg-muted rounded-md text-sm">
                          {selectedRuta.observaciones}
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="mt-2">
                      <div className="text-sm font-medium flex justify-between mb-2">
                        <span>
                          Total a cobrar: Q
                          {selectedRuta.clientes
                            .reduce(
                              (sum, cliente) =>
                                sum + (cliente.saldoPendiente || 0),
                              0
                            )
                            .toFixed(2)}
                        </span>
                        <span>
                          Cobrado: Q{selectedRuta.montoCobrado.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <ScrollArea className="h-[300px] rounded-md border">
                    <div className="p-4 space-y-4">
                      {selectedRuta.clientes.length === 0 ? (
                        <div className="text-center text-muted-foreground py-4">
                          No hay clientes en esta ruta
                        </div>
                      ) : (
                        selectedRuta.clientes.map((cliente) => (
                          <div
                            key={cliente.id}
                            className="p-3 bg-muted rounded-md"
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
                                <span>{cliente.direccion}</span>
                              </div>
                            )}

                            <div className="flex items-center justify-between mt-2">
                              <div className="text-sm">
                                <span className="font-medium">
                                  Saldo: Q
                                  {cliente.saldoPendiente?.toFixed(2) || "0.00"}
                                </span>
                                {cliente.facturasPendientes &&
                                  cliente.facturasPendientes > 0 && (
                                    <span className="text-xs text-muted-foreground ml-2">
                                      ({cliente.facturasPendientes} facturas)
                                    </span>
                                  )}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </ScrollArea>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewDialogOpen(false)}>Cerrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo de confirmación de eliminación */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmar Eliminación</DialogTitle>
            <DialogDescription>
              ¿Está seguro que desea eliminar esta ruta de cobro? Esta acción no
              se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Advertencia</AlertTitle>
              <AlertDescription>
                Al eliminar esta ruta, se perderá toda la información asociada a
                ella.
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
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
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
};

export default RutasCobroManage;
