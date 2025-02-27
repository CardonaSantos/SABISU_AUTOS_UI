import { useStore } from "@/components/Context/ContextSucursal";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  // CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axios from "axios";
import {
  AlertTriangle,
  ArrowDownIcon,
  ArrowUpIcon,
  Banknote,
  Calendar,
  Check,
  CheckCircle,
  Clock,
  Coins,
  CreditCard,
  Delete,
  Edit,
  FileText,
  Lock,
  MoreVertical,
  Percent,
  Search,
  Store,
  Target,
  TargetIcon,
  Trash2,
  TrendingDown,
  TrendingUp,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import SelectComponent, { SingleValue } from "react-select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import dayjs from "dayjs";

import dayOfYear from "dayjs/plugin/dayOfYear";
import isLeapYear from "dayjs/plugin/isLeapYear"; // ES 2015
import advancedFormat from "dayjs/plugin/advancedFormat"; // ES 2015
import currency from "currency.js";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

dayjs.extend(advancedFormat);
dayjs.extend(dayOfYear);
dayjs.extend(isLeapYear);

const API_URL = import.meta.env.VITE_API_URL;
interface MetaCobros {
  id: number; // ID de la meta
  usuarioId: number; // ID del usuario al que pertenece la meta
  sucursalId: number; // ID de la sucursal asociada a la meta
  fechaCreado: string; // Fecha de creación de la meta (ISO 8601)
  fechaInicio: string; // Fecha de inicio de la meta (ISO 8601)
  fechaFin: string; // Fecha de fin de la meta (ISO 8601)
  montoMeta: number; // Monto objetivo de la meta
  montoActual: number; // Monto acumulado actual
  cumplida: boolean; // Indica si la meta fue cumplida
  fechaCumplida: string | null; // Fecha en que se cumplió la meta, si aplica
  numeroDepositos: number; // Número de depósitos asociados a la meta
  tituloMeta: string; // Título descriptivo de la meta
  DepositoCobro: DepositoCobro[]; // Lista de depósitos asociados a la meta
  sucursal: Sucursal; // Información de la sucursal
  usuario: Usuario; // Información del usuario
}

interface DepositoCobro {
  id: number; // ID del depósito
  usuarioId: number; // ID del usuario que realizó el depósito
  sucursalId: number; // ID de la sucursal asociada al depósito
  numeroBoleta: string; // Número de boleta o comprobante del depósito
  fechaRegistro: string; // Fecha de registro del depósito (ISO 8601)
  montoDepositado: number; // Monto del depósito realizado
  descripcion: string; // Descripción adicional del depósito
  metaCobroId: number; // ID de la meta a la que está asociado el depósito
}

interface Sucursal {
  id: number; // ID de la sucursal
  nombre: string; // Nombre de la sucursal
  direccion: string; // Dirección de la sucursal
  telefono: string; // Teléfonos de contacto
  pbx: string; // PBX de la sucursal
}

interface Usuario {
  id: number; // ID del usuario
  nombre: string; // Nombre del usuario
  rol: string; // Rol del usuario (por ejemplo, ADMIN, VENDEDOR, etc.)
}
//INTERFACES PARA METAS DE TIENDAS
// Interfaz principal para la meta de ventas o tienda
interface MetaTienda {
  id: number; // ID único de la meta
  cumplida: boolean; // Indica si la meta ha sido cumplida
  fechaCumplida: string | null; // Fecha en que se cumplió la meta, si aplica
  fechaFin: string; // Fecha de finalización de la meta (ISO 8601)
  fechaInicio: string; // Fecha de inicio de la meta (ISO 8601)
  montoActual: number; // Progreso actual del monto
  montoMeta: number; // Monto objetivo de la meta
  numeroVentas: number; // Número total de ventas realizadas
  sucursalId: number; // ID de la sucursal asociada
  tituloMeta: string; // Título o descripción de la meta
  usuarioId: number; // ID del usuario asociado a la meta
  estado: string;
  sucursal: SucursalMetaTiendas; // Detalles de la sucursal asociada
  usuario: UsuarioMetaTiendas; // Detalles del usuario asociado
}

// Interfaz para la sucursal
interface SucursalMetaTiendas {
  id: number; // ID único de la sucursal
  nombre: string; // Nombre de la sucursal
  telefono: string; // Teléfono(s) de la sucursal
  direccion: string; // Dirección de la sucursal
}

// Interfaz para el usuario
interface UsuarioMetaTiendas {
  id: number; // ID único del usuario
  nombre: string; // Nombre del usuario
  correo: string; // Correo electrónico del usuario
  rol: string; // Rol del usuario (e.g., ADMIN, VENDEDOR, etc.)
}

type TipoMeta = "Tienda" | "Cobro"; // Tipo literal para restringir los valores posibles

interface MetaInterfaceDTO {
  usuarioId: number | null;
  tipoMeta: TipoMeta;
  tituloMeta: string;
  montoMeta: number;
  fechaFin: string;
  sucursalId: number;
}

interface UsuarioSucursal {
  id: number; // ID único del usuario
  nombre: string; // Nombre completo del usuario
  correo: string; // Correo electrónico del usuario
  sucursal: Sucursal; // Relación con la sucursal
}

interface Sucursal {
  id: number; // ID único de la sucursal
  nombre: string; // Nombre de la sucursal
}

interface OptionSelected {
  value: number;
  label: string;
}

interface EditMetaTiendaDialogProps {
  open: boolean;
  onClose: () => void;
  metaTienda: MetaTienda | null;
  onUpdate: (updatedMeta: MetaTienda) => void; // Función para actualizar
}

function Metas() {
  const userId = useStore((state) => state.userId) ?? 0;
  const sucursalId = useStore((state) => state.sucursalId) ?? 0;
  const [metasCobros, setMetasCobros] = useState<MetaCobros[]>([]);

  const [metasTienda, setMetasTienda] = useState<MetaTienda[]>([]);
  const [usuarios, setUsuarios] = useState<UsuarioSucursal[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [openUpdateMetaTienda, setOpenUpdateMetaTienda] = useState(false);
  // const [openUpdateMetaCobro, setOpenUpdateMetaCobro] = useState(false);

  const [metaTiendaSelected, setMetaTiendaSelected] =
    useState<MetaTienda | null>(null);

  // const [formData, setFormData] = useState<MetaTienda | null>(null);

  const [metaDto, setMetaDto] = useState<MetaInterfaceDTO>({
    usuarioId: 0,
    tipoMeta: "Tienda",
    tituloMeta: "",
    montoMeta: 0,
    fechaFin: "",
    sucursalId: sucursalId,
  });

  const getMetasCobros = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/metas/get-all-cobros-metas/${sucursalId}`
      );

      if (response.status === 200) {
        setMetasCobros(response.data);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error al conseguir los registros de metas de cobros");
    }
  };

  const getMetasTienda = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/metas/get-all-seller-goals/${sucursalId}`
      );
      if (response.status === 200) {
        setMetasTienda(response.data);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error al conseguir los registros de metas de tiendas");
    }
  };

  const getUsuarios = async () => {
    try {
      const response = await axios.get(`${API_URL}/metas/get-all-metas-users`);
      if (response.status === 200) {
        setUsuarios(response.data);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error al cargar los usuarios");
    }
  };

  useEffect(() => {
    if (sucursalId) {
      getMetasCobros();
      getMetasTienda();
      getUsuarios();
    }
  }, []);

  const filteredMetasTienda = metasTienda.filter(
    (meta) =>
      (meta.tituloMeta ? meta.tituloMeta.toLowerCase() : "").includes(
        searchTerm.toLowerCase()
      ) ||
      meta.sucursal.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      meta.usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredMetasCobros = metasCobros.filter(
    (meta) =>
      (meta.tituloMeta ? meta.tituloMeta.toLowerCase() : "").includes(
        searchTerm.toLowerCase()
      ) ||
      meta.sucursal.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      meta.usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Opciones para el componente Select
  const optionsUsuarios = usuarios.map((user) => ({
    value: user.id,
    label: `${user.nombre} (${user.sucursal.nombre})`,
  }));

  //LA UNICA RAZON DE ESTE STATE ES PARA LIMPIAR EL INPUT
  const [opcionSeleccionada, setOpcionSeleccionada] =
    useState<OptionSelected | null>(null); // Usuario seleccionado
  // Manejar cambios en el Select de usuarios
  const handleChangeUser = (
    opcionSeleccionada: SingleValue<OptionSelected>
  ) => {
    setOpcionSeleccionada(opcionSeleccionada);
    setMetaDto((datosPrevios) => ({
      ...datosPrevios,
      usuarioId: opcionSeleccionada?.value || null, // Actualizar el usuarioId
    }));
  };
  console.log("La data a enviar es: ", metaDto);

  const handleSubmitGoal = async () => {
    try {
      // Validar que todos los campos requeridos estén presentes
      const { usuarioId, tipoMeta, fechaFin, montoMeta } = metaDto;

      if (!usuarioId || !tipoMeta || !fechaFin || !montoMeta) {
        toast.info("Faltan datos para continuar");
        return;
      }

      const user = usuarios.find((user) => user.id === usuarioId);
      const endpoint =
        tipoMeta === "Tienda"
          ? `${API_URL}/metas`
          : `${API_URL}/metas/regist-new-meta-cobros`;

      // Construir el cuerpo de la solicitud
      const requestBody = {
        usuarioId,
        tipoMeta,
        tituloMeta: metaDto.tituloMeta || null, // Título puede ser opcional
        montoMeta,
        fechaFin: new Date(fechaFin),
        sucursalId: sucursalId,
      };

      // Enviar la solicitud al backend
      const response = await axios.post(endpoint, requestBody);

      // Verificar la respuesta
      if (response.status === 201) {
        toast.success(`Meta registrada para el usuario ${user?.nombre}`);
        resetForm(); // Restablecer el formulario
        getMetasCobros();
        getMetasTienda();
      }
    } catch (error) {
      console.error(error);
      toast.error(
        metaDto.tipoMeta === "Tienda"
          ? "Error al crear meta de tienda"
          : "Error al crear meta de cobros"
      );
    }
  };

  // Función para restablecer el formulario
  const resetForm = () => {
    setMetaDto({
      usuarioId: null,
      tipoMeta: "Tienda",
      tituloMeta: "",
      montoMeta: 0,
      fechaFin: "",
      sucursalId: sucursalId,
    });
    setOpcionSeleccionada(null);
  };
  console.log("Los usuarios son: ", usuarios);

  const [openDepositosDialog, setOpenDepositosDialog] = useState(false);
  const [selectedMeta, setSelectedMeta] = useState<MetaCobros>();

  const handleOpenDepositos = (meta: MetaCobros) => {
    setSelectedMeta(meta); // Establece la meta seleccionada
    setOpenDepositosDialog(true); // Abre el dialog
  };

  const formatearMoneda = (monto: number) => {
    return currency(monto, {
      symbol: "Q",
      separator: ",",
      decimal: ".",
      precision: 2,
    }).format();
  };

  const [openDeletDepo, setOpenDeletDepo] = useState(false);
  const [selectedDepo, setSelectedDepo] = useState<DepositoCobro>();

  const onConfirmDelete = async (id: number) => {
    console.log("EL DEPOSITO ELIMINADO ES: ", id);

    try {
      const response = await axios.delete(
        `${API_URL}/metas/delete-one-payment/${selectedMeta?.id}/${selectedDepo?.id}`
      );
      if (response.status === 200 || response.status === 201) {
        toast.success("Depósito eliminado correctamente");
        setOpenDeletDepo(false);
        setOpenDepositosDialog(false);
        getMetasCobros();
      }
    } catch (error) {
      console.log(error);
      toast.error("Error al eliminar registro");
    }
  };

  const calcularReferencia = () => {
    const hoy = dayjs();
    const totalDiasMes = dayjs().daysInMonth(); // Obtiene el total de días en el mes actual
    const diaActual = hoy.date(); // Obtiene el día actual del mes (1-31)

    return (diaActual / totalDiasMes) * 100; // Calcula el porcentaje del mes transcurrido
  };

  console.log("Las metas de tienda son: ", metasTienda);

  const [openDeleteCobro, setOpenDeleteCobro] = useState(false);
  const [CobroToDelete, setCobroToDelete] = useState(0);
  const [passwordAdminCobro, setPasswordAdminCobro] = useState("");
  //
  const [openDeleteG, setOpenDeleteG] = useState(false);
  const [goalToDelete, setGoalToDelete] = useState(0);
  const [passwordAdmin, setPasswordAdmin] = useState("");

  const handleDeleteMeta = async () => {
    try {
      if (!goalToDelete || !userId || !passwordAdmin || goalToDelete <= 0) {
        toast.info("Faltan datos para completar la acción");
        return;
      }

      const response = await axios.delete(
        `${API_URL}/metas/delete-one-goal/${goalToDelete}/${userId}`,
        {
          data: {
            passwordAdmin: passwordAdmin,
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        toast.success("Registro de meta eliminado");
        getMetasTienda();
        setOpenDeleteG(false);
        setPasswordAdmin("");
        setGoalToDelete(0);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error al eliminar el registro");
    }
  };

  const handleDeleteCobro = async () => {
    try {
      if (
        !CobroToDelete ||
        !userId ||
        !passwordAdminCobro ||
        CobroToDelete <= 0
      ) {
        toast.info("Faltan datos para completar la acción");
        return;
      }

      const response = await axios.delete(
        `${API_URL}/metas/delete-one-cobro-goal/${CobroToDelete}/${userId}`,
        {
          data: {
            passwordAdmin: passwordAdminCobro,
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        toast.success("Registro de meta eliminado");
        getMetasCobros();
        setOpenDeleteCobro(false);
        setPasswordAdminCobro("");
        setCobroToDelete(0);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error al eliminar el registro");
    }
  };

  //METAS DE COBROS
  const getMetasCobroTotal = () => {
    return metasCobros.reduce((acc, meta) => acc + meta.montoMeta, 0);
  };

  const getMetasCobroAvance = () => {
    return metasCobros.reduce((acc, meta) => acc + meta.montoActual, 0);
  };

  const getMetasCobroRestante = () => {
    return getMetasCobroTotal() - getMetasCobroAvance();
  };

  const getPercentMetaCobro = () => {
    let montoMeta = metasCobros.reduce((acc, meta) => acc + meta.montoMeta, 0);
    let montoActual = metasCobros.reduce(
      (acc, meta) => acc + meta.montoActual,
      0
    );
    const porcentaje = montoActual >= 0 ? (montoActual / montoMeta) * 100 : 0;
    console.log("El porcentaje de avance es: ", porcentaje.toFixed(1));

    return porcentaje;
  };

  //METAS DE TIENDAS
  const getMetasTiendaTotal = () => {
    return metasTienda.reduce((acc, meta) => acc + meta.montoMeta, 0);
  };

  const getMetasTiendaAvance = () => {
    return metasTienda.reduce((acc, meta) => acc + meta.montoActual, 0);
  };

  const getMetasTiendaRestante = () => {
    return getMetasTiendaTotal() - getMetasTiendaAvance();
  };

  const getPercentTiendaCobro = () => {
    let montoMeta = metasTienda.reduce((acc, meta) => acc + meta.montoMeta, 0);
    let montoActual = metasTienda.reduce(
      (acc, meta) => acc + meta.montoActual,
      0
    );
    const porcentaje = montoActual >= 0 ? (montoActual / montoMeta) * 100 : 0;
    console.log(
      "El porcentaje de avance de metas tienda es: ",
      porcentaje.toFixed(1)
    );

    return porcentaje;
  };

  return (
    <div className="container mx-auto p-4">
      <Tabs defaultValue="asignar" className="w-full">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-4">
          <TabsTrigger value="asignar">
            <Target className="w-4 h-4 mr-2" />
            Asignar Metas
          </TabsTrigger>
          <TabsTrigger value="tiendas">
            <Store className="w-4 h-4 mr-2" />
            Metas de Tiendas
          </TabsTrigger>
          <TabsTrigger value="cobros">
            <CreditCard className="w-4 h-4 mr-2" />
            Metas de Cobros
          </TabsTrigger>

          <TabsTrigger value="totales">
            <CreditCard className="w-4 h-4 mr-2" />
            Totales
          </TabsTrigger>
        </TabsList>
        <TabsContent value="asignar">
          <Card>
            <CardHeader>
              <CardTitle>Asignar Metas</CardTitle>
              <CardDescription>
                Asigna metas a usuarios y cobradores
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="usuario">Usuario</Label>
                    <SelectComponent
                      isClearable
                      className="text-black"
                      placeholder="Seleccione un usuario"
                      id="usuario"
                      value={opcionSeleccionada} // Vinculo esto para que pueda limpiar el input cuando sea success
                      options={optionsUsuarios}
                      onChange={handleChangeUser}
                    ></SelectComponent>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tipoMeta">Tipo de Meta</Label>
                    {/* Recibirá un tipo de dato que solo sea del type definido, lo especifico aqui en el onValueChange */}
                    <Select
                      value={metaDto.tipoMeta}
                      onValueChange={(value: TipoMeta) =>
                        setMetaDto((datosprevios) => ({
                          ...datosprevios,
                          tipoMeta: value,
                        }))
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={metaDto.tipoMeta} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Tienda">Tienda</SelectItem>
                        <SelectItem value="Cobro">Cobro</SelectItem>
                      </SelectContent>
                    </Select>
                    {metaDto.tipoMeta && (
                      <p className="text-sm">
                        La meta seleccionada es de {metaDto.tipoMeta}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="titulo">Titulo de la meta</Label>
                    <Input
                      value={metaDto.tituloMeta || ""}
                      onChange={(e) =>
                        setMetaDto((datosprevios) => ({
                          ...datosprevios,
                          tituloMeta: e.target.value,
                        }))
                      }
                      id="titulo"
                      placeholder="Meta del mes de enero 2025 (opcional)"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="montoMeta">Monto de la Meta</Label>
                    <Input
                      value={metaDto.montoMeta}
                      onChange={(e) =>
                        setMetaDto((datosprevios) => ({
                          ...datosprevios,
                          montoMeta: Number(e.target.value),
                        }))
                      }
                      id="montoMeta"
                      type="number"
                      placeholder="0.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fechaFin">Fecha Límite</Label>
                    <Input
                      value={metaDto.fechaFin}
                      onChange={(e) =>
                        setMetaDto((datosprevios) => ({
                          ...datosprevios,
                          fechaFin: e.target.value,
                        }))
                      }
                      id="fechaFin"
                      type="date"
                    />
                  </div>
                </div>
                <Button
                  type="button"
                  className="w-full"
                  onClick={handleSubmitGoal}
                >
                  Asignar Meta
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="tiendas">
          <Card>
            <CardHeader>
              <CardTitle>Metas de Tiendas</CardTitle>
              <CardDescription>
                Visualiza y gestiona las metas de las tiendas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Label htmlFor="searchTiendas">Buscar</Label>
                <div className="flex">
                  <Input
                    id="searchTiendas"
                    placeholder="Buscar por título, sucursal o usuario"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-grow"
                  />
                  <Button variant="outline" className="ml-2">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Título</TableHead>
                      <TableHead>Usuario</TableHead>
                      <TableHead>Monto Meta</TableHead>
                      <TableHead>Monto Actual</TableHead>
                      <TableHead>Faltante</TableHead>

                      <TableHead>Porcentaje</TableHead>
                      <TableHead>Referencia</TableHead>

                      <TableHead>Diferencia</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Acción</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMetasTienda.map((meta) => {
                      const porcentaje =
                        meta.montoMeta > 0
                          ? (meta.montoActual / meta.montoMeta) * 100
                          : 0;
                      // const diferencia = 100 - porcentaje;

                      return (
                        <TableRow key={meta.id}>
                          <TableCell>
                            {meta.tituloMeta ? meta.tituloMeta : ""}
                          </TableCell>
                          <TableCell>{meta.usuario.nombre}</TableCell>
                          <TableCell>
                            {formatearMoneda(meta.montoMeta)}
                          </TableCell>
                          <TableCell>
                            {formatearMoneda(meta.montoActual)}
                          </TableCell>
                          <TableCell>
                            {formatearMoneda(meta.montoMeta - meta.montoActual)}
                          </TableCell>

                          {/* EL PORCENTAJE */}
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Percent
                                className={`w-4 h-4 ${
                                  porcentaje >= 70
                                    ? "text-green-500"
                                    : porcentaje >= 40
                                    ? "text-yellow-500"
                                    : "text-red-500"
                                }`}
                              />
                              {porcentaje.toFixed(2)}%
                            </div>
                          </TableCell>

                          {/* LA REFERENCIA */}
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Clock
                                className={`w-4 h-4 ${
                                  calcularReferencia() >= 70
                                    ? "text-green-500"
                                    : calcularReferencia() >= 40
                                    ? "text-yellow-500"
                                    : "text-red-500"
                                }`}
                              />
                              {calcularReferencia().toFixed(2)}%
                            </div>
                          </TableCell>

                          {/* LA DIFERENCIA */}
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {/* Icono dinámico con color */}
                              {porcentaje - calcularReferencia() >= 0 ? (
                                <TrendingUp className="w-4 h-4 text-green-500" />
                              ) : (
                                <TrendingDown className="w-4 h-4 text-red-500" />
                              )}

                              {/* Texto de la diferencia con color dinámico */}
                              <span
                                className={`${
                                  porcentaje - calcularReferencia() >= 0
                                    ? "text-green-500"
                                    : "text-red-500"
                                }`}
                              >
                                {(porcentaje - calcularReferencia()).toFixed(2)}
                                %
                              </span>
                            </div>
                          </TableCell>

                          <TableCell>
                            {meta.cumplida ? (
                              <div className="flex items-center gap-2 text-green-500">
                                <CheckCircle className="w-4 h-4" />
                                Cumplida
                              </div>
                            ) : (
                              <div className="flex items-center gap-2 text-yellow-500">
                                <Clock className="w-4 h-4" />
                                En progreso
                              </div>
                            )}
                          </TableCell>

                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="">
                                {/* Opción para eliminar */}
                                <DropdownMenuItem
                                  onClick={() => {
                                    setGoalToDelete(meta.id);
                                    setOpenDeleteG(true);
                                  }}
                                >
                                  <span>Eliminar</span>{" "}
                                  <Delete className="ml-2 h-4 w-4" />
                                </DropdownMenuItem>

                                {/* Opción para editar/actualizar */}
                                <DropdownMenuItem
                                  onClick={() => {
                                    // Handle edit/update here
                                    setOpenUpdateMetaTienda(true);
                                    setMetaTiendaSelected(meta);
                                    // setOpenUpdateMetaTienda(true);
                                  }}
                                >
                                  <span>Actualizar</span>
                                  <Edit className="ml-2 h-4 w-4" />
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="cobros">
          <Card>
            <CardHeader>
              <CardTitle>Metas de Cobros</CardTitle>
              <CardDescription>
                Visualiza y gestiona las metas de cobros
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Label htmlFor="searchCobros">Buscar</Label>
                <div className="flex">
                  <Input
                    id="searchCobros"
                    placeholder="Buscar por título, sucursal o usuario"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-grow"
                  />
                  <Button variant="outline" className="ml-2">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Título</TableHead>
                      <TableHead>Usuario</TableHead>
                      <TableHead>Monto Meta</TableHead>
                      <TableHead>Monto Actual</TableHead>
                      <TableHead>Faltante</TableHead>
                      <TableHead>Porcentaje</TableHead>
                      <TableHead>Referencia</TableHead>
                      <TableHead>Diferencia</TableHead>
                      <TableHead>Depósitos</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Depósitos</TableHead>
                      <TableHead>Acciónes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMetasCobros.map((meta) => {
                      const porcentaje =
                        meta.montoMeta > 0
                          ? (meta.montoActual / meta.montoMeta) * 100
                          : 0;

                      const referencia = calcularReferencia(); // Basado en la fecha actual y el mes
                      const diferencia = porcentaje - referencia;

                      return (
                        <TableRow key={meta.id}>
                          {/* Título */}
                          <TableCell>
                            {meta.tituloMeta ? meta.tituloMeta : "Sin título"}
                          </TableCell>

                          {/* Usuario */}
                          <TableCell>{meta.usuario.nombre}</TableCell>

                          {/* Monto Meta */}
                          <TableCell>
                            {formatearMoneda(meta.montoMeta)}
                          </TableCell>

                          {/* Monto Actual */}
                          <TableCell>
                            {formatearMoneda(meta.montoActual)}
                          </TableCell>

                          {/* Faltante */}
                          <TableCell>
                            {formatearMoneda(meta.montoMeta - meta.montoActual)}
                          </TableCell>

                          {/* Porcentaje de progreso */}
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Percent
                                className={`w-4 h-4 ${
                                  porcentaje >= 70
                                    ? "text-green-500"
                                    : porcentaje >= 40
                                    ? "text-yellow-500"
                                    : "text-red-500"
                                }`}
                              />
                              {porcentaje.toFixed(2)}%
                            </div>
                          </TableCell>

                          {/* Referencia (progreso ideal según el tiempo transcurrido) */}
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Clock
                                className={`w-4 h-4 ${
                                  referencia >= 70
                                    ? "text-green-500"
                                    : referencia >= 40
                                    ? "text-yellow-500"
                                    : "text-red-500"
                                }`}
                              />
                              {referencia.toFixed(2)}%
                            </div>
                          </TableCell>

                          {/* Diferencia entre el progreso real y la referencia */}
                          <TableCell>
                            <div
                              className={`flex items-center gap-2 ${
                                diferencia >= 0
                                  ? "text-green-500"
                                  : "text-red-500"
                              }`}
                            >
                              {diferencia >= 0 ? (
                                <TrendingUp className="w-4 h-4" />
                              ) : (
                                <TrendingDown className="w-4 h-4" />
                              )}
                              {diferencia.toFixed(2)}%
                            </div>
                          </TableCell>

                          {/* Número de depósitos */}
                          <TableCell>{meta.DepositoCobro.length}</TableCell>

                          {/* Estado de la meta */}
                          <TableCell>
                            {meta.cumplida ? (
                              <div className="flex items-center gap-2 text-green-500">
                                <CheckCircle className="w-4 h-4" />
                                Cumplida
                              </div>
                            ) : (
                              <div className="flex items-center gap-2 text-yellow-500">
                                <Clock className="w-4 h-4" />
                                En progreso
                              </div>
                            )}
                          </TableCell>

                          {/* Acciones */}
                          <TableCell>
                            <Button
                              onClick={() => handleOpenDepositos(meta)}
                              variant="ghost"
                              className="flex justify-center items-center"
                            >
                              <Coins />
                            </Button>
                          </TableCell>

                          <TableCell>
                            <Button
                              onClick={() => {
                                setCobroToDelete(meta.id);
                                setOpenDeleteCobro(true);
                              }}
                              variant={"ghost"}
                            >
                              <Delete />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              {/* Dialog para mostrar depósitos */}
              <Dialog
                open={openDepositosDialog}
                onOpenChange={setOpenDepositosDialog}
              >
                {selectedMeta && (
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle className="text-center">
                        Depósitos de{" "}
                        {selectedMeta.tituloMeta ? selectedMeta.tituloMeta : ""}
                      </DialogTitle>
                    </DialogHeader>
                    <ScrollArea className="max-h-[60vh] pr-4">
                      {selectedMeta.DepositoCobro.length > 0 ? (
                        <div className="space-y-4">
                          {selectedMeta.DepositoCobro.map((deposito) => (
                            <div
                              key={deposito.id}
                              className="bg-muted rounded-lg p-4 space-y-2"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <Banknote className="w-5 h-5 text-primary" />
                                  <span className="font-semibold">
                                    Boleta: {deposito.numeroBoleta}
                                  </span>
                                </div>
                                <Button
                                  onClick={() => {
                                    setSelectedDepo(deposito);
                                    setOpenDeletDepo(true);
                                  }}
                                  variant="destructive"
                                  size="icon"
                                  className="h-8 w-8"
                                  aria-label={`Eliminar depósito ${deposito.numeroBoleta}`}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Coins className="w-4 h-4 text-muted-foreground" />
                                <span>
                                  {formatearMoneda(deposito.montoDepositado)}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Calendar className="w-4 h-4 text-muted-foreground" />
                                <span>
                                  {new Date(
                                    deposito.fechaRegistro
                                  ).toLocaleString()}
                                </span>
                              </div>
                              {deposito.descripcion && (
                                <div className="flex items-start space-x-2">
                                  <FileText className="w-4 h-4 text-muted-foreground mt-1" />
                                  <p className="text-sm">
                                    {deposito.descripcion}
                                  </p>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-center text-muted-foreground py-4">
                          No hay depósitos registrados.
                        </p>
                      )}
                    </ScrollArea>
                    <DialogFooter>
                      <Button
                        onClick={() => setOpenDepositosDialog(false)}
                        className="w-full sm:w-auto"
                      >
                        Cerrar
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                )}
              </Dialog>

              {/* DIALOG PARA ELIMINAR UN PAGO */}
              <Dialog open={openDeletDepo} onOpenChange={setOpenDeletDepo}>
                {selectedDepo && (
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                        Confirmar Eliminación
                      </DialogTitle>
                      <DialogDescription>
                        ¿Estás seguro de que deseas eliminar el depósito con
                        boleta número {selectedDepo?.numeroBoleta}?
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="sm:justify-start">
                      <Button
                        variant="destructive"
                        onClick={() => {
                          onConfirmDelete(selectedDepo.id);
                        }}
                      >
                        Eliminar
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setOpenDeletDepo(false)}
                      >
                        Cancelar
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                )}
              </Dialog>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="totales">
          <Card>
            <CardHeader>
              <CardTitle>Resumen de metas de cobros</CardTitle>
              <CardDescription>
                Visualiza el avance de todas las metas de cobro
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">
                    Meta total
                  </span>
                  <div className="flex items-center">
                    <TargetIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className="text-2xl font-bold">
                      {formatearMoneda(getMetasCobroTotal())}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">Avance</span>
                  <div className="flex items-center">
                    <ArrowUpIcon className="mr-2 h-4 w-4 text-green-500" />
                    <span className="text-2xl font-bold">
                      {formatearMoneda(getMetasCobroAvance())}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">
                    Faltante
                  </span>
                  <div className="flex items-center">
                    <ArrowDownIcon className="mr-2 h-4 w-4 text-red-500" />
                    <span className="text-2xl font-bold">
                      {formatearMoneda(getMetasCobroRestante())}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Progreso</span>
                  <span className="text-sm font-medium">
                    {getPercentMetaCobro().toFixed(2)}%
                  </span>
                </div>
                <Progress
                  value={getPercentMetaCobro()}
                  className={cn(
                    "w-full",
                    getPercentMetaCobro() >= 100
                      ? "[&>div]:bg-green-500"
                      : getPercentMetaCobro() >= 75
                      ? "[&>div]:bg-blue-500"
                      : getPercentMetaCobro() >= 50
                      ? "[&>div]:bg-yellow-500"
                      : "[&>div]:bg-red-500"
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* RESUMEN DE METAS DE COBROS EN TIENDAS */}
          <Card>
            <CardHeader>
              <CardTitle>Resumen de metas de tiendas</CardTitle>
              <CardDescription>
                Visualiza el avance de todas las metas de tienda
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">
                    Meta total
                  </span>
                  <div className="flex items-center">
                    <TargetIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className="text-2xl font-bold">
                      {formatearMoneda(getMetasTiendaTotal())}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">Avance</span>
                  <div className="flex items-center">
                    <ArrowUpIcon className="mr-2 h-4 w-4 text-green-500" />
                    <span className="text-2xl font-bold">
                      {formatearMoneda(getMetasTiendaAvance())}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">
                    Faltante
                  </span>
                  <div className="flex items-center">
                    <ArrowDownIcon className="mr-2 h-4 w-4 text-red-500" />
                    <span className="text-2xl font-bold">
                      {formatearMoneda(getMetasTiendaRestante())}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Progreso</span>
                  <span className="text-sm font-medium">
                    {getPercentTiendaCobro().toFixed(2)}%
                  </span>
                </div>
                <Progress
                  value={getPercentTiendaCobro()}
                  className={cn(
                    "w-full",
                    getPercentTiendaCobro() >= 100
                      ? "[&>div]:bg-green-500"
                      : getPercentTiendaCobro() >= 75
                      ? "[&>div]:bg-blue-500"
                      : getPercentTiendaCobro() >= 50
                      ? "[&>div]:bg-yellow-500"
                      : "[&>div]:bg-red-500"
                  )}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* DIALOG PARA ELIMINACIONES DE METAS EN TIENDAS */}
      <Dialog open={openDeleteG} onOpenChange={setOpenDeleteG}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-semibold text-center">
              <p className="text-center">Confirmación de eliminación de meta</p>
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              ¿Estás seguro de eliminar este registro? Esta acción no se puede
              deshacer.
            </p>
            <div className="mt-4 space-y-4">
              <div className="relative">
                <Input
                  onChange={(e) => setPasswordAdmin(e.target.value)}
                  value={passwordAdmin}
                  placeholder="Introduzca su contraseña de administrador"
                  type="password"
                  className="pl-10 pr-4 py-2"
                />
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
          <DialogFooter className="sm:justify-end">
            <div className="mt-6 flex flex-col sm:flex-row sm:justify-end gap-3 sm:gap-2 w-full">
              <Button
                variant="outline"
                onClick={() => setOpenDeleteG(false)}
                className="w-full "
              >
                <X className="mr-2 h-4 w-4" />
                Cancelar
              </Button>
              <Button
                onClick={handleDeleteMeta}
                variant="destructive"
                className="w-full "
              >
                <Check className="mr-2 h-4 w-4" />
                Sí, eliminar
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DIALOG PARA ELIMINACIONES DE METAS EN COBROS */}
      <Dialog open={openDeleteCobro} onOpenChange={setOpenDeleteCobro}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-semibold text-center">
              <p className="text-center">
                Confirmación de eliminación de meta en cobros
              </p>
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              ¿Estás seguro de eliminar este registro? Esta acción no se puede
              deshacer.
            </p>
            <div className="mt-4 space-y-4">
              <div className="relative">
                <Input
                  onChange={(e) => setPasswordAdminCobro(e.target.value)}
                  value={passwordAdminCobro}
                  placeholder="Introduzca su contraseña de administrador"
                  type="password"
                  className="pl-10 pr-4 py-2"
                />
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
          <DialogFooter className="sm:justify-end">
            <div className="mt-6 flex flex-col sm:flex-row sm:justify-end gap-3 sm:gap-2 w-full">
              <Button
                variant="outline"
                onClick={() => setOpenDeleteCobro(false)}
                className="w-full "
              >
                <X className="mr-2 h-4 w-4" />
                Cancelar
              </Button>
              <Button
                onClick={handleDeleteCobro}
                variant="destructive"
                className="w-full "
              >
                <Check className="mr-2 h-4 w-4" />
                Sí, eliminar
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DIALOG PARA ACTUALIZACION DE METAS DE TIENDAS*/}
      <EditMetaTiendaDialog
        open={openUpdateMetaTienda}
        onClose={() => setOpenUpdateMetaTienda(false)}
        metaTienda={metaTiendaSelected}
        onUpdate={(updatedMeta) => {
          // Aquí puedes llamar a la API para actualizar el registro
          fetch(`/api/meta-tiendas/${updatedMeta.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedMeta),
          })
            .then(() => {
              toast.success("Meta actualizada correctamente");
              setOpenUpdateMetaTienda(false);
            })
            .catch(() => toast.error("Error al actualizar la meta"));
        }}
      />
    </div>
  );
}

export function EditMetaTiendaDialog({
  open,
  onClose,
  metaTienda,
  onUpdate,
}: EditMetaTiendaDialogProps) {
  const [formData, setFormData] = useState<MetaTienda | null>(null);

  useEffect(() => {
    if (metaTienda) {
      // Clonar el objeto para evitar modificar el estado original
      setFormData({ ...metaTienda });
    }
  }, [metaTienda]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!formData) return;
    const { name, value } = e.target;
    setFormData((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleSave = () => {
    if (formData) {
      onUpdate(formData); // Enviar solo los datos editados al backend
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
            <Edit className="h-5 w-5 text-blue-500" />
            Editar Meta de Tienda
          </DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div>
            <label className="text-sm font-medium">Título de la Meta</label>
            <Input
              name="tituloMeta"
              value={formData?.tituloMeta || ""}
              onChange={handleInputChange}
              placeholder="Título de la meta"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Monto Meta</label>
            <Input
              name="montoMeta"
              type="number"
              value={formData?.montoMeta || ""}
              onChange={handleInputChange}
              placeholder="Monto objetivo"
            />
          </div>

          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={formData?.estado} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <DialogFooter className="sm:justify-end">
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full sm:w-auto"
          >
            <X className="mr-2 h-4 w-4" />
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            variant="default"
            className="w-full sm:w-auto"
          >
            <Check className="mr-2 h-4 w-4" />
            Guardar Cambios
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default Metas;
