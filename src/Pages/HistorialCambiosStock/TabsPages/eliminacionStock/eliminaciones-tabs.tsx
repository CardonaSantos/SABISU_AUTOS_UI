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
import EliminacionesTable from "./eliminaciones-table";
import EliminacionesDetailModal from "./eliminaciones-details-modal";
import { getHistorialStockEliminacion } from "../../api";
import {
  HistorialStockEliminacionItem,
  HistorialStockEliminacionResponse,
} from "./interface.interface";

export default function EliminacionesTabs({ isActive }: { isActive: boolean }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [data, setData] = useState<HistorialStockEliminacionResponse>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedEliminacion, setSelectedEliminacion] =
    useState<HistorialStockEliminacionItem | null>(null);
  console.log("El error en tabs: ", error);

  const fetchEliminaciones = async (page: number, size: number) => {
    if (!isActive) return;
    setLoading(true);
    try {
      const resp = await getHistorialStockEliminacion(page, size);
      setData(resp.data);
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : typeof err === "string"
          ? err
          : "Error desconocido";
      setError(msg);
      toast.error("Error al cargar historial de eliminaciones de stock");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEliminaciones(currentPage, pageSize);
  }, [isActive, currentPage, pageSize]);

  const totalPages = data?.totalPages ?? 1;
  const handlePageChange = (page: number) => setCurrentPage(page);
  const handleViewDetails = (item: HistorialStockEliminacionItem) => {
    setSelectedEliminacion(item);
  };
  const handleCloseModal = () => setSelectedEliminacion(null);

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
      <EliminacionesTable
        data={data}
        isLoading={loading}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        onViewDetails={handleViewDetails}
      />
      <EliminacionesDetailModal
        isOpen={!!selectedEliminacion}
        onClose={handleCloseModal}
        eliminacion={selectedEliminacion}
      />
    </div>
  );
}
