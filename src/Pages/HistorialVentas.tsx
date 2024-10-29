import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Eye, FileText } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
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
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

// Importa los tipos
import type {
  VentasHistorial,
  Venta,
  ProductoVenta,
} from "../Types/SalesHistory/HistorialVentas";
import axios from "axios";
import { toast } from "sonner";
import {
  Pagination,
  PaginationContent,
  // PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Link } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL;

export default function HistorialVentas() {
  const [filtroVenta, setFiltroVenta] = useState("");
  const [filtroCliente, setFiltroCliente] = useState("");
  const [filtroFecha, setFiltroFecha] = useState("");
  const [ventas, setVentas] = useState<VentasHistorial>([]);
  const formatearFecha = (fecha: string) => {
    return format(new Date(fecha), "dd/MM/yyyy", { locale: es });
  };

  const getVentas = async () => {
    try {
      const response = await axios.get(`${API_URL}/venta`);
      if (response.status === 200) {
        setVentas(response.data);
      }
    } catch (error) {
      console.log(error);
      toast.error("No hay ventas disponibles");
    }
  };

  useEffect(() => {
    getVentas();
  }, []);

  console.log("Las ventas en el historial ventas son: ", ventas);

  const DetallesVenta = ({ venta }: { venta: Venta }) => (
    <Card className="w-full shadow-xl">
      {" "}
      {/* Cambia max-w-3xl a w-full */}
      <CardHeader>
        <CardTitle>Detalles de la Venta #{venta.id}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold">Información de la Venta</h3>
            <p>Fecha: {formatearFecha(venta.fechaVenta)}</p>
            <p>Hora: {new Date(venta.horaVenta).toLocaleTimeString()}</p>
            <p>
              Cantidad:{" "}
              {venta.productos.reduce(
                (total, producto) => total + producto.cantidad,
                0
              )}{" "}
              unidades de {venta.productos.length} Productos
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Cliente</h3>
            {venta.cliente ? (
              <>
                <p>Nombre: {venta.cliente.nombre || "N/A"}</p>
                <p>Correo: {venta.cliente.correo || "N/A"}</p>
                <p>Teléfono: {venta.cliente.telefono || "N/A"}</p>
              </>
            ) : (
              <>
                <p>Nombre: {venta.nombreClienteFinal || "CF"}</p>
                <p>Teléfono: {venta.telefonoClienteFinal || "N/A"}</p>
                <p>Dirección: {venta.direccionClienteFinal || "N/A"}</p>
              </>
            )}
          </div>
        </div>

        <div className="mt-4">
          <h3 className="font-semibold">Productos</h3>
          {/* Aquí limito la altura de la tabla y agrego scroll */}
          <div className="max-h-60 overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Producto</TableHead>
                  <TableHead>Cantidad</TableHead>
                  <TableHead>Precio Unitario</TableHead>
                  <TableHead>Subtotal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {venta.productos.map((producto: ProductoVenta) => (
                  <TableRow key={producto.id}>
                    <TableCell>{producto.producto.nombre}</TableCell>
                    <TableCell>{producto.cantidad}</TableCell>
                    <TableCell>
                      {new Intl.NumberFormat("es-GT", {
                        style: "currency",
                        currency: "GTQ",
                      }).format(producto.precioVenta)}
                    </TableCell>
                    <TableCell>
                      {new Intl.NumberFormat("es-GT", {
                        style: "currency",
                        currency: "GTQ",
                      }).format(producto.cantidad * producto.precioVenta)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="mt-4">
          <h3 className="font-semibold">Método de Pago</h3>
          <p>Tipo: {venta.metodoPago.metodoPago}</p>
          <p>
            Monto total:{" "}
            {new Intl.NumberFormat("es-GT", {
              style: "currency",
              currency: "GTQ",
            }).format(venta.totalVenta)}
          </p>
        </div>
      </CardContent>
    </Card>
  );

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(ventas.length / itemsPerPage);

  // Calcular el índice del último elemento de la página actual
  const indexOfLastItem = currentPage * itemsPerPage;
  // Calcular el índice del primer elemento de la página actual
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // Obtener los elementos de la página actual
  const currentItems = ventas.slice(indexOfFirstItem, indexOfLastItem);

  // Cambiar de página
  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Historial de Ventas</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <Input
          placeholder="Filtrar por número de venta"
          value={filtroVenta}
          onChange={(e) => setFiltroVenta(e.target.value)}
        />
        <Input
          placeholder="Filtrar por cliente"
          value={filtroCliente}
          onChange={(e) => setFiltroCliente(e.target.value)}
        />
        <Input
          type="date"
          placeholder="Filtrar por fecha"
          value={filtroFecha}
          onChange={(e) => setFiltroFecha(e.target.value)}
        />
      </div>
      <Card className="shadow-xl">
        <CardContent>
          <ScrollArea className="h-[600px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID Venta</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentItems.map((venta) => (
                  <TableRow key={venta.id}>
                    <TableCell>#{venta.id}</TableCell>
                    <TableCell>
                      {venta.cliente
                        ? venta.cliente.nombre
                        : venta.nombreClienteFinal
                        ? venta.nombreClienteFinal
                        : "CF"}
                    </TableCell>
                    <TableCell>{formatearFecha(venta.fechaVenta)}</TableCell>
                    <TableCell>
                      {new Intl.NumberFormat("es-GT", {
                        style: "currency",
                        currency: "GTQ",
                      }).format(venta.totalVenta)}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="icon">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="w-full justify-center items-center max-w-2xl">
                            <DetallesVenta venta={venta} />
                          </DialogContent>
                        </Dialog>
                        <Link to={`/venta/generar-factura/${venta.id}`}>
                          <Button variant="outline" size="icon">
                            <FileText className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
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
    </div>
  );
}
