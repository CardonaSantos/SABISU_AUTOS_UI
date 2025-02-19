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
  CreditCard,
  Download,
  FileText,
  // ShoppingBag,
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
  const [dateRangeVenta, setDateRangeVenta] = useState<DateRange>({
    startDate: undefined,
    endDate: undefined,
  });

  const [salesMinTotal, setSalesMinTotal] = useState<string>("");
  const [salesMaxTotal, setSalesMaxTotal] = useState<string>(""); // Nuevo estado
  // Manejador para descargar reporte

  const handleDownload = async (
    type: string,
    dateRange: DateRange,
    additionalParams = {}
  ) => {
    try {
      const params = {
        from: dateRange?.startDate?.toISOString(),
        to: dateRange?.endDate?.toISOString(),
        // useDiscounted: useDiscounted,
        ...additionalParams,
      };

      console.log("Los datos de los params es: ", params);

      const response = await axios.get(`${API_URL}/reports/${type}/excel`, {
        params,
        responseType: "blob", // Necesario para descargar archivos
      });

      // Crear enlace para descargar el archivo
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${type}-reporte.xlsx`);
      document.body.appendChild(link);
      link.click();

      toast.success(`El reporte de ${type} ha sido descargado exitosamente.`);
    } catch (error) {
      console.error(`Error al descargar el reporte de ${type}:`, error);
      toast.error("Error al descargar el reporte.");
    }
  };

  const [creditosDateRange, setCreditosDateRange] = useState<DateRange>({
    startDate: undefined,
    endDate: undefined,
  });

  const handleDateChange = (
    reportType: string,
    field: "startDate" | "endDate",
    date: Date | null
  ) => {
    switch (reportType) {
      case "ventas":
        setDateRangeVenta((prev) => ({ ...prev, [field]: date }));
        break;

      case "credito":
        setCreditosDateRange((prev) => ({ ...prev, [field]: date }));
        break;
    }
  };

  interface ReportCardProps {
    title: string;
    icon: React.ReactNode;
    description: string;
    dateRange: DateRange;
    onDateChange: (field: "startDate" | "endDate", date: Date | null) => void;
    onDownload: () => void;
    children?: React.ReactNode;
    startDatePlaceholder?: string; // Placeholder para la fecha de inicio
    endDatePlaceholder?: string; // Placeholder para la fecha de fin
  }

  function ReportCard({
    title,
    icon,
    description,
    dateRange,
    onDateChange,
    onDownload,
    children,
    startDatePlaceholder = "Seleccionar fecha de inicio", // Valor por defecto
    endDatePlaceholder = "Seleccionar fecha de fin", // Valor por defecto
  }: ReportCardProps) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            {icon}
            <span>{title}</span>
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Fecha de Inicio */}
            <div className="space-y-2">
              <label
                htmlFor={`start-date-${title}`}
                className="text-sm font-medium"
              >
                Fecha
              </label>
              <div className="relative">
                <DatePicker
                  id={`start-date-${title}`}
                  selected={dateRange.startDate}
                  onChange={(date) => onDateChange("startDate", date)}
                  selectsStart
                  isClearable={true}
                  startDate={dateRange.startDate}
                  endDate={dateRange.endDate}
                  locale={es}
                  dateFormat="dd/MM/yyyy"
                  placeholderText={startDatePlaceholder} // Usar la prop
                  className="text-sm w-full px-4 py-2 border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:outline-none"
                />
                <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              </div>
            </div>
            {/* Fecha de Fin */}
            <div className="space-y-2">
              <label
                htmlFor={`end-date-${title}`}
                className="text-sm font-medium"
              >
                Fecha
              </label>
              <div className="relative">
                <DatePicker
                  id={`end-date-${title}`}
                  selected={dateRange.endDate}
                  onChange={(date) => onDateChange("endDate", date)}
                  selectsEnd
                  isClearable={true}
                  startDate={dateRange.startDate}
                  endDate={dateRange.endDate}
                  minDate={dateRange.startDate}
                  locale={es}
                  dateFormat="dd/MM/yyyy"
                  placeholderText={endDatePlaceholder} // Usar la prop
                  className="text-sm w-full px-4 py-2 border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:outline-none"
                />
                <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 " />
              </div>
            </div>
          </div>
          {children}
          <Button onClick={onDownload} className="w-full">
            <Download className="mr-2 h-4 w-4" /> Descargar Reporte
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileText className="h-6 w-6" />
          <span>Conseguir Reportes</span>
        </CardTitle>
        <CardDescription>
          Reportes con filtros por rango de fechas y montos.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* CONSEGUIR REPORTES DE LAS VENTAS */}
        <ReportCard
          title="Ventas"
          icon={<Coins className="h-6 w-6" />}
          description="Reporte de ventas con filtro por rango de fechas y montos"
          dateRange={dateRangeVenta}
          onDateChange={(field, date) =>
            handleDateChange("ventas", field, date)
          }
          onDownload={() =>
            handleDownload("ventas", dateRangeVenta, {
              minTotal: salesMinTotal,
              maxTotal: salesMaxTotal,
            })
          }
        >
          <div className="space-y-2">
            <label htmlFor="sales-min-total" className="text-sm font-medium">
              Costo Total Mínimo
            </label>
            <Input
              id="sales-min-total"
              type="number"
              placeholder="Ingrese el costo total mínimo"
              value={salesMinTotal}
              onChange={(e) => setSalesMinTotal(e.target.value)}
            />
            <label htmlFor="sales-max-total" className="text-sm font-medium">
              Costo Total Máximo
            </label>
            <Input
              id="sales-max-total"
              type="number"
              placeholder="Ingrese el costo total máximo"
              value={salesMaxTotal}
              onChange={(e) => setSalesMaxTotal(e.target.value)}
            />
          </div>
        </ReportCard>
        {/* CONSEGUIR REPORTES DE LAS VENTAS */}

        {/* CONSEGUIR REPORTES DE CREDITOS */}
        <ReportCard
          title="Creditos"
          icon={<CreditCard className="h-6 w-6" />} // Icono ideal para entregas
          description="Reporte de historial de Asistencias"
          dateRange={creditosDateRange}
          onDateChange={(field, date) =>
            handleDateChange("creditos", field, date)
          }
          onDownload={() =>
            handleDownload("creditos", creditosDateRange, {
              // proveedor: selectedProveedor?.value, // Filtro de proveedor
            })
          }
          startDatePlaceholder="Inicio del rango de creación"
          endDatePlaceholder="Fin del rango de creación"
        ></ReportCard>
        {/* CONSEGUIR REPORTES DE CREDITOS */}
      </CardContent>
    </Card>
  );
}

export default VentasReport;
