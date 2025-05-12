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
import { CalendarIcon, FileText, X } from "lucide-react";
const VITE_CRM_API_URL = import.meta.env.VITE_CRM_API_URL;

interface DataGenerateFactura {
  mesInicio: number | null;
  mesFin: number | null;
  anio: number | null;
  clienteId: number | null;
}

interface DialogProps {
  openGenerateFacturas: false | true;
  setOpenGenerateFacturas: (value: boolean) => void;
  clienteId: number | null;
  getClienteDetails: () => void;
}

function GenerateFacturas({
  openGenerateFacturas,
  setOpenGenerateFacturas,
  clienteId,
  getClienteDetails,
}: DialogProps) {
  const [fechaInicio, setFechaInicio] = useState<Date | null>(null);
  const [fechaFin, setFechaFin] = useState<Date | null>(null);

  const [dataGenerarFactura, setDataGenerarFactura] =
    useState<DataGenerateFactura>({
      anio: null,
      clienteId: clienteId,
      mesInicio: null,
      mesFin: null,
    });

  const handleDateChange = (type: "inicio" | "fin", date: Date | null) => {
    if (type === "inicio") {
      setFechaInicio(date);
      if (date) {
        setDataGenerarFactura((previaData) => ({
          ...previaData,
          anio: date.getFullYear(),
          mesInicio: date.getMonth() + 1, // Ajustar mes
        }));
      }
    } else if (type === "fin") {
      setFechaFin(date);
      if (date) {
        setDataGenerarFactura((previaData) => ({
          ...previaData,
          mesFin: date.getMonth() + 1, // Ajustar mes
        }));
      }
    }
  };

  const [isSubmiting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!clienteId || clienteId === 0) {
      toast.error("No se ha proporcionado un cliente válido.");
      return;
    }

    if (!fechaInicio || !fechaFin) {
      toast.error("Por favor, seleccione el rango de meses.");
      return;
    }

    const data = {
      clienteId: clienteId,
      mesInicio: dataGenerarFactura.mesInicio,
      mesFin: dataGenerarFactura.mesFin,
      anio: dataGenerarFactura.anio,
    };

    console.log("La data generada es: ", data);

    try {
      setIsSubmitting(true);
      const response = await axios.post(
        `${VITE_CRM_API_URL}/facturacion/generate-factura-internet-multiple`,
        data
      );

      if (response.status === 200 || response.status === 201) {
        toast.success("Facturas Generadas");
        setOpenGenerateFacturas(false);
        setFechaInicio(null);
        setFechaFin(null);
        setIsSubmitting(false);
        await getClienteDetails();
      }
    } catch (error) {
      console.log(error);
      toast.error("Error al generar facturas");
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={openGenerateFacturas} onOpenChange={setOpenGenerateFacturas}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden rounded-xl border-0 shadow-xl">
        {/* Icon with animation */}

        {/* Header */}
        <DialogHeader className="pt-8 px-6 pb-2">
          <DialogTitle className="text-xl font-semibold text-center text-gray-800 dark:text-gray-400">
            Generar facturas por adelantado
          </DialogTitle>
          <DialogDescription className="text-center text-gray-600 text-sm mt-1 dark:text-gray-400">
            Genere múltiples facturas para los meses seleccionados
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 py-4">
          {/* Form content */}
          <div className="border border-gray-200 rounded-lg p-5 mb-5 bg-gray-50 shadow-inner dark:bg-stone-950">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label
                  htmlFor="fechaInicio"
                  className="text-sm font-medium text-gray-700 dark:text-gray-400"
                >
                  Mes de inicio
                </Label>
                <div className="relative">
                  <DatePicker
                    id="fechaInicio"
                    locale={es}
                    selected={fechaInicio || null}
                    onChange={(date) => handleDateChange("inicio", date)}
                    selectsStart
                    placeholderText="Seleccione mes de inicio"
                    className="h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-400 pr-10 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-300"
                    dateFormat="MM/yyyy"
                    isClearable={true}
                    showMonthYearPicker
                  />
                  <CalendarIcon className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="fechaFin"
                  className="text-sm font-medium text-gray-700 dark:text-gray-400"
                >
                  Mes de fin
                </Label>
                <div className="relative">
                  <DatePicker
                    id="fechaFin"
                    locale={es}
                    selected={fechaFin || null}
                    onChange={(date) => handleDateChange("fin", date)}
                    selectsEnd
                    placeholderText="Seleccione mes de fin"
                    className="h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-400 pr-10 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-300"
                    dateFormat="MM/yyyy"
                    isClearable={true}
                    showMonthYearPicker
                  />
                  <CalendarIcon className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-5"></div>

          {/* Action buttons */}
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-2 pb-2">
            <Button
              variant="outline"
              onClick={() => setOpenGenerateFacturas(false)}
              className="border border-gray-200 w-full bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 rounded-lg py-2.5 transition-all duration-200 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-800"
            >
              <X className="mr-2 h-4 w-4" />
              Cerrar
            </Button>
            <Button
              disabled={isSubmiting}
              onClick={handleSubmit}
              className="w-full bg-gray-800 text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-800 rounded-lg py-2.5 shadow-sm transition-all duration-200"
            >
              {isSubmiting ? (
                <>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Procesando...
                </>
              ) : (
                <>
                  <FileText className="mr-2 h-4 w-4" />
                  Generar Facturas
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default GenerateFacturas;
