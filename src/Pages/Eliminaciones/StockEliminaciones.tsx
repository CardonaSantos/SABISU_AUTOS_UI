"use client";

import type React from "react";

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
  AlertCircle,
  Tag,
  FileText,
  Building,
  Hash,
  Boxes,
  Trash2,
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
  return dayjs(fecha).format("DD/MM/YYYY hh:mm A");
}

// Definición de tipos (ya proporcionados por el usuario)
export interface ProductoResumen {
  id: number;
  nombre: string;
  descripcion?: string;
  codigoProducto: string;
}
export interface UsuarioResumen {
  id: number;
  nombre: string;
  rol: string;
}
export interface SucursalResumen {
  id: number;
  nombre: string;
}
export interface EliminacionStockRegistro {
  id: number;
  productoId: number;
  fechaHora: string; // ISO
  usuarioId: number;
  sucursalId: number;
  motivo: string;
  cantidadAnterior: number;
  cantidadStockEliminada: number;
  stockRestante: number;
  referenciaTipo?: string;
  referenciaId?: number;
  createdAt: string; // ISO
  updatedAt: string; // ISO
  producto: ProductoResumen;
  usuario: UsuarioResumen;
  sucursal: SucursalResumen;
}

const API_URL = import.meta.env.VITE_API_URL;

// Componente para mostrar un campo de información mejorado
const InfoField = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number | undefined;
}) => (
  <div className="flex items-start space-x-2 py-2">
    {" "}
    {/* Reduced padding, removed bg/border/rounded */}
    <div className="w-4 h-4 flex-shrink-0 ">{icon}</div>{" "}
    {/* Smaller icon, lighter color */}
    <div className="flex flex-col">
      <p className="text-xs 0">{label}</p> {/* Smaller label text */}
      <p className="text-sm  break-words">{value || "N/A"}</p>{" "}
      {/* Normal value text */}
    </div>
  </div>
);

