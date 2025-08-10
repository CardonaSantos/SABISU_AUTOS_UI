"use client";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import type { Reparacion } from "../types/dashboard";
import { ReparacionCard } from "./reparacion-card";

interface RepairCardListProps {
  reparaciones: Reparacion[];
  getReparacionesRegis: () => Promise<void>;
  userID: number;
  sucursalId: number | null;
}

export function RepairCardList({
  reparaciones,
  getReparacionesRegis,
  userID,
  sucursalId,
}: RepairCardListProps) {
  return (
    <div
      className={
        reparaciones && reparaciones.length > 0
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4"
          : "flex justify-center items-center w-full h-full"
      }
    >
      {reparaciones && reparaciones.length > 0 ? (
        reparaciones.map((reparacion) => (
          <ReparacionCard
            key={reparacion.id}
            reparacion={reparacion}
            getReparacionesRegis={getReparacionesRegis}
            userID={userID}
            sucursalId={sucursalId}
          />
        ))
      ) : (
        <Card className="w-full mx-auto">
          <CardTitle className="text-xl px-6 py-4 text-center">
            Reparaciones
          </CardTitle>
          <CardContent className="flex justify-center items-center">
            <p className="text-center text-gray-500">
              No hay registros de reparaciones abiertos
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
