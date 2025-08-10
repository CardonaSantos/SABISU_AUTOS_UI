"use client";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import type { CreditoRegistro } from "../types/dashboard";
import { VentaCuotaCard } from "./venta-cuota-card";
import SkeletonCardCredit from "../components/dashboard/skeleton/skeleton-card-credit";

interface CreditCardListProps {
  creditos: CreditoRegistro[];
  isLoadingCreditos: boolean;
  formatearMoneda: (monto: number) => string;
  formatearFechaSimple: (fecha: string) => string;
  getCredits: () => Promise<void>;
}

export function CreditCardList({
  creditos,
  isLoadingCreditos,
  formatearMoneda,
  formatearFechaSimple,
  getCredits,
}: CreditCardListProps) {
  return (
    <div
      className={
        creditos && creditos.length > 0
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4"
          : "w-full"
      }
    >
      {isLoadingCreditos ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <SkeletonCardCredit key={index} />
          ))}
        </div>
      ) : creditos && creditos.length > 0 ? (
        creditos.map((ventacuota) => (
          <VentaCuotaCard
            key={ventacuota.id}
            ventaCuota={ventacuota}
            formatearMoneda={formatearMoneda}
            formatearFechaSimple={formatearFechaSimple}
            getCredits={getCredits}
          />
        ))
      ) : (
        <Card className="w-full">
          <CardTitle className="text-xl px-6 py-4">Créditos</CardTitle>
          <CardContent>
            <p className="text-center text-gray-500">
              No hay registros de créditos abiertos
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
