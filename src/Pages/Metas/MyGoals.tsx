import { useStore } from "@/components/Context/ContextSucursal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import {
  AlertTriangle,
  Banknote,
  BarChart2,
  Calendar,
  Coins,
  FileText,
  Percent,
  Target,
  Trash2,
  TrendingUp,
  User,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
const API_URL = import.meta.env.VITE_API_URL;

import dayjs from "dayjs";
import "dayjs/locale/es";
import utc from "dayjs/plugin/utc";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { ScrollArea } from "@/components/ui/scroll-area";

dayjs.extend(utc);
dayjs.extend(localizedFormat);
dayjs.locale("es");

const formatearFecha = (fecha: string) => {
  // Formateo en UTC sin conversión a local
  return dayjs(fecha).format("DD/MM/YYYY hh:mm A");
};

const formatearMoneda = (monto: number) => {
  return new Intl.NumberFormat("es", {
    style: "currency",
    currency: "GTQ",
  }).format(monto);
};

// Interfaces
interface Sucursal {
  id: number;
  nombre: string;
  direccion?: string;
  telefono?: string;
  pbx?: string;
}

interface Usuario {
  id: number;
  nombre: string;
  rol: string;
  correo?: string;
}

interface DepositoCobro {
  id: number; // ID único del depósito
  usuarioId: number; // ID del usuario que realizó el depósito
  sucursalId: number; // ID de la sucursal donde se registró el depósito
  numeroBoleta: string; // Número de boleta del depósito
  fechaRegistro: string; // Fecha y hora en que se registró el depósito (ISO string)
  montoDepositado: number; // Monto depositado en GTQ
  descripcion: string; // Descripción o nota asociada al depósito
  metaCobroId: number; // ID de la meta de cobros a la que está asociado
}

interface MetaCobro {
  id: number;
  usuarioId: number;
  sucursalId: number;
  fechaCreado: string;
  fechaInicio: string;
  fechaFin: string;
  montoMeta: number;
  montoActual: number;
  cumplida: boolean;
  fechaCumplida: string | null;
  numeroDepositos: number;
  tituloMeta: string;
  estado: string;
  DepositoCobro: DepositoCobro[];
  sucursal: Sucursal;
  usuario: Usuario;
}

interface MetaTienda {
  id: number;
  usuarioId: number;
  sucursalId: number;
  fechaInicio: string;
  fechaFin: string;
  montoMeta: number;
  montoActual: number;
  cumplida: boolean;
  fechaCumplida: string | null;
  numeroVentas: number;
  tituloMeta: string;
  sucursal: Sucursal;
  usuario: Usuario;
}

interface MetasResponse {
  metasCobros: MetaCobro[];
  metasTienda: MetaTienda[];
}

