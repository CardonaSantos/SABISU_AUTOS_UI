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
import type { CreateServicioDialogProps } from "./servicio-internet.types";

const CreateServicioDialog: React.FC<CreateServicioDialogProps> = ({
  isOpen,
  onOpenChange,
  initialData,
  onSubmit,
  isLoading,
  empresaId,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nuevo Plan de Internet</DialogTitle>
          <DialogDescription>
            Complete el formulario para crear un nuevo plan de internet
          </DialogDescription>
        </DialogHeader>
        <ServicioForm
          initialData={initialData}
          onSubmit={onSubmit}
          isLoading={isLoading}
          isEditing={false}
          empresaId={empresaId}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CreateServicioDialog;
