// import React from "react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import DatePicker from "react-datepicker";
import { es } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { toast } from "sonner";
const VITE_CRM_API_URL = import.meta.env.VITE_CRM_API_URL;

interface DataGenerateFactura {
  mes: number | null;
  anio: number | null;
  clienteId: number | null;
}

interface DialogProps {
  openGenerarFactura: false | true;
  setOpenGenerarFactura: (value: boolean) => void;
  // handleGenerateFactura: () => void;
  clienteId: number | null;
  getClienteDetails: () => void;
}

function FacturaGenerateDialog({
  openGenerarFactura,
  setOpenGenerarFactura,
  clienteId,
  getClienteDetails,
}: DialogProps) {
  const [fechaSeleccionada, setFechaSeleccionada] = useState<Date | null>(null);

  const [dataGenerarFactura, setDataGenerarFactura] =
    useState<DataGenerateFactura>({
      anio: null,
      clienteId: clienteId,
      mes: null,
    });

  console.log("El objeto es: ", dataGenerarFactura);
  console.log("El clienteId es: ", clienteId);

  const handleDateChange = (date: Date | null) => {
    setFechaSeleccionada(date); // Actualizamos el estado correctamente cuando se limpia el campo
    if (date) {
      const mes = date.getMonth() + 1;
      const anio = date.getFullYear();
      setDataGenerarFactura((previaData) => ({
        ...previaData,
        anio: anio,
        mes: mes,
      }));
    } else {
      // Si se limpia la fecha, actualizamos mes y año a null
      setDataGenerarFactura((previaData) => ({
        ...previaData,
        anio: null,
        mes: null,
      }));
    }
  };

  const handleSubmit = async () => {
    if (!clienteId || clienteId === 0) {
      toast.error("No se ha proporcionado un cliente válido.");
      return;
    }

    if (!fechaSeleccionada) return;

    const mes = fechaSeleccionada.getMonth() + 1; // getMonth() devuelve 0 para enero, por eso sumamos 1
    const anio = fechaSeleccionada.getFullYear();

    const data = {
      clienteId: clienteId,
      mes: mes,
      anio: anio,
    };

    try {
      const response = await axios.post(
        `${VITE_CRM_API_URL}/facturacion/generate-factura-internet`,
        data
      );

      if (response.status === 200 || response.status === 201) {
        toast.success("Factura Generada");
        setOpenGenerarFactura(false);
        setFechaSeleccionada(null);
        await getClienteDetails();
      }
    } catch (error) {
      console.log(error);
      toast.error("Error al generar factura");
    }
  };

  console.log("La fecha seleccionada: ", fechaSeleccionada);
  console.log("el objeto es: ", dataGenerarFactura);

  return (
    <div className="container mx-auto py-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Dialog open={openGenerarFactura} onOpenChange={setOpenGenerarFactura}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-center">
                Generar factura de servicio de internet
              </DialogTitle>
              <DialogDescription className="text-center">
                Genere una factura pasada o futura
              </DialogDescription>
            </DialogHeader>
            <div className="">
              <Label htmlFor="fecha" className="mr-2">
                Mes de pago
              </Label>
              <DatePicker
                id="fecha"
                locale={es}
                selected={fechaSeleccionada || null}
                onChange={handleDateChange}
                selectsStart
                placeholderText="Fecha inicial"
                className="h-9 w-full min-w-[140px] rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                dateFormat="MM/yyyy"
                isClearable={true}
              />
            </div>
            <div className="flex gap-2">
              <Button className="w-full" variant={"destructive"}>
                Cerrar
              </Button>

              <Button
                variant={"outline"}
                className="w-full"
                onClick={handleSubmit}
              >
                Generar Factura
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>
    </div>
  );
}

export default FacturaGenerateDialog;
