"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Reparacion } from "../types/dashboard";

const API_URL = import.meta.env.VITE_API_URL;

interface UpdateRepairDialogProps {
  reparacion: Reparacion;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  getReparacionesRegis: () => Promise<void>;
  setOpenClose: (open: boolean) => void;
}

const estadosReparacion = [
  "RECIBIDO",
  "PENDIENTE",
  "EN_PROCESO",
  "ESPERANDO_PIEZAS",
  "REPARADO",
  "ENTREGADO",
  "NO_REPARABLE",
];

export function UpdateRepairDialog({
  reparacion,
  open,
  onOpenChange,
  getReparacionesRegis,
  setOpenClose,
}: UpdateRepairDialogProps) {
  const [estado, setEstado] = useState(reparacion.estado);
  const [problemas, setProblemas] = useState(reparacion.problemas);
  const [observaciones, setObservaciones] = useState(
    reparacion.observaciones || ""
  );

  const handleUpdateRepair = async () => {
    const payload = {
      estado,
      observaciones,
      problemas,
    };
    try {
      const response = await axios.patch(
        `${API_URL}/repair/update-repair/${reparacion.id}`,
        payload
      );
      if (response.status === 200) {
        toast.success("Registro actualizado");
        getReparacionesRegis();
        onOpenChange(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error al actualizar el registro");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Actualizar Estado de Reparación</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="estado" className="text-right">
              Estado
            </label>
            <Select value={estado} onValueChange={setEstado}>
              <SelectTrigger id="estado" className="col-span-3">
                <SelectValue placeholder="Seleccionar estado" />
              </SelectTrigger>
              <SelectContent>
                {estadosReparacion.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="problemas" className="text-right">
              Problemas
            </label>
            <Textarea
              id="problemas"
              value={problemas}
              onChange={(e) => setProblemas(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="observaciones" className="text-right">
              Observaciones
            </label>
            <Textarea
              id="observaciones"
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <Button onClick={handleUpdateRepair}>Guardar cambios</Button>
        <Button
          variant={"destructive"}
          onClick={() => {
            onOpenChange(false);
            setOpenClose(true);
          }}
        >
          Cerrar registro
        </Button>
      </DialogContent>
    </Dialog>
  );
}
