// src/Pages/CuentasBancarias/_components/ConfirmDialog.tsx
"use client";
import { AdvancedDialog } from "@/utils/components/AdvancedDialog";

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  loading,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: string;
  description: string;
  confirmLabel: string;
  loading?: boolean;
  onConfirm: () => void;
}) {
  return (
    <AdvancedDialog
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
      confirmButton={{
        label: confirmLabel,
        loadingText: "Procesando...",
        loading: !!loading,
        onClick: onConfirm,
      }}
      cancelButton={{ label: "Cancelar", onClick: () => onOpenChange(false) }}
    />
  );
}
