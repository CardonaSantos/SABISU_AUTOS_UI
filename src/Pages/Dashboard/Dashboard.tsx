import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  AlertCircle,
  Box,
  Calendar,
  ChevronDown,
  ChevronUp,
  Coins,
  CoinsIcon,
  IdCard,
  MapPin,
  Phone,
  TextIcon,
  TicketCheck,
  User,
} from "lucide-react";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useStore } from "@/components/Context/ContextSucursal";
// import { useSocketStore } from "@/components/Context/ContextConection";
const API_URL = import.meta.env.VITE_API_URL;

import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import customParseFormat from "dayjs/plugin/customParseFormat";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useSocket } from "@/components/Context/SocketContext";
import { GarantiaType } from "@/Types/Warranty/Warranty";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import {
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Tooltip as Tooltip2,
} from "@/components/ui/tooltip";
import { CreditoRegistro } from "../VentaCuotas/CreditosType";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  codigoProducto: string;
}

interface Usuario {
  id: number;
  nombre: string;
  rol: string;
  sucursal: { nombre: string };
}

interface Solicitud {
  id: number;
  productoId: number;
  precioSolicitado: number;
  solicitadoPorId: number;
  estado: EstadoPrecio;
  aprobadoPorId: number | null;
  fechaSolicitud: string;
  fechaRespuesta: string | null;
  producto: Producto;
  solicitadoPor: Usuario;
}

enum EstadoSolicitudTransferencia {
  PENDIENTE,
  APROBADO,
  RECHAZADO,
}

interface Producto {
  nombre: string;
}

interface SucursalDestino {
  nombre: string;
}

interface SucursalOrigen {
  nombre: string;
}

enum Rol {
  ADMIN,
  MANAGER,
  VENDEDOR,
  SUPER_ADMIN,
}

interface UsuarioSolicitante {
  rol: Rol;
  nombre: string;
}

export interface SolicitudTransferencia {
  id: number;
  productoId: number;
  producto: Producto;
  sucursalDestino: SucursalDestino;
  sucursalOrigen: SucursalOrigen;
  usuarioSolicitante: UsuarioSolicitante;
  cantidad: number;
  sucursalOrigenId: number;
  sucursalDestinoId: number;
  usuarioSolicitanteId: number | null;
  estado: EstadoSolicitudTransferencia;
  fechaSolicitud: string;
  fechaAprobacion: string | null;
  administradorId: number | null;
}

enum EstadoPrecio {
  APROBADO = "APROBADO",
  PENDIENTE = "PENDIENTE",
  RECHAZADO = "RECHAZADO",
}

