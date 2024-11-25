import { useStore } from "@/components/Context/ContextSucursal";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axios from "axios";
import {
  AtSign,
  Building,
  ChartNoAxesColumn,
  Ghost,
  ToggleLeft,
  UserIcon,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_URL;

interface User {
  id: number;
  nombre: string;
  activo: boolean;
  correo: string;
  rol: string;
  contrasena?: string; // Opcional
  contrasenaConfirm?: string; // Opcional
}

interface Sucursal {
  id: number;
  nombre: string;
}

interface UsuarioResponse {
  id: number;
  activo: boolean;
  nombre: string;
  correo: string;
  sucursal: Sucursal;
  rol: string;
  totalVentas: number;
}

function UserConfig() {
  const userId = useStore((state) => state.userId);
  const [user, setUser] = useState<User>({
    activo: true,
    correo: "",
    id: 0,
    nombre: "",
    rol: "",
    contrasena: "",
    contrasenaConfirm: "",
  });

  const [userEdit, setUserEdit] = useState<User>({
    id: 0,
    activo: true,
    correo: "",
    nombre: "",
    rol: "",
    contrasena: "",
    contrasenaConfirm: "",
  });

  const [users, setUsers] = useState<UsuarioResponse[]>([]);

  const getUser = async () => {
    try {
      const response = await axios.get(`${API_URL}/user/fin-my-user/${userId}`);
      if (response.status === 200) {
        const userData = response.data;
        setUser({
          ...user,
          ...userData,
          contrasena: "", // Resetea valores no proporcionados
          contrasenaConfirm: "",
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Error al conseguir datos");
    }
  };

  const getUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/user/fin-all-users`);
      if (response.status === 200) {
        setUsers(response.data);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error al conseguir datos");
    }
  };

  useEffect(() => {
    if (userId) {
      getUser();
    }
  }, [userId]);

  useEffect(() => {
    getUsers();
  }, []);

  console.log(user);

  //================================>
  const [truncateClose, setTruncateClose] = useState(false); // Previene doble envío al cerrar
  const [closeConfirm, setCloseConfirm] = useState(false); // Controla el dialog para cerrar

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (truncateClose) return; // Evitar doble clic
    setTruncateClose(true);

    if (!user.contrasenaConfirm) {
      toast.info("Ingrese su contraseña para confirmar el cambio");
      setTruncateClose(false);
      return;
    }

    try {
      const response = await axios.patch(
        `${API_URL}/user/update-user/${userId}`,
        user
      );
      if (response.status === 201 || response.status === 200) {
        toast.success("Usuario actualizado correctamente");
        getUser();
        setCloseConfirm(false); // Cierra el diálogo explícitamente
      }
    } catch (error) {
      toast.error("Error al registrar cambio, verifique sus credenciales.");
    } finally {
      setTruncateClose(false);
    }
  };

  const handleChangeInputs = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target; //tomas las props del objeto target

    setUser((datosPrevios) => ({
      ...datosPrevios,
      [name]: value,
    }));
  };

  console.log("los usuarios son: ", users);
  console.log("El usuario a enviar es: ", userEdit);

  const [openEdit, setOpenEdit] = useState(false);

  const handleToggleEditActivo = (key: keyof User) => {
    setUserEdit((previaData) => ({
      ...previaData,
      [key]: !previaData[key],
    }));
  };

  const handleChangeEditUser = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setUserEdit((datosPrevios) => ({
      ...datosPrevios,
      [name]: value,
    }));
  };

  const handleSubmitEditUser = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userEdit.contrasenaConfirm) {
      toast.info("Ingrese su contraseña para confirmar el cambio");
      return;
    }

    try {
      const payload = {
        userId: userEdit.id,
        nombre: userEdit.nombre,
        correo: userEdit.correo,
        rol: userEdit.rol,
        activo: userEdit.activo,
        nuevaContrasena: userEdit.contrasena || undefined,
        adminPassword: userEdit.contrasenaConfirm,
      };

      const response = await axios.patch(
        `${API_URL}/user/update-user/as-admin/${userId}`, // Enviar el ID del admin actual
        payload
      );

      if (response.status === 200 || response.status === 201) {
        getUsers();
        toast.success("Usuario Actualizado");
        setOpenEdit(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error al editar usuario");
    }
  };

  return (
    <div className="container mx-auto flex justify-center items-center">
      <Tabs defaultValue="usuario" className="w-full">
        <div className="flex justify-center">
          <TabsList className="w-full max-w-4xl flex justify-center space-x-4">
            <TabsTrigger value="usuario" className="flex-1 text-center">
              Mi usuario
            </TabsTrigger>
            <TabsTrigger value="usuarios" className="flex-1 text-center">
              Usuarios
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="usuario">
          <Card className="w-full max-w-4xl mx-auto shadow-xl">
            <CardHeader>
              <CardTitle className="text-center">
                Editar Mi Usuario {user.nombre ? user.nombre : ""}
              </CardTitle>
              <CardDescription className="text-center">
                Actualiza tu información personal.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <CardContent className="space-y-4">
                {/* Información personal */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="nombre">Nombre</Label>
                    <Input
                      id="nombre"
                      name="nombre"
                      type="text"
                      value={user.nombre || ""}
                      onChange={handleChangeInputs}
                      placeholder="Ingresa tu nombre"
                    />
                  </div>
                  <div>
                    <Label htmlFor="correo">Correo</Label>
                    <Input
                      id="correo"
                      name="correo"
                      type="text"
                      value={user.correo || ""}
                      onChange={handleChangeInputs}
                      placeholder="Ingresa tu correo"
                    />
                  </div>
                </div>
                {/* Cambio de contraseña */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="contrasena">Nueva Contraseña</Label>
                    <Input
                      id="contrasena"
                      name="contrasena"
                      type="password"
                      value={user.contrasena || ""}
                      onChange={handleChangeInputs}
                      placeholder="Ingresa tu nueva contraseña"
                    />
                  </div>
                  <div>
                    <Label htmlFor="contrasenaConfirm">
                      Confirmar Contraseña
                    </Label>
                    <Input
                      id="contrasenaConfirm"
                      name="contrasenaConfirm"
                      type="password"
                      value={user.contrasenaConfirm || ""}
                      onChange={handleChangeInputs}
                      placeholder="Confirma con tu contraseña de administrador"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-4">
                <Button
                  className="w-full"
                  type="button"
                  variant="default"
                  onClick={() => setCloseConfirm(true)}
                >
                  Actualizar
                </Button>
              </CardFooter>
            </form>
            {/* Diálogo de confirmación */}
            <Dialog open={closeConfirm} onOpenChange={setCloseConfirm}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="text-center">
                    Confirmar Actualización
                  </DialogTitle>
                  <DialogDescription className="text-center">
                    ¿Estás seguro de actualizar tu información?
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex space-x-4">
                  <Button
                    className="w-full"
                    variant="outline"
                    onClick={() => setCloseConfirm(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    className="w-full"
                    type="button"
                    onClick={handleSubmit}
                  >
                    Confirmar
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </Card>
        </TabsContent>
        <TabsContent value="usuarios">
          {/* Aquí podrías añadir contenido extra si es necesario */}
          <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Lista de Usuarios</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {users &&
                users.map((usuario) => (
                  <div
                    key={usuario.id}
                    className="bg-white dark:bg-transparent shadow-md rounded-lg p-6 mb-4 flex flex-col gap-3 border-4"
                  >
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                      <UserIcon className="" />
                      {usuario.nombre}
                    </h2>
                    <p className="text-gray-600 flex items-center gap-2">
                      <AtSign className="" />
                      <span className="font-medium">Correo:</span>{" "}
                      {usuario.correo}
                    </p>
                    <p className="text-gray-600 flex items-center gap-2">
                      <Building className="" />
                      <span className="font-medium">Sucursal:</span>{" "}
                      {usuario.sucursal.nombre}
                    </p>
                    <p className="text-gray-600 flex items-center gap-2">
                      <ChartNoAxesColumn className="" />
                      <span className="font-medium">Total Ventas:</span>{" "}
                      {usuario.totalVentas}
                    </p>
                    <p className="text-gray-600 flex items-center gap-2">
                      <ToggleLeft className="" />
                      <span className="font-medium">Activo:</span>{" "}
                      {usuario.activo == true ? "Activo" : "Desactivado"}
                    </p>
                    <p className="text-gray-600 flex items-center gap-2">
                      <Ghost className="" />
                      <span className="font-medium">Rol:</span> {usuario.rol}
                    </p>
                    <div className="flex gap-2">
                      <Button className="w-full" variant={"destructive"}>
                        Eliminar
                      </Button>
                      <Button
                        onClick={() => {
                          setUserEdit({
                            activo: usuario.activo,
                            correo: usuario.correo,
                            id: usuario.id,
                            nombre: usuario.nombre,
                            rol: usuario.rol,
                          });
                          setOpenEdit(true);
                        }}
                        className="w-full"
                        variant={"default"}
                      >
                        Editar
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
            <Dialog onOpenChange={setOpenEdit} open={openEdit}>
              <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="text-center">
                    Editar Usuario {userEdit.nombre}
                  </DialogTitle>
                  <DialogDescription className="text-center">
                    Editar mis usuarios en las sucursales
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="nombre" className="text-right">
                      Nombre
                    </Label>
                    <Input
                      name="nombre"
                      onChange={handleChangeEditUser}
                      id="nombre"
                      value={userEdit.nombre}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="correo" className="text-right">
                      Correo
                    </Label>
                    <Input
                      name="correo"
                      onChange={handleChangeEditUser}
                      id="correo"
                      value={userEdit.correo}
                      className="col-span-3"
                    />
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="contrasena" className="text-right">
                      Nueva contraseña
                    </Label>
                    <Input
                      onChange={handleChangeEditUser}
                      id="contrasena"
                      name="contrasena"
                      type="password"
                      value={userEdit.contrasena}
                      className="col-span-3"
                    />
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="activo" className="text-right">
                      Activo
                    </Label>
                    <Switch
                      id="activo"
                      checked={userEdit.activo}
                      onCheckedChange={() => handleToggleEditActivo("activo")}
                    />
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="contrasenaConfirm" className="text-right">
                      Confirmar contraseña de administrador
                    </Label>
                    <Input
                      onChange={handleChangeEditUser}
                      id="contrasenaConfirm"
                      name="contrasenaConfirm"
                      type="password"
                      placeholder="Ingrese su contraseña como administrado para confirmar los cambios"
                      value={userEdit.contrasenaConfirm}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    className="w-full"
                    type="button"
                    onClick={handleSubmitEditUser}
                  >
                    Guardar cambios
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default UserConfig;
