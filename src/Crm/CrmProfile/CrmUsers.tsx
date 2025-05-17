import React, { useEffect, useState } from "react";
import {
  deleteUserProfile,
  getProfiles,
  updateOneUserProfile,
} from "./ProfileConfig.api";
import { RolUsuario, UserProfile, UsersProfile } from "./interfacesProfile";
import { Loader, Trash2, UserCog } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formateDate } from "../Utils/FormateDate";
import { Button } from "@/components/ui/button";
import DialogEdit from "./DialogEdit";
import DialogDelete from "./DialogDelete";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

function CrmUsers() {
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [isSubmiting, setIsSubmiting] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState<boolean>(false);

  const [users, setUsers] = useState<UsersProfile[]>([]);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string>("");

  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    setIsLoading(true);
    getProfiles()
      .then((data) => setUsers(data))
      .catch((error) => {
        console.error("Fetch error:", error);
        setError("Error al cargar los perfiles");
      })
      .finally(() => setIsLoading(false));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setUser((prevData) =>
      prevData
        ? {
            ...prevData,
            [name]: value,
          }
        : prevData
    );
  };

  const handleRolChange = (value: string) => {
    setUser((prevData) =>
      prevData
        ? {
            ...prevData,
            rol: value as RolUsuario,
          }
        : prevData
    );
  };

  const handleActivoChange = (checked: boolean) => {
    setUser((prevData) =>
      prevData
        ? {
            ...prevData,
            activo: checked,
          }
        : prevData
    );
  };

  const handleSaveChanges = async () => {
    if (!user) return;

    setIsSubmiting(true);
    try {
      await updateOneUserProfile(user.id, user);
      setOpenEdit(false);
      toast.success("Usario actualzado");
      loadUsers(); // Recargar la lista de usuarios
    } catch (error) {
      console.error("Error al actualizar:", error);
      setError("Error al actualizar el perfil");
      toast.error("Error al actualizar usuario");
    } finally {
      setIsSubmiting(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!user) return;

    setIsSubmiting(true);
    try {
      await deleteUserProfile(user.id);
      setOpenDelete(false);
      loadUsers(); // Recargar la lista de usuarios
      toast.success("Usario eliminado");
    } catch (error) {
      console.error("Error al eliminar:", error);
      setError("Error al eliminar el usuario");
      toast.error("Ocurrió un error, no se puede eliminar el usuario");
    } finally {
      setIsSubmiting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="animate-spin mr-2" />
        <h2>Cargando...</h2>
      </div>
    );
  }

  console.log("El usuario editando o eliminar es: ", user);

  return (
    <div className="container p-4">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <h2 className=" mb-4 text-center text-lg font-bold">
        Administrador de Usuarios
      </h2>

      <div className="rounded-md border shadow-sm">
        <Table>
          <TableCaption>Una lista de los usuarios registrados.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[180px]">Usuario</TableHead>
              <TableHead>Correo</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Creado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users &&
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.nombre}</TableCell>
                  <TableCell>{user.correo}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {user.rol.toLowerCase().replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.activo ? "default" : "secondary"}>
                      {user.activo ? "Activo" : "Inactivo"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {formateDate(user.creadoEn)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          setUser(user);
                          setOpenEdit(true);
                        }}
                      >
                        <UserCog className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => {
                          setUser(user);
                          setOpenDelete(true);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      <DialogEdit
        handleChange={handleChange}
        handleRolChange={handleRolChange}
        handleActivoChange={handleActivoChange}
        handleSaveChanges={handleSaveChanges}
        user={user}
        openEdit={openEdit}
        setOpenEdit={setOpenEdit}
        isSubmiting={isSubmiting}
      />

      <DialogDelete
        user={user}
        openDelete={openDelete}
        setOpenDelete={setOpenDelete}
        handleDeleteUser={handleDeleteUser}
        isSubmiting={isSubmiting}
      />
    </div>
  );
}

export default CrmUsers;
