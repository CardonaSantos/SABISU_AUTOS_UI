"use client";

import type { UserProfile } from "./interfacesProfile";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";

interface DialogDeleteProps {
  user: UserProfile | null;
  openDelete: boolean;
  setOpenDelete: (value: boolean) => void;
  handleDeleteUser: () => void;
  isSubmiting: boolean;
}

function DialogDelete({
  user,
  openDelete,
  setOpenDelete,
  handleDeleteUser,
  isSubmiting,
}: DialogDeleteProps) {
  return (
    <Dialog open={openDelete} onOpenChange={setOpenDelete}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>¿Estás seguro?</DialogTitle>
          <DialogDescription>
            Esta acción eliminará permanentemente al usuario{" "}
            <span className="font-semibold">{user?.nombre}</span> y no se puede
            deshacer.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={handleDeleteUser}
            disabled={isSubmiting}
          >
            {isSubmiting ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Eliminando...
              </>
            ) : (
              "Eliminar usuario"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DialogDelete;
