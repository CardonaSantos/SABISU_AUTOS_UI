import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getHistorialStockVentas } from "../../api";
import VentasTable from "./ventas-table";
import VentasDetailModal from "./ventas-details-modal";
import {
  HistorialSalidaVentaItemDTO,
  PaginatedHistorialSalidaVentaDTO,
} from "./interfaces.interface";

export default function VentasTabs({ isActive }: { isActive: boolean }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10); // Puedes ajustar el tamaño de página

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedVenta, setSelectedVenta] =
    useState<HistorialSalidaVentaItemDTO | null>(null);

  // Tu estado “data” ya está bien:
  const [data, setData] = useState<PaginatedHistorialSalidaVentaDTO>();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getTrackerVentas = async (currentPage: number, pageSize: number) => {
    try {
      if (!isActive) return;
      setLoading(true);
      const response = await getHistorialStockVentas(currentPage, pageSize);
      setData(response.data);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : typeof error === "string"
          ? error
          : "Ocurrió un error desconocido"
      );
      console.log("El error es: ", error);
      toast.error("Error al conseguir trackeos de requisiciones");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTrackerVentas(currentPage, pageSize);
  }, [isActive, currentPage, pageSize]);

  const totalPages = data?.totalPages ?? 1;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleViewDetails = (item: HistorialSalidaVentaItemDTO) => {
    setSelectedVenta(item);
    setIsModalOpen(true);
  };

  console.log("La data solicitante es: ", data);
  console.log("El error es: ", error);

  return (
    <div className="mt-4 space-y-4">
      <Select
        onValueChange={(value: string) => {
          setPageSize(Number(value));
        }}
        value={String(pageSize)}
      >
        <SelectTrigger className="w-[280px]">
          <SelectValue placeholder="Items por paginas" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Cantidad por pagina</SelectLabel>
            <SelectItem value={"15"}>15</SelectItem>
            <SelectItem value={"20"}>20</SelectItem>
            <SelectItem value={"25"}>25</SelectItem>
            <SelectItem value={"30"}>30</SelectItem>
            <SelectItem value={"50"}>50</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      <VentasTable
        data={data}
        isLoading={loading}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        onViewDetails={handleViewDetails} // ahora recibe HistorialSalidaVentaItemDTO
      />

      <VentasDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        venta={selectedVenta} // ojo, pasa selectedVenta, no “requisicion”
      />
    </div>
  );
}
