import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_URL;

interface Sucursal {
  id: number;
  nombre: string;
}

export default function RegisterView() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");
  const [sucursalId, setSucursalId] = useState<number>(0);

  const [sucursales, setSucursales] = useState<Sucursal[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría la lógica para enviar los datos al servidor
    console.log("Register submitted", {
      name,
      email,
      password,
      confirmPassword,
      role,
      sucursalId,
    });

    if (password !== confirmPassword) {
      toast.info("Las contraseñans no coinciden");
      return;
    }

    if (!name || !email || !password || !role || !sucursalId) {
      toast.info("Debe llenar todos los campos");
      return;
    }

    const nuevoUsuario = {
      nombre: name,
      correo: email,
      contrasena: password,
      rol: role,
      sucursalId: sucursalId,
    };

    console.log("los datos a enviar son el register: ", {
      ...nuevoUsuario,
    });

    try {
      const response = await axios.post(`${API_URL}/auth/regist-user`, {
        ...nuevoUsuario,
      });

      console.log("Response data:", response.data); // Verifica si el token existe y es válido

      if (response.status === 201) {
        toast.success("Usuario creado existosamente");
        localStorage.setItem("authTokenPos", response.data.access_token);

        window.location.href = "/dashboard";
      }
    } catch (error) {
      console.log(error);
      toast.error("Error al crear usuario");
    }
  };

  useEffect(() => {
    const getSucursales = async () => {
      try {
        const response = await axios.get(`${API_URL}/sucursales/`, {});

        console.log("Response data:", response.data); // Verifica si el token existe y es válido

        if (response.status === 200) {
          setSucursales(response.data);
        }
      } catch (error) {
        console.log(error);
        toast.error("Error al cargar sucursales");
      }
    };
    getSucursales();
  }, []);
  console.log("Las sucursales son: ", sucursales);

  return (
    <div className="min-h-screen flex items-center justify-center  px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Registro
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                placeholder="Tu nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sucursal">Pertenece a la sucursal</Label>
              <Select onValueChange={(value) => setSucursalId(Number(value))}>
                {/* El select espera operar con un string, asi que eso le pasamos en el onValueChange y en el value delos items, un string parseado porque el id es number al inicion */}
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione una sucursal" />
                </SelectTrigger>
                <SelectContent>
                  {sucursales &&
                    sucursales.map((sucursal) => (
                      <SelectItem key={sucursal.id} value={String(sucursal.id)}>
                        {sucursal.nombre}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Rol</Label>
              <Select onValueChange={setRole} required>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="VENDEDOR">Vendedor</SelectItem>
                  <SelectItem value="ADMIN">Administrador</SelectItem>
                  <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="w-full">
              Registrarse
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center"></CardFooter>
      </Card>
    </div>
  );
}
