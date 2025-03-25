import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { RutaCobroInterface } from "./RutaCobroInterface";
const VITE_CRM_API_URL = import.meta.env.VITE_CRM_API_URL;
import MapsMapa from "./ClientesRutaMap";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  User,
  Phone,
  Calendar,
  DollarSign,
  CreditCard,
  Clock,
  FileText,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import currency from "currency.js";

const formatearMoneda = (monto: number) => {
  return currency(monto, {
    symbol: "Q",
    separator: ",",
    decimal: ".",
    precision: 2,
  }).format();
};

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function RutaCobro() {
  const { rutaId } = useParams<{ rutaId: string }>();
  const [ruta, setRuta] = useState<RutaCobroInterface>();
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const getRuta = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${VITE_CRM_API_URL}/ruta-cobro/get-one-ruta-cobro/${rutaId}`
      );

      if (response.status === 200) {
        setRuta(response.data);
      }
    } catch (error) {
      console.log(error);
      toast.info("Error al conseguir datos");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getRuta();
  }, [rutaId]);

  const handleClientSelect = (clientId: number) => {
    setSelectedClientId(clientId);
  };

  const handleRegisterPayment = (clientId: number, facturaId: number) => {
    toast.info(`Registrando pago para factura #${facturaId}`);
    // Implement your payment registration logic here
    alert(`el cliente seleccionado es ${clientId}`);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">
            Cargando datos de la ruta...
          </p>
        </div>
      </div>
    );
  }

  if (!ruta) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>Ruta no encontrada</CardTitle>
            <CardDescription>
              No se pudo encontrar la información de esta ruta de cobro.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => window.history.back()}>Volver</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-4 space-y-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-4"
      >
        <div className="flex flex-col space-y-4 order-2 lg:order-1">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-xl">{ruta.nombreRuta}</CardTitle>
                  <CardDescription>
                    <div className="flex items-center mt-1">
                      <User className="h-4 w-4 mr-1" />
                      <span>Cobrador: {ruta.cobrador.nombre}</span>
                    </div>
                  </CardDescription>
                </div>
                <Badge variant="outline" className="ml-2">
                  {ruta.clientes.length} clientes
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="text-sm text-muted-foreground flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                <span>Creado: {formatDate(ruta.creadoEn)}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="flex-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Clientes en Ruta</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[calc(100vh-350px)] px-4">
                <Accordion type="single" collapsible className="w-full">
                  {ruta.clientes.map((cliente) => (
                    <AccordionItem
                      key={cliente.id}
                      value={`cliente-${cliente.id}`}
                    >
                      <AccordionTrigger
                        className="py-3 px-2 hover:bg-accent rounded-md group"
                        onClick={() => handleClientSelect(cliente.id)}
                      >
                        <div className="flex flex-1 items-center justify-between pr-2">
                          <div className="flex items-center">
                            <div
                              className={cn(
                                "w-2 h-2 rounded-full mr-3",
                                cliente.saldo.saldoPendiente > 0
                                  ? "bg-destructive"
                                  : "bg-green-500"
                              )}
                            ></div>
                            <span>{cliente.nombreCompleto}</span>
                          </div>
                          <Badge
                            variant={
                              cliente.saldo.saldoPendiente > 0
                                ? "destructive"
                                : "outline"
                            }
                            className="ml-2"
                          >
                            {formatearMoneda(cliente.saldo.saldoPendiente)}
                          </Badge>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-2">
                        <div className="space-y-3 py-1">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <div className="flex items-center text-sm">
                              <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>{cliente.telefono}</span>
                            </div>
                            <div className="flex items-center text-sm">
                              <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>
                                Último pago:{" "}
                                {formatDate(cliente.saldo.ultimoPago)}
                              </span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="flex items-center">
                              <DollarSign className="h-4 w-4 mr-2 text-green-500" />
                              <span>
                                Saldo a favor:{" "}
                                {formatearMoneda(cliente.saldo.saldoFavor)}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <CreditCard className="h-4 w-4 mr-2 text-destructive" />
                              <span>
                                Pendiente:{" "}
                                {formatearMoneda(cliente.saldo.saldoPendiente)}
                              </span>
                            </div>
                          </div>

                          <Separator />

                          <div className="space-y-2">
                            <h4 className="text-sm font-medium flex items-center">
                              <FileText className="h-4 w-4 mr-2" />
                              Facturas pendientes
                            </h4>
                            {cliente.facturas.length > 0 ? (
                              <div className="space-y-2">
                                {cliente.facturas.map((factura) => (
                                  <div
                                    key={factura.id}
                                    className="bg-accent/50 p-2 rounded-md"
                                  >
                                    <div className="flex justify-between items-center">
                                      <div className="flex items-center">
                                        {factura.estadoFactura ===
                                        "pendiente" ? (
                                          <AlertCircle className="h-4 w-4 mr-2 text-amber-500" />
                                        ) : (
                                          <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                                        )}
                                        <span className="text-sm font-medium">
                                          Factura #{factura.id}
                                        </span>
                                      </div>
                                      <Badge
                                        className={`${
                                          factura.estadoFactura === "PENDIENTE"
                                            ? "bg-red-500"
                                            : factura.estadoFactura ===
                                              "PARCIAL"
                                            ? "bg-yellow-500"
                                            : "bg-green-500"
                                        }`}
                                      >
                                        {factura.estadoFactura}
                                      </Badge>
                                    </div>
                                    <div className="mt-1 grid grid-cols-2 gap-1 text-xs text-muted-foreground">
                                      <div>
                                        Monto:{" "}
                                        {formatearMoneda(factura.montoPago)}
                                      </div>
                                      <div>
                                        Pendiente:{" "}
                                        {formatearMoneda(
                                          factura.saldoPendiente
                                        )}
                                      </div>
                                      <div>
                                        Fecha: {formatDate(factura.creadoEn)}
                                      </div>
                                    </div>
                                    <div className="mt-2">
                                      <Button
                                        size="sm"
                                        className="w-full"
                                        onClick={() =>
                                          handleRegisterPayment(
                                            cliente.id,
                                            factura.id
                                          )
                                        }
                                      >
                                        Registrar Pago
                                      </Button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-sm text-muted-foreground">
                                No hay facturas pendientes
                              </div>
                            )}
                          </div>

                          <div className="pt-1">
                            {/* <Button
                              variant="outline"
                              size="sm"
                              className="w-full"
                              onClick={() => handleClientSelect(cliente.id)}
                            >
                              <MapPin className="h-4 w-4 mr-2" />
                              Ver en mapa
                            </Button> */}
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        <div className="order-1 lg:order-2">
          <Card className="h-full flex flex-col">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">
                Mapa de clientes en ruta
              </CardTitle>
              <CardDescription>
                {selectedClientId ? (
                  <span>Mostrando ubicación del cliente seleccionado</span>
                ) : (
                  <span>Mostrando todos los clientes en la ruta</span>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 p-0">
              <div className="h-full w-full">
                <MapsMapa />
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}

export default RutaCobro;