function MyGoals() {
  const userId = useStore((state) => state.userId) ?? 0;
  const [metas, setMetas] = useState<MetasResponse | null>(null); // Estado para guardar las metas
  const [loading, setLoading] = useState<boolean>(true); // Estado de carga
  const [error, setError] = useState<string | null>(null); // Estado de error

  //======================>
  const [selectedMetaId, setSelectedMetaId] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [depositForm, setDepositForm] = useState({
    numeroBoleta: "",
    montoDepositado: "",
    descripcion: "",
  });
  const [openDepositos, setOpenDepositos] = useState(false);
  const [selectedMeta, setSelectedMeta] = useState<MetaCobro>();
  const [openDeletDepo, setOpenDeletDepo] = useState(false);
  const [selectedDepo, setSelectedDepo] = useState<DepositoCobro>();

  const fetchGoals = async () => {
    try {
      const response = await axios.get<MetasResponse>(
        `${API_URL}/metas/get-all-my-goals/${userId}`
      ); // Tipar la respuesta de Axios
      setMetas(response.data); // Guardar las metas en el estado
      setLoading(false);
    } catch (err) {
      console.error("Error al obtener las metas:", err);
      setError("Ocurrió un error al cargar las metas");
      setLoading(false);
    }
  };
  useEffect(() => {
    if (userId) {
      fetchGoals();
    }
  }, []);

  if (loading) {
    return <div>Cargando metas...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  console.log("Los registros de este usuario son: ", metas);
  const handleOpenDialog = (metaId: number) => {
    setSelectedMetaId(metaId);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedMetaId(null);
    setDepositForm({
      numeroBoleta: "",
      montoDepositado: "",
      descripcion: "",
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setDepositForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMetaId) return;

    try {
      const response = await axios.post(
        `${API_URL}/metas/create-new-payment-cobros`,
        {
          usuarioId: userId,
          sucursalId: metas?.metasCobros.find((m) => m.id === selectedMetaId)
            ?.sucursalId,
          numeroBoleta: depositForm.numeroBoleta,
          montoDepositado: Number.parseFloat(depositForm.montoDepositado),
          metaCobroId: selectedMetaId,
          descripcion: depositForm.descripcion,
        }
      );

      if (response.status === 201) {
        toast.success("El depósito se ha registrado correctamente.");
        handleCloseDialog();
        fetchGoals(); // Refresh goals after successful deposit
      }
    } catch (error) {
      console.error("Error al registrar el depósito:", error);
      toast.error("Ocurrió un error al registrar el depósito.");
    }
  };

  const onConfirmDelete = async (id: number) => {
    console.log("EL DEPOSITO ELIMINADO ES: ", id);

    try {
      const response = await axios.delete(
        `${API_URL}/metas/delete-one-payment/${selectedMeta?.id}/${selectedDepo?.id}`
      );
      if (response.status === 200 || response.status === 201) {
        toast.success("Depósito eliminado correctamente");
        setOpenDeletDepo(false);
        setOpenDepositos(false);
        fetchGoals();
      }
    } catch (error) {
      console.log(error);
      toast.error("Error al eliminar registro");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Mis Metas</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {metas?.metasCobros.map((meta) => (
          <Card key={meta.id}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Banknote className="mr-2" />
                {meta.tituloMeta}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="flex items-center">
                  <User className="mr-2" /> {meta.usuario.nombre}
                </p>

                <p className="flex items-center">
                  <Calendar className="mr-2" />
                  Plazo: {formatearFecha(meta.fechaInicio)} -{" "}
                  {formatearFecha(meta.fechaFin)}
                </p>
                <p className="flex items-center">
                  <Target className="mr-2" /> Meta:{" "}
                  {formatearMoneda(meta.montoMeta)}
                </p>
                <p className="flex items-center">
                  <TrendingUp className="mr-2" /> Actual:{" "}
                  {formatearMoneda(meta.montoActual)}
                </p>

                <p className="flex items-center">
                  <BarChart2 className="mr-2" /> Faltante:{" "}
                  {formatearMoneda(meta.montoMeta - meta.montoActual)}
                </p>

                <p className="flex items-center">
                  <Percent className="mr-2" /> Porcentaje:{" "}
                  {meta.montoMeta > 0
                    ? `${((meta.montoActual / meta.montoMeta) * 100).toFixed(
                        2
                      )}%`
                    : "Meta no definida"}
                </p>

                <p className="flex items-center">
                  <Percent className="mr-2" /> Diferencia:{" "}
                  {meta.montoMeta > 0
                    ? `${(
                        100 -
                        (meta.montoActual / meta.montoMeta) * 100
                      ).toFixed(2)}%`
                    : "Meta no definida"}
                </p>

                <div className="flex gap-2 justify-center items-center">
                  <Button
                    onClick={() => {
                      setOpenDepositos(true);
                      setSelectedMeta(meta);
                    }}
                    variant={"outline"}
                    className="w-full"
                  >
                    <p className="flex items-center">
                      <Coins className="mr-2" /> Depósitos:{" "}
                      {meta.DepositoCobro.length}
                    </p>
                  </Button>

                  <Button
                    onClick={() => handleOpenDialog(meta.id)}
                    className="w-full"
                  >
                    Agregar Depósito
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Metas de Tiendas */}
        {metas?.metasTienda.map((meta) => (
          <Card key={meta.id}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="mr-2" />
                {meta.tituloMeta}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="flex items-center">
                  <Calendar className="mr-2" />{" "}
                  {formatearFecha(meta.fechaInicio)} -{" "}
                  {formatearFecha(meta.fechaFin)}
                </p>
                <p className="flex items-center">
                  <Target className="mr-2" /> Meta:{" "}
                  {formatearMoneda(meta.montoMeta)}
                </p>
                <p className="flex items-center">
                  <TrendingUp className="mr-2" /> Actual:{" "}
                  {formatearMoneda(meta.montoActual)}
                </p>
                <p className="flex items-center">
                  <User className="mr-2" /> {meta.usuario.nombre}
                </p>

                {/* Porcentaje */}
                <p className="flex items-center">
                  <Percent className="mr-2" /> Porcentaje:{" "}
                  {meta.montoMeta > 0
                    ? `${((meta.montoActual / meta.montoMeta) * 100).toFixed(
                        2
                      )}%`
                    : "Meta no definida"}
                </p>

                {/* Diferencia */}
                <p className="flex items-center">
                  <Percent className="mr-2" /> Diferencia:{" "}
                  {meta.montoMeta > 0
                    ? `${(
                        100 -
                        (meta.montoActual / meta.montoMeta) * 100
                      ).toFixed(2)}%`
                    : "Meta no definida"}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* DIALOG PARA PODER ELIMINAR UN REGISTRO DE DEPOSITO */}
      <Dialog open={openDepositos} onOpenChange={setOpenDepositos}>
        {selectedMeta && (
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-center">
                Depósitos de {selectedMeta.tituloMeta}
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
                            // handleEliminarDeposito(deposito.id);
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
                          Q{formatearMoneda(deposito.montoDepositado)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span>{formatearFecha(deposito.fechaRegistro)}</span>
                      </div>
                      {deposito.descripcion && (
                        <div className="flex items-start space-x-2">
                          <FileText className="w-4 h-4 text-muted-foreground mt-1" />
                          <p className="text-sm">{deposito.descripcion}</p>
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
                onClick={() => setOpenDepositos(false)}
                className="w-full sm:w-auto"
              >
                Cerrar
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>

      {/* DIALOG PARA CONFIRMACION DE ELIMINACION */}
      <Dialog open={openDeletDepo} onOpenChange={setOpenDeletDepo}>
        {selectedDepo && (
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                Confirmar Eliminación
              </DialogTitle>
              <DialogDescription>
                ¿Estás seguro de que deseas eliminar el depósito con boleta
                número {selectedDepo?.numeroBoleta}?
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
              <Button variant="outline" onClick={() => setOpenDeletDepo(false)}>
                Cancelar
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar Depósito</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmitDeposit} className="space-y-4">
            <div>
              <Label htmlFor="numeroBoleta">Número de Boleta</Label>
              <Input
                id="numeroBoleta"
                name="numeroBoleta"
                value={depositForm.numeroBoleta}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="montoDepositado">Monto Depositado</Label>
              <Input
                id="montoDepositado"
                name="montoDepositado"
                type="number"
                step="0.01"
                value={depositForm.montoDepositado}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="descripcion">Descripción</Label>
              <Textarea
                id="descripcion"
                name="descripcion"
                value={depositForm.descripcion}
                onChange={handleInputChange}
                rows={3}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseDialog}
              >
                Cancelar
              </Button>
              <Button type="submit">Guardar Depósito</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default MyGoals;
