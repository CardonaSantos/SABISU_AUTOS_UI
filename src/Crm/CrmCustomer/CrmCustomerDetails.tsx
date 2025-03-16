"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Phone,
  MapPin,
  FileText,
  MessageSquare,
  // Users,
  Wifi,
  Calendar,
  Building,
  Map,
  Clock,
  Tag,
  Ticket,
  CreditCard,
  Package,
  ChevronRight,
  ExternalLink,
  Navigation,
  AlertCircle,
  CheckCircle,
  Clock3,
  Wallet,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
const VITE_CRM_API_URL = import.meta.env.VITE_CRM_API_URL;
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { ClienteDetailsDto } from "./CustomerDetails";
import currency from "currency.js";

import dayjs from "dayjs";
import "dayjs/locale/es";
import utc from "dayjs/plugin/utc";
import localizedFormat from "dayjs/plugin/localizedFormat";
// const API_URL = import.meta.env.VITE_API_URL;

dayjs.extend(utc);
dayjs.extend(localizedFormat);
dayjs.locale("es");

const formatearFecha = (fecha: string) => {
  // Formateo en UTC sin conversión a local
  return dayjs(fecha).format("DD/MM/YYYY");
};

const formatearMoneda = (monto: number) => {
  return currency(monto, {
    symbol: "Q",
    separator: ",",
    decimal: ".",
    precision: 2,
  }).format();
};

// const clienteEjemplo = {
//   id: 1,
//   nombre: "Juan",
//   apellidos: "Pérez González",
//   telefono: "+502 5555-1234",
//   direccion: "Zona 10, Ciudad de Guatemala",
//   dpi: "1234567890123",
//   observaciones: "Cliente preferente. Requiere atención prioritaria.",
//   contactoReferenciaNombre: "María López",
//   contactoReferenciaTelefono: "+502 5555-5678",
//   estadoCliente: "ACTIVO",
//   contrasenaWifi: "WiFi123456",
//   ssidRouter: "ROUTER-JUAN",
//   fechaInstalacion: "2023-05-15T10:30:00",
//   asesor: {
//     id: 1,
//     nombre: "Carlos Rodríguez",
//   },
//   servicio: {
//     id: 2,
//     nombre: "Plan Estándar 25Mbps",
//     precio: 299,
//     velocidad: "25Mbps",
//   },
//   municipio: {
//     id: 1,
//     nombre: "Guatemala",
//   },
//   departamento: {
//     id: 1,
//     nombre: "Guatemala",
//   },
//   empresa: {
//     id: 1,
//     nombre: "TelcoNet",
//   },
//   IP: {
//     id: 1,
//     direccion: "192.168.1.100",
//     mascara: "255.255.255.0",
//     gateway: "192.168.1.1",
//   },

//   ubicacion: {
//     id: 1,
//     latitud: 15.66637668322957,
//     longitud: -91.70805410647728,
//   },
//   saldoCliente: {
//     id: 1,
//     saldo: 0,
//     ultimoPago: "2023-10-15T14:30:00",
//   },
//   creadoEn: "2023-01-10T09:15:00",
//   actualizadoEn: "2023-10-15T14:30:00",
//   ticketSoporte: [
//     {
//       id: 101,
//       titulo: "Sin señal de internet",
//       estado: "CERRADA",
//       prioridad: "ALTA",
//       fechaCreacion: "2023-09-05T11:20:00",
//       fechaCierre: "2023-09-05T15:45:00",
//     },
//     {
//       id: 102,
//       titulo: "Velocidad lenta",
//       estado: "ABIERTA",
//       prioridad: "MEDIA",
//       fechaCreacion: "2023-10-12T09:30:00",
//       fechaCierre: null,
//     },
//   ],
//   facturaInternet: [
//     {
//       id: 1001,
//       monto: 299,
//       fechaEmision: "2023-10-01T00:00:00",
//       fechaVencimiento: "2023-10-15T00:00:00",
//       pagada: true,
//     },
//     {
//       id: 1002,
//       monto: 299,
//       fechaEmision: "2023-09-01T00:00:00",
//       fechaVencimiento: "2023-09-15T00:00:00",
//       pagada: true,
//     },
//   ],
//   clienteServicio: [
//     {
//       id: 1,
//       servicio: {
//         id: 101,
//         nombre: "IPTV Básico",
//         tipo: "IPTV",
//       },
//       fechaContratacion: "2023-05-15T10:30:00",
//     },
//   ],
// };

