"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { SolicitudTransferencia } from "../types/dashboard";

interface TransferRequestCardProps {
  soli: SolicitudTransferencia;
  handleAceptarTransferencia: (id: number) => Promise<void>;
  handleRejectTransferencia: (id: number) => Promise<void>;
  formatearFecha: (fecha: string) => string;
}

export function TransferRequestCard({
  soli,
  handleAceptarTransferencia,
  handleRejectTransferencia,
  formatearFecha,
}: TransferRequestCardProps) {
  const [openAceptarTransferencia, setOpenAceptarTransferencia] =
    useState(false);
  const [openRechazarTransferencia, setOpenRechazarTransferencia] =
    useState(false);

  return (
    <Card key={soli.id} className="m-4 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg">Solicitud de Transferencia</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-cyan-500">
          Estado: <strong>{soli.estado}</strong>
        </p>
        <p className="text-sm mt-1">
          Producto: <strong>{soli.producto.nombre}</strong>
        </p>
        <p className="text-sm">
          Solicitado por:{" "}
          <strong>
            {soli.usuarioSolicitante.nombre} ({soli.usuarioSolicitante.rol})
          </strong>
        </p>
        <p className="text-sm">
          Cantidad solicitada: <strong>{soli.cantidad}</strong>
        </p>
        <p className="text-sm">
          Sucursal Origen: <strong>{soli.sucursalOrigen.nombre}</strong>
        </p>
        <p className="text-sm">
          Sucursal Destino: <strong>{soli.sucursalDestino.nombre}</strong>
        </p>
        <p className="text-sm text-gray-500">
          Fecha de solicitud: {formatearFecha(soli.fechaSolicitud)}
        </p>
        <div className="flex gap-2 mt-2">
          <Button
            onClick={() => setOpenAceptarTransferencia(true)}
            variant={"default"}
          >
            Aceptar
          </Button>
          <Dialog
            open={openAceptarTransferencia}
            onOpenChange={setOpenAceptarTransferencia}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-center">
                  Aceptar solicitud de Transferencia
                </DialogTitle>
                <DialogDescription className="text-center">
                  Se le descontará stock a la sucursal de origen y se asignará a
                  la sucursal de destino.
                </DialogDescription>
                <DialogDescription className="text-center">
                  ¿Continuar?
                </DialogDescription>
              </DialogHeader>
              <div className="flex justify-end gap-2">
                <Button
                  className="w-full"
                  onClick={() => handleAceptarTransferencia(soli.id)}
                >
                  Sí, transferir producto
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <Button
            onClick={() => setOpenRechazarTransferencia(true)}
            variant={"destructive"}
          >
            Rechazar
          </Button>
          <Dialog
            open={openRechazarTransferencia}
            onOpenChange={setOpenRechazarTransferencia}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-center">
                  Rechazar transferencia de producto
                </DialogTitle>
                <DialogDescription className="text-center">
                  Se negará esta transferencia.
                </DialogDescription>
                <DialogDescription className="text-center">
                  ¿Continuar?
                </DialogDescription>
              </DialogHeader>
              <div className="flex justify-end gap-2">
                <Button
                  variant={"destructive"}
                  className="w-full"
                  onClick={() => handleRejectTransferencia(soli.id)}
                >
                  Sí, negar y continuar
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}
