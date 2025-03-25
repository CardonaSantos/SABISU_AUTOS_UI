"use client";

import type React from "react";
import { useState, useEffect } from "react";
// import { useRouter, useSearchParams } from "next/navigation"
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
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
  Calendar,
  CreditCard,
  FileText,
  User,
  MapPin,
  Phone,
  Clock,
  AlertCircle,
  CheckCircle,
  Loader2,
  Receipt,
  CalendarClock,
  Wallet,
  History,
  Save,
  Wifi,
  Building,
  UserCheck,
  CalendarX,
  CalendarCheck,
  XCircle,
  Info,
  Coins,
  ReceiptText,
  X,
  Download,
  BadgeCheck,
  Printer,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useStoreCrm } from "@/Crm/ZustandCrm/ZustandCrmContext";
import axios from "axios";
import { toast } from "sonner";
const VITE_CRM_API_URL = import.meta.env.VITE_CRM_API_URL;
// Enums
enum EstadoFacturaInternet {
  PENDIENTE = "PENDIENTE",
  PAGADA = "PAGADA",
  VENCIDA = "VENCIDA",
  ANULADA = "ANULADA",
  PARCIAL = "PARCIAL",
}

enum MetodoPagoFacturaInternet {
  EFECTIVO = "EFECTIVO",
  DEPOSITO = "DEPOSITO",
  TARJETA = "TARJETA",
  OTRO = "OTRO",
  PENDIENTE = "PENDIENTE",
  PAYPAL = "PAYPAL",
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

interface FacturacionZona {
  id: number;
  nombre: string;
}

interface ServicioInternet {
  id: number;
  nombre: string;
  velocidad?: string;
  precio: number;
}

// interface Usuario {
//   id: number;
//   nombre: string;
//   apellidos?: string;
// }

interface ClienteInternet {
  id: number;
  nombre: string;
  apellidos?: string;
  telefono?: string;
  direccion?: string;
  dpi?: string;
  estadoCliente: EstadoCliente;
  servicioInternet?: ServicioInternet;
  facturacionZona?: FacturacionZona;
  empresa?: Empresa;
}

interface RecordatorioPago {
  id: number;
  fechaEnvio: string;
  medioEnvio: string;
}

interface PagoFacturaInternet {
  id: number;
  facturaInternetId: number;
  clienteId: number;
  montoPagado: number;
  metodoPago: MetodoPagoFacturaInternet;
  fechaPago: string;
  cobradorId: number;
  cobrador: string;
  creadoEn: string;
}

interface FacturaInternet {
  id: number;
  fechaPagoEsperada: string | null;
  fechaPagada: string | null;
  montoPago: number | null;
  saldoPendiente: number | null;
  empresaId: number;
  empresa: Empresa;
  metodoPago: MetodoPagoFacturaInternet;
  clienteId: number;
  cliente: ClienteInternet;
  estadoFacturaInternet: EstadoFacturaInternet;
  pagos: PagoFacturaInternet[];
  creadoEn: string;
  actualizadoEn: string;
  nombreClienteFactura?: string;
  detalleFactura?: string;
  facturacionZonaId?: number;
  facturacionZona?: FacturacionZona;
  RecordatorioPago: RecordatorioPago[];
}

interface NuevoPago {
  facturaInternetId: number;
  clienteId: number;
  montoPagado: number;
  metodoPago: MetodoPagoFacturaInternet;
  cobradorId: number;
}

// Componente principal
const CrmPaymentFactura: React.FC = () => {
  const { facturaId, clienteId } = useParams();
  console.log("el id es: ", facturaId);
  const userId = useStoreCrm((state) => state.userIdCRM) ?? 0;
  // Estados
  const [factura, setFactura] = useState<FacturaInternet | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  console.log(setSuccess);

  // const [cobradores, setCobradores] = useState<Usuario[]>([]);
  const [facturasPendientes, setFacturasPendientes] = useState<
    FacturaInternet[]
  >([]);
  console.log(setFacturasPendientes);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showHistorial, setShowHistorial] = useState(false);

  // Estado para el formulario de pago
  const [nuevoPago, setNuevoPago] = useState<NuevoPago>({
    facturaInternetId: Number(facturaId) || 1,
    clienteId: Number(clienteId),
    montoPagado: 0,
    metodoPago: MetodoPagoFacturaInternet.EFECTIVO,
    cobradorId: userId,
  });

