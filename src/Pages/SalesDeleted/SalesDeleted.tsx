import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useStore } from "@/components/Context/ContextSucursal";
import axios from "axios";
import { toast } from "sonner";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Eye,
  Package,
  Search,
  Trash2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

dayjs.extend(localizedFormat);
dayjs.extend(customParseFormat);
dayjs.locale("es");
const formatearFecha = (fecha: string) => {
  return dayjs(fecha).format("DD MMMM YYYY hh:mm A");
};

const API_URL = import.meta.env.VITE_API_URL;
export interface Product {
  id: number;
  nombre: string;
  codigoProducto: string;
}

export interface VentaEliminadaProducto {
  id: number;
  cantidad: number;
  precioVenta: number;
  producto: Product;
}

export interface Usuario {
  id: number;
  nombre: string;
  rol: string;
}

export interface SaleDeletedRecord {
  id: number;
  usuarioId: number;
  motivo: string;
  totalVenta: number;
  clienteId: number;
  fechaEliminacion: string;
  sucursalId: number;
  cliente: {
    id: number;
    nombre: string;
    telefono: string;
    dpi: string;
    direccion: string;
  };
  VentaEliminadaProducto: VentaEliminadaProducto[];
  usuario: Usuario;
}

export default function SalesDeleted() {
  const sucursalId = useStore((state) => state.sucursalId) ?? 0;
  const [selectedSale, setSelectedSale] = useState<SaleDeletedRecord | null>(
    null
  );
  const [salesDeletedRecords, setSalesDeletedRecords] = useState<
    SaleDeletedRecord[]
  >([]);

  const getRecords = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/sale-deleted/get-my-sales-deleted/${sucursalId}`
      );
      if (response.status === 200) {
        setSalesDeletedRecords(response.data);
      }
    } catch (error) {
      console.log(error);

      toast.error("Error al cargar datos");
    }
  };

  useEffect(() => {
    if (sucursalId) {
      getRecords();
    }
  }, [sucursalId]);

  const [filtro, setFiltro] = useState<string>("");

  const filtrados =
    salesDeletedRecords &&
    salesDeletedRecords.filter((rec) => {
      return (
        rec?.cliente?.nombre
          .trim()
          .toLocaleLowerCase()
          .includes(filtro.trim().toLowerCase()) ||
        rec?.cliente?.telefono
          .trim()
          .toLocaleLowerCase()
          .includes(filtro.trim().toLowerCase()) ||
        rec?.cliente?.dpi
          .trim()
          .toLocaleLowerCase()
          .includes(filtro.trim().toLowerCase()) ||
        rec?.cliente?.direccion
          .trim()
          .toLocaleLowerCase()
          .includes(filtro.trim().toLowerCase()) ||
        rec?.usuario?.nombre
          .trim()
          .toLocaleLowerCase()
          .includes(filtro.trim().toLowerCase())
      );
    });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;
  const totalPages = Math.ceil(filtrados.length / itemsPerPage);

  // Calcular el índice del último elemento de la página actual
  const indexOfLastItem = currentPage * itemsPerPage;
  // Calcular el índice del primer elemento de la página actual
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // Obtener los elementos de la página actual
  const currentItems = filtrados.slice(indexOfFirstItem, indexOfLastItem);

  // Cambiar de página
  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-primary">
        Registros de Ventas Eliminadas
      </h1>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="pl-10 pr-4 py-2"
          placeholder="Buscar por nombre, número, dpi, dirección, usuario"
        />
      </div>

      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">
            Ventas Eliminadas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">No.</TableHead>
                <TableHead>Motivo</TableHead>
                <TableHead>Total Venta</TableHead>
                <TableHead>Fecha Eliminación</TableHead>
                <TableHead>Usuario</TableHead>
                <TableHead className="text-right">Acción</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentItems &&
                currentItems.map((sale) => (
                  <TableRow key={sale.id || Math.random()}>
                    <TableCell className="font-medium">
                      #{sale.id || "N/A"}
                    </TableCell>
                    <TableCell>
                      {sale.motivo || "Sin motivo especificado"}
                    </TableCell>
                    <TableCell>
                      {sale.totalVenta
                        ? new Intl.NumberFormat("es-GT", {
                            style: "currency",
                            currency: "GTQ",
                          }).format(sale.totalVenta)
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      {sale.fechaEliminacion
                        ? formatearFecha(sale.fechaEliminacion)
                        : "Sin fecha"}
                    </TableCell>
                    <TableCell>
                      {sale.usuario?.nombre || "Usuario Desconocido"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedSale(sale)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Ver Detalles
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl">
                          <DialogHeader>
                            <DialogTitle className="text-2xl font-bold flex items-center">
                              <Trash2 className="w-6 h-6 mr-2 text-destructive" />
                              Detalles de Venta Eliminada
                            </DialogTitle>
                          </DialogHeader>
                          {selectedSale && (
                            <div className="mt-4 space-y-6">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                                    <DollarSign className="w-5 h-5 mr-2 text-primary" />
                                    Información General
                                  </h3>
                                  <p>
                                    <strong>No.</strong> #
                                    {selectedSale.id || "N/A"}
                                  </p>
                                  <p>
                                    <strong>Motivo:</strong>{" "}
                                    {selectedSale.motivo ||
                                      "Sin motivo especificado"}
                                  </p>
                                  <p>
                                    <strong>Total Venta:</strong>{" "}
                                    {selectedSale.totalVenta
                                      ? new Intl.NumberFormat("es-GT", {
                                          style: "currency",
                                          currency: "GTQ",
                                        }).format(selectedSale.totalVenta)
                                      : "N/A"}
                                  </p>
                                </div>
                                <div>
                                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                                    <Calendar className="w-5 h-5 mr-2 text-primary" />
                                    Fecha y Usuario
                                  </h3>
                                  <p>
                                    <strong>Fecha Eliminación:</strong>{" "}
                                    {selectedSale.fechaEliminacion
                                      ? formatearFecha(
                                          selectedSale.fechaEliminacion
                                        )
                                      : "Sin fecha"}
                                  </p>
                                  <p>
                                    <strong>Cliente:</strong>{" "}
                                    {selectedSale.cliente?.nombre ||
                                      "Cliente final"}
                                  </p>
                                  <p>
                                    <strong>Usuario:</strong>{" "}
                                    {selectedSale.usuario?.nombre ||
                                      "Usuario desconocido"}{" "}
                                    (
                                    {selectedSale.usuario?.rol ||
                                      "Rol no disponible"}
                                    )
                                  </p>
                                </div>
                              </div>

                              <div>
                                <h3 className="text-lg font-semibold mt-4 mb-2 flex items-center">
                                  <Package className="w-5 h-5 mr-2 text-primary" />
                                  Productos
                                </h3>
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead>Nombre</TableHead>
                                      <TableHead>Código</TableHead>
                                      <TableHead>Cantidad</TableHead>
                                      <TableHead>Precio Venta</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {selectedSale.VentaEliminadaProducto
                                      ?.length > 0 ? (
                                      selectedSale.VentaEliminadaProducto.map(
                                        (product) => (
                                          <TableRow
                                            key={product.id || Math.random()}
                                          >
                                            <TableCell>
                                              {product.producto?.nombre ||
                                                "N/A"}
                                            </TableCell>
                                            <TableCell>
                                              {product.producto
                                                ?.codigoProducto || "N/A"}
                                            </TableCell>
                                            <TableCell>
                                              {product.cantidad || "N/A"}
                                            </TableCell>
                                            <TableCell>
                                              {product.precioVenta
                                                ? `$${product.precioVenta.toFixed(
                                                    2
                                                  )}`
                                                : "N/A"}
                                            </TableCell>
                                          </TableRow>
                                        )
                                      )
                                    ) : (
                                      <TableRow>
                                        <TableCell
                                          colSpan={4}
                                          className="text-center"
                                        >
                                          Sin productos disponibles
                                        </TableCell>
                                      </TableRow>
                                    )}
                                  </TableBody>
                                </Table>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="w-full flex justify-center items-center">
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
        </CardFooter>
      </Card>
    </div>
  );
}
