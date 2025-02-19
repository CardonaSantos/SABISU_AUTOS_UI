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
  ChartBar,
  Coins,
  FileText,
  Plus,
  Target,
  Trash2,
  TrendingDown,
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
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import currency from "currency.js";
dayjs.extend(utc);
dayjs.extend(localizedFormat);
dayjs.locale("es");

const formatearFecha = (fecha: string) => {
  // Formateo en UTC sin conversión a local
  return dayjs(fecha).format("DD/MM/YYYY hh:mm A");
};

const formatearMoneda = (monto: number) => {
  return currency(monto, {
    symbol: "Q",
    separator: ",",
    decimal: ".",
    precision: 2,
  }).format();
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

  const calcularReferencia = () => {
    const hoy = dayjs();
    const totalDiasMes = dayjs().daysInMonth(); // Obtiene el total de días en el mes actual
    const diaActual = hoy.date(); // Obtiene el día actual del mes (1-31)

    return (diaActual / totalDiasMes) * 100; // Calcula el porcentaje del mes transcurrido
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Mis Metas</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {metas?.metasCobros.map((meta) => {
          const percentageComplete =
            meta.montoMeta > 0 ? (meta.montoActual / meta.montoMeta) * 100 : 0;
          const referencia = calcularReferencia();
          const diferencia = percentageComplete - referencia;

          return (
            <Card key={meta.id} className="overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Banknote className="mr-2 h-5 w-5 text-primary" />
                    <span className="font-semibold">{meta.tituloMeta}</span>
                  </div>
                  <Badge
                    variant={
                      percentageComplete >= 100 ? "default" : "destructive"
                    }
                  >
                    {percentageComplete.toFixed(1)}%
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Progress Bar */}
                  <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full transition-all duration-300",
                        percentageComplete >= 100
                          ? "bg-green-500"
                          : percentageComplete >= 75
                          ? "bg-blue-500"
                          : percentageComplete >= 50
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      )}
                      style={{ width: `${Math.min(percentageComplete, 100)}%` }}
                    />
                  </div>

                  {/* Main Info Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center text-sm">
                        <User className="mr-2 h-4 w-4 text-gray-500" />
                        <span className="font-medium">
                          {meta.usuario.nombre}
                        </span>
                      </div>

                      <div className="flex items-center text-sm">
                        <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                        <span>
                          {formatearFecha(meta.fechaInicio)} -{" "}
                          {formatearFecha(meta.fechaFin)}
                        </span>
                      </div>

                      <div className="flex items-center text-sm">
                        <Target className="mr-2 h-4 w-4 text-primary" />
                        <span>Meta: {formatearMoneda(meta.montoMeta)}</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center text-sm">
                        <TrendingUp
                          className={cn(
                            "mr-2 h-4 w-4",
                            percentageComplete >= 100
                              ? "text-green-500"
                              : percentageComplete >= 75
                              ? "text-blue-500"
                              : "text-gray-500"
                          )}
                        />
                        <span>Actual: {formatearMoneda(meta.montoActual)}</span>
                      </div>

                      <div className="flex items-center text-sm">
                        <BarChart2 className="mr-2 h-4 w-4 text-gray-500" />
                        <span>
                          Faltante:{" "}
                          {formatearMoneda(meta.montoMeta - meta.montoActual)}
                        </span>
                      </div>

                      <div className="flex items-center text-sm">
                        {diferencia >= 0 ? (
                          <TrendingUp className="mr-2 h-4 w-4 text-green-500" />
                        ) : (
                          <TrendingDown className="mr-2 h-4 w-4 text-red-500" />
                        )}
                        <span>
                          Diferencia vs Referencia: {diferencia.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-2 pt-4">
                    <Button
                      onClick={() => {
                        setOpenDepositos(true);
                        setSelectedMeta(meta);
                      }}
                      variant="outline"
                      className="flex-1"
                    >
                      <Coins className="mr-2 h-4 w-4" />
                      Depósitos: {meta.DepositoCobro.length}
                    </Button>

                    <Button
                      onClick={() => handleOpenDialog(meta.id)}
                      className="flex-1"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Agregar Depósito
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {/* Metas de Tiendas */}

        {metas?.metasTienda.map((meta) => {
          const percentageComplete =
            meta.montoMeta > 0 ? (meta.montoActual / meta.montoMeta) * 100 : 0;
          const referencia = calcularReferencia();
          const diferencia = percentageComplete - referencia;

          return (
            <Card key={meta.id} className="overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <TrendingUp className="mr-2 h-5 w-5 text-primary" />
                    <span className="font-semibold">{meta.tituloMeta}</span>
                  </div>
                  <Badge
                    variant={
                      percentageComplete >= 100 ? "default" : "destructive"
                    }
                  >
                    {percentageComplete.toFixed(1)}%
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Progress Bar */}
                  <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full transition-all duration-300",
                        percentageComplete >= 100
                          ? "bg-green-500"
                          : percentageComplete >= 75
                          ? "bg-blue-500"
                          : percentageComplete >= 50
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      )}
                      style={{ width: `${Math.min(percentageComplete, 100)}%` }}
                    />
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Left Column */}
                    <div className="space-y-3">
                      <div className="flex items-center text-sm">
                        <User className="mr-2 h-4 w-4 text-gray-500" />
                        <span className="font-medium">
                          {meta.usuario.nombre}
                        </span>
                      </div>

                      <div className="flex items-center text-sm">
                        <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                        <span>
                          {formatearFecha(meta.fechaInicio)} -{" "}
                          {formatearFecha(meta.fechaFin)}
                        </span>
                      </div>

                      <div className="flex items-center text-sm">
                        <Target className="mr-2 h-4 w-4 text-primary" />
                        <span>Meta: {formatearMoneda(meta.montoMeta)}</span>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-3">
                      <div className="flex items-center text-sm">
                        <TrendingUp
                          className={cn(
                            "mr-2 h-4 w-4",
                            percentageComplete >= 100
                              ? "text-green-500"
                              : percentageComplete >= 75
                              ? "text-blue-500"
                              : "text-gray-500"
                          )}
                        />
                        <span>Actual: {formatearMoneda(meta.montoActual)}</span>
                      </div>

                      <div className="flex items-center text-sm gap-2">
                        <div className="flex items-center">
                          <ChartBar
                            className={cn(
                              "mr-2 h-4 w-4",
                              referencia >= 75
                                ? "text-green-500"
                                : referencia >= 50
                                ? "text-yellow-500"
                                : "text-gray-500"
                            )}
                          />
                          <span>Referencia: {referencia.toFixed(1)}%</span>
                        </div>
                      </div>

                      <div className="flex items-center text-sm">
                        {diferencia >= 0 ? (
                          <TrendingUp className="mr-2 h-4 w-4 text-green-500" />
                        ) : (
                          <TrendingDown className="mr-2 h-4 w-4 text-red-500" />
                        )}
                        <span
                          className={cn(
                            diferencia >= 0 ? "text-green-600" : "text-red-600"
                          )}
                        >
                          Diferencia: {diferencia.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Performance Indicators */}
                  <div className="grid grid-cols-3 gap-2 pt-2">
                    <div
                      className={cn(
                        "rounded-lg p-2 text-center",
                        percentageComplete >= referencia
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      )}
                    >
                      <div className="text-xs font-medium">Progreso</div>
                      <div className="text-sm font-bold">
                        {percentageComplete.toFixed(2)}%
                      </div>
                    </div>
                    <div className="rounded-lg bg-secondary p-2 text-center">
                      <div className="text-xs font-medium">Referencia</div>
                      <div className="text-sm font-bold">
                        {referencia.toFixed(2)}%
                      </div>
                    </div>
                    <div
                      className={cn(
                        "rounded-lg p-2 text-center",
                        diferencia >= 0
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      )}
                    >
                      <div className="text-xs font-medium">Diferencia</div>
                      <div className="text-sm font-bold">
                        {diferencia >= 0 ? "+" : ""}
                        {diferencia.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
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
                        <span>{formatearMoneda(deposito.montoDepositado)}</span>
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
