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
  CalendarRange,
  Building,
  Phone,
  Home,
  Info,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import axios from "axios";
const VITE_CRM_API_URL = import.meta.env.VITE_CRM_API_URL;

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
  cobradorId?: number;
  EmpresaId: number;
  clientesIds: number[];
  observaciones?: string;
  diasCobro?: string[];
}

// Componente principal
const RutasCobroManage: React.FC = () => {
  // Estados
  const [rutas, setRutas] = useState<Ruta[]>([]);
  const [clientes, setClientes] = useState<ClienteInternet[]>([]);
  const [cobradores, setCobradores] = useState<Usuario[]>([]);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [selectedClientes, setSelectedClientes] = useState<number[]>([]);
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
  const [sortBy, setSortBy] = useState<"nombre" | "saldo">("nombre");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Estado para el formulario de creación de ruta
  const [nuevaRuta, setNuevaRuta] = useState<CreateRutaDto>({
    nombreRuta: "",
    EmpresaId: 0,
    clientesIds: [],
    diasCobro: [],
  });

  // Días de la semana para selección
  const diasSemana = [
    { id: "LUNES", label: "Lunes" },
    { id: "MARTES", label: "Martes" },
    { id: "MIERCOLES", label: "Miércoles" },
    { id: "JUEVES", label: "Jueves" },
    { id: "VIERNES", label: "Viernes" },
    { id: "SABADO", label: "Sábado" },
    { id: "DOMINGO", label: "Domingo" },
  ];

  // Cargar datos iniciales
  useEffect(() => {
    fetchRutas();
    fetchClientes();
    fetchCobradores();
    fetchEmpresas();
  }, []);

  // Función para cargar rutas
  const fetchRutas = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // En un entorno real, esto sería una llamada a la API
      // const response = await axios.get('/api/rutas-cobro')
      // setRutas(response.data)

      // Mock data para demostración
      setTimeout(() => {
        const mockRutas: Ruta[] = [
          {
            id: 1,
            nombreRuta: "Ruta Centro Huehuetenango",
            cobradorId: 1,
            cobrador: {
              id: 1,
              nombre: "Carlos",
              apellidos: "Rodríguez",
              email: "carlos@example.com",
              rol: "COBRADOR",
            },
            empresaId: 1,
            empresa: {
              id: 1,
              nombre: "InternetPro S.A.",
            },
            clientes: [
              {
                id: 1,
                nombre: "Juan",
                apellidos: "Pérez",
                telefono: "5555-1234",
                direccion: "Zona 1, Calle Principal",
                estadoCliente: EstadoCliente.ACTIVO,
                saldoPendiente: 250,
              },
              {
                id: 2,
                nombre: "María",
                apellidos: "López",
                telefono: "5555-5678",
                direccion: "Zona 2, Avenida Central",
                estadoCliente: EstadoCliente.ACTIVO,
                saldoPendiente: 300,
              },
            ],
            cobrados: 1,
            montoCobrado: 250,
            estadoRuta: EstadoRuta.ACTIVO,
            fechaCreacion: "2025-03-15T10:30:00.000Z",
            fechaActualizacion: "2025-03-18T14:20:00.000Z",
            observaciones: "Cobrar preferentemente en horario de mañana",
            diasCobro: ["LUNES", "MIERCOLES", "VIERNES"],
          },
          {
            id: 2,
            nombreRuta: "Ruta Norte Huehuetenango",
            cobradorId: 2,
            cobrador: {
              id: 2,
              nombre: "María",
              apellidos: "González",
              email: "maria@example.com",
              rol: "COBRADOR",
            },
            empresaId: 1,
            empresa: {
              id: 1,
              nombre: "InternetPro S.A.",
            },
            clientes: [
              {
                id: 3,
                nombre: "Roberto",
                apellidos: "Gómez",
                telefono: "5555-9012",
                direccion: "Zona 3, Calle 5",
                estadoCliente: EstadoCliente.MOROSO,
                saldoPendiente: 500,
              },
              {
                id: 4,
                nombre: "Ana",
                apellidos: "Martínez",
                telefono: "5555-3456",
                direccion: "Zona 3, Avenida 2",
                estadoCliente: EstadoCliente.ACTIVO,
                saldoPendiente: 250,
              },
              {
                id: 5,
                nombre: "Pedro",
                apellidos: "Sánchez",
                telefono: "5555-7890",
                direccion: "Zona 4, Calle 10",
                estadoCliente: EstadoCliente.ACTIVO,
                saldoPendiente: 250,
              },
            ],
            cobrados: 0,
            montoCobrado: 0,
            estadoRuta: EstadoRuta.PENDIENTE,
            fechaCreacion: "2025-03-16T09:15:00.000Z",
            fechaActualizacion: "2025-03-16T09:15:00.000Z",
            diasCobro: ["MARTES", "JUEVES", "SABADO"],
          },
          {
            id: 3,
            nombreRuta: "Ruta Sur Huehuetenango",
            cobradorId: 1,
            cobrador: {
              id: 1,
              nombre: "Carlos",
              apellidos: "Rodríguez",
              email: "carlos@example.com",
              rol: "COBRADOR",
            },
            empresaId: 1,
            empresa: {
              id: 1,
              nombre: "InternetPro S.A.",
            },
            clientes: [
              {
                id: 6,
                nombre: "Laura",
                apellidos: "Díaz",
                telefono: "5555-2345",
                direccion: "Zona 5, Calle 3",
                estadoCliente: EstadoCliente.ACTIVO,
                saldoPendiente: 250,
              },
              {
                id: 7,
                nombre: "Miguel",
                apellidos: "Hernández",
                telefono: "5555-6789",
                direccion: "Zona 5, Avenida 8",
                estadoCliente: EstadoCliente.SUSPENDIDO,
                saldoPendiente: 750,
              },
            ],
            cobrados: 2,
            montoCobrado: 1000,
            estadoRuta: EstadoRuta.COMPLETADO,
            fechaCreacion: "2025-03-10T11:45:00.000Z",
            fechaActualizacion: "2025-03-17T16:30:00.000Z",
            observaciones: "Ruta completada satisfactoriamente",
            diasCobro: ["LUNES", "JUEVES"],
          },
        ];

        setRutas(mockRutas);
        setIsLoading(false);
      }, 800);
    } catch (err) {
      console.error("Error al cargar rutas:", err);
      setError("Error al cargar las rutas de cobro. Intente nuevamente.");
      setIsLoading(false);
    }
  };

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
      // const response = await axios.get('/api/usuarios/cobradores')
      // setCobradores(response.data)

      // Mock data para demostración
      const mockCobradores: Usuario[] = [
        {
          id: 1,
          nombre: "Carlos",
          apellidos: "Rodríguez",
          email: "carlos@example.com",
          telefono: "5555-1111",
          rol: "COBRADOR",
        },
        {
          id: 2,
          nombre: "María",
          apellidos: "González",
          email: "maria@example.com",
          telefono: "5555-2222",
          rol: "COBRADOR",
        },
        {
          id: 3,
          nombre: "Roberto",
          apellidos: "Méndez",
          email: "roberto@example.com",
          telefono: "5555-3333",
          rol: "COBRADOR",
        },
      ];

      setCobradores(mockCobradores);
    } catch (err) {
      console.error("Error al cargar cobradores:", err);
    }
  };

  // Función para cargar empresas
  const fetchEmpresas = async () => {
    try {
      // En un entorno real, esto sería una llamada a la API
      // const response = await axios.get('/api/empresas')
      // setEmpresas(response.data)

      // Mock data para demostración
      const mockEmpresas: Empresa[] = [
        {
          id: 1,
          nombre: "InternetPro S.A.",
        },
        {
          id: 2,
          nombre: "Conexiones Rápidas",
        },
      ];

      setEmpresas(mockEmpresas);

      // Establecer la primera empresa como predeterminada
      if (mockEmpresas.length > 0) {
        setNuevaRuta((prev) => ({
          ...prev,
          EmpresaId: mockEmpresas[0].id,
        }));
      }
    } catch (err) {
      console.error("Error al cargar empresas:", err);
    }
  };

  // Handlers para formulario
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setNuevaRuta((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setNuevaRuta((prev) => ({
      ...prev,
      [name]:
        name === "EmpresaId" || name === "cobradorId"
          ? Number.parseInt(value)
          : value,
    }));
  };

  const handleDiaCobroChange = (dia: string, checked: boolean) => {
    if (checked) {
      setNuevaRuta((prev) => ({
        ...prev,
        diasCobro: [...(prev.diasCobro || []), dia],
      }));
    } else {
      setNuevaRuta((prev) => ({
        ...prev,
        diasCobro: (prev.diasCobro || []).filter((d) => d !== dia),
      }));
    }
  };

  const handleClienteSelect = (clienteId: number, checked: boolean) => {
    if (checked) {
      setSelectedClientes((prev) => [...prev, clienteId]);
    } else {
      setSelectedClientes((prev) => prev.filter((id) => id !== clienteId));
    }
  };

  // Actualizar clientesIds cuando cambia selectedClientes
  useEffect(() => {
    setNuevaRuta((prev) => ({
      ...prev,
      clientesIds: selectedClientes,
    }));
  }, [selectedClientes]);

  // Submit handler
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

      // En un entorno real, esto sería una llamada a la API
      // const response = await axios.post('/api/rutas-cobro', nuevaRuta)

      // Mock para demostración
      setTimeout(() => {
        console.log("Enviando nueva ruta:", nuevaRuta);

        // Crear una nueva ruta con los datos del formulario
        const newRuta: Ruta = {
          id: rutas.length + 1,
          nombreRuta: nuevaRuta.nombreRuta,
          cobradorId: nuevaRuta.cobradorId,
          cobrador: nuevaRuta.cobradorId
            ? cobradores.find((c) => c.id === nuevaRuta.cobradorId)
            : undefined,
          empresaId: nuevaRuta.EmpresaId,
          empresa: empresas.find((e) => e.id === nuevaRuta.EmpresaId) || {
            id: 0,
            nombre: "Desconocida",
          },
          clientes: clientes.filter((c) =>
            nuevaRuta.clientesIds.includes(c.id)
          ),
          cobrados: 0,
          montoCobrado: 0,
          estadoRuta: EstadoRuta.ACTIVO,
          fechaCreacion: new Date().toISOString(),
          fechaActualizacion: new Date().toISOString(),
          observaciones: nuevaRuta.observaciones,
          diasCobro: nuevaRuta.diasCobro,
        };

        setRutas([...rutas, newRuta]);

        // Resetear formulario
        setNuevaRuta({
          nombreRuta: "",
          EmpresaId: empresas.length > 0 ? empresas[0].id : 0,
          clientesIds: [],
          diasCobro: [],
        });
        setSelectedClientes([]);

        setSuccess("Ruta de cobro creada correctamente");
        setIsSubmitting(false);

        // Limpiar mensaje de éxito después de 3 segundos
        setTimeout(() => {
          setSuccess(null);
        }, 3000);
      }, 1000);
    } catch (err: any) {
      console.error("Error al crear ruta:", err);
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
    .sort((a, b) => {
      if (sortBy === "nombre") {
        const nameA = `${a.nombre} ${a.apellidos || ""}`.toLowerCase();
        const nameB = `${b.nombre} ${b.apellidos || ""}`.toLowerCase();
        return sortDirection === "asc"
          ? nameA.localeCompare(nameB)
          : nameB.localeCompare(nameA);
      } else {
        const saldoA = a.saldoPendiente || 0;
        const saldoB = b.saldoPendiente || 0;
        return sortDirection === "asc" ? saldoA - saldoB : saldoB - saldoA;
      }
    });

  // Filtrar rutas según búsqueda\
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

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

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
        <TabsContent value="crear" className="space-y-6">
          <form onSubmit={handleSubmitRuta}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Formulario de datos básicos */}
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
                    <Label htmlFor="empresa">Empresa</Label>
                    <Select
                      onValueChange={(value) =>
                        handleSelectChange("EmpresaId", value)
                      }
                      defaultValue={nuevaRuta.EmpresaId.toString() || undefined}
                    >
                      <SelectTrigger id="empresa">
                        <SelectValue placeholder="Seleccione una empresa" />
                      </SelectTrigger>
                      <SelectContent>
                        {empresas.map((empresa) => (
                          <SelectItem
                            key={empresa.id}
                            value={empresa.id.toString()}
                          >
                            <div className="flex items-center">
                              <Building className="h-4 w-4 mr-2" />
                              {empresa.nombre}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cobrador">Cobrador (Opcional)</Label>
                    <Select
                      onValueChange={(value) =>
                        handleSelectChange("cobradorId", value)
                      }
                      defaultValue={nuevaRuta.cobradorId?.toString()}
                    >
                      <SelectTrigger id="cobrador">
                        <SelectValue placeholder="Seleccione un cobrador" />
                      </SelectTrigger>
                      <SelectContent>
                        {cobradores.map((cobrador) => (
                          <SelectItem
                            key={cobrador.id}
                            value={cobrador.id.toString()}
                          >
                            <div className="flex items-center">
                              <UserCheck className="h-4 w-4 mr-2" />
                              {cobrador.nombre} {cobrador.apellidos || ""}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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

                  <div className="space-y-2">
                    <Label>Días de Cobro (Opcional)</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {diasSemana.map((dia) => (
                        <div
                          key={dia.id}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`dia-${dia.id}`}
                            checked={(nuevaRuta.diasCobro || []).includes(
                              dia.id
                            )}
                            onCheckedChange={(checked) =>
                              handleDiaCobroChange(dia.id, checked === true)
                            }
                          />
                          <Label htmlFor={`dia-${dia.id}`} className="text-sm">
                            {dia.label}
                          </Label>
                        </div>
                      ))}
                    </div>
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
                        Selección de Clientes
                      </CardTitle>
                      <CardDescription>
                        Seleccione los clientes que formarán parte de esta ruta
                        de cobro
                      </CardDescription>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Buscar clientes..."
                          className="pl-8 w-full"
                          value={searchCliente}
                          onChange={(e) => setSearchCliente(e.target.value)}
                        />
                      </div>
                      <Select
                        onValueChange={(value) =>
                          setClienteFilter(value as EstadoCliente | "TODOS")
                        }
                        defaultValue="TODOS"
                      >
                        <SelectTrigger className="w-[140px]">
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
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border overflow-hidden">
                    <div className="overflow-x-auto">
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
                                      cliente.id
                                    )}
                                    onCheckedChange={(checked) =>
                                      handleClienteSelect(
                                        cliente.id,
                                        checked === true
                                      )
                                    }
                                  />
                                </TableCell>
                                <TableCell>
                                  <div className="font-medium">
                                    {cliente.nombre} {cliente.apellidos || ""}
                                  </div>
                                  <div className="text-sm text-muted-foreground md:hidden">
                                    {cliente.telefono}
                                  </div>
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                  <div className="flex items-start gap-1">
                                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                                    <span className="truncate max-w-[200px]">
                                      {cliente.direccion || "No disponible"}
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
                                    {cliente.facturasPendientes || 0} facturas
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      {selectedClientes.length} clientes seleccionados
                    </div>
                    <div className="text-sm font-medium">
                      Total a cobrar: Q
                      {clientes
                        .filter((c) => selectedClientes.includes(c.id))
                        .reduce(
                          (sum, cliente) => sum + (cliente.saldoPendiente || 0),
                          0
                        )
                        .toFixed(2)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </form>
        </TabsContent>

        {/* Tab de Rutas Existentes */}
        <TabsContent value="rutas" className="space-y-6">
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
                          <TableHead>Progreso</TableHead>
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
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <div className="w-full max-w-[100px] bg-muted rounded-full h-2.5">
                                    <div
                                      className="bg-primary h-2.5 rounded-full"
                                      style={{
                                        width: `${
                                          ruta.clientes.length > 0
                                            ? (ruta.cobrados /
                                                ruta.clientes.length) *
                                              100
                                            : 0
                                        }%`,
                                      }}
                                    ></div>
                                  </div>
                                  <span className="text-xs whitespace-nowrap">
                                    {ruta.cobrados}/{ruta.clientes.length}
                                  </span>
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  Q{ruta.montoCobrado.toFixed(2)}
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
                        <Building className="h-4 w-4 text-primary" />
                        <span className="font-medium">
                          {selectedRuta.empresa.nombre}
                        </span>
                      </div>
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

                  {selectedRuta.diasCobro &&
                    selectedRuta.diasCobro.length > 0 && (
                      <>
                        <Separator />

                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">
                            Días de Cobro
                          </h3>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {selectedRuta.diasCobro.map((dia) => (
                              <Badge
                                key={dia}
                                variant="outline"
                                className="flex items-center gap-1"
                              >
                                <CalendarRange className="h-3 w-3" />
                                {diasSemana.find((d) => d.id === dia)?.label ||
                                  dia}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </>
                    )}

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
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-muted-foreground">
                        Clientes en la Ruta
                      </h3>
                      <span className="text-xs font-medium">
                        {selectedRuta.cobrados} de{" "}
                        {selectedRuta.clientes.length} cobrados
                      </span>
                    </div>

                    <div className="mt-2">
                      <div className="w-full bg-muted rounded-full h-2.5 mb-4">
                        <div
                          className="bg-primary h-2.5 rounded-full"
                          style={{
                            width: `${
                              selectedRuta.clientes.length > 0
                                ? (selectedRuta.cobrados /
                                    selectedRuta.clientes.length) *
                                  100
                                : 0
                            }%`,
                          }}
                        ></div>
                      </div>

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
