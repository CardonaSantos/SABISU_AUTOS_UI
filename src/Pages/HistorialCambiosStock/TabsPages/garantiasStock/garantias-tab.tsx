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
import GarantiasDetailsModal from "./garantias-details-modal";
import { HistorialStockDTO, PaginatedHistorialStock } from "../DtoGenerico";
import GarantiasTable from "./garantias-table";
import { toast } from "sonner";
import { getHistorialStockGarantias } from "../../api";

export default function GarantiasTab({ isActive }: { isActive: boolean }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10); // Puedes ajustar el tamaño de página

  const [selectedGarantia, setSelectedGarantia] =
    useState<HistorialStockDTO | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [data, setData] = useState<PaginatedHistorialStock>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getTrackerRequisiciones = async (
    currentPage: number,
    pageSize: number
  ) => {
    try {
      if (!isActive) return;
      setLoading(true);
      const response = await getHistorialStockGarantias(currentPage, pageSize);
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
    getTrackerRequisiciones(currentPage, pageSize);
  }, [isActive, currentPage, pageSize]);

  const totalPages = data?.totalPages ?? 1;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleViewDetails = (item: HistorialStockDTO) => {
    setSelectedGarantia(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedGarantia(null);
  };

  console.log("La data solicitante es: ", data);
  console.log("El error es: ", error);

  console.log("La garantia seleccionada es: ", selectedGarantia);

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

      <GarantiasTable
        data={data}
        isLoading={loading}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        onViewDetails={handleViewDetails}
      />

      <GarantiasDetailsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        garantia={selectedGarantia}
      />
    </div>
  );
}