// Componente principal
export default function StockEliminaciones() {
  const [selectedItem, setSelectedItem] =
    useState<EliminacionStockRegistro | null>(null);
  const [stockEliminaciones, setStockEliminaciones] = useState<
    EliminacionStockRegistro[]
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
        console.error("Error al conseguir los registros:", error);
        toast.error("Error al conseguir los registros");
      }
    };
    getRegists();
  }, []);

  // PAGINACIÓN:
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  const totalPages = Math.ceil(stockEliminaciones.length / itemsPerPage);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = stockEliminaciones.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <Card className="shadow-lg ">
        <CardHeader className="pb-3">
          {" "}
          {/* Slightly less padding */}
          <CardTitle className="text-xl font-semibold ">
            Registros de Eliminaciones de Stock
          </CardTitle>{" "}
          {/* Smaller title */}
          <CardDescription className="text-sm text-gray-600">
            {" "}
            {/* Smaller description */}
            Todas las acciones de eliminación de stock quedan guardadas.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table className="min-w-full  ">
              <TableHeader>
                <TableRow>
                  <TableHead className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider">
                    Eliminación
                  </TableHead>
                  <TableHead className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider">
                    Producto
                  </TableHead>
                  <TableHead className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider">
                    Fecha y Hora
                  </TableHead>
                  <TableHead className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider">
                    Usuario
                  </TableHead>
                  <TableHead className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider">
                    Sucursal
                  </TableHead>
                  <TableHead className="px-4 py-2 text-right text-xs font-medium uppercase tracking-wider">
                    Acciones
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody className="">
                {currentItems && currentItems.length > 0 ? (
                  currentItems.map((item) => (
                    <TableRow key={item.id} className="">
                      <TableCell className="px-4 py-2 whitespace-nowrap text-sm font-medium ">
                        {" "}
                        {/* Smaller padding, text-sm, darker text */}#{item.id}
                      </TableCell>
                      <TableCell className="px-4 py-2 whitespace-nowrap text-sm ">
                        {" "}
                        {/* Smaller padding, text-sm */}
                        {item.producto.nombre}
                      </TableCell>
                      <TableCell className="px-4 py-2 whitespace-nowrap text-sm ">
                        {" "}
                        {/* Smaller padding, text-sm */}
                        {formatearFechaUTC(item.fechaHora)}
                      </TableCell>
                      <TableCell className="px-4 py-2 whitespace-nowrap text-sm">
                        {" "}
                        {/* Smaller padding, text-sm */}
                        {item.usuario.nombre}
                      </TableCell>
                      <TableCell className="px-4 py-2 whitespace-nowrap text-sm ">
                        {" "}
                        {/* Smaller padding, text-sm */}
                        {item.sucursal.nombre}
                      </TableCell>
                      <TableCell className="px-4 py-2 whitespace-nowrap text-right text-sm font-medium">
                        {" "}
                        {/* Smaller padding, text-sm */}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedItem(item)}
                            >
                              <Trash2 className="w-4 h-4" />
                              Detalles
                            </Button>
                          </DialogTrigger>

                          <DialogContent className="sm:max-w-lg p-4">
                            <DialogHeader className="mb-3">
                              <DialogTitle className="text-base font-bold">
                                Detalles de Eliminación de Stock
                              </DialogTitle>
                            </DialogHeader>

                            {selectedItem && (
                              <ScrollArea className="max-h-[70vh]">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  <InfoField
                                    icon={<Hash />}
                                    label="ID Eliminación"
                                    value={selectedItem.id}
                                  />
                                  <InfoField
                                    icon={<Package />}
                                    label="Producto"
                                    value={selectedItem.producto.nombre}
                                  />
                                  <InfoField
                                    icon={<Tag />}
                                    label="Código producto"
                                    value={selectedItem.producto.codigoProducto}
                                  />
                                  <InfoField
                                    icon={<FileText />}
                                    label="Descripción"
                                    value={
                                      selectedItem.producto.descripcion || "N/A"
                                    }
                                  />
                                  <InfoField
                                    icon={<Calendar />}
                                    label="Fecha de eliminación"
                                    value={formatearFechaUTC(
                                      selectedItem.fechaHora
                                    )}
                                  />
                                  <InfoField
                                    icon={<User />}
                                    label="Usuario"
                                    value={`${selectedItem.usuario.nombre} (${selectedItem.usuario.rol})`}
                                  />
                                  <InfoField
                                    icon={<Building />}
                                    label="Sucursal"
                                    value={selectedItem.sucursal.nombre}
                                  />
                                  <InfoField
                                    icon={<Boxes />}
                                    label="Cant. Eliminada"
                                    value={selectedItem.cantidadStockEliminada}
                                  />
                                  <InfoField
                                    icon={<Boxes />}
                                    label="Stock Anterior"
                                    value={selectedItem.cantidadAnterior}
                                  />
                                  <InfoField
                                    icon={<Boxes />}
                                    label="Stock Restante"
                                    value={selectedItem.stockRestante}
                                  />
                                  <div className="sm:col-span-2">
                                    <InfoField
                                      icon={<AlertCircle />}
                                      label="Motivo"
                                      value={
                                        selectedItem.motivo || "No especificado"
                                      }
                                    />
                                  </div>
                                </div>
                              </ScrollArea>
                            )}
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-8 text-gray-500"
                    >
                      No hay registros de eliminaciones de stock.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-center py-6">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(1)}
                    disabled={currentPage === 1}
                    className="text-gray-700 hover:bg-gray-100"
                  >
                    Primero
                  </Button>
                </PaginationItem>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                    className="text-gray-700 hover:bg-gray-100"
                  />
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
                    className="text-gray-700 hover:bg-gray-100"
                  />
                </PaginationItem>
                <PaginationItem>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(totalPages)}
                    disabled={currentPage === totalPages}
                    className="text-gray-700 hover:bg-gray-100"
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
