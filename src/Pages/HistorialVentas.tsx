import { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  FileSpreadsheet,
  FileText,
  Ticket,
} from "lucide-react";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
const API_URL = import.meta.env.VITE_API_URL;

import DatePicker, { registerLocale } from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
registerLocale("es", es);

export default function HistorialVentas() {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);

  const [filtroVenta, setFiltroVenta] = useState("");
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
                {/* <p>Correo: {venta.cliente.correo || "N/A"}</p> */}
                <p>Teléfono: {venta.cliente.telefono || "N/A"}</p>
                <p>DPI: {venta.cliente.dpi || "N/A"}</p>
                <p>Direccion: {venta.cliente.direccion || "N/A"}</p>
              </>
            ) : (
              <>
                <p>Nombre: {venta.nombreClienteFinal || "CF"}</p>
                {/* <p>Teléfono: {venta.telefonoClienteFinal || "N/A"}</p> */}
                {/* <p>Dirección: {venta.direccionClienteFinal || "N/A"}</p> */}
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

  const filter = ventas
    .filter((venta) => {
      // Convertir la fecha de la venta a formato sin hora
      const ventaFecha = new Date(venta.fechaVenta);
      // Eliminar la hora de la fecha seleccionada
      const fechaSeleccionada =
        startDate && new Date(startDate).setHours(0, 0, 0, 0); // Solo la fecha sin la hora
      const ventaFechaSinHora = ventaFecha.setHours(0, 0, 0, 0); // Solo la fecha sin la hora

      // Compara solo las fechas sin tener en cuenta la hora
      const fechaCoincide = fechaSeleccionada
        ? fechaSeleccionada === ventaFechaSinHora
        : true; // Si no hay fecha seleccionada, no se aplica filtro

      // Filtra por nombre, teléfono, dpi, dirección o id, y también por fecha si se selecciona
      return (
        (venta.cliente?.nombre
          .trim()
          .toLowerCase()
          .includes(filtroVenta.trim().toLowerCase()) ||
          venta.cliente?.telefono
            .trim()
            .toLowerCase()
            .includes(filtroVenta.trim().toLowerCase()) ||
          venta.cliente?.dpi
            .trim()
            .toLowerCase()
            .includes(filtroVenta.trim().toLowerCase()) ||
          venta.cliente?.direccion
            .trim()
            .toLowerCase()
            .includes(filtroVenta.trim().toLowerCase()) ||
          venta.cliente?.id
            .toString()
            .trim()
            .toLowerCase()
            .includes(filtroVenta.trim().toLowerCase()) ||
          venta.id
            .toString()
            .trim()
            .toLowerCase()
            .includes(filtroVenta.trim().toLowerCase())) &&
        fechaCoincide
      );
    })
    .sort((a, b) => {
      const fechaA = new Date(a.fechaVenta).getTime();
      const fechaB = new Date(b.fechaVenta).getTime();
      return fechaB - fechaA;
    });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  const totalPages = Math.ceil(filter.length / itemsPerPage);

  // Calcular el índice del último elemento de la página actual
  const indexOfLastItem = currentPage * itemsPerPage;
  // Calcular el índice del primer elemento de la página actual
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // Obtener los elementos de la página actual
  const currentItems = filter.slice(indexOfFirstItem, indexOfLastItem);

  // Cambiar de página
  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  console.log("LA FECHA SELECCIONADA ES: ", startDate);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Historial de Ventas</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <Input
          placeholder="Filtrar por número de venta, nombre, teléfono, dpi, dirección"
          value={filtroVenta}
          onChange={(e) => setFiltroVenta(e.target.value)}
        />
        <div className="w-full md:w-1/2">
          <DatePicker
            locale="es"
            selected={startDate}
            onChange={(date) => {
              setStartDate(date || undefined);
            }}
            className="w-full px-4 py-2 border rounded-md bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 dark:placeholder-gray-500"
            isClearable
            placeholderText="Seleccionar una fecha"
          />
        </div>
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
                  <TableHead>Ticket</TableHead>
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

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Link to={`/venta/generar-factura/${venta.id}`}>
                                <Button variant="outline" size="icon">
                                  <FileText className="h-4 w-4" />
                                </Button>
                              </Link>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Conseguir comprobante</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Link
                                to={`/garantía/generar-garantía/${venta.id}`}
                              >
                                <Button variant="outline" size="icon">
                                  <FileSpreadsheet className="h-4 w-4" />
                                </Button>
                              </Link>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Conseguir garantías</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </TableCell>
                    <TableCell>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Link to={`/ticket/generar-ticket/${venta.id}`}>
                              <Button variant="outline" size="icon">
                                <Ticket className="h-4 w-4" />
                              </Button>
                            </Link>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Generar Ticket</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <div className="flex space-x-2"></div>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
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
      </Card>
    </div>
  );
}