  const [openPdfPago, setOpenPdfPago] = useState(false);
  // interface newFacturacionPaymentSucces {
  //   facturaInternetId: number | null;
  //   clienteId: number | null;
  // }
  // const [pagoPdfId, setPagoPdfId] = useState<newFacturacionPaymentSucces>({
  //   clienteId: null,
  //   facturaInternetId: null,
  // });
  // const [pdf]

  console.log("EL nuevo pago es: ", nuevoPago);

  // Cargar datos de la factura
  useEffect(() => {
    if (!facturaId) {
      setError("No se proporcionó un ID de factura válido");
      setIsLoading(false);
      return;
    }

    fetchFactura(Number(facturaId));
    // fetchCobradores();
  }, [facturaId]);

  useEffect(() => {
    if (factura?.clienteId) {
      fetchFacturasPendientes(factura.clienteId);
      // Inicializar el formulario de pago con datos de la factura
      setNuevoPago((prev) => ({
        ...prev,
        clienteId: factura.clienteId,
        montoPagado: factura.saldoPendiente || factura.montoPago || 0,
      }));
    }
  }, [factura]);

  const fetchFactura = async (id: number) => {
    setIsLoading(true);
    setError(null);

    try {
      // En un entorno real, esto sería una llamada a la API
      const response = await axios.get(
        `${VITE_CRM_API_URL}/facturacion/get-facturacion-with-payments/${id}`
      );
      if (response.status === 200) {
        setFactura(response.data);
        setIsLoading(false);
      }
    } catch (err) {
      console.error("Error al cargar la factura:", err);
      setError("Error al cargar los datos de la factura. Intente nuevamente.");
      setIsLoading(false);
    }
  };

  console.log("La factura recuperada es: ", factura);

  // Función para cargar facturas pendientes del cliente
  const fetchFacturasPendientes = async (clienteId: number) => {
    try {
      console.log(clienteId);

      // En un entorno real, esto sería una llamada a la API
      // const response = await axios.get(`/api/clientes/${clienteId}/facturas-pendientes`)
      // setFacturasPendientes(response.data)
    } catch (err) {
      console.error("Error al cargar facturas pendientes:", err);
    }
  };

  // Handlers para formulario
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setNuevoPago((prev) => ({
      ...prev,
      [name]: name === "montoPagado" ? Number.parseFloat(value) || 0 : value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setNuevoPago((prev) => ({
      ...prev,
      [name]: name === "cobradorId" ? Number.parseInt(value) : value,
    }));
  };

  const handleSubmitPago = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Validaciones
      if (nuevoPago.montoPagado <= 0) {
        throw new Error("El monto pagado debe ser mayor a cero");
      }

      if (!nuevoPago.cobradorId) {
        throw new Error("Debe seleccionar un cobrador");
      }

      if (nuevoPago.montoPagado > (factura?.saldoPendiente || 0)) {
        throw new Error(
          "El monto pagado no puede ser mayor al saldo pendiente"
        );
      }

      //   REVISAR EL MAPEO DE PAGOS, Y EL ESTADO DE LA FACTURA

      const dataToSend = {
        facturaInternetId: Number(facturaId),
        clienteId: Number(clienteId),
        montoPagado: nuevoPago.montoPagado,
        metodoPago: nuevoPago.metodoPago,
        cobradorId: Number(userId),
      };

      // En un entorno real, esto sería una llamada a la API
      const response = await axios.post(
        `${VITE_CRM_API_URL}/facturacion/create-new-payment`,
        dataToSend
      );

      if (response.status === 201) {
        toast.success("Pago de factura registrado");
        fetchFactura(Number(facturaId));
        setIsSubmitting(false);
        setOpenConfirm(false);

        setOpenPdfPago(true);
        console.log("La data recibida es: ", response.data.dataToPdfSucces);

        // setPagoPdfId(response.data.dataToPdfSucces);
      }
    } catch (err: any) {
      console.error("Error al registrar pago:", err);
      setError(
        err.message || "Error al registrar el pago. Intente nuevamente."
      );
      setIsSubmitting(false);
    }
  };

  // Función para formatear fechas
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "No disponible";

