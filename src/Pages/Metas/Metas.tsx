import { useStore } from "@/components/Context/ContextSucursal";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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
  Banknote,
  Calendar,
  CheckCircle,
  Clock,
  Coins,
  CreditCard,
  FileText,
  MinusCircle,
  Percent,
  Search,
  Store,
  Target,
  Trash2,
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

function Metas() {
  const sucursalId = useStore((state) => state.sucursalId) ?? 0;
  const [metasCobros, setMetasCobros] = useState<MetaCobros[]>([]);

  const [metasTienda, setMetasTienda] = useState<MetaTienda[]>([]);
  const [usuarios, setUsuarios] = useState<UsuarioSucursal[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

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
    return new Intl.NumberFormat("es", {
      style: "currency",
      currency: "GTQ",
    }).format(monto);
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

  return (
    <div className="container mx-auto p-4">
      <Tabs defaultValue="asignar" className="w-full">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-3">
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
                      <TableHead>Diferencia</TableHead>
                      <TableHead>Estado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMetasTienda.map((meta) => {
                      const porcentaje =
                        meta.montoMeta > 0
                          ? (meta.montoActual / meta.montoMeta) * 100
                          : 0;
                      const diferencia = 100 - porcentaje;

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

                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Percent className="w-4 h-4 text-green-500" />
                              {porcentaje.toFixed(2)}%
                            </div>
                          </TableCell>
                          <TableCell>
                            <div
                              className={`flex items-center gap-2 ${
                                diferencia >= 0
                                  ? "text-red-500"
                                  : "text-green-500"
                              }`}
                            >
                              <MinusCircle className="w-4 h-4" />
                              {diferencia.toFixed(2)}%
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
                      <TableHead>Diferencia</TableHead>
                      <TableHead>Depósitos</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMetasCobros.map((meta) => {
                      const porcentaje =
                        meta.montoMeta > 0
                          ? (meta.montoActual / meta.montoMeta) * 100
                          : 0;
                      const diferencia = 100 - porcentaje;

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

                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Percent className="w-4 h-4 text-green-500" />
                              {porcentaje.toFixed(2)}%
                            </div>
                          </TableCell>
                          <TableCell>
                            <div
                              className={`flex items-center gap-2 ${
                                diferencia >= 0
                                  ? "text-red-500"
                                  : "text-green-500"
                              }`}
                            >
                              <MinusCircle className="w-4 h-4" />
                              {diferencia.toFixed(2)}%
                            </div>
                          </TableCell>
                          <TableCell>{meta.DepositoCobro.length}</TableCell>
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
                            <Button
                              onClick={() => handleOpenDepositos(meta)}
                              variant="outline"
                              size="sm"
                            >
                              <Coins className="w-4 h-4 mr-2" />
                              Ver
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
      </Tabs>
    </div>
  );
}

export default Metas;
