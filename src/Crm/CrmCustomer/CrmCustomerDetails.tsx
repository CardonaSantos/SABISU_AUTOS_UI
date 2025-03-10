"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Phone,
  MapPin,
  FileText,
  MessageSquare,
  Users,
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

// Tipos
// interface ClienteDetalleProps {
//   clienteId: number;
// }

// Datos simulados para el ejemplo
const clienteEjemplo = {
  id: 1,
  nombre: "Juan",
  apellidos: "Pérez González",
  telefono: "+502 5555-1234",
  direccion: "Zona 10, Ciudad de Guatemala",
  dpi: "1234567890123",
  observaciones: "Cliente preferente. Requiere atención prioritaria.",
  contactoReferenciaNombre: "María López",
  contactoReferenciaTelefono: "+502 5555-5678",
  estadoCliente: "ACTIVO",
  contrasenaWifi: "WiFi123456",
  ssidRouter: "ROUTER-JUAN",
  fechaInstalacion: "2023-05-15T10:30:00",
  asesor: {
    id: 1,
    nombre: "Carlos Rodríguez",
  },
  servicio: {
    id: 2,
    nombre: "Plan Estándar 25Mbps",
    precio: 299,
    velocidad: "25Mbps",
  },
  municipio: {
    id: 1,
    nombre: "Guatemala",
  },
  departamento: {
    id: 1,
    nombre: "Guatemala",
  },
  empresa: {
    id: 1,
    nombre: "TelcoNet",
  },
  IP: {
    id: 1,
    direccion: "192.168.1.100",
    mascara: "255.255.255.0",
    gateway: "192.168.1.1",
  },

  ubicacion: {
    id: 1,
    latitud: 14.03974379354681,
    longitud: -90.61328241041647,
  },
  saldoCliente: {
    id: 1,
    saldo: 0,
    ultimoPago: "2023-10-15T14:30:00",
  },
  creadoEn: "2023-01-10T09:15:00",
  actualizadoEn: "2023-10-15T14:30:00",
  ticketSoporte: [
    {
      id: 101,
      titulo: "Sin señal de internet",
      estado: "CERRADA",
      prioridad: "ALTA",
      fechaCreacion: "2023-09-05T11:20:00",
      fechaCierre: "2023-09-05T15:45:00",
    },
    {
      id: 102,
      titulo: "Velocidad lenta",
      estado: "ABIERTA",
      prioridad: "MEDIA",
      fechaCreacion: "2023-10-12T09:30:00",
      fechaCierre: null,
    },
  ],
  facturaInternet: [
    {
      id: 1001,
      monto: 299,
      fechaEmision: "2023-10-01T00:00:00",
      fechaVencimiento: "2023-10-15T00:00:00",
      pagada: true,
    },
    {
      id: 1002,
      monto: 299,
      fechaEmision: "2023-09-01T00:00:00",
      fechaVencimiento: "2023-09-15T00:00:00",
      pagada: true,
    },
  ],
  clienteServicio: [
    {
      id: 1,
      servicio: {
        id: 101,
        nombre: "IPTV Básico",
        tipo: "IPTV",
      },
      fechaContratacion: "2023-05-15T10:30:00",
    },
  ],
};

