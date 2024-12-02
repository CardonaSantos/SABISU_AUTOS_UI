import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ProductoVenta,
  Venta,
  VentasHistorial,
} from "@/Types/SalesHistory/HistorialVentas";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  FileSpreadsheet,
  FileText,
  Ticket,
  Trash2,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useStore } from "@/components/Context/ContextSucursal";
import { Textarea } from "@/components/ui/textarea";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { es } from "date-fns/locale";

interface Producto {
  productoId: number;
  cantidad: number;
  precioVenta: number;
}

interface VentaToDelete {
  sucursalId: number;
  ventaId: number;
  usuarioId: number;
  motivo: string;
  totalVenta: number;
  clienteId: number;
  productos: Producto[];
}

const API_URL = import.meta.env.VITE_API_URL;

function ClientHistorialPurchase() {
  const { id } = useParams();
  const sucursalId = useStore((state) => state.sucursalId) ?? 0;
  const [ventaEliminar, setVentaEliminar] = useState<VentaToDelete>({
    usuarioId: 0,
    motivo: "",
    totalVenta: 0,
    clienteId: 0,
    productos: [],
    ventaId: 0,
    sucursalId: sucursalId,
  });

  const [ventas, setVentas] = useState<VentasHistorial>([]);
  const formatearFecha = (fecha: string) => {
    return format(new Date(fecha), "dd/MM/yyyy", { locale: es });
  };

  const getVentas = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/venta/find-customer-sales/${id}`
      );
      if (response.status === 200) {
        setVentas(response.data);
      }
    } catch (error) {
      console.log(error);
      toast.error("No hay ventas disponibles");
    }
  };

  useEffect(() => {
    if (id) {
      getVentas();
    }
  }, [id]);

  const DetallesVenta = ({ venta }: { venta: Venta }) => (
    <Card className="w-full shadow-xl">
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
                <p>Teléfono: {venta.cliente.telefono || "N/A"}</p>
                <p>DPI: {venta.cliente.dpi || "N/A"}</p>
                <p>Direccion: {venta.cliente.direccion || "N/A"}</p>
              </>
            ) : (
              <>
                <p>Nombre: {venta.nombreClienteFinal || "CF"}</p>
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
  const itemsPerPage = 25;
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

  const userId = useStore((state) => state.userId) ?? 0;

  const [isOpenDelete, setIsOpenDelete] = useState(false); // Estado del modal
  const [isDeleting, setIsDeleting] = useState(false); // Estado para deshabilitar el botón

  const handleDeleteSale = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!adminPassword || adminPassword.trim().length === 0) {
      toast.info("Contraseña no ingresada");
      return;
    }

    if (!ventaEliminar.motivo || ventaEliminar.motivo.trim().length === 0) {
      toast.info("Debe ingresar un motivo para la eliminación");
      return;
    }

    if (!ventaEliminar || ventaEliminar.productos.length === 0) {
      toast.info("No se ha seleccionado una venta para eliminar");
      return;
    }

    setIsDeleting(true); // Deshabilitar el botón mientras se procesa la solicitud
    try {
      const response = await axios.post(`${API_URL}/sale-deleted`, {
        ...ventaEliminar,
        adminPassword, // Enviar la contraseña junto con los datos
      });

      if (response.status === 201) {
        console.log("Lo que devuele el servidor es: ", response.data);

        toast.success("Venta eliminada exitosamente");
        setIsOpenDelete(false); // Cerrar el modal después de eliminar
        setVentaEliminar({
          usuarioId: userId,
          motivo: "",
          totalVenta: 0,
          clienteId: 0,
          productos: [],
          ventaId: 0,
          sucursalId,
        }); // Reiniciar el estado de la venta
        setAdminPassword(""); // Limpiar la contraseña
        getVentas();
        setTimeout(() => {
          setIsDeleting(false); // Habilitar el botón nuevamente
        }, 1000);
      }
    } catch (error) {
      toast.error("Ocurrió un error al eliminar la venta");
      setIsDeleting(false); // Habilitar el botón nuevamente
    }
  };

  const handleChangeTextAreaMotivo = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const texto = e.target.value;

    setVentaEliminar((datosPrevios) => ({
      ...datosPrevios,
      motivo: texto,
    }));
  };

  const [adminPassword, setAdminPassword] = useState("");
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Historial de Ventas</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4"></div>
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
                  <TableHead>Eliminar</TableHead>
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
                              <p>Imprimir Ticket Garantía</p>
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
                              <p>Imprimir Garantía</p>
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
                            <p>Imprimir Ticket</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    {/* COMETARIO SEPARADOR DE ELIMINACIOND DE REGISTRO */}
                    <TableCell>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            {/* <Link to={`/ticket/generar-ticket/${venta.id}`}> */}
                            <Button
                              onClick={() => {
                                setVentaEliminar((datosPrevios) => ({
                                  ...datosPrevios,
                                  // motivo: "Venta eliminada por prueba",
                                  usuarioId: userId,
                                  ventaId: venta.id,
                                  clienteId: Number(venta.cliente?.id),
                                  productos: venta.productos.map((prod) => ({
                                    cantidad: prod.cantidad,
                                    precioVenta: prod.precioVenta,
                                    productoId: prod.productoId, // Corrección aquí
                                  })),

                                  totalVenta: venta.totalVenta,
                                }));
                                setIsOpenDelete(true);
                              }}
                              variant="outline"
                              size="icon"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                            {/* </Link> */}
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Eliminar Registro</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
        <Dialog onOpenChange={setIsOpenDelete} open={isOpenDelete}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-center">
                ¿Estás seguro de eliminar este registro de venta?
              </DialogTitle>
              <DialogDescription className="text-center">
                Esto eliminará por completo el registro, y se restará de las
                ganancias de la sucursal.
              </DialogDescription>
              <DialogDescription className="text-center">
                ¿Continuar?
              </DialogDescription>
            </DialogHeader>
            <div className="">
              <Textarea
                placeholder="Escriba el motivo de la eliminación del registro"
                className="mb-2"
                value={ventaEliminar.motivo}
                onChange={handleChangeTextAreaMotivo}
              />

              <Input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="Ingrese su contraseña como administrador para confirmar"
              ></Input>
            </div>
            <div className="flex gap-2">
              {/* Botón para cancelar */}
              <Button
                className="w-full"
                onClick={() => setIsOpenDelete(false)}
                variant={"destructive"}
                disabled={isDeleting} // Deshabilitar si está eliminando
              >
                Cancelar
              </Button>

              {/* Botón para confirmar eliminación */}
              <Button
                className="w-full"
                variant={"default"}
                onClick={handleDeleteSale}
                disabled={isDeleting} // Deshabilitar mientras se procesa la solicitud
              >
                {isDeleting ? "Eliminando..." : "Sí, continúa y elimina"}{" "}
                {/* Texto dinámico */}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

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

export default ClientHistorialPurchase;