export default function CustomerDetails() {
  // En una aplicación real, aquí cargaríamos los datos del cliente desde una API
  // const cliente = clienteEjemplo;
  const { id } = useParams();

  const [cliente, setCliente] = useState<ClienteDetailsDto>({
    id: 0,
    nombre: "",
    apellidos: "",
    telefono: "",
    direccion: "",
    dpi: "",
    observaciones: "",
    contactoReferenciaNombre: "",
    contactoReferenciaTelefono: "",
    estadoCliente: "",
    contrasenaWifi: "",
    ssidRouter: "",
    fechaInstalacion: "",
    asesor: null,
    servicio: [],
    municipio: {
      id: 1,
      nombre: "",
    },
    departamento: {
      id: 1,
      nombre: "",
    },
    empresa: {
      id: 1,
      nombre: "",
    },
    IP: {
      direccion: "192.168.100.1",
      gateway: "",
      id: 1,
      mascara: "",
    },
    ubicacion: {
      id: 1,
      latitud: 15.667147636975496,
      longitud: -91.71722598563508,
    },
    saldoCliente: null,
    creadoEn: "",
    actualizadoEn: "",
    ticketSoporte: [],
    facturaInternet: [],
    clienteServicio: [],
  });

  const getClienteDetails = async () => {
    try {
      const response = await axios.get(
        `${VITE_CRM_API_URL}/internet-customer/get-customer-details/${Number(
          id
        )}`
      );

      if (response.status === 200) {
        setCliente(response.data);
      }
    } catch (error) {
      console.log(error);
      toast.info("Error al conseguir información sobre el cliente");
    }
  };

  useEffect(() => {
    getClienteDetails();
  }, []);

  // Estado para controlar la pestaña activa
  const [activeTab, setActiveTab] = useState("general");

  // Función para abrir Google Maps con la ubicación
  const abrirGoogleMaps = () => {
    if (cliente.ubicacion) {
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${cliente.ubicacion.latitud},${cliente.ubicacion.longitud}`,
        "_blank"
      );
    }
  };

  // Función para iniciar ruta en Google Maps
  const iniciarRuta = () => {
    if (cliente.ubicacion) {
      window.open(
        `https://www.google.com/maps/dir/?api=1&destination=${cliente.ubicacion.latitud},${cliente.ubicacion.longitud}`,
        "_blank"
      );
    }
  };

  // Función para obtener el color de la insignia según el estado
  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "ACTIVO":
        return "bg-green-100 text-green-800";
      case "INACTIVO":
        return "bg-gray-100 text-gray-800";
      case "SUSPENDIDO":
        return "bg-yellow-100 text-yellow-800";
      case "MOROSO":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Función para obtener el color de la insignia según el estado del ticket
  const getTicketEstadoColor = (estado: string) => {
    switch (estado) {
      case "ABIERTA":
        return "bg-blue-100 text-blue-800";
      case "EN_PROCESO":
        return "bg-yellow-100 text-yellow-800";
      case "PENDIENTE":
        return "bg-orange-100 text-orange-800";
      case "CERRADA":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Función para obtener el color de la insignia según la prioridad del ticket
  const getTicketPrioridadColor = (prioridad: string) => {
    switch (prioridad) {
      case "BAJA":
        return "bg-blue-100 text-blue-800";
      case "MEDIA":
        return "bg-yellow-100 text-yellow-800";
      case "ALTA":
        return "bg-orange-100 text-orange-800";
      case "URGENTE":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Función para obtener el icono según el estado del ticket
  const getTicketEstadoIcon = (estado: string) => {
    switch (estado) {
      case "ABIERTA":
        return <AlertCircle className="h-4 w-4" />;
      case "EN_PROCESO":
        return <Clock3 className="h-4 w-4" />;
      case "PENDIENTE":
        return <Clock className="h-4 w-4" />;
      case "CERRADA":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  console.log("El cliente es: ", cliente);

  return (
    <div className="container mx-auto px-4 py-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              {cliente.nombre} {cliente.apellidos}
            </h1>
            <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
              <span>Cliente #{cliente.id}</span>
              <span>•</span>
              <Badge
                variant="outline"
                className={cn("text-xs", getEstadoColor(cliente.estadoCliente))}
              >
                {cliente.estadoCliente}
              </Badge>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button size="sm" className="h-8">
              <Ticket className="h-4 w-4 mr-1" />
              Nuevo Ticket
            </Button>
          </div>
        </div>

        <Tabs
          defaultValue="general"
          value={activeTab}
          onValueChange={setActiveTab}
          className="lg:space-y-4"
        >
          <TabsList className="grid w-full grid-cols-3 sm:grid-cols-3 md:grid-cols-5 gap-2 mb-7 ">
            <TabsTrigger
              value="general"
              className="text-xs md:text-sm flex items-center justify-center"
            >
              <User className="h-4 w-4 mr-1 sm:inline" />
              <span>General</span>
            </TabsTrigger>
            <TabsTrigger
              value="servicio"
              className="text-xs md:text-sm flex items-center justify-center"
            >
              <Wifi className="h-4 w-4 mr-1 sm:inline" />
              <span>Servicio</span>
            </TabsTrigger>
            <TabsTrigger
              value="ubicacion"
              className="text-xs md:text-sm flex items-center justify-center"
            >
              <Map className="h-4 w-4 mr-1 sm:inline" />
              <span>Ubicación</span>
            </TabsTrigger>
            <TabsTrigger
              value="tickets"
              className="text-xs md:text-sm flex items-center justify-center"
            >
              <Ticket className="h-4 w-4 mr-1 sm:inline" />
              <span>Tickets</span>
            </TabsTrigger>
            <TabsTrigger
              value="facturacion"
              className="text-xs md:text-sm flex items-center justify-center"
            >
              <CreditCard className="h-4 w-4 mr-1 sm:inline" />
              <span>Facturación</span>
            </TabsTrigger>
          </TabsList>

          {/* Pestaña de Información General */}
          <TabsContent value="general" className="space-y-2 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {/* Información Personal y Contacto de Referencia */}
              <Card className="border border-gray-300">
                <CardHeader className="pb-1">
                  <CardTitle className="text-sm flex items-center">
                    <User className="h-3.5 w-3.5 mr-2 text-primary" />
                    Información Personal & Contacto de Referencia
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="grid gap-1">
                    <div className="grid grid-cols-3 items-center">
                      <dt className="font-medium text-muted-foreground flex items-center">
                        <User className="h-3 w-3 mr-1 text-muted-foreground" />
                        Nombre:
                      </dt>
                      <dd className="col-span-2 truncate">
                        {cliente.nombre} {cliente.apellidos}
                      </dd>
                    </div>
                    <div className="grid grid-cols-3 items-center">
                      <dt className="font-medium text-muted-foreground flex items-center">
                        <Phone className="h-3 w-3 mr-1 text-muted-foreground" />
                        Teléfono:
                      </dt>
                      <dd className="col-span-2 truncate">
                        {cliente.telefono || "No especificado"}
                      </dd>
                    </div>
                    <div className="grid grid-cols-3 items-center">
                      <dt className="font-medium text-muted-foreground flex items-center">
                        <MapPin className="h-3 w-3 mr-1 text-muted-foreground" />
                        Dirección:
                      </dt>
                      <dd className="col-span-2 truncate">
                        {cliente.direccion || "No especificada"}
                      </dd>
                    </div>
                    <div className="grid grid-cols-3 items-center">
                      <dt className="font-medium text-muted-foreground flex items-center">
                        <FileText className="h-3 w-3 mr-1 text-muted-foreground" />
                        DPI:
                      </dt>
                      <dd className="col-span-2 truncate">
                        {cliente.dpi || "No especificado"}
                      </dd>
                    </div>
                    <div className="grid grid-cols-3 items-center border-t pt-2">
                      <dt className="font-medium text-muted-foreground flex items-center">
                        <User className="h-3 w-3 mr-1 text-muted-foreground" />
                        Contacto Referencia:
                      </dt>
                      <dd className="col-span-2 truncate">
                        {cliente.contactoReferenciaNombre || "No especificado"}
                      </dd>
                    </div>
                    <div className="grid grid-cols-3 items-center">
                      <dt className="font-medium text-muted-foreground flex items-center">
                        <Phone className="h-3 w-3 mr-1 text-muted-foreground" />
                        Teléfono Referencia:
                      </dt>
                      <dd className="col-span-2 truncate">
                        {cliente.contactoReferenciaTelefono ||
                          "No especificado"}
                      </dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>

              {/* Empresa, Ubicación, Observaciones y Sistema */}
              <Card className="border border-gray-300">
                <CardHeader className="pb-1">
                  <CardTitle className="text-sm flex items-center">
                    <Building className="h-3.5 w-3.5 mr-2 text-primary" />
                    Empresa, Ubicación & Sistema
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="grid gap-1">
                    <div className="grid grid-cols-3 items-center">
                      <dt className="font-medium text-muted-foreground flex items-center">
                        <Building className="h-3 w-3 mr-1 text-muted-foreground" />
                        Empresa:
                      </dt>
                      <dd className="col-span-2 truncate">
                        {cliente.empresa?.nombre || "No especificada"}
                      </dd>
                    </div>
                    <div className="grid grid-cols-3 items-center">
                      <dt className="font-medium text-muted-foreground flex items-center">
                        <MapPin className="h-3 w-3 mr-1 text-muted-foreground" />
                        Municipio:
                      </dt>
                      <dd className="col-span-2 truncate">
                        {cliente.municipio?.nombre || "No especificado"}
                      </dd>
                    </div>
                    <div className="grid grid-cols-3 items-center">
                      <dt className="font-medium text-muted-foreground flex items-center">
                        <Map className="h-3 w-3 mr-1 text-muted-foreground" />
                        Departamento:
                      </dt>
                      <dd className="col-span-2 truncate">
                        {cliente.departamento?.nombre || "No especificado"}
                      </dd>
                    </div>
                    <div className="grid grid-cols-3 items-center border-t pt-2">
                      <dt className="font-medium text-muted-foreground flex items-center">
                        <MessageSquare className="h-3 w-3 mr-1 text-muted-foreground" />
                        Observaciones:
                      </dt>
                      <dd className="col-span-2 truncate">
                        {cliente.observaciones ||
                          "No hay observaciones registradas."}
                      </dd>
                    </div>
                    <div className="grid grid-cols-3 items-center border-t pt-2">
                      <dt className="font-medium text-muted-foreground flex items-center">
                        <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />
                        Creado:
                      </dt>
                      <dd className="col-span-2 truncate">
                        {cliente.creadoEn
                          ? format(new Date(cliente.creadoEn), "PPP", {
                              locale: es,
                            })
                          : "No disponible"}
                      </dd>
                    </div>
                    <div className="grid grid-cols-3 items-center">
                      <dt className="font-medium text-muted-foreground flex items-center">
                        <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />
                        Actualizado:
                      </dt>
                      <dd className="col-span-2 truncate">
                        {cliente.actualizadoEn
                          ? format(new Date(cliente.actualizadoEn), "PPP", {
                              locale: es,
                            })
                          : "No disponible"}
                      </dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Pestaña de Servicio */}
          <TabsContent value="servicio" className="space-y-2 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {/* Servicio de Internet & Configuración WiFi */}
              <Card className="border border-gray-300">
                <CardHeader className="pb-1">
                  <CardTitle className="text-sm flex items-center">
                    <Wifi className="h-3.5 w-3.5 mr-2 text-primary" />
                    Servicio de Internet & Configuración WiFi
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="grid gap-1">
                    <div className="grid grid-cols-3 items-center">
                      <dt className="font-medium text-muted-foreground flex items-center">
                        <Package className="h-3 w-3 mr-1 text-muted-foreground" />
                        Plan:
                      </dt>
                      <dd className="col-span-2 truncate">
                        {cliente.servicio
                          ?.map((servicio) => servicio.nombre)
                          .join(", ") || "Sin servicios"}
                      </dd>
                    </div>
                    <div className="grid grid-cols-3 items-center">
                      <dt className="font-medium text-muted-foreground flex items-center">
                        <Wifi className="h-3 w-3 mr-1 text-muted-foreground" />
                        Velocidad:
                      </dt>
                      <dd className="col-span-2 truncate">
                        {cliente.servicio
                          ?.map((servicio) => servicio.velocidad)
                          .join(", ") || "No especificada"}
                      </dd>
                    </div>
                    <div className="grid grid-cols-3 items-center">
                      <dt className="font-medium text-muted-foreground flex items-center">
                        <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />
                        Instalación:
                      </dt>
                      <dd className="col-span-2 truncate">
                        {cliente.fechaInstalacion
                          ? format(new Date(cliente.fechaInstalacion), "PPP", {
                              locale: es,
                            })
                          : "No especificada"}
                      </dd>
                    </div>
                    <div className="grid grid-cols-3 items-center border-t pt-2">
                      <dt className="font-medium text-muted-foreground flex items-center">
                        <User className="h-3 w-3 mr-1 text-muted-foreground" />
                        Asesor:
                      </dt>
                      <dd className="col-span-2 truncate">
                        {cliente.asesor?.nombre || "No asignado"}
                      </dd>
                    </div>
                    <div className="grid grid-cols-3 items-center border-t pt-2">
                      <dt className="font-medium text-muted-foreground flex items-center">
                        <Tag className="h-3 w-3 mr-1 text-muted-foreground" />
                        SSID:
                      </dt>
                      <dd className="col-span-2 truncate">
                        {cliente.ssidRouter || "No especificado"}
                      </dd>
                    </div>
                    <div className="grid grid-cols-3 items-center">
                      <dt className="font-medium text-muted-foreground flex items-center">
                        <FileText className="h-3 w-3 mr-1 text-muted-foreground" />
                        Contraseña:
                      </dt>
                      <dd className="col-span-2 truncate">
                        {cliente.contrasenaWifi || "No especificada"}
                      </dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>

              {/* Configuración IP */}
              <Card className="border border-gray-300">
                <CardHeader className="pb-1">
                  <CardTitle className="text-sm flex items-center">
                    <FileText className="h-3.5 w-3.5 mr-2 text-primary" />
                    Configuración IP
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {cliente.IP ? (
                    <dl className="grid gap-1">
                      <div className="grid grid-cols-3 items-center">
                        <dt className="font-medium text-muted-foreground flex items-center">
                          <FileText className="h-3 w-3 mr-1 text-muted-foreground" />
                          Dirección IP:
                        </dt>
                        <dd className="col-span-2 truncate">
                          {cliente.IP.direccion}
                        </dd>
                      </div>
                      <div className="grid grid-cols-3 items-center">
                        <dt className="font-medium text-muted-foreground flex items-center">
                          <FileText className="h-3 w-3 mr-1 text-muted-foreground" />
                          Máscara:
                        </dt>
                        <dd className="col-span-2 truncate">
                          {cliente.IP.mascara}
                        </dd>
                      </div>
                      <div className="grid grid-cols-3 items-center">
                        <dt className="font-medium text-muted-foreground flex items-center">
                          <FileText className="h-3 w-3 mr-1 text-muted-foreground" />
                          Gateway:
                        </dt>
                        <dd className="col-span-2 truncate">
                          {cliente.IP.gateway}
                        </dd>
                      </div>
                    </dl>
                  ) : (
                    <p>No hay configuración IP asignada.</p>
                  )}
                </CardContent>
              </Card>

              {/* Servicios Adicionales */}
              <Card className="border border-gray-300 md:col-span-2">
                <CardHeader className="pb-1">
                  <CardTitle className="text-sm flex items-center">
                    <Package className="h-3.5 w-3.5 mr-2 text-primary" />
                    Servicios Adicionales
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {cliente.clienteServicio &&
                  cliente.clienteServicio.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Servicio</TableHead>
                          <TableHead>Precio</TableHead>
                          <TableHead>Fecha Contratación</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {cliente.clienteServicio.map((servicio) => (
                          <TableRow className="text-[12px]" key={servicio.id}>
                            <TableCell>{servicio.servicio.nombre}</TableCell>
                            <TableCell>
                              {formatearMoneda(servicio.servicio.precio)}
                            </TableCell>
                            <TableCell>
                              {format(
                                new Date(servicio.fechaContratacion),
                                "PPP",
                                { locale: es }
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <p>No hay servicios adicionales contratados.</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Pestaña de Ubicación */}
          <TabsContent value="ubicacion" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center">
                  <Map className="h-4 w-4 mr-2 text-primary" />
                  Ubicación del Cliente
                </CardTitle>
                <CardDescription>
                  {cliente.direccion || "Dirección no especificada"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {cliente.ubicacion ? (
                  <div className="space-y-4">
                    <div className="aspect-video w-full rounded-md overflow-hidden border">
                      {/* Aquí iría el componente de Google Maps */}
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <iframe
                          src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyD_hzrV-YS5EaHDm-UK3jL0ny6gsJoj_18&q=${cliente.ubicacion.latitud},${cliente.ubicacion.longitud}`}
                          width="100%"
                          height="100%"
                          style={{ border: 0 }}
                          allowFullScreen
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                          title="Ubicación del cliente"
                        ></iframe>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Button
                        onClick={abrirGoogleMaps}
                        className="flex-1 sm:flex-none"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Ver en Maps
                      </Button>
                      <Button
                        onClick={iniciarRuta}
                        variant="outline"
                        className="flex-1 sm:flex-none"
                      >
                        <Navigation className="h-4 w-4 mr-2" />
                        Iniciar Ruta
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-medium text-muted-foreground">
                          Latitud
                        </p>
                        <p>{cliente.ubicacion.latitud}</p>
                      </div>
                      <div>
                        <p className="font-medium text-muted-foreground">
                          Longitud
                        </p>
                        <p>{cliente.ubicacion.longitud}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Map className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
                    <p className="mt-2 text-muted-foreground">
                      No hay información de ubicación disponible.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pestaña de Tickets */}
          <TabsContent value="tickets" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center">
                    <Ticket className="h-4 w-4 mr-2 text-primary" />
                    Tickets de Soporte
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                {cliente.ticketSoporte && cliente.ticketSoporte.length > 0 ? (
                  <ScrollArea className="h-[400px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Título</TableHead>
                          <TableHead>Estado</TableHead>
                          <TableHead>Prioridad</TableHead>
                          <TableHead>Fecha</TableHead>
                          <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {cliente.ticketSoporte.map((ticket) => (
                          <TableRow key={ticket.id}>
                            <TableCell className="font-medium">
                              #{ticket.id}
                            </TableCell>
                            <TableCell>{ticket.titulo}</TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={cn(
                                  "flex items-center w-fit gap-1",
                                  getTicketEstadoColor(ticket.estado)
                                )}
                              >
                                {getTicketEstadoIcon(ticket.estado)}
                                {ticket.estado}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={cn(
                                  getTicketPrioridadColor(ticket.prioridad)
                                )}
                              >
                                {ticket.prioridad}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {format(
                                new Date(ticket.fechaCreacion),
                                "dd/MM/yyyy",
                                { locale: es }
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                              >
                                <ChevronRight className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                ) : (
                  <div className="text-center py-8">
                    <Ticket className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
                    <p className="mt-2 text-muted-foreground">
                      No hay tickets de soporte registrados.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pestaña de Facturación */}
          <TabsContent value="facturacion" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center">
                    <Wallet className="h-4 w-4 mr-2 text-primary" />
                    Saldo del Cliente
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                  {cliente.saldoCliente ? (
                    <dl className="grid grid-cols-1 gap-2">
                      <div className="grid grid-cols-3 items-start">
                        <dt className="font-medium text-muted-foreground flex items-center">
                          <CreditCard className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                          Saldo actual:
                        </dt>
                        <dd className="col-span-2">
                          <span
                            className={
                              cliente.saldoCliente.saldo > 0
                                ? "text-red-600"
                                : "text-green-600"
                            }
                          >
                            Q{cliente.saldoCliente.saldo.toFixed(2)}
                          </span>
                        </dd>
                      </div>

                      <div className="grid grid-cols-3 items-start">
                        <dt className="font-medium text-muted-foreground flex items-center">
                          <Calendar className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                          Último pago:
                        </dt>
                        <dd className="col-span-2">
                          {cliente.saldoCliente.ultimoPago
                            ? format(
                                new Date(cliente.saldoCliente.ultimoPago),
                                "PPP",
                                { locale: es }
                              )
                            : "No hay pagos registrados"}
                        </dd>
                      </div>
                    </dl>
                  ) : (
                    <p>No hay información de saldo disponible.</p>
                  )}
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center">
                    <CreditCard className="h-4 w-4 mr-2 text-primary" />
                    Facturas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {cliente.facturaInternet &&
                  cliente.facturaInternet.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Fecha Emisión</TableHead>
                          <TableHead>Fecha de Pago</TableHead>
                          <TableHead>Monto</TableHead>
                          <TableHead>Estado</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {cliente.facturaInternet.map((factura) => (
                          <TableRow key={factura.id}>
                            <TableCell className="font-medium">
                              #{factura.id}
                            </TableCell>
                            <TableCell>
                              {formatearFecha(factura.fechaEmision)}
                            </TableCell>
                            <TableCell>
                              {formatearFecha(factura.fechaVencimiento)}
                            </TableCell>
                            <TableCell>
                              {formatearMoneda(factura.monto)}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={
                                  factura.pagada
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }
                              >
                                {factura.pagada ? "Pagada" : "Pendiente"}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-8">
                      <CreditCard className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
                      <p className="mt-2 text-muted-foreground">
                        No hay facturas registradas.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
