"use client";

import type React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ServicioForm from "./ServicioForm";

// Importación centralizada de tipos
import type { EditServicioDialogProps } from "./servicio-internet.types";

const EditServicioDialog: React.FC<EditServicioDialogProps> = ({
  isOpen,
  onOpenChange,
  servicio,
  onSave,
  isLoading,
}) => {
  if (!servicio) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Plan de Internet</DialogTitle>
          <DialogDescription>
            Modifique los detalles del plan de internet y guarde los cambios
          </DialogDescription>
        </DialogHeader>
        <ServicioForm
          initialData={servicio}
          onSubmit={(data) => {
            if ("id" in data && "creadoEn" in data && "actualizadoEn" in data) {
              return onSave(data);
            }
            return Promise.reject(new Error("Invalid data type"));
          }}
          isLoading={isLoading}
          isEditing={true}
          empresaId={servicio.empresaId}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditServicioDialog;
