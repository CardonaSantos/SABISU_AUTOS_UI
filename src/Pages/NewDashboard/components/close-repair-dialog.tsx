"use client";

import type React from "react";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { FormCloseRegist, Reparacion } from "../types/dashboard";

const API_URL = import.meta.env.VITE_API_URL;

interface CloseRepairDialogProps {
  reparacion: Reparacion;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  getReparacionesRegis: () => Promise<void>;
  userID: number;
  sucursalId: number | null;
}

const estadosReparacionClose = ["FINALIZADO", "CANCELADO", "NO_REPARABLE"];

export function CloseRepairDialog({
  reparacion,
  open,
  onOpenChange,
  getReparacionesRegis,
  userID,
  sucursalId,
}: CloseRepairDialogProps) {
  const [formCloseRegist, setFormCloseRegist] = useState<FormCloseRegist>({
    comentarioFinal: "",
    accionesRealizadas: "",
    estado: "FINALIZADO",
    montoPagado: 0,
  });

  const handleChangeCloseRegist = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormCloseRegist((datosprevios) => ({
      ...datosprevios,
      [name]: name === "montoPagado" ? Number.parseFloat(value) : value,
    }));
  };

  const handleCloseRepairRegist = async () => {
    try {
      const payload = {
        ...formCloseRegist,
        usuarioId: userID,
        sucursalId: sucursalId,
      };

      if (!payload.montoPagado || payload.montoPagado <= 0) {
        toast.info("Ingrese un monto pagado válido");
        return;
      }
      if (!payload.accionesRealizadas) {
        toast.info("Debe ingresar las acciones que se realizaron");
        return;
      }

      const response = await axios.patch(
        `${API_URL}/repair/close-regist-repair/${reparacion.id}`,
        payload
      );

      if (response.status === 200 || response.status === 201) {
        toast.success("Registro cerrado correctamente");
        getReparacionesRegis();
        onOpenChange(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error al cerrar registro");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="space-y-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">
            Cerrar el registro de reparación
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            ¿Estás seguro de cerrar el registro de reparación? Una vez cerrado,
            ya no podrás volver a editar esta información.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label
              htmlFor="estado"
              className="block text-sm font-medium text-muted-foreground mb-2"
            >
              Estado
            </Label>
            <Select
              value={formCloseRegist.estado}
              onValueChange={(nuevoDato) =>
                setFormCloseRegist((datosprevios) => ({
                  ...datosprevios,
                  estado: nuevoDato,
                }))
              }
            >
              <SelectTrigger id="estado" className="w-full">
                <SelectValue placeholder="Seleccionar estado" />
              </SelectTrigger>
              <SelectContent>
                {estadosReparacionClose.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label
              htmlFor="accionesRealizadas"
              className="block text-sm font-medium text-muted-foreground mb-2"
            >
              Acciones realizadas
            </Label>
            <Textarea
              id="accionesRealizadas"
              className="w-full"
              name="accionesRealizadas"
              placeholder="Describe las acciones realizadas"
              onChange={handleChangeCloseRegist}
              value={formCloseRegist.accionesRealizadas}
              required
            />
          </div>
          <div>
            <Label
              htmlFor="comentarioFinal"
              className="block text-sm font-medium text-muted-foreground mb-2"
            >
              Comentario final (opcional)
            </Label>
            <Textarea
              id="comentarioFinal"
              className="w-full"
              name="comentarioFinal"
              placeholder="Escribe un comentario final"
              onChange={handleChangeCloseRegist}
              value={formCloseRegist.comentarioFinal}
            />
            <Label
              htmlFor="montoPagado"
              className="block text-sm font-medium text-muted-foreground mb-2 mt-2"
            >
              Monto Pagado por reparación
            </Label>
            <Input
              id="montoPagado"
              className="my-3"
              placeholder="100"
              name="montoPagado"
              type="number"
              value={formCloseRegist.montoPagado}
              onChange={handleChangeCloseRegist}
            />
          </div>
        </div>
        <div className="flex justify-end">
          <Button
            onClick={handleCloseRepairRegist}
            variant={"destructive"}
            className="w-full"
          >
            Cerrar registro
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
