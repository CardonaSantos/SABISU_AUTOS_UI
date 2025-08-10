"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EstadoGarantia } from "../types/dashboard";

interface FinishWarrantyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  estadoRegistFinishW: string;
  setEstadoFinishW: (value: string) => void;
  conclusion: string;
  setConclusion: (value: string) => void;
  accionesRealizadas: string;
  setAccionesRealizadas: (value: string) => void;
  handleSubmitFinishRegistW: () => Promise<void>;
}

export function FinishWarrantyDialog({
  open,
  onOpenChange,
  estadoRegistFinishW,
  setEstadoFinishW,
  conclusion,
  setConclusion,
  accionesRealizadas,
  setAccionesRealizadas,
  handleSubmitFinishRegistW,
}: FinishWarrantyDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">
            Finalizar Registro de Garantía
          </DialogTitle>
          <DialogDescription className="text-center">
            Completa los detalles finales de la garantía para formalizar el
            registro.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="block font-medium">Estado</label>
            <select
              value={estadoRegistFinishW}
              onChange={(e) => setEstadoFinishW(e.target.value)}
              className="w-full border rounded px-2 py-1 text-black"
            >
              <option value="">Seleccionar Estado</option>
              <option value={EstadoGarantia.REPARADO}>Reparado</option>
              <option value={EstadoGarantia.REEMPLAZADO}>Reemplazado</option>
              <option value={EstadoGarantia.CERRADO}>
                Cerrado (cancelado)
              </option>
            </select>
          </div>
          <div>
            <label className="block font-medium">Conclusión</label>
            <textarea
              value={conclusion}
              onChange={(e) => setConclusion(e.target.value)}
              className="w-full border border-gray-300 rounded px-2 py-1"
              placeholder="Ej. Reparado, Reemplazado"
            />
          </div>
          <div>
            <label className="block font-medium">Acciones Realizadas</label>
            <textarea
              value={accionesRealizadas}
              onChange={(e) => setAccionesRealizadas(e.target.value)}
              className="w-full border border-gray-300 rounded px-2 py-1"
              placeholder="Describe las acciones realizadas (opcional)"
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button onClick={handleSubmitFinishRegistW} className="w-full">
            Finalizar Registro
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
