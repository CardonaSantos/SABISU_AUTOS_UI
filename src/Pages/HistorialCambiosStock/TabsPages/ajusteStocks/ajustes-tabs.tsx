"use client";

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
import AjustesTable from "./ajustes-table";
import {
  HistorialAjusteStockItemDTO,
  PaginatedHistorialAjusteStockDTO,
} from "./interfaces.interface";
import { getHistorialAjusteStock } from "../../api";
import AjustesDetailModal from "./ajustes-details-modal";

export default function AjustesTabs({ isActive }: { isActive: boolean }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [data, setData] = useState<PaginatedHistorialAjusteStockDTO>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedAjuste, setSelectedAjuste] =
    useState<HistorialAjusteStockItemDTO | null>(null);
  console.log(error);

  const fetchAjustes = async (page: number, size: number) => {
    if (!isActive) return;
    setLoading(true);
    try {
      const resp = await getHistorialAjusteStock(page, size);
      setData(resp.data);
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : typeof err === "string"
          ? err
          : "Error desconocido";
      setError(msg);
      toast.error("Error al cargar ajustes de stock");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAjustes(currentPage, pageSize);
  }, [isActive, currentPage, pageSize]);

  const totalPages = data?.totalPages ?? 1;

  const handlePageChange = (page: number) => setCurrentPage(page);
  const handleViewDetails = (item: HistorialAjusteStockItemDTO) => {
    setSelectedAjuste(item);
  };
  const handleCloseModal = () => setSelectedAjuste(null);

  return (
    <div className="mt-4 space-y-4">
      <Select
        value={String(pageSize)}
        onValueChange={(v) => setPageSize(Number(v))}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Filas por página" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Filas por página</SelectLabel>
            {["10", "15", "20", "25", "50"].map((opt) => (
              <SelectItem key={opt} value={opt}>
                {opt}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      <AjustesTable
        data={data}
        isLoading={loading}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        onViewDetails={handleViewDetails}
      />

      <AjustesDetailModal
        isOpen={!!selectedAjuste}
        onClose={handleCloseModal}
        ajuste={selectedAjuste}
      />
    </div>
  );
}
