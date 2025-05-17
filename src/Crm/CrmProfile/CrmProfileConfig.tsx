"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { Check, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  // CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getUserProfile, updateUserProfile } from "./ProfileConfig.api";
import { RolUsuario, type UserProfile } from "./interfacesProfile";
import { useStoreCrm } from "../ZustandCrm/ZustandCrmContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

function CrmProfileConfig() {
  // const userId = searchParams.get("id");
  const userId = useStoreCrm((state) => state.userIdCRM) ?? 0;

  const [nombre, setNombre] = useState<string>("");
  const [correo, setCorreo] = useState<string>("");
  const [telefono, setTelefono] = useState<string>("");
  const [contrasena, setContrasena] = useState<string>("");
  const [rol, setRol] = useState<RolUsuario>(RolUsuario.TECNICO);
  const [activo, setActivo] = useState<boolean>(true);

  const [loading, setLoading] = useState<boolean>(true);
  const [updating, setUpdating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("userId:", userId);
    if (userId) {
      setLoading(true);
      getUserProfile(userId)
        .then((data: UserProfile) => {
          setNombre(data.nombre);
          setCorreo(data.correo);
          setTelefono(data.telefono);
          setRol(data.rol);
          setActivo(data.activo);
        })
        .catch((err) => {
          setError("Error al cargar los datos del usuario");
          console.error("Fetch error:", err);
        })
        .finally(() => {
          console.log("Terminó el fetch");
          setLoading(false);
        });
    }
  }, [userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId) return;

    setUpdating(true);
    try {
      const dataToUpdate: Partial<UserProfile> = {
        nombre,
        correo,
        telefono,
        rol: rol,
        activo,
      };

      if (contrasena) {
        dataToUpdate.contrasena = contrasena;
      }

      await updateUserProfile(userId, dataToUpdate);
      // alert("Perfil actualizado correctamente");
      localStorage.removeItem("tokenAuthCRM");
      toast.info("Cerrando sesión...");
      window.location.reload();
    } catch (err) {
      setError("Error al actualizar el perfil");
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="animate-spin mr-2" />
        <h2>Cargando...</h2>
      </div>
    );
  }

  return (
    <div className="container flex justify-center items-center py-4 min-h-[calc(100vh-100px)]">
      <Card className="w-full max-w-3xl shadow-md">
        <CardHeader className="pb-4 border-b">
          <CardTitle className="text-xl text-center sm:text-left ">
            <p className="text-center">Actualizar Perfil de Usuario</p>
          </CardTitle>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="pt-6">
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="nombre" className="text-sm font-medium">
                  Nombre
                </label>
                <Input
                  id="nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Nombre completo"
                  required
                  className="h-9"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="correo" className="text-sm font-medium">
                  Correo Electrónico
                </label>
                <Input
                  id="correo"
                  type="email"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  placeholder="correo@ejemplo.com"
                  required
                  className="h-9"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="telefono" className="text-sm font-medium">
                  Teléfono
                </label>
                <Input
                  id="telefono"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  placeholder="Número de teléfono"
                  className="h-9"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="rol" className="text-sm font-medium">
                  Rol de Usuario
                </label>
                <Select
                  value={rol}
                  onValueChange={(value) => setRol(value as RolUsuario)}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Seleccionar rol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={RolUsuario.TECNICO}>Técnico</SelectItem>
                    <SelectItem value={RolUsuario.OFICINA}>Oficina</SelectItem>
                    <SelectItem value={RolUsuario.ADMIN}>
                      Administrador
                    </SelectItem>
                    <SelectItem value={RolUsuario.COBRADOR}>
                      Cobrador
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="contrasena" className="text-sm font-medium">
                  Contraseña
                </label>
                <Input
                  id="contrasena"
                  type="password"
                  value={contrasena}
                  onChange={(e) => setContrasena(e.target.value)}
                  placeholder="Dejar en blanco para mantener la actual"
                  className="h-9"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Dejar en blanco para mantener la contraseña actual
                </p>
              </div>

              <div className="flex items-center space-x-4 p-3 rounded-lg border bg-gray-50/50 dark:bg-zinc-900">
                <div className="flex-1">
                  <p className="text-sm font-medium">Estado de la cuenta</p>
                  <p className="text-xs text-gray-500 ">
                    {activo ? "Usuario activo" : "Usuario inactivo"}
                  </p>
                </div>
                <Switch checked={activo} onCheckedChange={setActivo} />
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-between pt-2 pb-4 border-t mt-4">
            <Button
              variant="outline"
              type="button"
              onClick={() => window.history.back()}
              className="h-9"
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={updating} className="h-9">
              {updating ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Actualizando...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Guardar Cambios
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

export default CrmProfileConfig;
