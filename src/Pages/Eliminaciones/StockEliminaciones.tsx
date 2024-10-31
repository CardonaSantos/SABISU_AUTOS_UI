"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  Calendar,
  Clock,
  User,
  Package,
  Trash2,
  AlertCircle,
  Tag,
  FileText,
  MapPin,
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

// Definición de tipos
type Producto = {
  id: number;
  nombre: string;
  descripcion: string;
  codigoProducto: string;
};

type Usuario = {
  id: number;
  nombre: string;
  rol: string;
};

type Sucursal = {
  id: number;
  nombre: string;
};

type EliminacionStock = {
  id: number;
  productoId: number;
  fechaHora: string;
  usuarioId: number;
  sucursalId: number;
  motivo: string;
  producto: Producto;
  usuario: Usuario;
  sucursal: Sucursal;
};

const API_URL = import.meta.env.VITE_API_URL;
// Componente para mostrar un campo de información
const InfoField = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-md">
    {icon}
    <div>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="text-sm text-gray-900">{value}</p>
    </div>
  </div>
);

// Componente principal
export default function StockEliminaciones() {
  const [selectedItem, setSelectedItem] = useState<EliminacionStock | null>(
    null
  );

  const [stockEliminaciones, setStockEliminaciones] = useState<
    EliminacionStock[]
  >([]);
  useEffect(() => {
    const getRegists = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/stock-remove/get-stock-remove-regists`
        );

        if (response.status === 200) {
          setStockEliminaciones(response.data);
        }
      } catch (error) {
        console.log(error);
        toast.error("Error al conseguir los registros");
      }
    };
    getRegists();
  }, []);

  return (
    <div className="container mx-auto py-10">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Producto</TableHead>
            <TableHead>Fecha y Hora</TableHead>
            <TableHead>Usuario</TableHead>
            <TableHead>Sucursal</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stockEliminaciones &&
            stockEliminaciones.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.id}</TableCell>
                <TableCell>{item.producto.nombre}</TableCell>
                <TableCell>
                  {format(new Date(item.fechaHora), "dd/MM/yyyy HH:mm", {
                    locale: es,
                  })}
                </TableCell>
                <TableCell>{item.usuario.nombre}</TableCell>
                <TableCell>{item.sucursal.nombre}</TableCell>
                <TableCell className="text-right">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedItem(item)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Detalles
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[550px]">
                      <DialogHeader>
                        <DialogTitle className="text-2xl font-bold flex items-center">
                          <Trash2 className="w-6 h-6 mr-2 text-red-500" />
                          Detalles de Eliminación de Stock
                        </DialogTitle>
                      </DialogHeader>
                      {selectedItem && (
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-2 gap-4">
                            <InfoField
                              icon={
                                <Package className="w-5 h-5 text-blue-500" />
                              }
                              label="Producto"
                              value={selectedItem.producto.nombre}
                            />
                            <InfoField
                              icon={<Tag className="w-5 h-5 text-green-500" />}
                              label="Código"
                              value={selectedItem.producto.codigoProducto}
                            />
                          </div>
                          <InfoField
                            icon={
                              <FileText className="w-5 h-5 text-purple-500" />
                            }
                            label="Descripción"
                            value={selectedItem.producto.descripcion}
                          />
                          <div className="grid grid-cols-2 gap-4">
                            <InfoField
                              icon={
                                <Calendar className="w-5 h-5 text-orange-500" />
                              }
                              label="Fecha"
                              value={format(
                                new Date(selectedItem.fechaHora),
                                "dd/MM/yyyy",
                                { locale: es }
                              )}
                            />
                            <InfoField
                              icon={
                                <Clock className="w-5 h-5 text-indigo-500" />
                              }
                              label="Hora"
                              value={format(
                                new Date(selectedItem.fechaHora),
                                "HH:mm:ss",
                                { locale: es }
                              )}
                            />
                          </div>
                          <InfoField
                            icon={<User className="w-5 h-5 text-cyan-500" />}
                            label="Usuario"
                            value={`${selectedItem.usuario.nombre} (${selectedItem.usuario.rol})`}
                          />
                          <InfoField
                            icon={<MapPin className="w-5 h-5 text-red-500" />}
                            label="Sucursal"
                            value={selectedItem.sucursal.nombre}
                          />
                          <InfoField
                            icon={
                              <AlertCircle className="w-5 h-5 text-yellow-500" />
                            }
                            label="Motivo"
                            value={selectedItem.motivo || "No especificado"}
                          />
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
}
