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
import type {
  HistorialStockEliminacionVentaItem,
  HistorialStockEliminacionVentaResponse,
} from "./interfaces.interface";
import { getHistorialStockVentaEliminada } from "../../api";
import VentasEliminadasTable from "./ventas-eliminadas-table";
import VentasEliminadasDetailModal from "./ventas-eliminadas-details-modal";

export default function VentasEliminadasTabs({
  isActive,
}: {
  isActive: boolean;
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [data, setData] = useState<HistorialStockEliminacionVentaResponse>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedVentaEliminada, setSelectedVentaEliminada] =
    useState<HistorialStockEliminacionVentaItem | null>(null);
  console.log(error);

  const fetchVentasEliminadas = async (page: number, size: number) => {
    if (!isActive) return;
    setLoading(true);
    try {
      const resp = await getHistorialStockVentaEliminada(page, size);
      setData(resp.data);
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : typeof err === "string"
          ? err
          : "Error desconocido";
      setError(msg);
      toast.error("Error al cargar historial de ventas eliminadas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVentasEliminadas(currentPage, pageSize);
  }, [isActive, currentPage, pageSize]);

  const totalPages = data?.totalPages ?? 1;
  const handlePageChange = (page: number) => setCurrentPage(page);
  const handleViewDetails = (item: HistorialStockEliminacionVentaItem) => {
    setSelectedVentaEliminada(item);
  };
  const handleCloseModal = () => setSelectedVentaEliminada(null);

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
      <VentasEliminadasTable
        data={data}
        isLoading={loading}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        onViewDetails={handleViewDetails}
      />
      <VentasEliminadasDetailModal
        isOpen={!!selectedVentaEliminada}
        onClose={handleCloseModal}
        ventaEliminada={selectedVentaEliminada}
      />
    </div>
  );
}
