"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
// import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Building2,
  Phone,
  MapPin,
  Users,
  Package,
  Calendar,
  PenSquare,
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

type Sucursal = {
  id: number;
  nombre: string;
  direccion: string;
  telefono: string;
  creadoEn: string;
  actualizadoEn: string;
  tipoSucursal: "TIENDA" | "BODEGA";
  estadoOperacion: boolean;
  usuarios: { id: number; nombre: string; rol: string }[];
  _count: { productos: number };
};

export default function Sucursales() {
  const API_URL = import.meta.env.VITE_API_URL;

  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [editingSucursal, setEditingSucursal] = useState<Sucursal | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  console.log(loading);

  const getSucursales = async () => {
    setLoading(true); // Set loading state
    try {
      const response = await axios.get(
        `${API_URL}/sucursales/info/sucursales-infor`
      );
      if (response.status === 200) {
        setSucursales(response.data);
      }
    } catch (error) {
      toast.error("Error al recuperar sucursales");
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  useEffect(() => {
    getSucursales();
  }, []);

  const handleEdit = async () => {
    if (!editingSucursal) return; // Guard against null editingSucursal

    const confirmEdit = window.confirm(
      "¿Estás seguro de que deseas guardar los cambios?"
    );
    if (!confirmEdit) return; // Only proceed if confirmed

    try {
      const response = await axios.patch(
        `${API_URL}/sucursales/editar-sucursal/${editingSucursal.id}`,
        editingSucursal // Include data to update
      );
      if (response.status === 200) {
        toast.success("Sucursal Actualizada");
        getSucursales();
      }
    } catch (error) {
      toast.error("Error al editar sucursal");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editingSucursal) {
      setEditingSucursal({
        ...editingSucursal,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleSelectChange = (value: string) => {
    if (editingSucursal) {
      setEditingSucursal({
        ...editingSucursal,
        tipoSucursal: value as "TIENDA" | "BODEGA",
      });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Sucursales</h1>

      {/* Tabla para pantallas grandes */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Dirección</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Usuarios</TableHead>
              <TableHead>Productos</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sucursales.map((sucursal) => (
              <TableRow key={sucursal.id}>
                <TableCell>{sucursal.nombre}</TableCell>
                <TableCell>{sucursal.direccion}</TableCell>
                <TableCell>{sucursal.telefono}</TableCell>
                <TableCell>{sucursal.tipoSucursal}</TableCell>
                <TableCell>
                  {sucursal.estadoOperacion ? "Activo" : "Inactivo"}
                </TableCell>
                <TableCell>{sucursal.usuarios.length}</TableCell>
                <TableCell>{sucursal._count.productos}</TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingSucursal(sucursal);
                        }}
                      >
                        <PenSquare className="w-4 h-4 mr-2" />
                        Editar
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Editar Sucursal</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="nombre" className="text-right">
                            Nombre
                          </Label>
                          <Input
                            id="nombre"
                            name="nombre"
                            value={editingSucursal?.nombre || ""}
                            onChange={handleInputChange}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="direccion" className="text-right">
                            Dirección
                          </Label>
                          <Input
                            id="direccion"
                            name="direccion"
                            value={editingSucursal?.direccion || ""}
                            onChange={handleInputChange}
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
                            value={editingSucursal?.telefono || ""}
                            onChange={handleInputChange}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="tipoSucursal" className="text-right">
                            Tipo
                          </Label>
                          <Select
                            onValueChange={handleSelectChange}
                            defaultValue={editingSucursal?.tipoSucursal}
                          >
                            <SelectTrigger className="col-span-3">
                              <SelectValue placeholder="Selecciona un tipo" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="TIENDA">Tienda</SelectItem>
                              <SelectItem value="BODEGA">Bodega</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label
                            htmlFor="estadoOperacion"
                            className="text-right"
                          >
                            Estado
                          </Label>
                          {/* <Switch
                            id="estadoOperacion"
                            checked={editingSucursal?.estadoOperacion || false}
                            onCheckedChange={handleSwitchChange}
                          /> */}
                        </div>
                      </div>
                      <Button onClick={handleEdit}>Guardar cambios</Button>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Tarjetas para pantallas pequeñas */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {sucursales.map((sucursal) => (
          <Card key={sucursal.id}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building2 className="w-5 h-5 mr-2" />
                {sucursal.nombre}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  {sucursal.direccion}
                </div>
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  {sucursal.telefono}
                </div>
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  {sucursal.usuarios.length} usuarios
                </div>
                <div className="flex items-center">
                  <Package className="w-4 h-4 mr-2" />
                  {sucursal._count.productos} productos
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  Creado: {new Date(sucursal.creadoEn).toLocaleDateString()}
                </div>
                <div className="flex justify-between items-center">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      sucursal.estadoOperacion
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {sucursal.estadoOperacion ? "Activo" : "Inactivo"}
                  </span>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit()}
                      >
                        <PenSquare className="w-4 h-4 mr-2" />
                        Editar
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Editar Sucursal</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="nombre" className="text-right">
                            Nombre
                          </Label>
                          <Input
                            id="nombre"
                            name="nombre"
                            value={editingSucursal?.nombre || ""}
                            onChange={handleInputChange}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="direccion" className="text-right">
                            Dirección
                          </Label>
                          <Input
                            id="direccion"
                            name="direccion"
                            value={editingSucursal?.direccion || ""}
                            onChange={handleInputChange}
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
                            value={editingSucursal?.telefono || ""}
                            onChange={handleInputChange}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="tipoSucursal" className="text-right">
                            Tipo
                          </Label>
                          <Select
                            onValueChange={handleSelectChange}
                            defaultValue={editingSucursal?.tipoSucursal}
                          >
                            <SelectTrigger className="col-span-3">
                              <SelectValue placeholder="Selecciona un tipo" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="TIENDA">Tienda</SelectItem>
                              <SelectItem value="BODEGA">Bodega</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label
                            htmlFor="estadoOperacion"
                            className="text-right"
                          >
                            Estado
                          </Label>
                          {/* <Switch
                            id="estadoOperacion"
                            checked={editingSucursal?.estadoOperacion || false}
                            onCheckedChange={handleSwitchChange}
                          /> */}
                        </div>
                      </div>
                      <Button onClick={handleEdit}>Guardar cambios</Button>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
