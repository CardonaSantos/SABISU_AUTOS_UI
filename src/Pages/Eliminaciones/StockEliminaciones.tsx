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

import {
  Calendar,
  User,
  Package,
  Trash2,
  AlertCircle,
  Tag,
  FileText,
  Building,
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";

import dayjs from "dayjs";
import "dayjs/locale/es";
import localizedFormat from "dayjs/plugin/localizedFormat";

dayjs.extend(localizedFormat);
dayjs.locale("es");

function formatearFechaUTC(fecha: string) {
  // return dayjs.utc(fecha).format("DD/MM/YYYY HH:mm:ss");
  return dayjs(fecha).format("DD/MM/YYYY hh:mm A");
}

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
  <div className="flex items-start space-x-2 p-2 bg-gray-50 rounded-md">
    <div className="w-5 h-5 flex-shrink-0">{icon}</div>
    <div className="flex flex-col">
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

  console.log("Las eliminaciones de stock son: ", stockEliminaciones);

  return (
    <div className="container mx-auto py-10">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Eliminación</TableHead>
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
                <TableCell className="font-medium">#{item.id}</TableCell>
                <TableCell>{item.producto.nombre}</TableCell>
                <TableCell>{formatearFechaUTC(item.fechaHora)}</TableCell>
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
                      <DialogHeader className="text-center">
                        <DialogTitle className="text-2xl font-bold">
                          Detalles de Eliminación de Stock
                        </DialogTitle>
                      </DialogHeader>

                      {selectedItem && (
                        <ScrollArea className="max-h-[27rem]">
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                              <InfoField
                                icon={<Package className="w-5 h-5 " />}
                                label="Producto"
                                value={selectedItem.producto.nombre}
                              />
                              <InfoField
                                icon={<Tag className="w-5 h-5 " />}
                                label="Código producto"
                                value={selectedItem.producto.codigoProducto}
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <InfoField
                                icon={<FileText className="w-5 h-5 " />}
                                label="Descripción"
                                value={selectedItem.producto.descripcion}
                              />
                              <InfoField
                                icon={<Calendar className="w-5 h-5 " />}
                                label="Fecha de eliminación"
                                value={formatearFechaUTC(
                                  selectedItem.fechaHora
                                )}
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <InfoField
                                icon={<User className="w-5 h-5 " />}
                                label="Usuario"
                                value={`${selectedItem.usuario.nombre} (${selectedItem.usuario.rol})`}
                              />
                              <InfoField
                                icon={<Building className="w-5 h-5 " />}
                                label="Sucursal"
                                value={selectedItem.sucursal.nombre}
                              />
                            </div>

                            <InfoField
                              icon={<AlertCircle className="w-5 h-5 " />}
                              label="Motivo"
                              value={selectedItem.motivo || "No especificado"}
                            />
                          </div>
                        </ScrollArea>
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
