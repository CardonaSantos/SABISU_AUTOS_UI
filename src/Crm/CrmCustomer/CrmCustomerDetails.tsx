"use client";

import React, { useEffect, useState } from "react";
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
  MoreHorizontal,
  UserCog,
  LandPlot,
  FilePenLine,
  FilePlus,
  Printer,
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
import axios, { AxiosResponse } from "axios";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";
import { ClienteDetailsDto } from "./CustomerDetails";
import currency from "currency.js";

import dayjs from "dayjs";
import "dayjs/locale/es";
import utc from "dayjs/plugin/utc";
import localizedFormat from "dayjs/plugin/localizedFormat";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  // DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import FacturaGenerateDialog from "./Factura/FacturaGenerateDialog";
import GenerateFacturas from "./Factura/GenerateFacturas";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import timezone from "dayjs/plugin/timezone";
import { HistorialPagos } from "./HistorialPagos";
dayjs.extend(utc);
dayjs.extend(localizedFormat);
dayjs.locale("es");
dayjs.extend(timezone);
const formatearFecha = (fecha: string) => {
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
interface PlantillasInterface {
  id: number;
  nombre: string;
  body: string;
  empresaId: number;
  creadoEn: string;
  actualizadoEn: string;
}

export default function CustomerDetails() {
  const [plantillas, setPlantillas] = useState<PlantillasInterface[]>([]);

  const { id } = useParams();
  const [cliente, setCliente] = useState<ClienteDetailsDto>({
    id: 0,
    sector: {
      id: 1,
      nombre: "",
    },
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
    servicio: null, // Relación 1:1 con un solo servicio
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
    contratoServicioInternet: null,
  });

  // AJUSTAR EL SERVICIO DE GENERAR UNA FACTURA, QUE LA FECHA DE VENCIMIENTO, COINCIDA CON EL MES ASIGNADO, Y CREAREMOS OTROS

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

  const getPlantillas = async () => {
    try {
      const response = await axios.get(
        `${VITE_CRM_API_URL}/contrato-cliente/plantillas-contrato`
      );
      if (response.status === 200) {
        setPlantillas(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getClienteDetails();
    getPlantillas();
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
  const [openGenerarFactura, setOpenGenerarFactura] = useState(false);

  const [openGenerateFacturas, setOpenGenerateFacturas] = useState(false);
  //
  interface FacturaToDeleter {
    id: number;
    estado: string;
    fechaEmision: string;
    fechaVencimiento: string;
  }
  const [openDeleteFactura, setOpenDeleteFactura] = useState(false);
  const [facturaAction, setFacturaAction] = useState<FacturaToDeleter | null>(
    null
  );

  interface Contrato {
    clienteId: number;
    fechaInstalacionProgramada: string;
    costoInstalacion: number;
    fechaPago: string;
    observaciones: string;
    ssid: string;
    wifiPassword: string;
  }

  const [openCreateContrato, setOpenCreateContrato] = useState(false);
  const [dataContrato, setDataContrato] = useState<Contrato>({
    clienteId: id ? Number(id) : 0,
    fechaInstalacionProgramada: "",
    costoInstalacion: 0,
    fechaPago: "",
    observaciones: "",
    ssid: "",
    wifiPassword: "",
  });

  console.log("el objeto dataContrato es: ", dataContrato);

  const handleInputChangeContrato = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;

    let newValue: any;

    if (name === "fechaPago" || name === "fechaInstalacionProgramada") {
      newValue = dayjs(value).tz("America/Guatemala").format();
      console.log("Fecha de pago:", newValue);
    } else {
      newValue = value;
    }

    setDataContrato((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDeleteFactura = async () => {
    if (!facturaAction) {
      toast.warning("No hay factura seleccionada para eliminar");
      return;
    }

    const { id, estado, fechaEmision, fechaVencimiento } = facturaAction;

    try {
      const response: AxiosResponse = await axios.delete(
        `${VITE_CRM_API_URL}/facturacion/delete-one-factura`,
        {
          data: {
            facturaId: id,
            estadoFactura: estado,
            fechaEmision,
            fechaVencimiento,
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        toast.success("Factura eliminada correctamente");
        getClienteDetails();
        setFacturaAction(null);
        setOpenDeleteFactura(false);
      } else {
        toast.error("No se pudo eliminar la factura");
      }
    } catch (error: any) {
      console.error("Error al eliminar factura:", error);
      toast.error("Ocurrió un error al intentar eliminar la factura");
    }
  };
  console.log("La factura a eliminar es: ", facturaAction);
  const [isLoading, setIsLoading] = useState(false);
  const handleCreateContrato = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (
        !dataContrato.clienteId &&
        dataContrato.costoInstalacion &&
        !dataContrato.fechaPago &&
        !dataContrato.fechaInstalacionProgramada
      ) {
        toast.error("Por favor, completa todos los campos requeridos.");
        return;
      }

      setIsLoading(true);
      const response = await axios.post(
        `${VITE_CRM_API_URL}/contrato-cliente`,
        dataContrato
      );

      if (response.status === 201) {
        toast.success("Contrato creado correctamente");
        setOpenCreateContrato(false);
        getClienteDetails();
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
    setIsLoading(false);
  };

  return (
    <div className="container mx-auto  py-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <User className="h-5 w-5 dark:text-white" />
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
            {cliente.contratoServicioInternet ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8">
                    <FilePenLine className="h-4 w-4 mr-1" />
                    Contrato
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem
                    className="flex items-center gap-2"
                    onClick={() => setOpenCreateContrato(true)}
                  >
                    <FilePenLine className="h-4 w-4" />
                    Editar Contrato
                  </DropdownMenuItem>

                  {plantillas.map((plantilla) => (
                    <DropdownMenuItem asChild key={plantilla.id}>
                      <Link
                        to={`/crm/contrato/${
                          cliente.contratoServicioInternet!.id
                        }/vista?plantilla=${plantilla.id}`}
                        className="flex items-center gap-2 w-full"
                      >
                        <Printer className="h-4 w-4" />
                        Imprimir: {plantilla.nombre}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="h-8"
                onClick={() => setOpenCreateContrato(true)}
              >
                <FilePlus className="h-4 w-4 mr-1" />
                Generar Contrato
              </Button>
            )}

            <Link to={`/crm/tickets`}>
              <Button variant="outline" size="sm" className="h-8">
                <Ticket className="h-4 w-4 mr-1" />
                Nuevo Ticket
              </Button>
            </Link>

            <Link to={`/crm/cliente-edicion/${cliente.id}`}>
              <Button variant="outline" size="sm" className="h-8">
                <UserCog className="h-4 w-4 mr-1" />
                Editar
              </Button>
            </Link>
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
                    <User className="h-3.5 w-3.5 mr-2 dark:text-white" />
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
                      <dd className="col-span-2 ">
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
                    <Building className="h-3.5 w-3.5 mr-2 text-primary dark:text-white" />
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
                        <LandPlot className="h-3 w-3 mr-1 text-muted-foreground" />
                        Sector:
                      </dt>
                      <dd className="col-span-2 truncate">
                        {cliente.sector?.nombre || "No especificado"}
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
                      <dd className="col-span-2 ">
                        {cliente.observaciones ||
                          "No hay observaciones registradas."}
                      </dd>
                    </div>

                    <div className="grid grid-cols-3 items-center">
                      <dt className="font-medium text-muted-foreground flex items-center">
                        <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />
                        Fecha Instalación:
                      </dt>
                      <dd className="col-span-2 truncate">
                        {cliente.fechaInstalacion
                          ? format(new Date(cliente.fechaInstalacion), "PPP", {
                              locale: es,
                            })
                          : "No disponible"}
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
              {/* Mostrar el servicio de internet */}
              <Card className="border border-gray-300">
                <CardHeader className="pb-1">
                  <CardTitle className="text-sm flex items-center">
                    <Wifi className="h-3.5 w-3.5 mr-2 text-primary" />
                    Servicio de Internet
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
                        {cliente.servicio?.nombre || "No asignado"}
                      </dd>
                    </div>
                    <div className="grid grid-cols-3 items-center">
                      <dt className="font-medium text-muted-foreground flex items-center">
                        <Wifi className="h-3 w-3 mr-1 text-muted-foreground" />
                        Velocidad:
                      </dt>
                      <dd className="col-span-2 truncate">
                        {cliente.servicio?.velocidad || "No especificada"}
                      </dd>
                    </div>
                    <div className="grid grid-cols-3 items-center">
                      <dt className="font-medium text-muted-foreground flex items-center">
                        <Tag className="h-3 w-3 mr-1 text-muted-foreground" />
                        Precio:
                      </dt>
                      <dd className="col-span-2 truncate">
                        {cliente.servicio?.precio || "No especificado"}
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
                  Dirección: {cliente.direccion || "Dirección no especificada"}
                </CardDescription>

                <CardDescription>
                  Sector: {cliente.sector?.nombre || "Sector no especificada"}
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
                          <TableHead>Fecha Apertura</TableHead>
                          <TableHead>Fecha Cierre</TableHead>

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
                              {formatearFecha(ticket.fechaCreacion)}
                            </TableCell>

                            <TableCell>
                              {ticket.fechaCierre
                                ? formatearFecha(ticket.fechaCierre)
                                : "Sin cerrar"}
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
            <div className="flex flex-col md:flex-row gap-1">
              {/* Tarjeta de Saldo del Cliente */}
              <Card className="h-fit max-w-[320px] w-full shadow-sm">
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                  <CardTitle className="text-sm flex items-center">
                    <Wallet className="h-4 w-4 mr-2 dark:text-white" />
                    <p className="text-sm font-normal">Saldo del Cliente</p>
                  </CardTitle>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Abrir menú</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuGroup>
                        <DropdownMenuItem
                          onClick={() => setOpenGenerarFactura(true)}
                        >
                          Generar factura individual
                        </DropdownMenuItem>
                      </DropdownMenuGroup>

                      <DropdownMenuSeparator />

                      <DropdownMenuGroup>
                        <DropdownMenuItem
                          onClick={() => setOpenGenerateFacturas(true)}
                        >
                          Generar múltiples facturas
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardHeader>

                <CardContent className="text-sm">
                  {cliente.saldoCliente ? (
                    <dl className="grid grid-cols-1 gap-4">
                      {/* Actual */}
                      <div className="grid grid-cols-3 items-start">
                        <dt className="font-medium text-muted-foreground flex items-center">
                          <CreditCard className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                          Actual:
                        </dt>
                        <dd className="col-span-2">
                          <span className={"text-green-600 font-semibold"}>
                            {formatearMoneda(cliente.saldoCliente.saldo)}
                          </span>
                        </dd>
                      </div>

                      {/* Pendiente */}
                      <div className="grid grid-cols-3 items-start">
                        <dt className="font-medium text-muted-foreground flex items-center">
                          <CreditCard className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                          Pendiente:
                        </dt>
                        <dd className="col-span-2">
                          <span className={"text-red-600 font-semibold"}>
                            {formatearMoneda(
                              cliente.saldoCliente.saldoPendiente
                            )}
                          </span>
                        </dd>
                      </div>

                      {/* Total */}
                      <div className="grid grid-cols-3 items-start">
                        <dt className="font-medium text-muted-foreground flex items-center">
                          <CreditCard className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                          Total:
                        </dt>
                        <dd className="col-span-2">
                          <span className="text-green-600 font-semibold">
                            {formatearMoneda(cliente.saldoCliente.totalPagos)}
                          </span>
                        </dd>
                      </div>

                      {/* Último pago */}
                      <div className="grid grid-cols-3 items-start">
                        <dt className="font-medium text-muted-foreground flex items-center">
                          <Calendar className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                          Último pago:
                        </dt>
                        <dd className="col-span-2">
                          {cliente.saldoCliente.ultimoPago
                            ? formatearFecha(cliente.saldoCliente.ultimoPago)
                            : "No hay pagos registrados"}
                        </dd>
                      </div>
                    </dl>
                  ) : (
                    <p>No hay información de saldo disponible.</p>
                  )}
                </CardContent>
              </Card>

              {/* Historial de Pagos - Ahora ocupa el espacio restante */}
              <div className="flex-1">
                <HistorialPagos
                  facturas={cliente.facturaInternet}
                  nombreCliente={`${cliente.nombre} ${cliente.apellidos}`}
                  //open dialogs
                  setOpenDeleteFactura={setOpenDeleteFactura}
                  setFacturaAction={setFacturaAction}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* DIALOG PARA GENERAR UNA FACTURA-PASADA-FUTURA */}

      <FacturaGenerateDialog
        openGenerarFactura={openGenerarFactura}
        setOpenGenerarFactura={setOpenGenerarFactura}
        //funcion enviar
        // handleGenerateFactura={handleGenerateFactura}
        clienteId={cliente.id}
        getClienteDetails={getClienteDetails}
      />

      <GenerateFacturas
        openGenerateFacturas={openGenerateFacturas}
        setOpenGenerateFacturas={setOpenGenerateFacturas}
        //
        clienteId={cliente.id}
        getClienteDetails={getClienteDetails}
      />

      <Dialog open={openDeleteFactura} onOpenChange={setOpenDeleteFactura}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-center">
              Confirmar Eliminación
            </DialogTitle>
            <DialogDescription className="text-center">
              ¿Está seguro que desea eliminar esta factura? Esta acción no se
              puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Advertencia</AlertTitle>
              <AlertDescription>
                El saldo y estado del cliente se verán afectados en función de
                su saldo actual y su relacion con sus facturas.
              </AlertDescription>
            </Alert>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpenDeleteFactura(false)}
              // disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteFactura}
              // disabled={isLoading}
            >
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={openCreateContrato} onOpenChange={setOpenCreateContrato}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-xl">Crear Nuevo Contrato</DialogTitle>
            <DialogDescription>
              Complete la información para generar un nuevo contrato para el
              cliente.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateContrato}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fechaInstalacionProgramada">
                    Fecha de Instalación
                  </Label>
                  <Input
                    id="fechaInstalacionProgramada"
                    name="fechaInstalacionProgramada"
                    type="date"
                    value={dataContrato.fechaInstalacionProgramada}
                    onChange={handleInputChangeContrato}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fechaPago">Fecha de Pago</Label>
                  <Input
                    id="fechaPago"
                    name="fechaPago"
                    type="date"
                    value={dataContrato.fechaPago}
                    onChange={handleInputChangeContrato}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="costoInstalacion">Costo de Instalación</Label>
                <div className="relative">
                  <span className="absolute left-2 top-2.5 text-muted-foreground">
                    $
                  </span>
                  <Input
                    id="costoInstalacion"
                    name="costoInstalacion"
                    type="number"
                    className="pl-6"
                    placeholder="0.00"
                    value={dataContrato.costoInstalacion}
                    onChange={handleInputChangeContrato}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="observaciones">Observaciones</Label>
                <Textarea
                  id="observaciones"
                  name="observaciones"
                  placeholder="Observaciones adicionales sobre el contrato..."
                  rows={3}
                  value={dataContrato.observaciones}
                  onChange={handleInputChangeContrato}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpenCreateContrato(false)}
              >
                Cancelar
              </Button>
              <Button disabled={isLoading} type="submit">
                Crear Contrato
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