    return new Date(dateString).toLocaleDateString("es-GT", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Función para formatear montos
  const formatMoney = (amount: number | null) => {
    if (amount === null) return "Q0.00";

    return `Q${amount.toFixed(2)}`;
  };

  // Obtener el color del badge según el estado
  const getEstadoBadgeColor = (estado: EstadoFacturaInternet) => {
    switch (estado) {
      case EstadoFacturaInternet.PAGADA:
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case EstadoFacturaInternet.PENDIENTE:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case EstadoFacturaInternet.VENCIDA:
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      case EstadoFacturaInternet.ANULADA:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
      case EstadoFacturaInternet.PARCIAL:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      default:
        return "";
    }
  };

  // Obtener el icono según el estado
  const getEstadoIcon = (estado: EstadoFacturaInternet) => {
    switch (estado) {
      case EstadoFacturaInternet.PAGADA:
        return <CheckCircle className="h-3.5 w-3.5 mr-1" />;
      case EstadoFacturaInternet.PENDIENTE:
        return <Clock className="h-3.5 w-3.5 mr-1" />;
      case EstadoFacturaInternet.VENCIDA:
        return <CalendarX className="h-3.5 w-3.5 mr-1" />;
      case EstadoFacturaInternet.ANULADA:
        return <XCircle className="h-3.5 w-3.5 mr-1" />;
      case EstadoFacturaInternet.PARCIAL:
        return <CalendarCheck className="h-3.5 w-3.5 mr-1" />;
      default:
        return null;
    }
  };

  // Obtener el icono según el método de pago
  const getMetodoPagoIcon = (metodoPago: MetodoPagoFacturaInternet) => {
    switch (metodoPago) {
      case MetodoPagoFacturaInternet.EFECTIVO:
        return <Coins className="h-4 w-4 mr-1" />;
      case MetodoPagoFacturaInternet.DEPOSITO:
        return <Building className="h-4 w-4 mr-1" />;
      case MetodoPagoFacturaInternet.TARJETA:
        return <CreditCard className="h-4 w-4 mr-1" />;
      case MetodoPagoFacturaInternet.PAYPAL:
        return <FileText className="h-4 w-4 mr-1" />;
      default:
        return <Wallet className="h-4 w-4 mr-1" />;
    }
  };

  // Verificar si la factura está vencida
  const isFacturaVencida = () => {
    if (!factura?.fechaPagoEsperada) return false;

    const fechaEsperada = new Date(factura.fechaPagoEsperada);
    const hoy = new Date();

    return (
      fechaEsperada < hoy &&
      factura.estadoFacturaInternet !== EstadoFacturaInternet.PAGADA
    );
  };

  // Verificar si se puede pagar la factura
  const canPayFactura = () => {
    return (
      factura &&
      (factura.estadoFacturaInternet === EstadoFacturaInternet.PENDIENTE ||
        factura.estadoFacturaInternet === EstadoFacturaInternet.PARCIAL ||
        factura.estadoFacturaInternet === EstadoFacturaInternet.VENCIDA) &&
      (factura.saldoPendiente || factura.montoPago) !== 0
    );
  };
  const [openConfirm, setOpenConfirm] = useState(false);

  return (
    <div className="container mx-auto py-6 space-y-6 print:py-0">
      {/* Botón de volver y título */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold tracking-tight">
            Pago de Factura de Internet
          </h1>
        </div>
      </div>

      {/* Mensajes de error y éxito */}
      {error && (
        <Alert variant="destructive" className="print:hidden">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-900/30 print:hidden">
          <CheckCircle className="h-4 w-4" />
          <AlertTitle>Éxito</AlertTitle>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : !factura ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Factura no encontrada</AlertTitle>
          <AlertDescription>
            No se pudo encontrar la factura solicitada.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Información de la factura */}
          <Card className="lg:col-span-2">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <ReceiptText className="h-5 w-5" />
                    Factura #{factura.id}
                  </CardTitle>
                  <CardDescription>
                    Detalles de la factura de servicio de internet
                  </CardDescription>
                </div>
                <Badge
                  className={`${getEstadoBadgeColor(
                    factura.estadoFacturaInternet
                  )} flex items-center`}
                >
                  {getEstadoIcon(factura.estadoFacturaInternet)}
                  {factura.estadoFacturaInternet}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 ">
              {/* Detalles principales */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">
                    Servicio
                  </div>
                  <div className="flex items-center gap-2">
                    <Wifi className="h-4 w-4 text-primary dark:text-white" />
                    <span className="font-medium">
                      {factura.cliente.servicioInternet?.nombre ||
                        "Plan de Internet"}
                    </span>
                    {factura.cliente.servicioInternet?.velocidad && (
                      <span className="text-sm text-muted-foreground">
                        ({factura.cliente.servicioInternet.velocidad})
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">
                    Empresa
                  </div>
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-primary dark:text-white" />
                    <span>{factura.empresa.nombre}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">
                    Fecha de Pago Esperada
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarClock
                      className={`dark:text-white h-4 w-4 ${
                        isFacturaVencida() ? "text-destructive" : "text-primary"
                      }`}
                    />
                    <span
                      className={
                        isFacturaVencida() ? "text-destructive font-medium" : ""
                      }
                    >
                      {formatDate(factura.fechaPagoEsperada)}
                    </span>
                    {isFacturaVencida() && (
                      <Badge variant="destructive" className="text-xs">
                        Vencida
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">
                    Fecha de Pago
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary dark:text-white " />
                    <span>{formatDate(factura.fechaPagada)}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">
                    Monto Total
                  </div>
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-primary dark:text-white" />
                    <span className="font-medium text-lg">
                      {formatMoney(factura.montoPago)}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">
                    Saldo Pendiente
                  </div>
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-primary dark:text-white" />
                    <span
                      className={`font-medium text-lg ${
                        factura.saldoPendiente
                          ? "text-destructive"
                          : "text-green-600"
                      }`}
                    >
                      {formatMoney(factura.saldoPendiente)}
                    </span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Detalles adicionales */}
              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">
                  Detalle de la Factura
                </div>
                <div className="p-3 bg-muted rounded-md">
                  {factura.detalleFactura || "Sin detalles adicionales"}
                </div>
              </div>

              {/* Zona de facturación */}
              {factura.facturacionZona && (
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">
                    Zona de Facturación
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary dark:text-white" />
                    <span>{factura.facturacionZona.nombre}</span>
                  </div>
                </div>
              )}

              {/* Historial de pagos */}
              {factura.pagos.length > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="text-sm font-medium text-muted-foreground">
                      Historial de Pagos
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 text-xs"
                      onClick={() => setShowHistorial(true)}
                    >
                      <History className="h-3.5 w-3.5 mr-1" />
                      Ver historial
                    </Button>
                  </div>
                  <div className="text-sm">
                    {factura.pagos.length === 1 ? (
                      <span>1 pago registrado</span>
                    ) : (
                      <span>{factura.pagos.length} pagos registrados</span>
                    )}
                  </div>
                </div>
              )}

              {/* Recordatorios */}
              {factura.RecordatorioPago.length > 0 && (
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">
                    Recordatorios Enviados
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {factura.RecordatorioPago.map((recordatorio) => (
                      <Badge
                        key={recordatorio.id}
                        variant="outline"
                        className="flex items-center gap-1"
                      >
                        <Clock className="h-3 w-3" />
                        {new Date(
                          recordatorio.fechaEnvio
                        ).toLocaleDateString()}{" "}
                        ({recordatorio.medioEnvio})
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Información del cliente */}
          <Card className="lg:col-span-1">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="h-5 w-5" />
                Información del Cliente
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">
                  Nombre Completo
                </div>
                <div className="flex items-center gap-2">
                  <UserCheck className="h-4 w-4 text-primary dark:text-white" />
                  <span className="font-medium">
                    {factura.cliente.nombre} {factura.cliente.apellidos || ""}
                  </span>
                </div>
              </div>

              {factura.cliente.telefono && (
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">
                    Teléfono
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-primary dark:text-white" />
                    <span>{factura.cliente.telefono}</span>
                  </div>
                </div>
              )}

              {factura.cliente.direccion && (
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">
                    Dirección
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-primary mt-0.5 dark:text-white" />
                    <span>{factura.cliente.direccion}</span>
                  </div>
                </div>
              )}

              {factura.cliente.dpi && (
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">
                    DPI
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary dark:text-white" />
                    <span>{factura.cliente.dpi}</span>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">
                  Estado del Cliente
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    className={
                      factura.cliente.estadoCliente === EstadoCliente.ACTIVO
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                        : factura.cliente.estadoCliente === EstadoCliente.MOROSO
                        ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                    }
                  >
                    {factura.cliente.estadoCliente === EstadoCliente.ACTIVO && (
                      <CheckCircle className="h-3.5 w-3.5 mr-1" />
                    )}
                    {factura.cliente.estadoCliente === EstadoCliente.MOROSO && (
                      <AlertCircle className="h-3.5 w-3.5 mr-1" />
                    )}
                    {factura.cliente.estadoCliente ===
                      EstadoCliente.SUSPENDIDO && (
                      <XCircle className="h-3.5 w-3.5 mr-1" />
                    )}
                    {factura.cliente.estadoCliente}
                  </Badge>
                </div>
              </div>

              <Separator />

              {/* Facturas pendientes */}
              <div className="space-y-3">
                <div className="text-sm font-medium text-muted-foreground">
                  Otras Facturas Pendientes
                </div>
                {facturasPendientes.length === 0 ? (
                  <div className="text-sm text-muted-foreground">
                    No hay otras facturas pendientes
                  </div>
                ) : (
                  <div className="space-y-2">
                    {facturasPendientes.map((facturaPendiente) => (
                      <div
                        key={facturaPendiente.id}
                        className="flex justify-between items-center p-2 bg-muted rounded-md"
                      >
                        <div className="flex items-center gap-2">
                          <Receipt className="h-4 w-4 text-primary" />
                          <div>
                            <div className="text-sm font-medium">
                              Factura #{facturaPendiente.id}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Vence:{" "}
                              {formatDate(facturaPendiente.fechaPagoEsperada)}
                            </div>
                          </div>
                        </div>
                        <div className="font-medium">
                          {formatMoney(facturaPendiente.montoPago)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Formulario de pago */}
          {canPayFactura() && (
            <Card className="lg:col-span-3 print:hidden">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Wallet className="h-5 w-5" />
                  Registrar Pago
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="montoPagado">Monto a Pagar</Label>
                    <div className="relative">
                      <CreditCard className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="montoPagado"
                        name="montoPagado"
                        type="number"
                        step="0.01"
                        className="pl-8"
                        value={nuevoPago.montoPagado || ""}
                        onChange={handleInputChange}
                        required
                        min="0.01"
                        max={factura.saldoPendiente || factura.montoPago || 0}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Saldo pendiente:{" "}
                      {formatMoney(factura.saldoPendiente || factura.montoPago)}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="metodoPago">Método de Pago</Label>
                    <Select
                      onValueChange={(value) =>
                        handleSelectChange("metodoPago", value)
                      }
                      defaultValue={nuevoPago.metodoPago}
                    >
                      <SelectTrigger id="metodoPago">
                        <SelectValue placeholder="Seleccione un método de pago" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={MetodoPagoFacturaInternet.EFECTIVO}>
                          <div className="flex items-center">
                            <Coins className="h-4 w-4 mr-2" />
                            Efectivo
                          </div>
                        </SelectItem>

                        <SelectItem value={MetodoPagoFacturaInternet.DEPOSITO}>
                          <div className="flex items-center">
                            <Building className="h-4 w-4 mr-2" />
                            Depósito
                          </div>
                        </SelectItem>
                        <SelectItem value={MetodoPagoFacturaInternet.TARJETA}>
                          <div className="flex items-center">
                            <CreditCard className="h-4 w-4 mr-2" />
                            Tarjeta
                          </div>
                        </SelectItem>

                        <SelectItem value={MetodoPagoFacturaInternet.OTRO}>
                          <div className="flex items-center">
                            <Wallet className="h-4 w-4 mr-2" />
                            Otro
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button
                  onClick={() => setOpenConfirm(true)}
                  type="button"
                  className="w-full md:w-auto"
                  disabled={isSubmitting || nuevoPago.montoPagado <= 0}
                >
                  <Save className="mr-2 h-4 w-4" />
                  Registrar
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
      )}

      {/* Diálogo de historial de pagos */}
      <Dialog open={showHistorial} onOpenChange={setShowHistorial}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <History className="h-4 w-4" />
              Historial de Pagos - Factura #{factura?.id}
            </DialogTitle>
            <DialogDescription>
              Registro de todos los pagos realizados para esta factura
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {factura?.pagos.length === 0 ? (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Sin pagos</AlertTitle>
                <AlertDescription>
                  No hay pagos registrados para esta factura.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="rounded-md border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted">
                        <th className="text-left p-2 text-sm font-medium">
                          Fecha
                        </th>
                        <th className="text-left p-2 text-sm font-medium">
                          Monto
                        </th>
                        <th className="text-left p-2 text-sm font-medium">
                          Método
                        </th>
                        <th className="text-left p-2 text-sm font-medium">
                          Cobrador
                        </th>

                        <th className="text-left p-2 text-sm font-medium">
                          Acción
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {factura?.pagos.map((pago, index) => (
                        <tr
                          key={pago.id}
                          className={
                            index % 2 === 0 ? "bg-background" : "bg-muted/50"
                          }
                        >
                          <td className="p-2 text-sm">
                            {new Date(pago.fechaPago).toLocaleDateString(
                              "es-GT",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </td>
                          <td className="p-2 text-sm font-medium">
                            {formatMoney(pago.montoPagado)}
                          </td>
                          <td className="p-2 text-sm">
                            <div className="flex items-center">
                              {getMetodoPagoIcon(pago.metodoPago)}
                              {pago.metodoPago}
                            </div>
                          </td>
                          <td className="p-2 text-sm">{pago.cobrador || ""}</td>

                          <td className="p-2 text-sm">
                            <Link
                              to={`/crm/factura-pago/pago-servicio-pdf/${facturaId}`}
                            >
                              <Button size={"icon"} variant={"outline"}>
                                <Printer />
                              </Button>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setShowHistorial(false)}>Cerrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={openConfirm} onOpenChange={setOpenConfirm}>
        <DialogContent className="sm:max-w-md p-0 overflow-hidden rounded-lg border-0 shadow-lg">
          {/* Header with icon */}
          <DialogHeader className="pt-6 px-6 pb-2">
            <DialogTitle
              className="flex items-center gap-3 text-xl font-semibold
              justify-center 
              "
            >
              <div className="bg-amber-100 dark:bg-gray-900 p-2 rounded-full">
                <AlertCircle className="h-5 w-5 text-rose-500" />
              </div>
              Confirmación de Pago
            </DialogTitle>
          </DialogHeader>

          <div className="px-6 py-4">
            <div className="border border-gray-200 dark:border-gray-800 rounded-md p-4 mb-5 bg-gray-50 dark:bg-gray-800 ">
              <h3 className="font-medium mb-2 text-gray-900 dark:text-gray-100 text-center">
                ¿Estás seguro de que deseas registrar este pago con estos datos?
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                Por favor, revisa cuidadosamente los datos antes de proceder.
              </p>
            </div>

            <div className="h-px bg-gray-200 dark:bg-gray-800 my-4"></div>

            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-2 pb-2">
              <Button
                variant={"outline"}
                onClick={() => setOpenConfirm(false)}
                className="border w-full bg-red-500 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-600 rounded-lg py-2 hover:text-white "
              >
                <X className="mr-2 h-4 w-4" />
                Cancelar
              </Button>
              <Button
                variant={"outline"}
                onClick={handleSubmitPago}
                className="bg-teal-600 text-white w-full hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-600 rounded-lg py-2 hover:text-white"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Procesando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Registrar Pago
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={openPdfPago} onOpenChange={setOpenPdfPago}>
        <DialogContent className="sm:max-w-md p-0 overflow-hidden rounded-lg border-0 shadow-lg">
          {/* Header with icon */}
          <DialogHeader className="pt-6 px-6 pb-2">
            <DialogTitle
              className="flex items-center gap-3 text-xl font-semibold
              justify-center 
              "
            >
              <div className="bg-blue-100 dark:bg-gray-900 p-2 rounded-full">
                <BadgeCheck className="h-5 w-5 text-green-500" />
              </div>
              Pago registrado exitosamente
            </DialogTitle>
          </DialogHeader>

          <div className="px-6 py-4">
            <div className="border border-gray-200 dark:border-gray-800 rounded-md p-4 mb-5 bg-gray-50 dark:bg-gray-800 ">
              <h3 className="font-medium mb-2 text-gray-900 dark:text-gray-100 text-center">
                ¿Desea imprimir su comprobante?
              </h3>
              {/* <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                Por favor, revisa cuidadosamente los datos antes de proceder.
              </p> */}
            </div>

            <div className="h-px bg-gray-200 dark:bg-gray-800 my-4"></div>

            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-2 pb-2">
              <Button
                variant={"outline"}
                onClick={() => setOpenPdfPago(false)}
                className="border w-full bg-red-500 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-600 rounded-lg py-2 hover:text-white "
              >
                <X className="mr-2 h-4 w-4" />
                Mantenerse
              </Button>
              <Link to={`/crm/factura-pago/pago-servicio-pdf/${facturaId}`}>
                <Button
                  onClick={() => setOpenPdfPago(false)}
                  variant={"outline"}
                  className="bg-teal-600 text-white w-full hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-600 rounded-lg py-2 hover:text-white"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Conseguir comprobante
                </Button>
              </Link>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CrmPaymentFactura;
