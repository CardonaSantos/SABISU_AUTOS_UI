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
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";

import dayjs from "dayjs";
import "dayjs/locale/es";
import localizedFormat from "dayjs/plugin/localizedFormat";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
  <div className="flex items-start space-x-2 p-2  rounded-md">
    <div className="w-5 h-5 flex-shrink-0">{icon}</div>
    <div className="flex flex-col">
      <p className="text-sm font-medium ">{label}</p>
      <p className="text-sm ">{value}</p>
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

  //PAGINACIÓN:
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  const totalPages = Math.ceil(stockEliminaciones.length / itemsPerPage);

  // Calcular el índice del último elemento de la página actual
  const indexOfLastItem = currentPage * itemsPerPage;
  // Calcular el índice del primer elemento de la página actual
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // Obtener los elementos de la página actual
  const currentItems = stockEliminaciones.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Cambiar de página
  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="container mx-auto py-10">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle>Registros de eliminaciones de Stock</CardTitle>
          <CardDescription>Todas las acciones quedan guardadas</CardDescription>
        </CardHeader>
        <CardContent>
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
              {currentItems &&
                currentItems.map((item) => (
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
                                  value={
                                    selectedItem.motivo || "No especificado"
                                  }
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
          <div className="flex items-center justify-center py-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <Button onClick={() => onPageChange(1)}>Primero</Button>
                </PaginationItem>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </PaginationPrevious>
                </PaginationItem>

                {/* Sistema de truncado */}
                {currentPage > 3 && (
                  <>
                    <PaginationItem>
                      <PaginationLink onClick={() => onPageChange(1)}>
                        1
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <span className="text-muted-foreground">...</span>
                    </PaginationItem>
                  </>
                )}

                {Array.from({ length: totalPages }, (_, index) => {
                  const page = index + 1;
                  if (
                    page === currentPage ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <PaginationItem key={index}>
                        <PaginationLink
                          onClick={() => onPageChange(page)}
                          isActive={page === currentPage}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  }
                  return null;
                })}

                {currentPage < totalPages - 2 && (
                  <>
                    <PaginationItem>
                      <span className="text-muted-foreground">...</span>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink onClick={() => onPageChange(totalPages)}>
                        {totalPages}
                      </PaginationLink>
                    </PaginationItem>
                  </>
                )}

                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      onPageChange(Math.min(totalPages, currentPage + 1))
                    }
                  >
                    <ChevronRight className="h-4 w-4" />
                  </PaginationNext>
                </PaginationItem>
                <PaginationItem>
                  <Button
                    variant={"destructive"}
                    onClick={() => onPageChange(totalPages)}
                  >
                    Último
                  </Button>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