export default function CustomerDetails() {
  // En una aplicación real, aquí cargaríamos los datos del cliente desde una API
  const cliente = clienteEjemplo;

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
            <Button size="sm" variant="outline" className="h-8">
              <Phone className="h-4 w-4 mr-1" />
              Llamar
            </Button>
            <Button size="sm" variant="outline" className="h-8">
              <MessageSquare className="h-4 w-4 mr-1" />
              Mensaje
            </Button>
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
          className="space-y-4"
        >
          <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
            <TabsTrigger value="general" className="text-xs md:text-sm">
              <User className="h-4 w-4 mr-1 hidden sm:inline" />
              General
            </TabsTrigger>
            <TabsTrigger value="servicio" className="text-xs md:text-sm">
              <Wifi className="h-4 w-4 mr-1 hidden sm:inline" />
              Servicio
            </TabsTrigger>
            <TabsTrigger value="ubicacion" className="text-xs md:text-sm">
              <Map className="h-4 w-4 mr-1 hidden sm:inline" />
              Ubicación
            </TabsTrigger>
            <TabsTrigger value="tickets" className="text-xs md:text-sm">
              <Ticket className="h-4 w-4 mr-1 hidden sm:inline" />
              Tickets
            </TabsTrigger>
            <TabsTrigger value="facturacion" className="text-xs md:text-sm">
              <CreditCard className="h-4 w-4 mr-1 hidden sm:inline" />
              Facturación
            </TabsTrigger>
          </TabsList>

          {/* Pestaña de Información General */}
          <TabsContent value="general" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center">
                    <User className="h-4 w-4 mr-2 text-primary" />
                    Información Personal
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                  <dl className="grid grid-cols-1 gap-2">
                    <div className="grid grid-cols-3 items-start">
                      <dt className="font-medium text-muted-foreground flex items-center">
                        <User className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                        Nombre:
                      </dt>
                      <dd className="col-span-2">
                        {cliente.nombre} {cliente.apellidos}
                      </dd>
                    </div>

                    <div className="grid grid-cols-3 items-start">
                      <dt className="font-medium text-muted-foreground flex items-center">
                        <Phone className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                        Teléfono:
                      </dt>
                      <dd className="col-span-2">
                        {cliente.telefono || "No especificado"}
                      </dd>
                    </div>

                    <div className="grid grid-cols-3 items-start">
                      <dt className="font-medium text-muted-foreground flex items-center">
                        <MapPin className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                        Dirección:
                      </dt>
                      <dd className="col-span-2">
                        {cliente.direccion || "No especificada"}
                      </dd>
                    </div>

                    <div className="grid grid-cols-3 items-start">
                      <dt className="font-medium text-muted-foreground flex items-center">
                        <FileText className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                        DPI:
                      </dt>
                      <dd className="col-span-2">
                        {cliente.dpi || "No especificado"}
                      </dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center">
                    <Users className="h-4 w-4 mr-2 text-primary" />
                    Contacto de Referencia
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                  <dl className="grid grid-cols-1 gap-2">
                    <div className="grid grid-cols-3 items-start">
                      <dt className="font-medium text-muted-foreground flex items-center">
                        <User className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                        Nombre:
                      </dt>
                      <dd className="col-span-2">
                        {cliente.contactoReferenciaNombre || "No especificado"}
                      </dd>
                    </div>

                    <div className="grid grid-cols-3 items-start">
                      <dt className="font-medium text-muted-foreground flex items-center">
                        <Phone className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                        Teléfono:
                      </dt>
                      <dd className="col-span-2">
                        {cliente.contactoReferenciaTelefono ||
                          "No especificado"}
                      </dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center">
                    <MessageSquare className="h-4 w-4 mr-2 text-primary" />
                    Observaciones
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                  <p>
                    {cliente.observaciones ||
                      "No hay observaciones registradas."}
                  </p>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-primary" />
                    Información del Sistema
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                  <dl className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div className="grid grid-cols-3 items-start">
                      <dt className="font-medium text-muted-foreground flex items-center">
                        <Calendar className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                        Creado:
                      </dt>
                      <dd className="col-span-2">
                        {cliente.creadoEn
                          ? format(new Date(cliente.creadoEn), "PPP", {
                              locale: es,
                            })
                          : "No disponible"}
                      </dd>
                    </div>

                    <div className="grid grid-cols-3 items-start">
                      <dt className="font-medium text-muted-foreground flex items-center">
                        <Calendar className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                        Actualizado:
                      </dt>
                      <dd className="col-span-2">
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
          <TabsContent value="servicio" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center">
                    <Wifi className="h-4 w-4 mr-2 text-primary" />
                    Servicio de Internet
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                  <dl className="grid grid-cols-1 gap-2">
                    <div className="grid grid-cols-3 items-start">
                      <dt className="font-medium text-muted-foreground flex items-center">
                        <Package className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                        Plan:
                      </dt>
                      <dd className="col-span-2">
                        {cliente.servicio?.nombre || "No especificado"}
                      </dd>
                    </div>

                    <div className="grid grid-cols-3 items-start">
                      <dt className="font-medium text-muted-foreground flex items-center">
                        <Wifi className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                        Velocidad:
                      </dt>
                      <dd className="col-span-2">
                        {cliente.servicio?.velocidad || "No especificada"}
                      </dd>
                    </div>

                    <div className="grid grid-cols-3 items-start">
                      <dt className="font-medium text-muted-foreground flex items-center">
                        <Calendar className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                        Instalación:
                      </dt>
                      <dd className="col-span-2">
                        {cliente.fechaInstalacion
                          ? format(new Date(cliente.fechaInstalacion), "PPP", {
                              locale: es,
                            })
                          : "No especificada"}
                      </dd>
                    </div>

                    <div className="grid grid-cols-3 items-start">
                      <dt className="font-medium text-muted-foreground flex items-center">
                        <User className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                        Asesor:
                      </dt>
                      <dd className="col-span-2">
                        {cliente.asesor?.nombre || "No asignado"}
                      </dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center">
                    <Wifi className="h-4 w-4 mr-2 text-primary" />
                    Configuración WiFi
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                  <dl className="grid grid-cols-1 gap-2">
                    <div className="grid grid-cols-3 items-start">
                      <dt className="font-medium text-muted-foreground flex items-center">
                        <Tag className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                        SSID:
                      </dt>
                      <dd className="col-span-2">
                        {cliente.ssidRouter || "No especificado"}
                      </dd>
                    </div>

                    <div className="grid grid-cols-3 items-start">
                      <dt className="font-medium text-muted-foreground flex items-center">
                        <FileText className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                        Contraseña:
                      </dt>
                      <dd className="col-span-2">
                        {cliente.contrasenaWifi || "No especificada"}
                      </dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center">
                    <Building className="h-4 w-4 mr-2 text-primary" />
                    Empresa y Ubicación
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                  <dl className="grid grid-cols-1 gap-2">
                    <div className="grid grid-cols-3 items-start">
                      <dt className="font-medium text-muted-foreground flex items-center">
                        <Building className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                        Empresa:
                      </dt>
                      <dd className="col-span-2">
                        {cliente.empresa?.nombre || "No especificada"}
                      </dd>
                    </div>

                    <div className="grid grid-cols-3 items-start">
                      <dt className="font-medium text-muted-foreground flex items-center">
                        <MapPin className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                        Municipio:
                      </dt>
                      <dd className="col-span-2">
                        {cliente.municipio?.nombre || "No especificado"}
                      </dd>
                    </div>

                    <div className="grid grid-cols-3 items-start">
                      <dt className="font-medium text-muted-foreground flex items-center">
                        <Map className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                        Departamento:
                      </dt>
                      <dd className="col-span-2">
                        {cliente.departamento?.nombre || "No especificado"}
                      </dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-primary" />
                    Configuración IP
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                  {cliente.IP ? (
                    <dl className="grid grid-cols-1 gap-2">
                      <div className="grid grid-cols-3 items-start">
                        <dt className="font-medium text-muted-foreground flex items-center">
                          <FileText className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                          Dirección IP:
                        </dt>
                        <dd className="col-span-2">{cliente.IP.direccion}</dd>
                      </div>

                      <div className="grid grid-cols-3 items-start">
                        <dt className="font-medium text-muted-foreground flex items-center">
                          <FileText className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                          Máscara:
                        </dt>
                        <dd className="col-span-2">{cliente.IP.mascara}</dd>
                      </div>

                      <div className="grid grid-cols-3 items-start">
                        <dt className="font-medium text-muted-foreground flex items-center">
                          <FileText className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                          Gateway:
                        </dt>
                        <dd className="col-span-2">{cliente.IP.gateway}</dd>
                      </div>
                    </dl>
                  ) : (
                    <p>No hay configuración IP asignada.</p>
                  )}
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center">
                    <Package className="h-4 w-4 mr-2 text-primary" />
                    Servicios Adicionales
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                  {cliente.clienteServicio &&
                  cliente.clienteServicio.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Servicio</TableHead>
                          <TableHead>Tipo</TableHead>
                          <TableHead>Fecha Contratación</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {cliente.clienteServicio.map((servicio) => (
                          <TableRow key={servicio.id}>
                            <TableCell>{servicio.servicio.nombre}</TableCell>
                            <TableCell>{servicio.servicio.tipo}</TableCell>
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
                          src={`https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${cliente.ubicacion.latitud},${cliente.ubicacion.longitud}`}
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
                  <Button size="sm" className="h-8">
                    <Ticket className="h-4 w-4 mr-1" />
                    Nuevo Ticket
                  </Button>
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
                          <TableHead>Vencimiento</TableHead>
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
                              {format(
                                new Date(factura.fechaEmision),
                                "dd/MM/yyyy",
                                { locale: es }
                              )}
                            </TableCell>
                            <TableCell>
                              {format(
                                new Date(factura.fechaVencimiento),
                                "dd/MM/yyyy",
                                { locale: es }
                              )}
                            </TableCell>
                            <TableCell>Q{factura.monto.toFixed(2)}</TableCell>
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
