import { useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { es } from "date-fns/locale";
import { toast } from "sonner";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Calendar as CalendarIcon,
  Coins,
  Download,
  ShoppingBag,
} from "lucide-react";

// Registrar el idioma para el DatePicker
registerLocale("es", es);
const API_URL = import.meta.env.VITE_API_URL;

// Tipos definidos
interface DateRange {
  startDate: Date | undefined;
  endDate: Date | undefined;
}

function VentasReport() {
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: undefined,
    endDate: undefined,
  });

  const [salesMinTotal, setSalesMinTotal] = useState<number | null>(null);
  const [salesMaxTotal, setSalesMaxTotal] = useState<number | null>(null);

  // Manejador para cambiar fechas
  const handleDateChange = (
    field: "startDate" | "endDate",
    date: Date | null
  ) => {
    setDateRange((prev) => ({ ...prev, [field]: date }));
  };

  // Manejador para descargar reporte
  const handleDownload = async () => {
    try {
      const params = {
        from: dateRange.startDate?.toISOString(),
        to: dateRange.endDate?.toISOString(),
        minTotal: salesMinTotal,
        maxTotal: salesMaxTotal,
      };

      const response = await axios.get(`${API_URL}/reports/ventas/excel`, {
        params,
        responseType: "blob", // Necesario para descargar archivos
      });

      // Crear enlace para descargar el archivo
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `ventas-reporte.xlsx`);
      document.body.appendChild(link);
      link.click();

      toast.success("El reporte de ventas ha sido descargado exitosamente.");
    } catch (error) {
      console.error("Error al descargar el reporte:", error);
      toast.error("Error al descargar el reporte.");
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <ShoppingBag className="h-6 w-6" />
          <span>Ventas</span>
        </CardTitle>
        <CardDescription>
          Reporte de ventas con filtro por rango de fechas y montos.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Rango de Fechas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Fecha de Inicio */}
          <div className="space-y-2">
            <label htmlFor="start-date" className="text-sm font-medium">
              Fecha de Inicio
            </label>
            <div className="relative">
              <DatePicker
                id="start-date"
                selected={dateRange.startDate}
                onChange={(date) => handleDateChange("startDate", date)}
                selectsStart
                isClearable={true}
                startDate={dateRange.startDate}
                endDate={dateRange.endDate}
                locale={es}
                dateFormat="dd/MM/yyyy"
                placeholderText="Seleccionar fecha de inicio"
                className="w-full px-4 py-2 pl-10 text-sm border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:outline-none"
              />
              <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </div>

          {/* Fecha de Fin */}
          <div className="space-y-2">
            <label htmlFor="end-date" className="text-sm font-medium">
              Fecha de Fin
            </label>
            <div className="relative">
              <DatePicker
                id="end-date"
                selected={dateRange.endDate}
                onChange={(date) => handleDateChange("endDate", date)}
                selectsEnd
                isClearable={true}
                startDate={dateRange.startDate}
                endDate={dateRange.endDate}
                minDate={dateRange.startDate}
                locale={es}
                dateFormat="dd/MM/yyyy"
                placeholderText="Seleccionar fecha de fin"
                className="w-full px-4 py-2 pl-10 text-sm border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:outline-none"
              />
              <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Costo Total Mínimo */}
        <div className="space-y-2">
          <label htmlFor="sales-min-total" className="text-sm font-medium">
            Costo Total Mínimo
          </label>
          <div className="relative">
            <Coins className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              id="sales-min-total"
              type="number"
              placeholder="Ingrese el costo mínimo"
              value={salesMinTotal !== null ? salesMinTotal : ""}
              onChange={(e) =>
                setSalesMinTotal(
                  e.target.value === "" ? null : parseFloat(e.target.value)
                )
              }
              className="pl-10"
            />
          </div>
        </div>

        {/* Costo Total Máximo */}
        <div className="space-y-2">
          <label htmlFor="sales-max-total" className="text-sm font-medium">
            Costo Total Máximo
          </label>
          <div className="relative">
            <Coins className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              id="sales-max-total"
              type="number"
              placeholder="Ingrese el costo máximo"
              value={salesMaxTotal !== null ? salesMaxTotal : ""}
              onChange={(e) =>
                setSalesMaxTotal(
                  e.target.value === "" ? null : parseFloat(e.target.value)
                )
              }
              className="pl-10"
            />
          </div>
        </div>

        {/* Botón de Descarga */}
        <Button
          onClick={handleDownload}
          className="w-full flex items-center justify-center"
        >
          <Download className="mr-2 h-4 w-4" /> Descargar Reporte
        </Button>
      </CardContent>
    </Card>
  );
}

export default VentasReport;
