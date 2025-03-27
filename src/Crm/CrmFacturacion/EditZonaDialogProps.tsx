"use client";

import type React from "react";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ZonaForm } from "./FacturacionZonaForm";
import type {
  FacturacionZona,
  NuevaFacturacionZona,
} from "./FacturacionZonaTypes";

interface EditZonaDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  zona: FacturacionZona | null;
  onSave: (zona: FacturacionZona) => void;
  isLoading: boolean;
}

export const EditZonaDialog: React.FC<EditZonaDialogProps> = ({
  isOpen,
  onOpenChange,
  zona,
  onSave,
  isLoading,
}) => {
  const [editedZona, setEditedZona] = useState<FacturacionZona | null>(null);

  useEffect(() => {
    if (zona) {
      setEditedZona(zona);
    }
  }, [zona]);

  if (!zona || !editedZona) {
    return null;
  }

  const handleSave = (data: FacturacionZona | NuevaFacturacionZona) => {
    // Sabemos que en modo edición siempre es FacturacionZona,
    // por lo que podemos hacer una aserción:
    const updatedZona = data as FacturacionZona;
    onSave(updatedZona);
    console.log("La data actualizando: ", updatedZona);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {/* Set a max height and enable scroll */}
      <DialogContent className="sm:max-w-[700px] max-h-[99vh] overflow-y-auto p-4">
        {/* Reduce vertical spacing on header */}
        <DialogHeader className="mb-2">
          <DialogTitle className="text-base font-semibold">
            Editar Zona de Facturación
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Modifique los detalles de la zona de facturación y guarde los
            cambios.
          </DialogDescription>
        </DialogHeader>

        {/* Reduce padding around the form */}
        <div className="space-y-2">
          <ZonaForm
            initialData={editedZona}
            onSubmit={handleSave}
            isLoading={isLoading}
            isEditing={true}
          />
        </div>

        {/* Footer with minimal spacing */}
        <DialogFooter className="mt-2 flex justify-end space-x-2">
          {/* <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancelar
          </Button> */}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
