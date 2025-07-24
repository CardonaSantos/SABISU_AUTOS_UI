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
import RequisicionDetailsModal from "./requisicion-details-modal";
import { HistorialStockDTO, PaginatedHistorialStock } from "../DtoGenerico";
import RequisicionesTable from "./requisiciones-table";
import { toast } from "sonner";
import { getHistorialStockRequisiciones } from "../../api";

export default function EntradasTab({ isActive }: { isActive: boolean }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10); // Puedes ajustar el tamaño de página

  const [selectedRequisicion, setSelectedRequisicion] =
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
      const response = await getHistorialStockRequisiciones(
        currentPage,
        pageSize
      );
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
    setSelectedRequisicion(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRequisicion(null);
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

      <RequisicionesTable
        data={data}
        isLoading={loading}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        onViewDetails={handleViewDetails}
      />

      <RequisicionDetailsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        requisicion={selectedRequisicion}
      />
    </div>
  );
}
