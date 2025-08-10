"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Solicitud } from "../types/dashboard";
import { PriceRequestCard } from "./price-request-card";

interface PriceRequestListProps {
  solicitudes: Solicitud[];
  handleAceptRequest: (id: number) => Promise<void>;
  handleRejectRequest: (id: number) => Promise<void>;
  formatearFecha: (fecha: string) => string;
}

export function PriceRequestList({
  solicitudes,
  handleAceptRequest,
  handleRejectRequest,
  formatearFecha,
}: PriceRequestListProps) {
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-xl">Solicitud de Precio Especial</CardTitle>
      </CardHeader>
      <CardContent className="h-full">
        {solicitudes && solicitudes.length > 0 ? (
          solicitudes.map((soli) => (
            <PriceRequestCard
              key={soli.id}
              soli={soli}
              handleAceptRequest={handleAceptRequest}
              handleRejectRequest={handleRejectRequest}
              formatearFecha={formatearFecha}
            />
          ))
        ) : (
          <p className="text-center text-gray-500">
            No hay solicitudes de precio.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
