import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertCircle, Loader2 } from "lucide-react";

interface DeleteDialogProps {
  openDeleteSector: boolean;
  setOpenDeleteSector: (value: boolean) => void;
  handleSubmitDelete: () => void;
  isloading: boolean;
}

function DeleteDialog({
  handleSubmitDelete,
  openDeleteSector,
  setOpenDeleteSector,
  isloading,
}: DeleteDialogProps) {
  return (
    <Dialog open={openDeleteSector} onOpenChange={setOpenDeleteSector}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center">
            Confirmar Eliminación
          </DialogTitle>
          <DialogDescription className="text-center">
            ¿Está seguro que desea eliminar esta zona de facturación? Esta
            acción no se puede deshacer.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Advertencia</AlertTitle>
            <AlertDescription>
              Si hay clientes o facturas asociadas a esta zona, se perderá la
              relación con ellos.
            </AlertDescription>
          </Alert>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpenDeleteSector(false)}
            disabled={isloading}
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleSubmitDelete}
            disabled={isloading}
          >
            {isloading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Eliminando...
              </>
            ) : (
              "Eliminar"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DeleteDialog;
