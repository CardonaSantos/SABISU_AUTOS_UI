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
import TransferenciasTable from "./transferencias-table";
import type {
  HistorialStockTransferenciaItem,
  HistorialStockTransferenciaResponse,
} from "./interfaces.interface";
import TransferenciasDetailModal from "./transferencias-details-modal";
import { getTransferenciaStockTracker } from "../../api";

export default function TransferenciasTabs({
  isActive,
}: {
  isActive: boolean;
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [data, setData] = useState<HistorialStockTransferenciaResponse>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTransferencia, setSelectedTransferencia] =
    useState<HistorialStockTransferenciaItem | null>(null);
  console.log("error en transferencias stocks: ", error);

  const fetchTransferencias = async (page: number, size: number) => {
    if (!isActive) return;
    setLoading(true);
    try {
      const resp = await getTransferenciaStockTracker(page, size);
      setData(resp.data);
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : typeof err === "string"
          ? err
          : "Error desconocido";
      setError(msg);
      toast.error("Error al cargar historial de transferencias de stock");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransferencias(currentPage, pageSize);
  }, [isActive, currentPage, pageSize]);

  const totalPages = data?.totalPages ?? 1;
  const handlePageChange = (page: number) => setCurrentPage(page);
  const handleViewDetails = (item: HistorialStockTransferenciaItem) => {
    setSelectedTransferencia(item);
  };
  const handleCloseModal = () => setSelectedTransferencia(null);

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
      <TransferenciasTable
        data={data}
        isLoading={loading}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        onViewDetails={handleViewDetails}
      />
      <TransferenciasDetailModal
        isOpen={!!selectedTransferencia}
        onClose={handleCloseModal}
        transferencia={selectedTransferencia}
      />
    </div>
  );
}
