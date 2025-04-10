"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { useStore } from "@/components/Context/ContextSucursal";
import axios from "axios";
import dayjs from "dayjs";
import "dayjs/locale/es";
import utc from "dayjs/plugin/utc";
import localizedFormat from "dayjs/plugin/localizedFormat";
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
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
const API_URL = import.meta.env.VITE_API_URL;

dayjs.extend(utc);
dayjs.extend(localizedFormat);
dayjs.locale("es");

const formatearFecha = (fecha: string) => {
  // Formateo en UTC sin conversión a local
  return dayjs(fecha).format("DD/MM/YYYY hh:mm A");
};

interface RegistroCajaFormData {
  saldoInicial: number;
  saldoFinal: number;
  fechaInicio: string;
  fechaCierre: string;
  estado: "ABIERTO" | "CERRADO";
  comentario: string;
  usuarioId: number | null;
  sucursalId: number | null;
}

interface RegistroCajaInicioFormData {
  saldoInicial: number;
  estado: "ABIERTO" | "CERRADO";
  comentario: string;
  usuarioId: number | null;
  sucursalId: number | null;
}

interface RegistroAbierto {
  id: number;
  sucursalId: number;
  usuarioId: number;
  saldoInicial: number;
  saldoFinal: number;
  fechaInicio: string; // ISO string representation of the date
  fechaCierre: string; // ISO string representation of the date
  estado: "ABIERTO" | "CERRADO"; // assuming it can have two states
  comentario: string | null;
  usuario: {
    id: number;
    nombre: string;
    rol: "ADMIN" | "VENDEDOR";
  };
}

interface Usuario {
  id: number;
  nombre: string;
  rol: string;
}

interface Deposito {
  id: number;
  registroCajaId: number | null;
  monto: number;
  numeroBoleta: string;
  banco: string;
  fechaDeposito: string; // ISO string representation of the date
  usadoParaCierre: boolean;
  descripcion: string;
  sucursalId: number;
  usuarioId: number | null;
  usuario: Usuario | null;
  sucursal: {
    id: number;
    nombre: string;
  };
}

interface UsuarioEgreso {
  id: number;
  nombre: string;
  rol: string;
}

interface Egreso {
  id: number;
  registroCajaId: number | null;
  descripcion: string;
  monto: number;
  fechaEgreso: string; // ISO string representation of the date
  sucursalId: number;
  usuarioId: number;
  usuario: UsuarioEgreso;
}

interface Productos {
  cantidad: number;
  producto: {
    id: number;
    nombre: string;
    codigoProducto: string;
  };
}

interface VentaWithOutCashRegist {
  id: number;
  clienteId: number | null;
  fechaVenta: string;
  horaVenta: string;
  totalVenta: number;
  sucursalId: number;
  nombreClienteFinal: string | null;
  telefonoClienteFinal: string | null;
  direccionClienteFinal: string | null;
  imei: string | null;
  registroCajaId: number | null;
  productos: Productos[];
}

interface SaleItemProps {
  sale: {
    id: number;
    clienteId: number | null;
    fechaVenta: string;
    horaVenta: string;
    totalVenta: number;
    sucursalId: number;
    nombreClienteFinal: string | null;
    telefonoClienteFinal: string | null;
    direccionClienteFinal: string | null;
    imei: string | null;
    registroCajaId: number | null;
    productos: Productos[];
  };
}

interface ExpenseItemProps {
  expense: {
    id: number;
    registroCajaId: number | null;
    descripcion: string;
    monto: number;
    fechaEgreso: string; // ISO string representation of the date
    sucursalId: number;
    usuarioId: number;
    usuario: UsuarioEgreso;
  };
}

