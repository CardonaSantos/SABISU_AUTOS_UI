"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { SolicitudTransferencia } from "../types/dashboard";
import { TransferRequestCard } from "./transfer-request-card";

interface TransferRequestListProps {
  solicitudesTransferencia: SolicitudTransferencia[];
  handleAceptarTransferencia: (id: number) => Promise<void>;
  handleRejectTransferencia: (id: number) => Promise<void>;
  formatearFecha: (fecha: string) => string;
}

export function TransferRequestList({
  solicitudesTransferencia,
  handleAceptarTransferencia,
  handleRejectTransferencia,
  formatearFecha,
}: TransferRequestListProps) {
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-xl">
          Solicitudes de Transferencia de Producto
        </CardTitle>
      </CardHeader>
      <CardContent className="h-full">
        {solicitudesTransferencia && solicitudesTransferencia.length > 0 ? (
          solicitudesTransferencia.map((soli) => (
            <TransferRequestCard
              key={soli.id}
              soli={soli}
              handleAceptarTransferencia={handleAceptarTransferencia}
              handleRejectTransferencia={handleRejectTransferencia}
              formatearFecha={formatearFecha}
            />
          ))
        ) : (
          <p className="text-center text-gray-500">
            No hay solicitudes de transferencia.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
