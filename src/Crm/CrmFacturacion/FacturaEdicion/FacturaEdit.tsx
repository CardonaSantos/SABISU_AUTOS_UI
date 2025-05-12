import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import {
  AlertCircle,
  Calendar,
  Clock,
  CreditCard,
  FileText,
  Info,
  Save,
  User,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";
import dayjs from "dayjs";

import "dayjs/locale/es";
// import utc from "dayjs/plugin/utc";
import localizedFormat from "dayjs/plugin/localizedFormat";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

dayjs.locale("es");
dayjs.extend(localizedFormat);

export interface FacturaToEdit {
  id: number;
  montoPago: number;
  saldoPendiente: number;
  fechaPagada: string | null;
  creadoEn: string;
  fechaPagoEsperada: string;
  estadoFacturaInternet: string; // ajustar al enum correspondiente
  actualizadoEn: string;
  detalleFactura: string; // ajustar campos según tu modelo
  cliente: {
    id: number;
    nombre: string;
    apellidos: string;
    estadoCliente: string; // ajustar al enum correspondiente
  };
}

enum FacturaEstado {
  PENDIENTE = "PENDIENTE",
  PAGADA = "PAGADA",
  VENCIDA = "VENCIDA",
  ANULADA = "ANULADA",
  PARCIAL = "PARCIAL",
}

function FacturaEdit() {
  const VITE_CRM_API_URL = import.meta.env.VITE_CRM_API_URL;
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const facutura_id = searchParams.get("factura");
  console.log("factura_id", facutura_id);

  const [factura, setFactura] = useState<FacturaToEdit | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [openConfirm, setOpenConfirm] = useState(false);
  const getFacturaDetails = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${VITE_CRM_API_URL}/facturacion/get-factura-to-edit/${facutura_id}`
      );
      if (response.status === 200) {
        setFactura(response.data);
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getFacturaDetails();
  }, []);
  console.log("factura", factura);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    {
      const { name, value } = e.target;

      setFactura((previaData) =>
        previaData
          ? {
              ...previaData,
              [name]: value,
            }
          : previaData
      );
    }
  };

  const handleSelectChange = (value: string) => {
    setFactura((previaData) =>
      previaData
        ? {
            ...previaData,
            estadoFacturaInternet: value,
          }
        : previaData
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case FacturaEstado.PAGADA:
        return "bg-green-100 text-green-800";
      case FacturaEstado.PENDIENTE:
        return "bg-yellow-100 text-yellow-800";
      case FacturaEstado.VENCIDA:
        return "bg-red-100 text-red-800";
      case FacturaEstado.ANULADA:
        return "bg-gray-100 text-gray-800";
      case FacturaEstado.PARCIAL:
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const [isSubmiting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);

    // Construimos el payload cuidando las fechas
    const dataSend = {
      montoPago: Number(factura?.montoPago) || 0,
      saldoPendiente: Number(factura?.saldoPendiente) || 0,
      // Si viene fechaPagada válida, la convertimos a ISO, si no, null
      fechaPagada: factura?.fechaPagada
        ? dayjs(factura.fechaPagada).isValid()
          ? dayjs(factura.fechaPagada).toISOString()
          : null
        : null,
      // Igual para fechaPagoEsperada
      fechaPagoEsperada: factura?.fechaPagoEsperada
        ? dayjs(factura.fechaPagoEsperada).isValid()
          ? dayjs(factura.fechaPagoEsperada).toISOString()
          : null
        : null,
      estadoFacturaInternet: factura?.estadoFacturaInternet,
      detalleFactura: factura?.detalleFactura,
    };

    try {
      const response = await axios.patch(
        `${VITE_CRM_API_URL}/facturacion/update-factura/${facutura_id}`,
        dataSend
      );

      // La API devuelve 200 OK (no 201)
      if (response.status === 200) {
        toast.success("Factura actualizada con éxito");
        navigate(-1); // vuelve atrás
      } else {
        toast.info("No se pudo actualizar la factura");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error al actualizar la factura");
    } finally {
      // Siempre reactivamos el botón
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <span className="sr-only">Cargando...</span>
        </div>
      ) : (
        <Card className="w-full max-w-4xl mx-auto shadow-lg">
          <CardHeader className="border-b bg-muted/50">
            <CardTitle className="text-2xl flex items-center gap-2">
              <FileText className="h-6 w-6" />
              Edición de Factura #{factura?.id}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form
              onSubmit={(e: React.FormEvent) => {
                e.preventDefault();
                // Aquí puedes manejar el envío del formulario
                console.log("Formulario enviado", factura);
              }}
            >
              <div className="space-y-6">
                {/* Información del cliente */}
                <div className="bg-muted/30 p-4 rounded-lg mb-6">
                  <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Información del Cliente
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nombre" className="text-sm font-medium">
                        Nombre
                      </Label>
                      <Input
                        id="nombre"
                        type="text"
                        value={factura?.cliente.nombre}
                        onChange={handleInputChange}
                        name="nombre"
                        disabled
                        className="bg-muted/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="apellidos"
                        className="text-sm font-medium"
                      >
                        Apellidos
                      </Label>
                      <Input
                        id="apellidos"
                        type="text"
                        value={factura?.cliente.apellidos}
                        onChange={handleInputChange}
                        name="apellidos"
                        disabled
                        className="bg-muted/50"
                      />
                    </div>
                  </div>
                </div>

                {/* Información de pago */}
                <div>
                  <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Información de Pago
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label
                        htmlFor="montoPago"
                        className="text-sm font-medium flex items-center gap-1"
                      >
                        <CreditCard className="h-4 w-4" />
                        Monto Pago
                      </Label>
                      <Input
                        id="montoPago"
                        type="number"
                        value={factura?.montoPago}
                        onChange={handleInputChange}
                        name="montoPago"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <Label
                          htmlFor="saldoPendiente"
                          className="text-sm font-medium flex items-center gap-1"
                        >
                          <CreditCard className="h-4 w-4" />
                          Saldo Pendiente
                        </Label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="w-4 h-4" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-xs">
                                El saldo pendiente se restaurará en funcion del
                                nuevo monto pago
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>

                      <Input
                        disabled
                        id="saldoPendiente"
                        type="number"
                        value={factura?.saldoPendiente}
                        onChange={handleInputChange}
                        name="saldoPendiente"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="fechaPagoEsperada"
                        className="text-sm font-medium flex items-center gap-1"
                      >
                        <Calendar className="h-4 w-4" />
                        Fecha de Pago Esperada
                      </Label>
                      <Input
                        id="fechaPagoEsperada"
                        type="date"
                        value={factura?.fechaPagoEsperada.split("T")[0]}
                        onChange={handleInputChange}
                        name="fechaPagoEsperada"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="fechaPagada"
                        className="text-sm font-medium flex items-center gap-1"
                      >
                        <Calendar className="h-4 w-4" />
                        Fecha Pagada
                      </Label>
                      <Input
                        id="fechaPagada"
                        type="date"
                        value={
                          factura?.fechaPagada
                            ? factura?.fechaPagada.split("T")[0]
                            : ""
                        }
                        onChange={handleInputChange}
                        name="fechaPagada"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="creadoEn"
                        className="text-sm font-medium flex items-center gap-1"
                      >
                        <Clock className="h-4 w-4" />
                        Creado en
                      </Label>
                      <Input
                        id="creadoEn"
                        disabled
                        type="date"
                        value={factura?.creadoEn.split("T")[0]}
                        onChange={handleInputChange}
                        name="creadoEn"
                        className="bg-muted/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="estadoFactura"
                        className="text-sm font-medium flex items-center gap-1"
                      >
                        <AlertCircle className="h-4 w-4" />
                        Estado de Factura
                      </Label>
                      <Select
                        defaultValue={factura?.estadoFacturaInternet}
                        onValueChange={handleSelectChange}
                      >
                        <SelectTrigger
                          id="estadoFactura"
                          className={`${getStatusColor(
                            factura?.estadoFacturaInternet || ""
                          )}`}
                        >
                          <SelectValue>
                            {factura?.estadoFacturaInternet}
                          </SelectValue>
                        </SelectTrigger>

                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Estados de factura</SelectLabel>
                            <SelectItem
                              value={FacturaEstado.ANULADA}
                              className="flex items-center gap-2"
                            >
                              ANULADA
                            </SelectItem>
                            <SelectItem
                              value={FacturaEstado.PAGADA}
                              className="flex items-center gap-2"
                            >
                              PAGADA
                            </SelectItem>
                            <SelectItem
                              value={FacturaEstado.PARCIAL}
                              className="flex items-center gap-2"
                            >
                              PARCIAL
                            </SelectItem>
                            <SelectItem
                              value={FacturaEstado.PENDIENTE}
                              className="flex items-center gap-2"
                            >
                              PENDIENTE
                            </SelectItem>
                            <SelectItem
                              value={FacturaEstado.VENCIDA}
                              className="flex items-center gap-2"
                            >
                              VENCIDA
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Detalles de factura */}
                <div className="col-span-2 space-y-2 mt-4">
                  <Label
                    htmlFor="detalleFactura"
                    className="text-sm font-medium flex items-center gap-1"
                  >
                    <FileText className="h-4 w-4" />
                    Detalle de Factura
                  </Label>
                  <Textarea
                    id="detalleFactura"
                    value={factura?.detalleFactura}
                    onChange={handleInputChange}
                    name="detalleFactura"
                    rows={4}
                    className="w-full resize-none"
                    placeholder="Ingrese detalles adicionales sobre esta factura..."
                  />
                </div>
              </div>

              <CardFooter className="flex justify-end px-0 pt-6 pb-0 mt-6">
                <Button
                  variant={"outline"}
                  onClick={() => setOpenConfirm(true)}
                  type="button"
                  className="flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  Confirmar cambios
                </Button>
              </CardFooter>
            </form>
          </CardContent>
        </Card>
      )}

      <Dialog open={openConfirm} onOpenChange={setOpenConfirm}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-center">
              Confirmar edición de factura
            </DialogTitle>
            <DialogDescription className="text-center">
              ¿Está seguro de que desea aplicar estos cambios a la factura?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Advertencia</AlertTitle>
              <AlertDescription>
                El saldo pendiente y el estado del cliente se verán afectados
                según los datos ingresados.
              </AlertDescription>
            </Alert>
          </div>
          <DialogFooter>
            <Button
              className="w-full"
              variant="outline"
              onClick={() => setOpenConfirm(false)}
              disabled={isSubmiting}
            >
              Cancelar
            </Button>
            <Button
              className="w-full"
              variant="destructive"
              onClick={handleSubmit}
              disabled={isSubmiting}
            >
              Confirmar cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default FacturaEdit;
