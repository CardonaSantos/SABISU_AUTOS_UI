"use client";

import type React from "react";
import { useState, useEffect, useCallback } from "react";
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
  EllipsisVertical,
  FilePenLine,
  Trash2,
  Globe,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useStoreCrm } from "@/Crm/ZustandCrm/ZustandCrmContext";
import axios, { AxiosResponse } from "axios";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
  facturasPendientes: FacturaInternet[];
}

interface NuevoPago {
  facturaInternetId: number;
  clienteId: number;
  montoPagado: number;
  metodoPago: MetodoPagoFacturaInternet;
  cobradorId: number;
  numeroBoleta: string;
}

interface Servicios {
  id: number;
  nombre: string;
  precio: number;
  descripcion: string;
  estado: "ACTIVO" | "INACTIVO";
  tipoServicioId: number | null;
  creadoEn: string;
  actualizadoEn: string;
}

const CrmPaymentFactura: React.FC = () => {
  // Estados

  const navigate = useNavigate();
  const { facturaId } = useParams();
  const userId = useStoreCrm((state) => state.userIdCRM) ?? 0;
  const [factura, setFactura] = useState<FacturaInternet | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [factudaIdDelete, setFacturaIdDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [facturasPendientes, setFacturasPendientes] = useState<
    FacturaInternet[]
  >([]);
  console.log(setFacturasPendientes);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showHistorial, setShowHistorial] = useState(false);

  const [nuevoPago, setNuevoPago] = useState<NuevoPago>({
    facturaInternetId: Number(facturaId) || 1,
    clienteId: Number(factura?.clienteId),
    montoPagado: 0,
    metodoPago: MetodoPagoFacturaInternet.EFECTIVO,
    cobradorId: userId,
    numeroBoleta: "",
  });
  const [serviciosSeleccionados, setServiciosSeleccionados] =
    useState<number[]>();

  const [openPdfPago, setOpenPdfPago] = useState(false);

  const [servicios, setServicios] = useState<Servicios[]>([]);

  const fetchFactura = useCallback(async (id: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await axios.get<FacturaInternet>(
        `${VITE_CRM_API_URL}/facturacion/get-facturacion-with-payments/${id}`
      );
      setFactura(res.data);
      setFacturasPendientes(res.data.facturasPendientes || []);
    } catch (err) {
      console.error(err);
      setError("Error al cargar la factura.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch other services for invoice
  const fetchOtrosServicios = useCallback(async (clienteId: number) => {
    try {
      const res = await axios.get<Servicios[]>(
        `${VITE_CRM_API_URL}/servicio/get-servicios-to-invoice/${clienteId}`
      );
      setServicios(res.data);
    } catch (err) {
      console.error("Error cargando servicios:", err);
    }
  }, []);

  // Cargar datos de la factura
  // Initial load
  useEffect(() => {
    if (!facturaId) {
      setError("ID de factura inválido");
      setIsLoading(false);
      return;
    }
    fetchFactura(Number(facturaId));
  }, [facturaId, fetchFactura]);

  // When factura changes, init form and load services
  useEffect(() => {
    if (!factura) return;

    setNuevoPago((prev) => ({
      ...prev,
      clienteId: factura.clienteId,
      montoPagado: factura.saldoPendiente ?? factura.montoPago ?? 0,
    }));

    fetchOtrosServicios(factura.clienteId);
  }, [factura, fetchOtrosServicios]);

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

      const dataToSend = {
        facturaInternetId: Number(facturaId),
        clienteId: Number(factura?.clienteId),
        montoPagado: nuevoPago.montoPagado,
        metodoPago: nuevoPago.metodoPago,
        cobradorId: Number(userId),
        numeroBoleta: nuevoPago.numeroBoleta,
        serviciosAdicionales: serviciosSeleccionados?.map((s) => s),
      };

      const response = await axios.post(
        `${VITE_CRM_API_URL}/facturacion/create-new-payment`,
        dataToSend
      );

      if (response.status === 201) {
        toast.success("Pago de factura registrado");
        fetchFactura(Number(facturaId));
        setIsSubmitting(false);
        setOpenConfirm(false);

        setTimeout(() => {
          setOpenPdfPago(true);
        }, 1000);

        console.log("La data recibida es: ", response.data.dataToPdfSucces);
        setNuevoPago({
          facturaInternetId: Number(facturaId) || 1,
          clienteId: Number(factura?.clienteId),
          montoPagado: 0,
          metodoPago: MetodoPagoFacturaInternet.EFECTIVO,
          cobradorId: userId,
          numeroBoleta: "",
        });
      }
    } catch (err: any) {
      console.error("Error al registrar pago:", err);
      setError(
        err.message || "Error al registrar el pago. Intente nuevamente."
      );
      setIsSubmitting(false);
      toast.error("Porfavor verifique sus datos");
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "No disponible";

    return new Date(dateString).toLocaleDateString("es-GT", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatMoney = (amount: number | null) => {
    if (amount === null) return "Q0.00";

    return `Q${amount.toFixed(2)}`;
  };

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

  const isFacturaVencida = () => {
    if (!factura?.fechaPagoEsperada) return false;

    const fechaEsperada = new Date(factura.fechaPagoEsperada);
    const hoy = new Date();

    return (
      fechaEsperada < hoy &&
      factura.estadoFacturaInternet !== EstadoFacturaInternet.PAGADA
    );
  };

  const canPayFactura = () => {
    return (
      factura &&
      (factura.estadoFacturaInternet === EstadoFacturaInternet.PENDIENTE ||
        factura.estadoFacturaInternet === EstadoFacturaInternet.PARCIAL ||
        factura.estadoFacturaInternet === EstadoFacturaInternet.VENCIDA) &&
      (factura.saldoPendiente || factura.montoPago) !== 0
    );
  };

  const handleDeleteFactura = async () => {
    if (!factudaIdDelete) {
      toast.warning("No hay factura seleccionada para eliminar");
      return;
    }

    try {
      setIsDeleting(true);
      const response: AxiosResponse = await axios.delete(
        `${VITE_CRM_API_URL}/facturacion/delete-one-factura`,
        {
          data: {
            facturaId: factudaIdDelete,
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        toast.success("Factura eliminada correctamente");
        setOpenDelete(false);
        setIsDeleting(false);
        navigate(`/crm/cliente/${factura?.clienteId}?tab=facturacion`);
      } else {
        toast.error("No se pudo eliminar la factura");
      }
    } catch (error: any) {
      console.error("Error al eliminar factura:", error);
      toast.error("Ocurrió un error al intentar eliminar la factura");
      setIsDeleting(false);
    }
  };

  const handleCheckedServicio = (checked: boolean, idServicio: number) => {
    const isInArray = serviciosSeleccionados?.includes(idServicio);

    if (checked && !isInArray) {
      setServiciosSeleccionados((prev) => [...(prev || []), idServicio]);
    } else {
      setServiciosSeleccionados((datosPrevios) =>
        datosPrevios?.filter((id) => id !== idServicio)
      );
    }
  };

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

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 rounded-full hover:bg-muted dark:hover:bg-gray-800"
                    >
                      <EllipsisVertical className="h-3.5 w-3.5" />
                      <span className="sr-only">Acciones</span>
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end" className="w-36">
                    <DropdownMenuLabel className="text-sm">
                      Acciones
                    </DropdownMenuLabel>
                    <DropdownMenuItem asChild>
                      <Link
                        to={`/editar?factura=${factura.id}`}
                        className="flex items-center text-green-600 dark:text-green-400 focus:text-green-700 dark:focus:text-green-300"
                      >
                        <FilePenLine className="h-3.5 w-3.5 mr-2" />
                        Editar
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() => {
                        setFacturaIdDelete(factura.id);
                        setOpenDelete(true);
                      }}
                      className="text-red-600 dark:text-red-400 focus:text-red-700 dark:focus:text-red-300"
                    >
                      <Trash2 className="h-3.5 w-3.5 mr-2" />
                      Eliminar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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
                    Fecha Pagada
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

              {/* Otros servicios adquiridos */}
              {/* {servicios && servicios.length > 0 && ( */}
              <Card className="w-full shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Otros servicios adquiridos
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    {servicios.map((servicio) => (
                      <div
                        key={servicio.id}
                        className="flex items-center justify-between rounded-md border border-border/60 bg-card/50 p-2.5 hover:bg-accent/5 transition-colors"
                      >
                        <div className="flex items-start gap-2">
                          <Badge
                            variant="outline"
                            className="flex h-6 items-center gap-1 bg-background"
                          >
                            <Globe className="h-3 w-3" />
                            <span className="text-xs font-medium">
                              {servicio.nombre}
                            </span>
                          </Badge>

                          <div className="flex flex-col">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-semibold">
                                {formatMoney(servicio.precio)}
                              </span>

                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                                  </TooltipTrigger>
                                  <TooltipContent
                                    side="top"
                                    className="max-w-[200px] text-xs"
                                  >
                                    <p>{servicio.descripcion}</p>
                                    <p className="mt-1 text-muted-foreground">
                                      Adquirido: {formatDate(servicio.creadoEn)}
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </div>
                        </div>

                        <Switch
                          checked={serviciosSeleccionados?.includes(
                            servicio.id
                          )}
                          onCheckedChange={(checked) => {
                            handleCheckedServicio(checked, servicio.id);
                          }}
                          aria-label={`Agregar ${servicio.nombre} a la factura`}
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* )} */}
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
                  <span className="font-medium text-blue-500 underline">
                    <Link to={`/crm/cliente/${factura.cliente.id}`}>
                      {factura.cliente.nombre} {factura.cliente.apellidos || ""}
                    </Link>
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
                    <ScrollArea className="h-72">
                      {facturasPendientes.map((facturaPendiente) => (
                        <Link
                          to={`/crm/facturacion/pago-factura/${facturaPendiente.id}`}
                        >
                          <div
                            key={facturaPendiente.id}
                            className="flex justify-between items-center p-3 bg-muted rounded-md mb-2"
                          >
                            {/* Columna izquierda: ícono + info */}
                            <div className="flex items-start gap-3">
                              <Receipt className="h-5 w-5 text-primary dark:text-white mt-0.5" />
                              <div className="space-y-1">
                                <div className="text-sm font-medium">
                                  Factura #{facturaPendiente.id}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  Vence:{" "}
                                  {formatDate(
                                    facturaPendiente.fechaPagoEsperada
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Columna derecha: estado + monto */}
                            <div className="flex flex-col items-end gap-1">
                              <Badge
                                className={`${getEstadoBadgeColor(
                                  facturaPendiente.estadoFacturaInternet
                                )}`}
                              >
                                {facturaPendiente.estadoFacturaInternet}
                              </Badge>
                              <div className="text-sm font-semibold">
                                {formatMoney(facturaPendiente.montoPago)}
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </ScrollArea>
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

                  {/* Conditional field for receipt number when payment method is DEPOSITO */}
                  {nuevoPago.metodoPago === "DEPOSITO" && (
                    <div className="space-y-2">
                      <Label htmlFor="numeroBoleta">No. Boleta</Label>
                      <div className="relative">
                        <Receipt className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="numeroBoleta"
                          name="numeroBoleta"
                          className="pl-8"
                          value={nuevoPago.numeroBoleta || ""}
                          onChange={handleInputChange}
                          placeholder="Ingrese número de boleta"
                          required
                        />
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>

              <CardFooter className="flex justify-end">
                <Button
                  onClick={() => setOpenConfirm(true)}
                  type="button"
                  // variant={"outline"}
                  className="w-full md:w-auto bg-zinc-900 hover:bg-zinc-800"
                  disabled={
                    isSubmitting ||
                    !nuevoPago.montoPagado ||
                    Number(nuevoPago.montoPagado) <= 0
                  }
                >
                  <Save className="mr-2 h-4 w-4 " />
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
        <DialogContent className="sm:max-w-md p-0 overflow-hidden rounded-xl border-0 shadow-xl">
          {/* Warning icon */}
          <div className="flex justify-center mt-6">
            <div className="rounded-full p-3 shadow-lg border-4 border-white">
              <div className="bg-amber-100 p-3 rounded-full animate-pulse">
                <AlertCircle className="h-8 w-8 text-amber-600" />
              </div>
            </div>
          </div>

          {/* Header */}
          <DialogHeader className="pt-8 px-6 pb-2">
            <DialogTitle className="text-xl font-semibold text-center text-gray-800 dark:text-gray-400">
              Confirmación de Pago
            </DialogTitle>
            <p className="text-center text-gray-600 text-sm mt-1 dark:text-gray-400">
              Por favor revise los datos antes de continuar
            </p>
          </DialogHeader>

          <div className="px-6 py-4">
            {/* Question card */}
            <div className="border border-gray-200 rounded-lg p-5 mb-5 bg-gray-50 shadow-inner dark:bg-stone-950">
              <h3 className="font-medium mb-2 text-gray-800 text-center dark:text-gray-400">
                ¿Estás seguro de que deseas registrar este pago con estos datos?
              </h3>
              <p className="text-sm text-gray-600 text-center dark:text-gray-400">
                Por favor, revisa cuidadosamente los datos antes de proceder.
              </p>
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-5"></div>

            {/* Action buttons */}
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-2 pb-2">
              <Button
                variant="outline"
                onClick={() => setOpenConfirm(false)}
                className="border border-gray-200 w-full bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 rounded-lg py-2.5 transition-all duration-200"
              >
                <X className="mr-2 h-4 w-4" />
                Cancelar
              </Button>
              <Button
                type="button"
                onClick={handleSubmitPago}
                className="w-full bg-zinc-900 text-white hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-gray-800 rounded-lg py-2.5 shadow-sm transition-all duration-200"
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
        <DialogContent className="sm:max-w-md p-0 overflow-hidden rounded-xl border-0 shadow-xl hite">
          {/* Success icon */}
          <div className="flex justify-center mt-6">
            <div className="rounded-full p-3 shadow-lg border-4 border-white">
              <div className="bg-emerald-100 p-3 rounded-full animate-pulse">
                <BadgeCheck className="h-8 w-8 text-emerald-600" />
              </div>
            </div>
          </div>

          {/* Header */}
          <DialogHeader className="pt-8 px-6 pb-2">
            <DialogTitle className="text-xl font-semibold text-center text-gray-800 dark:text-gray-400">
              Pago registrado exitosamente
            </DialogTitle>
            <p
              className="text-center text-gray-600 text-sm mt-1 
            dark:text-gray-400
            "
            >
              Su transacción ha sido procesada correctamente
            </p>
          </DialogHeader>

          <div className="px-6 py-4">
            {/* Question card */}
            <div
              className="border border-gray-200 rounded-lg p-5 mb-5 bg-gray-50 shadow-inner
            dark:bg-stone-950
            "
            >
              <h3
                className="font-medium mb-2 text-gray-800 text-center
            dark:text-gray-400
              
              "
              >
                ¿Desea imprimir su comprobante?
              </h3>
              <p
                className="text-sm text-gray-600 text-center
            dark:text-gray-400
              
              "
              >
                Puede descargar el comprobante ahora o acceder a él más tarde
                desde su historial.
              </p>
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-5"></div>

            {/* Action buttons */}
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-2 pb-2">
              <Button
                variant="outline"
                onClick={() => setOpenPdfPago(false)}
                className="border border-gray-200 w-full bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 rounded-lg py-2.5 transition-all duration-200"
              >
                <X className="mr-2 h-4 w-4" />
                Cerrar
              </Button>
              <Link
                to={`/crm/factura-pago/pago-servicio-pdf/${facturaId}`}
                className="w-full sm:w-auto"
              >
                <Button
                  onClick={() => setOpenPdfPago(false)}
                  className="w-full bg-zinc-900  hover:bg-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-gray-800 rounded-lg py-2.5 shadow-sm transition-all duration-200"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Descargar comprobante
                </Button>
              </Link>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
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
              onClick={() => setOpenDelete(false)}
              // disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteFactura}
              disabled={isDeleting}
            >
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CrmPaymentFactura;
