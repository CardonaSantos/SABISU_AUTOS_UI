// ConfirmDialog.tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Loader2 } from "lucide-react";
import { ReactNode } from "react";

type ConfirmDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  warning?: string;
  onConfirm: () => void;
  isLoading?: boolean;
  confirmLabel?: string;
  cancelLabel?: string;
  icon?: ReactNode;
  bgIcon?: string;
};

export const ConfirmDialog = ({
  open,
  onOpenChange,
  title,
  description,
  warning = "Esta acción no se puede deshacer.",
  onConfirm,
  isLoading = false,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  icon,
  bgIcon,
}: ConfirmDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden rounded-xl border-0 shadow-xl">
        {/* Icono */}
        <div className="flex justify-center mt-6">
          <div className="rounded-full p-3 shadow-lg border-4 border-white dark:border-zinc-900">
            <div
              className={`${
                bgIcon ? bgIcon : "bg-amber-100"
              } p-3 rounded-full animate-pulse`}
            >
              {icon}
            </div>
          </div>
        </div>

        {/* Header */}
        <DialogHeader className="pt-8 px-6 pb-2">
          <DialogTitle className="text-xl font-semibold text-center text-gray-800 dark:text-gray-100">
            {title}
          </DialogTitle>
          <p className="text-center text-gray-600 text-sm mt-1 dark:text-gray-400">
            {warning}
          </p>
        </DialogHeader>

        <div className="px-6 py-4">
          {/* Mensaje */}
          <div className="border border-gray-200 rounded-lg p-5 mb-5 bg-gray-50 shadow-inner dark:bg-stone-950">
            <p className="text-sm text-gray-700 text-center dark:text-gray-300">
              {description}
            </p>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-5" />

          {/* Botones */}
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-2 pb-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border border-gray-200 w-full bg-white text-gray-700 hover:bg-gray-50 dark:hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-zinc-600 rounded-lg py-2.5 transition-all duration-200"
            >
              <X className="mr-2 h-4 w-4" />
              {cancelLabel}
            </Button>
            <Button
              onClick={onConfirm}
              disabled={isLoading}
              className="w-full bg-zinc-900 text-white hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-800 rounded-lg py-2.5 shadow-sm transition-all duration-200"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Procesando...
                </>
              ) : (
                <>{confirmLabel}</>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