interface DepositItemProps {
  deposit: {
    id: number;
    registroCajaId: number | null;
    monto: number;
    numeroBoleta: string;
    banco: string;
    fechaDeposito: string; // ISO string representation of the date
    usadoParaCierre: boolean;
    descripcion: string;
    sucursalId: number;
    usuarioId: number | null;
    usuario: Usuario | null;
    sucursal: {
      id: number;
      nombre: string;
    };
  };
}

export default function RegistroCaja() {
  const [isCashRegistOpen, setCashRegistIsOpen] = useState(false);
  const sucursalId = useStore((state) => state.sucursalId) ?? 0;
  const usuarioId = useStore((state) => state.userId) ?? 0;
  const [registroAbierto, setRegistroAbierto] = useState<RegistroAbierto>();
  const [depositos, setDepositos] = useState<Deposito[]>([]);

  const [egreso, setEgreso] = useState<Egreso[]>([]);

  const [formData, setFormData] = useState<RegistroCajaFormData>({
    saldoInicial: 0,
    saldoFinal: 0,
    fechaInicio: new Date().toISOString().split("T")[0],
    fechaCierre: "",
    estado: "ABIERTO",
    comentario: "",
    sucursalId,
    usuarioId,
  });

  const [formDataInicio, setFormDataInicio] =
    useState<RegistroCajaInicioFormData>({
      saldoInicial: 0,
      estado: "ABIERTO",
      comentario: "",
      sucursalId,
      usuarioId,
    });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleInputChangeInicio = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormDataInicio((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const [truncateOpen, setTruncateOpen] = useState(false); // Previene doble envío al abrir
  const [truncateClose, setTruncateClose] = useState(false); // Previene doble envío al cerrar

  const [openConfirm, setOpenConfirm] = useState(false); // Controla el dialog para iniciar
  const [closeConfirm, setCloseConfirm] = useState(false); // Controla el dialog para cerrar

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (truncateClose) return; // Evitar doble clic
    setTruncateClose(true);

    if (!formData.saldoFinal || formData.saldoFinal <= 0) {
      toast.warning("Saldo final no ingresado");
      setTruncateClose(false);
      return;
    }

    const depositosIDs = depositos?.map((dep) => dep.id) || [];
    const egresosIDs = egreso?.map((eg) => eg.id) || [];
    const ventasIds = ventas?.map((eg) => eg.id) || [];

    const dataToSend = {
      ...formData,
      sucursalId,
      usuarioId,
      depositosIds: depositosIDs,
      egresosIds: egresosIDs,
      ventasIds,
      id: registroAbierto?.id,
    };

    try {
      const response = await axios.patch(
        `${API_URL}/caja/close-box`,
        dataToSend
      );

      if (response.status === 201 || response.status === 200) {
        toast.success("El registro de caja se ha cerrado correctamente.");
        getCashRegistOpen();
        getRegistrosDeposito();
        getRegistrosEgreso();
        getRegistrosVentas();
        setFormData({
          saldoInicial: 0,
          saldoFinal: 0,
          fechaInicio: new Date().toISOString().split("T")[0],
          fechaCierre: "",
          estado: "ABIERTO",
          comentario: "",
          sucursalId,
          usuarioId,
        });
        setCloseConfirm(false); // Cierra el diálogo explícitamente
      }
    } catch (error) {
      toast.error("No se pudo cerrar el registro de caja. Intente nuevamente.");
    } finally {
      setTruncateClose(false);
    }
  };

  //INICIAR REGISTRO
  const handleSubmitInicio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (truncateOpen) return; // Evitar doble clic
    setTruncateOpen(true);

    if (!formDataInicio.saldoInicial || formDataInicio.saldoInicial <= 0) {
      toast.warning("Debe ingresar un saldo inicial");
      setTruncateOpen(false);
      return;
    }

    const dataToSend = {
      ...formDataInicio,
      sucursalId,
      usuarioId,
    };

    try {
      const response = await axios.post(
        `${API_URL}/caja/open-cash-regist`,
        dataToSend
      );

      if (response.status === 201 || response.status === 200) {
        toast.success("El registro de caja se ha creado correctamente.");
        setFormDataInicio({
          comentario: "",
          estado: "ABIERTO",
          sucursalId,
          usuarioId,
          saldoInicial: 0,
        });
        getCashRegistOpen(); // Actualiza el estado del registro
        setOpenConfirm(false); // Cierra el diálogo explícitamente
      }
    } catch (error) {
      toast.error("No se pudo abrir el registro de caja. Intente nuevamente.");
    } finally {
      setTruncateOpen(false);
    }
  };

  const getCashRegistOpen = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/caja/find-cash-regist-open/${sucursalId}/${usuarioId}`
      );

      if (response.data) {
        setCashRegistIsOpen(true);
        setRegistroAbierto(response.data);
      } else {
        setCashRegistIsOpen(false);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error al conseguir registro de caja");
    }
  };

  useEffect(() => {
    if (sucursalId && usuarioId) {
      getCashRegistOpen();
    }
  }, [sucursalId, usuarioId]);

  useEffect(() => {
    if (registroAbierto) {
      setFormData((prev) => ({
        ...prev,
        comentario: registroAbierto.comentario || "",
        saldoInicial: registroAbierto.saldoInicial || 0,
      }));
    }
  }, [registroAbierto]);

  const userName = useStore((state) => state.userNombre);
  // /caja/get-all-deposits-sucursal/2
  const getRegistrosDeposito = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/caja/get-all-deposits-sucursal/${sucursalId}`
      );

      if (response.status === 200) {
        setDepositos(response.data);
      }
    } catch (error) {
      console.log(error);
      toast.warning("No se pudieron conseguir registros de depósitos");
    }
  };

  const getRegistrosEgreso = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/caja/get-all-egresos-sucursal/${sucursalId}`
      );

      if (response.status === 200) {
        setEgreso(response.data);
      }
    } catch (error) {
      console.log(error);
      toast.warning("No se pudieron conseguir registros de egresos");
    }
  };

  const [ventas, setVentas] = useState<VentaWithOutCashRegist[]>([]);
  const getRegistrosVentas = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/venta/get-ventas-caja/${sucursalId}/${usuarioId}`
      );

      if (response.status === 200) {
        setVentas(response.data);
      }
    } catch (error) {
      console.log(error);
      toast.warning("No se pudieron conseguir registros de egresos");
    }
  };

  useEffect(() => {
    getRegistrosDeposito();
  }, [sucursalId]);

  useEffect(() => {
    getRegistrosEgreso();
  }, [sucursalId]);

  useEffect(() => {
    getRegistrosVentas();
  }, []);

  console.log("Activando diálogo de inicio:", openConfirm);
  console.log("Activando diálogo de cierre:", closeConfirm);
  console.log("isCashRegistOpen:", isCashRegistOpen);

  console.log("Las ventas son: ", ventas);

  function DepositItem({ deposit }: DepositItemProps) {
    return (
      <Card key={deposit.id} className="border rounded-lg shadow-lg p-1">
        <CardHeader>
          <CardTitle className="text-base font-semibold">
            No. Boleta:{" "}
            <span className="text-primary">{deposit.numeroBoleta}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <p>
              <span className="font-medium">Monto:</span>{" "}
              {new Intl.NumberFormat("es-GT", {
                style: "currency",
                currency: "GTQ",
              }).format(deposit.monto)}
            </p>
            <p>
              <span className="font-medium">Banco:</span> {deposit.banco}
            </p>
            <p>
              <span className="font-medium">Depositado el:</span>{" "}
              {formatearFecha(deposit.fechaDeposito)}
            </p>
            <p>
              <span className="font-medium">Registrado por:</span>{" "}
              {deposit.usuario
                ? `${deposit.usuario.nombre} (${deposit.usuario.rol})`
                : "N/A"}
            </p>
          </div>
          <p>
            <span className="font-medium">Descripción:</span>{" "}
            {deposit.descripcion || "Sin descripción"}
          </p>
          <div className="grid grid-cols-2 gap-4">
            <p>
              <span className="font-medium">Estado:</span>{" "}
              <Badge
                variant={deposit.usadoParaCierre ? "default" : "secondary"}
              >
                {deposit.usadoParaCierre
                  ? "Usado para cierre"
                  : "No usado para cierre"}
              </Badge>
            </p>
            <p>
              <span className="font-medium">Sucursal:</span>{" "}
              {deposit.sucursal.nombre}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  function ExpenseItem({ expense }: ExpenseItemProps) {
    return (
      <Card key={expense.id} className="border rounded-lg p-1 shadow-lg">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Egreso</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <p>
              <span className="font-medium">Registrado el:</span>{" "}
              {formatearFecha(expense.fechaEgreso)}
            </p>
            <p>
              <span className="font-medium">Registrado por:</span>{" "}
              {expense.usuario
                ? `${expense.usuario.nombre} (${expense.usuario.rol})`
                : "N/A"}
            </p>
          </div>
          <p>
            <span className="font-medium">Monto:</span>{" "}
            {new Intl.NumberFormat("es-GT", {
              style: "currency",
              currency: "GTQ",
            }).format(expense.monto)}
          </p>
          <p>
            <span className="font-medium">Descripción:</span>{" "}
            {expense.descripcion || "Sin descripción"}
          </p>
        </CardContent>
      </Card>
    );
  }

  function SaleItem({ sale }: SaleItemProps) {
    return (
      <Card key={sale.id} className="w-full shadow-md">
        <CardContent className="p-4">
          {/* Encabezado */}
          <div className="mb-4">
            <p className="text-sm font-medium">No.#{sale.id}</p>
          </div>

          {/* Detalles de la venta */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <p className="text-sm">
              <span className="font-medium">Fecha:</span>{" "}
              {formatearFecha(sale.fechaVenta)}
            </p>
            <p className="text-sm">
              <span className="font-medium">Total:</span>{" "}
              {new Intl.NumberFormat("es-GT", {
                style: "currency",
                currency: "GTQ",
              }).format(sale.totalVenta)}
            </p>
          </div>

          {/* Lista de productos */}
          {sale.productos.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">Productos:</h4>
              <ul className="space-y-2">
                {sale.productos.map((prod) => (
                  <li
                    key={prod.producto.id}
                    className="p-2 border rounded-md bg-gray-50 dark:bg-transparent flex justify-between items-center"
                  >
                    <div>
                      <p className="text-sm font-medium">
                        {prod.producto.nombre || "N/A"}
                      </p>
                      <p className="text-xs text-gray-500">
                        Código: {prod.producto.codigoProducto || "N/A"}
                      </p>
                    </div>
                    <p className="text-sm font-medium">
                      Cantidad: {prod.cantidad}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="w-full max-w-2xl mx-auto shadow-lg">
        {isCashRegistOpen ? (
          <>
            <CardHeader>
              <CardTitle className="text-center">Registro de Caja</CardTitle>
              <h3 className="text-sm text-gray-500">
                {userName ? userName : ""}
              </h3>
              <CardDescription className="text-center">
                Ingrese los detalles del cierre de caja
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                {/* Inputs para el cierre */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="saldoInicial">Saldo Inicial</Label>
                    <Input
                      id="saldoInicial"
                      name="saldoInicial"
                      type="number"
                      value={registroAbierto?.saldoInicial}
                      readOnly
                      placeholder="0.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="saldoFinal">Saldo Final de Salida</Label>
                    <Input
                      id="saldoFinal"
                      name="saldoFinal"
                      type="number"
                      value={formData.saldoFinal}
                      onChange={handleInputChange}
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="comentario">Comentario</Label>
                  <Textarea
                    id="comentario"
                    name="comentario"
                    value={
                      formData.comentario || registroAbierto?.comentario || ""
                    }
                    onChange={handleInputChange}
                    placeholder="Ingrese un comentario (opcional)"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant="destructive"
                  type="button"
                  className="w-full"
                  onClick={() => setCloseConfirm(true)}
                >
                  Cerrar caja
                </Button>
                <Dialog open={closeConfirm} onOpenChange={setCloseConfirm}>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="text-center">
                        Confirmar cierre
                      </DialogTitle>
                      <DialogDescription className="text-center">
                        ¿Estás seguro de cerrar el turno? Esta acción no puede
                        deshacerse.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button
                        className="w-full"
                        variant="outline"
                        onClick={() => setCloseConfirm(false)}
                      >
                        Cancelar
                      </Button>
                      <Button
                        className="w-full"
                        disabled={truncateClose}
                        onClick={handleSubmit}
                      >
                        Confirmar
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </form>
          </>
        ) : (
          <>
            <CardHeader>
              <CardTitle className="text-center">Registrar Turno</CardTitle>
              <h3 className="text-sm text-gray-500">
                {userName ? userName : ""}
              </h3>
            </CardHeader>
            <form onSubmit={handleSubmitInicio}>
              <CardContent className="space-y-4">
                {/* Inputs para abrir el registro */}
                <div className="space-y-2">
                  <Label htmlFor="saldoInicial">Saldo Inicial</Label>
                  <Input
                    id="saldoInicial"
                    name="saldoInicial"
                    type="number"
                    value={formDataInicio.saldoInicial}
                    onChange={handleInputChangeInicio}
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="comentario">Comentario</Label>
                  <Textarea
                    id="comentario"
                    name="comentario"
                    value={formDataInicio.comentario}
                    onChange={handleInputChangeInicio}
                    placeholder="Ingrese un comentario (opcional)"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  type="button"
                  onClick={() => setOpenConfirm(true)}
                >
                  Iniciar Turno
                </Button>
                <Dialog open={openConfirm} onOpenChange={setOpenConfirm}>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="text-center">
                        Confirmar inicio
                      </DialogTitle>
                      <DialogDescription className="text-center">
                        ¿Estás seguro de iniciar el turno? Esta acción no puede
                        deshacerse.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button
                        className="w-full"
                        variant="outline"
                        onClick={() => setOpenConfirm(false)}
                      >
                        Cancelar
                      </Button>
                      <Button
                        className="w-full"
                        disabled={truncateOpen}
                        onClick={handleSubmitInicio}
                      >
                        Confirmar
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </form>
          </>
        )}
      </Card>
      <div className="mt-8 space-y-4">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="deposits">
            <AccordionTrigger>
              <h3 className="text-lg font-semibold">
                Depósitos ({depositos.length})
              </h3>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 p-4">
                {depositos && depositos.length > 0 ? (
                  depositos.map((deposit) => (
                    <DepositItem key={deposit.id} deposit={deposit} />
                  ))
                ) : (
                  <p className="text-center text-gray-500">
                    No hay depósitos registrados.
                  </p>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="expenses">
            <AccordionTrigger>
              <h3 className="text-lg font-semibold">
                Egresos ({egreso.length})
              </h3>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 p-4">
                {egreso && egreso.length > 0 ? (
                  egreso.map((expense) => (
                    <ExpenseItem key={expense.id} expense={expense} />
                  ))
                ) : (
                  <p className="text-center text-gray-500">
                    No hay egresos registrados.
                  </p>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="sales">
            <AccordionTrigger>
              <h3 className="text-lg font-semibold">
                Ventas ({ventas.length})
              </h3>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 p-4">
                {ventas && ventas.length > 0 ? (
                  ventas.map((sale) => <SaleItem key={sale.id} sale={sale} />)
                ) : (
                  <p className="text-center text-gray-500">
                    No hay ventas registradas.
                  </p>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </>
  );
}