export default function Dashboard() {
  dayjs.extend(localizedFormat);
  dayjs.extend(customParseFormat);
  dayjs.locale("es");
  const formatearFecha = (fecha: string) => {
    let nueva_fecha = dayjs(fecha).format("DD MMMM YYYY, hh:mm A");
    return nueva_fecha;
  };

  const sucursalId = useStore((state) => state.sucursalId);
  const userID = useStore((state) => state.userId);

  interface VentasSemanalChart {
    dia: string;
    totalVenta: number;
    ventas: number;
    fecha: string;
  }

  interface MasVendidos {
    id: number;
    nombre: string;
    totalVentas: number;
  }

  interface VentaReciente {
    id: number;
    fechaVenta: string;
    totalVenta: number;
    sucursal: {
      id: number;
      nombre: string;
    };
  }

  const [ventasMes, setVentasMes] = useState(0);
  const [ventasSemana, setVentasSemana] = useState(0);
  const [ventasDia, setVentasDia] = useState(0);
  const [ventasSemanalChart, setVentasSemanalChart] = useState<
    VentasSemanalChart[]
  >([]);

  const [masVendidos, setMasVendidos] = useState<MasVendidos[]>([]);
  const [transaccionesRecientes, setTransaccionesRecientes] = useState<
    VentaReciente[]
  >([]);

  const getInfo = async () => {
    try {
      // Realiza las tres peticiones en paralelo
      const [
        ventasMes,
        ventasDia,
        ventasSemana,
        ventasSemanalChart,
        productoMasVendidos,
        transaccionesRecientesR,
      ] = await Promise.all([
        axios.get(`${API_URL}/analytics/get-ventas/mes/${sucursalId}`),
        axios.get(`${API_URL}/analytics/get-ventas/dia/${sucursalId}`),
        axios.get(`${API_URL}/analytics/get-ventas/semana/${sucursalId}`),
        axios.get(
          `${API_URL}/analytics/get-ventas/semanal-chart/${sucursalId}`
        ),

        axios.get(`${API_URL}/analytics/get-productos-mas-vendidos/`),
        axios.get(`${API_URL}/analytics/get-ventas-recientes/`),
      ]);

      // Accede a los datos de cada respuesta
      console.log("Ventas del mes:", ventasMes.data);
      console.log("Ventas del día:", ventasDia.data);
      console.log("Ventas de la semana:", ventasSemana.data);

      // Si necesitas combinar la información de alguna manera, puedes hacerlo aquí
      setVentasMes(ventasMes.data);
      setVentasSemana(ventasSemana.data);
      setVentasDia(ventasDia.data);
      setVentasSemanalChart(ventasSemanalChart.data);
      setMasVendidos(productoMasVendidos.data);
      setTransaccionesRecientes(transaccionesRecientesR.data);
    } catch (error) {
      console.error("Error al obtener los datos:", error);
      // Maneja los errores aquí
      toast.error("Error al recuperar informacion de ventas del servidor");
    }
  };

  console.log("Las ventas semanales del chart son: ", ventasSemanalChart);
  console.log("Mas vendidos: ", masVendidos);

  // Llamar a la función
  useEffect(() => {
    if (sucursalId) {
      getInfo();
    }
  }, [sucursalId]);

  //==============================================>
  // SOLICITUDES DE PRECIO
  const getSolicitudes = async () => {
    try {
      const response = await axios.get(`${API_URL}/price-request`);
      if (response.status === 200) {
        setSolicitudes(response.data);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error al conseguir solicitudes");
    }
  };

  //=======================================================>

  // SOLICITUDES DE TRANSFERENCIA PRODUCTO
  const getSolicitudesTransferencia = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/solicitud-transferencia-producto`
      );
      if (response.status === 200) {
        setSolicitudesTransferencia(response.data);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error al conseguir solicitudes de transferencia");
    }
  };

  useEffect(() => {
    getSolicitudes();
  }, []);

  useEffect(() => {
    getSolicitudesTransferencia();
  }, []);

  const [openAcept, setOpenAcept] = useState(false);
  const [openReject, setOpenReject] = useState(false);

  const handleAceptRequest = async (idSolicitud: number) => {
    try {
      const response = await axios.patch(
        `${API_URL}/price-request/acept-request-price/${idSolicitud}/${userID}`
      );
      if (response.status === 200) {
        toast.success("Petición aceptada, precio concedido");
        setOpenAcept(false); // Close dialog upon success
        getSolicitudes();
      }
    } catch (error) {
      console.log(error);
      toast.error("Error");
    }
  };

  const handleRejectRequest = async (idSolicitud: number) => {
    try {
      const response = await axios.patch(
        `${API_URL}/price-request/reject-request-price/${idSolicitud}/${userID}`
      );
      if (response.status === 200) {
        toast.warning("Petición rechazada");
        setOpenAcept(false); // Close dialog upon success
        setOpenReject(false);
        getSolicitudes();
      }
    } catch (error) {
      console.log(error);
      toast.error("Error");
    }
  };

  const socket = useSocket();
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);

  useEffect(() => {
    if (socket) {
      const handleSolicitud = (solicitudNueva: Solicitud) => {
        setSolicitudes((prevSolicitudes) => [
          ...prevSolicitudes,
          solicitudNueva,
        ]);
      };

      // Escucha el evento
      socket.on("recibirSolicitud", handleSolicitud);

      // Limpia el listener al desmontar
      return () => {
        socket.off("recibirSolicitud", handleSolicitud);
      };
    }
  }, [socket]);

  const [solicitudesTransferencia, setSolicitudesTransferencia] = useState<
    SolicitudTransferencia[]
  >([]);

  useEffect(() => {
    if (socket) {
      const handleSolicitud = (solicitudNueva: SolicitudTransferencia) => {
        setSolicitudesTransferencia((prevSolicitudes) => [
          ...prevSolicitudes,
          solicitudNueva,
        ]);
      };

      // Escucha el evento
      socket.on("recibirSolicitudTransferencia", handleSolicitud);

      // Limpia el listener al desmontar
      return () => {
        socket.off("recibirSolicitudTransferencia", handleSolicitud);
      };
    }
  }, [socket]);

  console.log("Las solicitudes son: ", solicitudes);
  console.log("Las solicitudes de transferencia: ", solicitudesTransferencia);

  const [openAceptarTransferencia, setOpenAceptarTransferencia] =
    useState(false);
  const [openRechazarTransferencia, setOpenRechazarTransferencia] =
    useState(false);

  // Funciones para manejar aceptar y rechazar en el card de transferencia
  const handleAceptarTransferencia = async (
    idSolicitudTransferencia: number
  ) => {
    console.log(
      `Aceptada la solicitud de transferencia con ID: ${idSolicitudTransferencia} y User ID: ${userID}`
    );

    try {
      // Realiza la llamada al backend usando axios
      const response = await axios.post(
        `${API_URL}/solicitud-transferencia-producto/aceptar`,
        {
          idSolicitudTransferencia,
          userID,
        }
      );

      console.log("Respuesta del servidor:", response.data);
      toast.success("Tranferencia completada");
      getSolicitudesTransferencia();
      // Puedes mostrar una notificación de éxito aquí
    } catch (error) {
      console.error("Error al aceptar la transferencia:", error);
      toast.error("Error");
      // Puedes mostrar una notificación de error aquí
    } finally {
      setOpenAceptarTransferencia(false);
    }
  };

  const handleRejectTransferencia = async (
    idSolicitudTransferencia: number
  ) => {
    console.log(
      `Aceptada la solicitud de transferencia con ID: ${idSolicitudTransferencia} y User ID: ${userID}`
    );

    try {
      // Realiza la llamada al backend usando axios
      const response = await axios.delete(
        `${API_URL}/solicitud-transferencia-producto/rechazar/${idSolicitudTransferencia}/${userID}`
      );

      if (response.status === 200) {
        toast.warning("Solicitu de transferencia rechazada");
        getSolicitudesTransferencia();
      }

      // Puedes mostrar una notificación de éxito aquí
    } catch (error) {
      console.error("Error al aceptar la transferencia:", error);
      toast.error("Error");
      // Puedes mostrar una notificación de error aquí
    }
  };

  const [warranties, setWarranties] = useState<GarantiaType[]>([]);
  const getWarranties = async () => {
    try {
      const response = await axios.get(`${API_URL}/warranty`);
      if (response.status === 200) {
        setWarranties(response.data);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error al conseguir las garantías");
    }
  };

  useEffect(() => {
    getWarranties();
  }, []);

  console.log("Las garantías son: ", warranties);
  enum EstadoGarantia {
    RECIBIDO = "RECIBIDO",
    // EN_PROCESO = "EN_PROCESO",
    // FINALIZADO = "FINALIZADO",
    ENVIADO_A_PROVEEDOR = "ENVIADO_A_PROVEEDOR",
    EN_REPARACION = "EN_REPARACION",
    REPARADO = "REPARADO",
    REEMPLAZADO = "REEMPLAZADO",
    // ENTREGADO_CLIENTE = "ENTREGADO_CLIENTE",
    CERRADO = "CERRADO",
  }

  const estadoColor = {
    [EstadoGarantia.RECIBIDO]: "bg-blue-500",

    [EstadoGarantia.ENVIADO_A_PROVEEDOR]: "bg-purple-500",
    [EstadoGarantia.EN_REPARACION]: "bg-orange-500",
    [EstadoGarantia.REPARADO]: "bg-green-500",
    [EstadoGarantia.REEMPLAZADO]: "bg-teal-500",
    [EstadoGarantia.CERRADO]: "bg-gray-500",
  };

  //========================================>
  const [openUpdateWarranty, setOpenUpdateWarranty] = useState(false);
  const [selectWarrantyUpdate, setSelectWarrantyUpdate] =
    useState<GarantiaType | null>(null);
  const [comentario, setComentario] = useState("");
  const [descripcionProblema, setDescripcionProblema] = useState("");
  const [estado, setEstado] = useState<EstadoGarantia | null>(null);

  const handleOpenUpdateDialog = (garantia: GarantiaType) => {
    setSelectWarrantyUpdate(garantia);
    setComentario(garantia.comentario);
    setDescripcionProblema(garantia.descripcionProblema);
    setEstado(garantia.estado as EstadoGarantia); // Aseguramos el tipo correcto
    setOpenUpdateWarranty(true);
  };

  const handleUpdateRegistW = async () => {
    if (!selectWarrantyUpdate) return;

    console.log({
      comentario,
      descripcionProblema,
      estado,
    });

    try {
      const response = await axios.patch(
        `${API_URL}/warranty/${selectWarrantyUpdate.id}`,
        {
          comentario,
          descripcionProblema,
          estado,
        }
      );
      if (response.status === 200) {
        toast.success("Registro actualizado correctamente");
        setOpenUpdateWarranty(false);
        getWarranties();
      }
    } catch (error) {
      toast.error("Error al actualizar el registro");
    }
  };

  //DATOS PARA FINALIZAR EL REGISTRO
  const [openFinishWarranty, setOpenFinishWarranty] = useState(false);
  const [estadoRegistFinishW, setEstadoFinishW] = useState(""); // Aquí puedes definir un valor por defecto
  const [productoIdW, setProductoIdW] = useState<number>(0);
  const [conclusion, setConclusion] = useState("");
  const [accionesRealizadas, setAccionesRealizadas] = useState("");
  const [warrantyId, setWarrantyId] = useState<number>(0);

  const handleSubmitFinishRegistW = async () => {
    if (!estadoRegistFinishW) {
      toast.warning("Debe seleccionar un estado");
      return;
    }

    if (!conclusion || !accionesRealizadas) {
      toast.warning("Debe llenar todos los campos");
      return;
    }

    const dtoFinishW = {
      garantiaId: warrantyId,
      usuarioId: userID,
      estado: estadoRegistFinishW,
      productoId: productoIdW,
      conclusion: conclusion,
      accionesRealizadas: accionesRealizadas,
    };

    try {
      const response = await axios.post(
        `${API_URL}/warranty/create-regist-warranty`,
        dtoFinishW
      );

      if (response.status === 201) {
        toast.success("Registro Finalizado");
        getWarranties();
        setOpenFinishWarranty(false);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error al crear registro final");
    }
  };

  const [expandedCard, setExpandedCard] = useState<number | null>(null);

  const toggleCard = (id: number) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  const [creditos, setCreditos] = useState<CreditoRegistro[]>([]);
  const getCredits = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/cuotas/get-credits-without-paying`
      );
      if (response.status === 200) {
        setCreditos(response.data);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error al cargar datos");
    }
  };

  useEffect(() => {
    getCredits();
  }, []);

  console.log("Los registros de creditos abiertos son: ", creditos);

  //==================================================>
  interface VentaCuotaCardProps {
    ventaCuota: CreditoRegistro;
  }

  const VentaCuotaCard: React.FC<VentaCuotaCardProps> = ({ ventaCuota }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const totalConInteres = (totalVenta: number, interes: number) => {
      const montoInteres = totalVenta * (interes / 100);
      return totalVenta + montoInteres;
    };

    const formatearMoneda = (cantidad: number) => {
      return new Intl.NumberFormat("es-GT", {
        style: "currency",
        currency: "GTQ",
      }).format(cantidad);
    };

    const calcularDetallesCredito = () => {
      const montoTotalConInteres = totalConInteres(
        ventaCuota.totalVenta,
        ventaCuota.interes
      );
      const saldoRestante = montoTotalConInteres - ventaCuota.totalPagado;
      const montoPorCuota =
        (montoTotalConInteres - ventaCuota.cuotaInicial) /
        ventaCuota.cuotasTotales;

      const cuotasPagadas = ventaCuota.cuotas.filter(
        (cuota) => cuota.estado === "PAGADA"
      ).length;

      const cuotasRestantes =
        ventaCuota.cuotasTotales - cuotasPagadas > 0
          ? ventaCuota.cuotasTotales - cuotasPagadas
          : 0;

      const fechaProximoPago = dayjs(ventaCuota.fechaInicio)
        .add(cuotasPagadas * ventaCuota.diasEntrePagos, "day")
        .format("D [de] MMMM [de] YYYY");

      return {
        saldoRestante,
        montoPorCuota,
        cuotasPagadas,
        cuotasRestantes,
        fechaProximoPago,
      };
    };

    const { saldoRestante, montoPorCuota, cuotasPagadas } =
      calcularDetallesCredito();

    const [openRegistCuota, setOpenRegistCuota] = useState(false);

    let diaInicio = dayjs(ventaCuota.fechaContrato);
    console.log("el dia de inicio es: ", diaInicio);
    const cuotasFechas = [];

    for (let index = 0; index < ventaCuota.cuotasTotales; index++) {
      const fechaAPagar = diaInicio.add(ventaCuota.diasEntrePagos, "day");
      // cuotasFechas.push(fechaAPagar.format("YYYY-MMMM-DD"));
      cuotasFechas.push(fechaAPagar.format("D [de] MMMM [de] YYYY"));

      diaInicio = fechaAPagar;
    }
    console.log("Las fechas a pagar cada x días son: ", cuotasFechas);

    return (
      <Card className="w-full max-w-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            <span className="font-bold">Crédito #{ventaCuota.id}</span>
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            aria-expanded={isExpanded}
            aria-label={isExpanded ? "Collapse details" : "Expand details"}
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </CardHeader>
        <CardContent>
          <div className="text-xl font-bold text-green-600">
            Saldo Restante: {formatearMoneda(saldoRestante)}
          </div>
          <p className="text-sm">
            Cliente: <strong>{ventaCuota.cliente.nombre}</strong>
          </p>
          <p className="text-sm">
            Monto por Cuota: <strong>{formatearMoneda(montoPorCuota)}</strong>
          </p>
          <p className="text-sm">
            Cuotas Pagadas: <strong>{cuotasPagadas}</strong> /{" "}
            {ventaCuota.cuotasTotales}
          </p>
          <p className="text-sm">
            Fechas de pago: <strong>{cuotasFechas.join(", ")}</strong>
          </p>
          <Badge className="mt-2">{ventaCuota.estado}</Badge>
          {isExpanded && (
            <div className="mt-4 space-y-2">
              <p className="text-sm">
                Monto Total (con Interés):{" "}
                {formatearMoneda(
                  totalConInteres(ventaCuota.totalVenta, ventaCuota.interes)
                )}
              </p>
              <p className="text-sm">
                Cuota Inicial: {formatearMoneda(ventaCuota.cuotaInicial)}
              </p>
              <p className="text-sm">
                Fecha Inicio:{" "}
                {new Date(ventaCuota.fechaInicio).toLocaleDateString()}
              </p>
            </div>
          )}
          <Dialog onOpenChange={setOpenRegistCuota} open={openRegistCuota}>
            <Button
              onClick={() => {
                setOpenRegistCuota(true);
              }}
              type="button"
              className="w-full mt-4"
              size="sm"
            >
              <Coins className="mr-2 h-4 w-4" />
              Registrar Cuota
            </Button>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Registrar Pago de Cuota</DialogTitle>
              </DialogHeader>
              <PaymentForm ventaCuotaId={ventaCuota.id} />
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    );
  };

  type EstadoPago = "PENDIENTE" | "PAGADA" | "ATRASADA";
  type EstadoCierre = "CANCELADA" | "COMPLETADA";

  interface PaymentFormProps {
    ventaCuotaId: number;
  }

  const PaymentForm: React.FC<PaymentFormProps> = ({ ventaCuotaId }) => {
    const usuarioId = useStore((state) => state.userId) ?? 0;
    const [monto, setMonto] = useState<string>("");
    const [estado, setEstado] = useState<EstadoPago>("PENDIENTE");
    const [error, setError] = useState<string | null>(null);
    const [comentario, setComentario] = useState<string>("");
    const [comentarioCierre, setComentarioCierre] = useState<string>("");

    const validateForm = (): boolean => {
      if (!monto || parseFloat(monto) <= 0) {
        setError("El monto debe ser un número positivo");
        return false;
      }
      setError(null);
      return true;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!validateForm()) return;

      const data = {
        monto: Number(monto),
        ventaCuotaId: Number(ventaCuotaId),
        estado: estado,
        comentario,
        usuarioId: Number(usuarioId),
      };

      try {
        const response = await axios.post(
          `${API_URL}/cuotas/register-new-pay`,
          data
        );

        if (response.status === 201) {
          toast.success("Registro de pago de cuota registrado");
          getCredits();
        }

        console.log("Pago registrado exitosamente");
        setMonto("");
        setEstado("PENDIENTE");
      } catch (error) {
        console.error("Error:", error);
        setError("Error al registrar el pago. Por favor, intente nuevamente.");
        console.log("Error al registrar pago de crédito. Inténtelo de nuevo");
      }
    };

    const [openColoseCredit, setOpenCloseCredit] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [estadoCierre, setEstadoCierre] =
      useState<EstadoCierre>("COMPLETADA");

    const handleCloseCredit = async (creditID: number) => {
      if (!creditID) {
        toast.error("El ID del crédito no es válido.");
        return;
      }

      if (isDeleting) {
        // Previene múltiples solicitudes simultáneas
        toast.info("El cierre ya está en proceso...");
        return;
      }

      setIsDeleting(true); // Marca como en proceso

      if (!estadoCierre) {
        toast.info("Seleccione un estado");
        setIsDeleting(false);
        return;
      }

      try {
        // Prepara el payload solo con datos válidos
        const payload = {
          comentario: comentarioCierre?.trim() || null, // Comentario opcional
          estado: estadoCierre,
        };
        // Realiza la solicitud
        const response = await axios.patch(
          `${API_URL}/cuotas/close-credit-regist/${creditID}`,
          payload
        );

        if (response.status === 200) {
          toast.success("Crédito cerrado con éxito");
          setOpenCloseCredit(false); // Cierra el diálogo
          getCredits(); // Actualiza la lista de créditos
        } else {
          throw new Error("Respuesta inesperada del servidor");
        }
      } catch (error) {
        toast.error("Error al registrar el cierre. Inténtelo de nuevo.");
        setIsDeleting(false); // Restaura el estado independientemente del resultado
      }
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="monto">Monto</Label>
          <Input
            id="monto"
            type="number"
            step="0.01"
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
            placeholder="Ingrese el monto"
            required
            aria-describedby="monto-error"
          />
          {error && (
            <p id="monto-error" className="text-sm text-red-500 mt-1">
              {error}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="estado">Estado</Label>
          <Select
            value={estado}
            onValueChange={(value: EstadoPago) => setEstado(value)}
          >
            <SelectTrigger id="estado">
              <SelectValue placeholder="Seleccione el estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PENDIENTE">Pendiente</SelectItem>
              <SelectItem value="PAGADA">Pagada</SelectItem>
              <SelectItem value="ATRASADA">Atrasada</SelectItem>
            </SelectContent>
          </Select>

          <Textarea
            className="my-2"
            onChange={(e) => setComentario(e.target.value)}
            value={comentario}
            placeholder="Ingresar comentario (opcional)"
          />
        </div>
        <Button type="submit" className="w-full">
          Registrar Pago
        </Button>
        <Button
          className="w-full"
          variant="destructive"
          type="button"
          disabled={isDeleting}
          // onClick={() => handleCloseCredit(ventaCuotaId)}
          onClick={() => setOpenCloseCredit(true)}
        >
          Cerrar Registro
        </Button>

        <Dialog onOpenChange={setOpenCloseCredit} open={openColoseCredit}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar Cierre del Crédito</DialogTitle>
              <DialogDescription>
                Estás a punto de cerrar este registro de crédito. Una vez
                cerrado:
              </DialogDescription>
              <ul className="list-disc pl-6 text-muted-foreground text-sm">
                <li>No se podrán registrar más pagos.</li>
                <li>El estado del crédito será marcado como finalizado.</li>
                <li>Esta acción no se puede deshacer.</li>
              </ul>

              <DialogDescription className="mt-2">
                ¿Estás seguro de que deseas continuar?
              </DialogDescription>

              <div className="py-2">
                <Label htmlFor="estadoCierre">Estado</Label>
                <Select
                  value={estadoCierre}
                  onValueChange={(value: EstadoCierre) =>
                    setEstadoCierre(value)
                  }
                >
                  <SelectTrigger id="estadoCierre">
                    <SelectValue placeholder="Seleccione el estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="COMPLETADA">COMPLETADA</SelectItem>
                    <SelectItem value="CANCELADA">CANCELADA</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </DialogHeader>
            <div className="mt-4 space-y-4">
              <Textarea
                placeholder="Añadir un comentario final (opcional)"
                value={comentarioCierre}
                onChange={(e) => setComentarioCierre(e.target.value)}
                className="w-full"
              />
              <div className="flex justify-end space-x-2">
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => setOpenCloseCredit(false)}
                >
                  Cancelar
                </Button>
                <Button
                  className="w-full"
                  variant="destructive"
                  disabled={isDeleting}
                  onClick={() => {
                    handleCloseCredit(ventaCuotaId);
                  }}
                >
                  {isDeleting ? "Cerrando..." : "Cerrar Crédito"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </form>
    );
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Dashboard de Administrador</h1>

      {/* Resumen de ventas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Ventas del mes{" "}
            </CardTitle>
            <CoinsIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat("es-GT", {
                style: "currency",
                currency: "GTQ",
              }).format(ventasMes)}
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Ingresos de la semana
            </CardTitle>
            <CoinsIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat("es-GT", {
                style: "currency",
                currency: "GTQ",
              }).format(ventasSemana)}
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Ingresos del dia{" "}
            </CardTitle>
            <CoinsIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat("es-GT", {
                style: "currency",
                currency: "GTQ",
              }).format(ventasDia)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* MOSTRAR LAS SOLICITUDES DE PRECIO */}
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl">
            Solicitud de Precio Especial
          </CardTitle>
        </CardHeader>
        <CardContent className="h-full">
          {solicitudes && solicitudes.length > 0 ? (
            solicitudes.map((soli) => (
              <Card key={soli.id} className="m-4 shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg">Solicitud de Precio</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-cyan-500">
                    Estado: <strong>{soli.estado}</strong>
                  </p>
                  <p className="text-sm mt-1">
                    Producto: <strong>{soli.producto.nombre}</strong> -{" "}
                    {soli.producto.descripcion}
                  </p>
                  <p className="text-sm">
                    Solicitado por: <strong>{soli.solicitadoPor.nombre}</strong>
                    ({soli.solicitadoPor.rol}) de{" "}
                    <strong>{soli.solicitadoPor.sucursal.nombre}</strong>
                  </p>
                  <p className="text-sm">
                    Precio solicitado:{" "}
                    <strong>
                      {new Intl.NumberFormat("es-GT", {
                        style: "currency",
                        currency: "GTQ",
                      }).format(soli.precioSolicitado)}
                    </strong>
                  </p>
                  <p className="text-sm text-gray-500">
                    Fecha de solicitud: {formatearFecha(soli.fechaSolicitud)}
                  </p>

                  {soli.fechaRespuesta && (
                    <p className="text-sm text-gray-500">
                      Fecha de respuesta:{" "}
                      {new Date(soli.fechaRespuesta).toLocaleString()}
                    </p>
                  )}
                  <div className="flex gap-2 mt-2">
                    <Button
                      onClick={() => setOpenAcept(true)}
                      variant={"default"}
                    >
                      Aceptar
                    </Button>

                    <Dialog open={openAcept} onOpenChange={setOpenAcept}>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle className="text-center">
                            Aceptar solicitud de precio
                          </DialogTitle>
                          <DialogDescription className="text-center">
                            Al aceptar la solicitud se creará una instancia de
                            precio que solo se podrá usar una vez para este
                            producto.
                          </DialogDescription>
                          <DialogDescription className="text-center">
                            ¿Continuar?
                          </DialogDescription>
                        </DialogHeader>
                        <div className="flex justify-end gap-2">
                          <Button
                            className="w-full"
                            onClick={() => handleAceptRequest(soli.id)}
                          >
                            Aceptar
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Button
                      onClick={() => setOpenReject(true)}
                      variant={"destructive"}
                    >
                      Rechazar
                    </Button>

                    <Dialog open={openReject} onOpenChange={setOpenReject}>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle className="text-center">
                            Aceptar solicitud de precio
                          </DialogTitle>
                          <DialogDescription className="text-center">
                            Se le negará este precio a la sucursal
                          </DialogDescription>
                          <DialogDescription className="text-center">
                            ¿Continuar?
                          </DialogDescription>
                        </DialogHeader>
                        <div className="flex justify-end gap-2">
                          <Button
                            variant={"destructive"}
                            className="w-full"
                            onClick={() => handleRejectRequest(soli.id)}
                          >
                            Si, continuar
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-center text-gray-500">
              No hay solicitudes de precio.
            </p>
          )}
        </CardContent>
      </Card>

      {/* MOSTRAS LAS SOLICITUDES DE TRANSFERENCIA */}
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl">
            Solicitudes de Transferencia de Producto
          </CardTitle>
        </CardHeader>
        <CardContent className="h-full">
          {solicitudesTransferencia && solicitudesTransferencia.length > 0 ? (
            solicitudesTransferencia.map((soli) => (
              <Card key={soli.id} className="m-4 shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg">
                    Solicitud de Transferencia
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-cyan-500">
                    Estado: <strong>{soli.estado}</strong>
                  </p>
                  <p className="text-sm mt-1">
                    Producto: <strong>{soli.producto.nombre}</strong>
                  </p>
                  <p className="text-sm">
                    Solicitado por:{" "}
                    <strong>
                      {soli.usuarioSolicitante.nombre} (
                      {soli.usuarioSolicitante.rol})
                    </strong>
                  </p>
                  <p className="text-sm">
                    Cantidad solicitada: <strong>{soli.cantidad}</strong>
                  </p>
                  <p className="text-sm">
                    Sucursal Origen:{" "}
                    <strong>{soli.sucursalOrigen.nombre}</strong>
                  </p>
                  <p className="text-sm">
                    Sucursal Destino:{" "}
                    <strong>{soli.sucursalDestino.nombre}</strong>
                  </p>
                  <p className="text-sm text-gray-500">
                    Fecha de solicitud: {formatearFecha(soli.fechaSolicitud)}
                  </p>

                  <div className="flex gap-2 mt-2">
                    <Button
                      onClick={() => setOpenAceptarTransferencia(true)}
                      variant={"default"}
                    >
                      Aceptar
                    </Button>

                    <Dialog
                      open={openAceptarTransferencia}
                      onOpenChange={setOpenAceptarTransferencia}
                    >
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle className="text-center">
                            Aceptar solicitud de Transferencia
                          </DialogTitle>
                          <DialogDescription className="text-center">
                            Se le descontará stock a la sucursal de origen y se
                            asignará a la sucursal de destino.
                          </DialogDescription>
                          <DialogDescription className="text-center">
                            ¿Continuar?
                          </DialogDescription>
                        </DialogHeader>
                        <div className="flex justify-end gap-2">
                          <Button
                            className="w-full"
                            onClick={() => handleAceptarTransferencia(soli.id)}
                          >
                            Sí, transferir producto
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Button
                      onClick={() => setOpenRechazarTransferencia(true)}
                      variant={"destructive"}
                    >
                      Rechazar
                    </Button>

                    <Dialog
                      open={openRechazarTransferencia}
                      onOpenChange={setOpenRechazarTransferencia}
                    >
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle className="text-center">
                            Rechazar transferencia de producto
                          </DialogTitle>
                          <DialogDescription className="text-center">
                            Se negará esta transferencia.
                          </DialogDescription>
                          <DialogDescription className="text-center">
                            ¿Continuar?
                          </DialogDescription>
                        </DialogHeader>
                        <div className="flex justify-end gap-2">
                          <Button
                            variant={"destructive"}
                            className="w-full"
                            onClick={() => handleRejectTransferencia(soli.id)}
                          >
                            Sí, negar y continuar
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-center text-gray-500">
              No hay solicitudes de transferencia.
            </p>
          )}
        </CardContent>
      </Card>

      {/* MOSTRAR GARANTÍAS ACTIVAS */}
      <div className="space-y-4">
        {warranties && warranties.length > 0 ? (
          warranties.map((garantia) => (
            <Card
              key={garantia.id}
              className="w-full shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg font-semibold">
                    Garantía No. #{garantia.id}
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Badge
                      className={`${estadoColor[garantia.estado]} text-white`}
                    >
                      {garantia.estado}
                    </Badge>
                    <TooltipProvider>
                      <Tooltip2>
                        <TooltipTrigger asChild>
                          <Link to={`/ticket-garantia/${garantia.id}`}>
                            <TicketCheck className="cursor-pointer" />
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Generar ticket de garantía</p>
                        </TooltipContent>
                      </Tooltip2>
                    </TooltipProvider>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleCard(garantia.id)}
                    >
                      {expandedCard === garantia.id ? (
                        <ChevronUp />
                      ) : (
                        <ChevronDown />
                      )}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">
                      Cliente: {garantia.cliente.nombre}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Box className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">
                      Producto: {garantia.producto.nombre}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span>
                      Fecha de recepción:{" "}
                      {formatearFecha(garantia.fechaRecepcion)}
                    </span>
                  </div>
                </div>
                {expandedCard === garantia.id && (
                  <>
                    <Separator className="my-2" />
                    <div className="grid grid-cols-2 gap-2 text-sm mt-2">
                      <div className="flex items-center gap-1">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <span>
                          Teléfono cliente: {garantia.cliente.telefono}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span>
                          Dirección cliente: {garantia.cliente.direccion}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <IdCard className="w-4 h-4 text-gray-500" />
                        <span>DPI: {garantia.cliente.dpi}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <TextIcon className="w-4 h-4 text-gray-500" />
                        <span>{garantia.producto.descripcion}</span>
                      </div>
                    </div>
                    {garantia.proveedor ? (
                      <div className="mt-2 text-sm">
                        <Badge className="mb-2">
                          <p className=" font-semibold">Enviado a proveedor:</p>
                        </Badge>
                        <p>{garantia.proveedor.nombre}</p>
                        <p>Teléfono: {garantia.proveedor.telefono}</p>
                        <p>
                          Teléfono contacto:{" "}
                          {garantia.proveedor.telefonoContacto}
                        </p>
                      </div>
                    ) : (
                      <div className="mt-2 text-sm">
                        <Badge variant={"default"}>
                          <p className="font-medium">{garantia.estado}</p>
                        </Badge>
                      </div>
                    )}
                    <Separator className="my-2" />
                    <div className="mt-2 text-sm">
                      <p className="font-medium">Comentario:</p>
                      <p className="text-gray-600">{garantia.comentario}</p>
                      <p className="font-medium mt-2">
                        Descripción del problema:
                      </p>
                      <p className="text-gray-600">
                        {garantia.descripcionProblema}
                      </p>
                    </div>
                    <Separator className="my-2" />
                    <div className="mt-2 text-xs text-gray-500">
                      <p>
                        Recibido por: {garantia.usuarioRecibe.nombre} (
                        {garantia.usuarioRecibe.rol})
                      </p>
                      <p>Sucursal: {garantia.usuarioRecibe.sucursal.nombre}</p>
                      <p>Creado: {formatearFecha(garantia.creadoEn)}</p>
                      <p>
                        Actualizado: {formatearFecha(garantia.actualizadoEn)}
                      </p>
                    </div>
                    <div className="mt-4">
                      <Button
                        // onClick={() => openUpdateWarranty(garantia.id)}

                        onClick={() => {
                          setWarrantyId(garantia.id);
                          handleOpenUpdateDialog(garantia);
                          setProductoIdW(garantia.productoId);
                        }}
                        variant={"destructive"}
                      >
                        Actualizar registro
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Registros de garantía</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center text-base">
                No hay registros de garantía disponibles
              </CardDescription>
            </CardContent>
          </Card>
        )}
      </div>

      {/* MOSTRAR LOS CRÉDITOS ACTIVOS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {creditos.map((ventaCuota) => (
          <VentaCuotaCard key={ventaCuota.id} ventaCuota={ventaCuota} />
        ))}
      </div>

      {/* MOSTRAR DIALOG DE ACTUALIZAR REGISTRO DE GARANTÍA */}
      <Dialog open={openUpdateWarranty} onOpenChange={setOpenUpdateWarranty}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center">
              Actualizar Garantía
            </DialogTitle>
            <DialogDescription className="text-center">
              Puedes actualizar los detalles del comentario, descripción del
              problema y estado de la garantía.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <label className="block">
              <span className="text-gray-700">Comentario</span>
              <textarea
                className="mt-1 block w-full border rounded-md
                px-2 py-1 bg-transparent
                "
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
              />
            </label>
            <label className="block">
              <span className="text-gray-700">Descripción del Problema</span>
              <textarea
                className="mt-1 block w-full border rounded-md
                px-2 py-1 bg-transparent
                "
                value={descripcionProblema}
                onChange={(e) => setDescripcionProblema(e.target.value)}
              />
            </label>
            <label className="block">
              <span className="text-gray-700">Estado de Garantía</span>
              <select
                className="mt-1 block w-full border rounded-md bg-white text-black p-2"
                value={estado || ""}
                onChange={(e) => setEstado(e.target.value as EstadoGarantia)}
              >
                {Object.values(EstadoGarantia).map((estadoValue) => (
                  <option key={estadoValue} value={estadoValue}>
                    {estadoValue}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className=" gap-2 mt-4">
            <Button onClick={handleUpdateRegistW} className="w-full my-1">
              Actualizar registro
            </Button>
            <Button
              variant={"destructive"}
              className="w-full"
              onClick={() => {
                setOpenUpdateWarranty(false);
                setOpenFinishWarranty(true);
              }}
            >
              Cerrar registro
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      {/* MOSTRAR DIALOG DE FINALZIACION DE REGISTRO DE GARANTIA */}
      <Dialog open={openFinishWarranty} onOpenChange={setOpenFinishWarranty}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center">
              Finalizar Registro de Garantía
            </DialogTitle>
            <DialogDescription className="text-center">
              Completa los detalles finales de la garantía para formalizar el
              registro.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block font-medium">Estado</label>
              <select
                value={estadoRegistFinishW}
                onChange={(e) => setEstadoFinishW(e.target.value)}
                className="w-full border rounded px-2 py-1 text-black"
              >
                <option value="">Seleccionar Estado</option>
                <option value="REPARADO">Reparado</option>
                <option value="REEMPLAZADO">Reemplazado</option>
                <option value="CERRADO">Cerrado (cancelado)</option>

                {/* <option value="ENTREGADO_CLIENTE">Entregado al Cliente</option> */}
                {/* Agrega otros estados según el enum EstadoGarantia */}
              </select>
            </div>
            <div>
              <label className="block font-medium">Conclusión</label>
              <textarea
                value={conclusion}
                onChange={(e) => setConclusion(e.target.value)}
                className="w-full border border-gray-300 rounded px-2 py-1"
                placeholder="Ej. Reparado, Reemplazado"
              />
            </div>
            <div>
              <label className="block font-medium">Acciones Realizadas</label>
              <textarea
                value={accionesRealizadas}
                onChange={(e) => setAccionesRealizadas(e.target.value)}
                className="w-full border border-gray-300 rounded px-2 py-1"
                placeholder="Describe las acciones realizadas (opcional)"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button onClick={handleSubmitFinishRegistW} className="w-full">
              Finalizar Registro
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Gráfico de ventas */}
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle>Ventas de la Semana</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ventasSemanalChart}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="dia" />
              <YAxis />
              <Tooltip
                formatter={(value, name) => {
                  if (name === "totalVenta") {
                    return [`Q${value}`, "Total Venta"];
                  } else if (name === "ventas") {
                    return [`${value} ventas`, "Número de Ventas"];
                  }
                  return value;
                }}
                labelFormatter={(label) => {
                  const dayData = ventasSemanalChart.find(
                    (d) => d.dia === label
                  );
                  return dayData
                    ? `Fecha: ${new Date(dayData.fecha).toLocaleDateString()}`
                    : label;
                }}
              />
              <Bar dataKey="totalVenta" fill="#8884d8" name="Total Venta" />
              <Bar dataKey="ventas" fill="#82ca9d" name="Número de Ventas" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Productos e inventario */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle>Productos Más Vendidos</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Producto</TableHead>
                  <TableHead>Ventas</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {masVendidos &&
                  masVendidos.map((product, index) => (
                    <TableRow key={index}>
                      <TableCell>{product.nombre}</TableCell>
                      <TableCell>{product.totalVentas}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle>Transacciones Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Fecha y hora</TableHead>
                  <TableHead>Monto Total</TableHead>
                  <TableHead>Sucursal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transaccionesRecientes &&
                  transaccionesRecientes.map((transaction, index) => (
                    <TableRow key={index}>
                      <TableCell>#{transaction.id}</TableCell>
                      <TableCell>
                        {formatearFecha(transaction.fechaVenta)}
                      </TableCell>
                      <TableCell>
                        {new Intl.NumberFormat("es-GT", {
                          style: "currency",
                          currency: "GTQ",
                        }).format(transaction.totalVenta)}
                      </TableCell>
                      <TableCell>{transaction.sucursal.nombre}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Actividades recientes y Calendario */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4"></div>

      {/* Notificaciones y alertas */}
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle>Notificaciones y Alertas</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li className="flex items-center text-yellow-600">
              <AlertCircle className="mr-2 h-4 w-4" />
              Inventario bajo para Producto X
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
