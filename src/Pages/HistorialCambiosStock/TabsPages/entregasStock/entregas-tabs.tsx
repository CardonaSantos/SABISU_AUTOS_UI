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
import EntregasTable from "./entregas-table";
import type {
  HistorialEntregaStockItem,
  HistorialEntregaStockResponse,
} from "./interfaces.interface";
import { getEntregasStockTracker } from "../../api";
import EntregasDetailModal from "./entregas-details-modal";

export default function EntregasTabs({ isActive }: { isActive: boolean }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [data, setData] = useState<HistorialEntregaStockResponse>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedEntrega, setSelectedEntrega] =
    useState<HistorialEntregaStockItem | null>(null);

  const fetchEntregas = async (page: number, size: number) => {
    if (!isActive) return;
    setLoading(true);
    try {
      const resp = await getEntregasStockTracker(page, size);
      setData(resp.data);
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : typeof err === "string"
          ? err
          : "Error desconocido";
      setError(msg);
      toast.error("Error al cargar historial de entregas de stock");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntregas(currentPage, pageSize);
  }, [isActive, currentPage, pageSize]);

  const totalPages = data?.totalPages ?? 1;
  const handlePageChange = (page: number) => setCurrentPage(page);
  const handleViewDetails = (item: HistorialEntregaStockItem) => {
    setSelectedEntrega(item);
  };
  const handleCloseModal = () => setSelectedEntrega(null);
  console.log("Error variable es: ", error);
  console.log("Las entregas de stock son: ", data);

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
      <EntregasTable
        data={data}
        isLoading={loading}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        onViewDetails={handleViewDetails}
      />
      <EntregasDetailModal
        isOpen={!!selectedEntrega}
        onClose={handleCloseModal}
        entrega={selectedEntrega}
      />
    </div>
  );
}
