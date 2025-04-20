"use client";

import type React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ZonaForm from "./ZonaForm";
import type { NuevaFacturacionZona } from "./FacturacionZonaTypes";

interface CreateZonaDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  initialData: NuevaFacturacionZona;
  onSubmit: (data: NuevaFacturacionZona) => Promise<void>;
  isLoading: boolean;
}

const CreateZonaDialog: React.FC<CreateZonaDialogProps> = ({
  isOpen,
  onOpenChange,
  initialData,
  onSubmit,
  isLoading,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nueva Zona de Facturación</DialogTitle>
          <DialogDescription>
            Configure los parámetros para una nueva zona de facturación
          </DialogDescription>
        </DialogHeader>
        <ZonaForm
          initialData={initialData}
          onSubmit={onSubmit}
          isLoading={isLoading}
          isEditing={false}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CreateZonaDialog;
