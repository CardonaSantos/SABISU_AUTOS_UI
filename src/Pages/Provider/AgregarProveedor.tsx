import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
// import { Switch } from "@/components/ui/switch"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;
interface ProveedorFormData {
  nombre: string;
  correo: string;
  telefono: string;
  direccion?: string;
  razonSocial?: string;
  rfc?: string;
  nombreContacto?: string;
  telefonoContacto?: string;
  emailContacto?: string;
  pais?: string;
  ciudad?: string;
  codigoPostal?: string;
  latitud?: number;
  longitud?: number;
  activo: boolean;
  notas?: string;
}

export default function AgregarProveedor() {
  const [formData, setFormData] = useState<ProveedorFormData>({
    nombre: "",
    correo: "",
    telefono: "",
    activo: true,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // const handleSwitchChange = (checked: boolean) => {
  //   setFormData((prev) => ({ ...prev, activo: checked }));
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/proveedor`, {
        ...formData,
      });

      if (response.status === 200 || response.status === 201) {
        toast.success("Proveedor creado");
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
      toast.error("error");
    }
  };

  console.log("lo que va enviar es: ", formData);

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Agregar Nuevo Proveedor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre</Label>
                <Input
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="correo">Correo Electrónico</Label>
                <Input
                  id="correo"
                  name="correo"
                  type="email"
                  value={formData.correo}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefono">Teléfono</Label>
                <Input
                  id="telefono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="direccion">Dirección</Label>
                <Input
                  id="direccion"
                  name="direccion"
                  value={formData.direccion || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="razonSocial">Razón Social</Label>
                <Input
                  id="razonSocial"
                  name="razonSocial"
                  value={formData.razonSocial || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rfc">RFC</Label>
                <Input
                  id="rfc"
                  name="rfc"
                  value={formData.rfc || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nombreContacto">Nombre de Contacto</Label>
                <Input
                  id="nombreContacto"
                  name="nombreContacto"
                  value={formData.nombreContacto || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefonoContacto">Teléfono de Contacto</Label>
                <Input
                  id="telefonoContacto"
                  name="telefonoContacto"
                  value={formData.telefonoContacto || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emailContacto">Email de Contacto</Label>
                <Input
                  id="emailContacto"
                  name="emailContacto"
                  type="email"
                  value={formData.emailContacto || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pais">País</Label>
                <Input
                  id="pais"
                  name="pais"
                  value={formData.pais || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ciudad">Ciudad</Label>
                <Input
                  id="ciudad"
                  name="ciudad"
                  value={formData.ciudad || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="codigoPostal">Código Postal</Label>
                <Input
                  id="codigoPostal"
                  name="codigoPostal"
                  value={formData.codigoPostal || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="latitud">Latitud</Label>
                <Input
                  id="latitud"
                  name="latitud"
                  type="number"
                  step="any"
                  value={formData.latitud || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="longitud">Longitud</Label>
                <Input
                  id="longitud"
                  name="longitud"
                  type="number"
                  step="any"
                  value={formData.longitud || ""}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notas">Notas</Label>
              <Textarea
                id="notas"
                name="notas"
                value={formData.notas || ""}
                onChange={handleInputChange}
                className="min-h-[100px]"
              />
            </div>
            {/* <div className="flex items-center space-x-2">
              <Switch
                id="activo"
                checked={formData.activo}
                onCheckedChange={handleSwitchChange}
              />
              <Label htmlFor="activo">Activo</Label>
            </div> */}
          </form>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button type="submit" onClick={handleSubmit}>
            Crear Proveedor
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
