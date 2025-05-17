import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RolUsuario, UserProfile } from "./interfacesProfile";
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Loader } from "lucide-react";

interface DialogProps {
  user: UserProfile | null;
  setOpenEdit: (value: boolean) => void;
  openEdit: boolean;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleRolChange: (value: string) => void;
  handleActivoChange: (checked: boolean) => void;
  handleSaveChanges: () => void;
  isSubmiting: boolean;
}

function DialogEdit({
  user,
  openEdit,
  setOpenEdit,
  handleChange,
  handleRolChange,
  handleActivoChange,
  handleSaveChanges,
  isSubmiting,
}: DialogProps) {
  return (
    <Dialog open={openEdit} onOpenChange={setOpenEdit}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Usuario: {user?.nombre}</DialogTitle>
          <DialogDescription>
            Modifica el perfil del usuario. Guarda los cambios cuando termines.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="nombre" className="text-right">
              Nombre
            </Label>
            <Input
              id="nombre"
              name="nombre"
              value={user?.nombre || ""}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="correo" className="text-right">
              Correo
            </Label>
            <Input
              id="correo"
              name="correo"
              value={user?.correo || ""}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="telefono" className="text-right">
              Teléfono
            </Label>
            <Input
              id="telefono"
              name="telefono"
              value={user?.telefono || ""}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="contrasena" className="text-right">
              Contraseña
            </Label>
            <div className="col-span-3 space-y-1">
              <Input
                id="contrasena"
                name="contrasena"
                type="password"
                placeholder="Dejar en blanco para mantener la actual"
                onChange={handleChange}
                className="w-full"
              />
              <p className="text-xs text-gray-500">
                Dejar en blanco para mantener la contraseña actual
              </p>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="rol" className="text-right">
              Rol
            </Label>
            <Select value={user?.rol} onValueChange={handleRolChange}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Seleccionar rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={RolUsuario.TECNICO}>Técnico</SelectItem>
                <SelectItem value={RolUsuario.OFICINA}>Oficina</SelectItem>
                <SelectItem value={RolUsuario.ADMIN}>Administrador</SelectItem>

                <SelectItem value={RolUsuario.COBRADOR}>Cobrador</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="activo" className="text-right">
              Estado
            </Label>
            <div className="flex items-center justify-between col-span-3 p-3 rounded-lg border">
              <div>
                <p className="text-sm font-medium">Estado de la cuenta</p>
                <p className="text-xs text-gray-500">
                  {user?.activo ? "Usuario activo" : "Usuario inactivo"}
                </p>
              </div>
              <Switch
                checked={user?.activo || false}
                onCheckedChange={handleActivoChange}
              />
            </div>
          </div>
        </div>
        <DialogFooter className="flex justify-between sm:justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpenEdit(false)}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleSaveChanges}
            disabled={isSubmiting}
          >
            {isSubmiting ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              "Guardar cambios"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DialogEdit;
