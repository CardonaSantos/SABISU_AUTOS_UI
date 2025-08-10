import React, { useEffect, useState } from "react";
import {
  Asterisk,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  CreditCard,
  Eye,
  FileSpreadsheet,
  FileText,
  IdCard,
  MapPinHouse,
  Package,
  Phone,
  Receipt,
  Trash2,
  Type,
  User,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import type {
  VentasHistorial,
  ProductoVenta,
} from "../../Types/SalesHistory/HistorialVentas";
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
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useStore } from "@/components/Context/ContextSucursal";
import { Textarea } from "@/components/ui/textarea";
import dayjs from "dayjs";
import "dayjs/locale/es";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { formattMonedaGT } from "@/utils/formattMoneda";
import { Badge } from "@/components/ui/badge";
import { DetallesVentaProps, VentaToDelete } from "./interfaces.interfaces";
import { getStatusClass, ReplaceUnderlines } from "@/utils/UtilsII";
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
dayjs.locale("es");
registerLocale("es", es);
const API_URL = import.meta.env.VITE_API_URL;

export default function HistorialVentas() {
  const sucursalId = useStore((state) => state.sucursalId) ?? 0;
  const userId = useStore((state) => state.userId) ?? 0;
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [ventaEliminar, setVentaEliminar] = useState<VentaToDelete>({
    usuarioId: 0,
    motivo: "",
    totalVenta: 0,
    clienteId: 0,
    productos: [],
    ventaId: 0,
    sucursalId: sucursalId,
  });

  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  const [filtroVenta, setFiltroVenta] = useState("");
  const [ventas, setVentas] = useState<VentasHistorial>([]);
  const formatearFecha = (fecha: string) => {
    return format(new Date(fecha), "dd/MM/yyyy", { locale: es });
  };

  const getVentas = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/venta/find-my-sucursal-sales/${sucursalId}`
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
    if (sucursalId) {
      getVentas();
    }
  }, [sucursalId]);

  const DetallesVenta = ({ venta }: DetallesVentaProps) => {
    const totalProductos =
      venta?.productos?.reduce(
        (total, producto) => total + producto.cantidad,
        0
      ) || 0;
    const cantidadTiposProductos = venta?.productos?.length || 0;
    console.log("las ventas son: ", ventas);
    console.log("LAS VENTA ES: ", venta);

    return (
      <div className="w-full max-w-3xl mx-auto">
        {/* Header - Ultra compact */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="flex items-center gap-1 mt-0.5">
              <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                #{venta?.id || "N/A"}
              </Badge>
              <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                {venta?.tipoComprobante || "Sin comprobante"}
              </Badge>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {/* Información General - Ultra compact grid */}
          <div className="grid grid-cols-2 gap-3">
            {/* Información de la Venta */}
            <div className="bg-blue-50 rounded-md p-3 dark:bg-zinc-900 ">
              <h3 className="dark:text-white text-xs font-semibold text-gray-900 mb-2 flex items-center gap-1">
                <Package className="w-3 h-3 text-blue-600" />
                Información de la Venta
              </h3>
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-2.5 h-2.5 text-blue-600 flex-shrink-0" />
                  <div className="min-w-0 flex-1 ">
                    <span className="text-xs text-gray-600 dark:text-white">
                      Fecha:{" "}
                      {venta?.fechaVenta
                        ? formatearFecha(venta.fechaVenta)
                        : "N/A"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-2.5 h-2.5 text-blue-600 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <span className="text-xs text-gray-600 dark:text-white">
                      Hora:{" "}
                      {venta?.horaVenta
                        ? new Date(venta.horaVenta).toLocaleTimeString("es-GT")
                        : "N/A"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <Package className="w-2.5 h-2.5 text-blue-600 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <span className="text-xs text-gray-600 dark:text-white">
                      Productos: {totalProductos} unidades de{" "}
                      {cantidadTiposProductos} productos
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Información del Cliente */}
            <div className="bg-green-50 rounded-md p-3 dark:bg-zinc-900 ">
              <h3 className="text-xs font-semibold text-gray-900 mb-2 flex items-center gap-1 dark:text-white">
                <User className="w-3 h-3 text-green-600" />
                Cliente
              </h3>
              <div className="space-y-1.5">
                {venta?.cliente ? (
                  <>
                    <div className="flex items-center gap-1.5">
                      <User className="w-2.5 h-2.5 text-green-600 flex-shrink-0" />
                      <span className="text-xs text-gray-600 truncate dark:text-white">
                        Nombre: {venta.cliente.nombre}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-2.5 h-2.5 text-green-600 flex-shrink-0" />
                      <span className="text-xs text-gray-600 dark:text-white">
                        Teléfono: {venta.cliente.telefono || "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <IdCard className="w-2.5 h-2.5 text-green-600 flex-shrink-0" />
                      <span className="text-xs text-gray-600 dark:text-white">
                        DPI: {venta.cliente.dpi || "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPinHouse className="w-2.5 h-2.5 text-green-600 flex-shrink-0" />
                      <span className="text-xs text-gray-600 break-words dark:text-white">
                        Dirección: {venta.cliente.direccion || "N/A"}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <User className="w-2.5 h-2.5 text-green-600 flex-shrink-0" />
                    <span className="text-xs text-gray-600 dark:text-white">
                      Cliente: {venta?.nombreClienteFinal || "Consumidor Final"}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Productos - Scrollable table with fixed height */}
          <div>
            <h3 className="text-xs font-semibold text-gray-900 mb-2 flex items-center gap-1 dark:text-white">
              <Package className="w-3 h-3 text-purple-600" />
              Productos Vendidos
            </h3>

            <div className="bg-white border border-gray-200 dark:border-none rounded-md overflow-hidden">
              <div className="max-h-32 overflow-y-auto">
                <table className="w-full text-xs">
                  <thead className="dark:bg-zinc-900  bg-gray-50 border-b border-gray-200 sticky top-0">
                    <tr>
                      <th
                        className="
                      dark:text-white
                      px-2 py-1.5 text-left font-semibold text-gray-900"
                      >
                        Producto
                      </th>
                      <th
                        className="
                      dark:text-white
                      px-2 py-1.5 text-center font-semibold text-gray-900"
                      >
                        Cant.
                      </th>
                      <th
                        className="
                      dark:text-white
                      px-2 py-1.5 text-right font-semibold text-gray-900"
                      >
                        Precio Unit.
                      </th>
                      <th
                        className="
                      dark:text-white
                      px-2 py-1.5 text-right font-semibold text-gray-900"
                      >
                        Subtotal
                      </th>

                      <th
                        className="
                      dark:text-white
                      px-2 py-1.5 text-right font-semibold text-gray-900"
                      >
                        Estado
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {venta?.productos?.length > 0 ? (
                      venta.productos.map(
                        (producto: ProductoVenta, index: number) => (
                          <tr
                            key={producto.id}
                            className={
                              index % 2 === 0 ? "bg-white" : "bg-gray-50"
                            }
                          >
                            <td className="px-2 py-1.5">
                              <div className="font-medium text-gray-900 truncate max-w-24">
                                {producto.producto?.nombre || "Sin nombre"}
                              </div>
                            </td>
                            <td className="px-2 py-1.5 text-center">
                              <Badge
                                variant="secondary"
                                className="text-xs px-1 py-0 font-mono"
                              >
                                {producto.cantidad || 0}
                              </Badge>
                            </td>
                            <td className="px-2 py-1.5 text-right font-mono text-gray-900">
                              {producto.precioVenta !== undefined
                                ? formattMonedaGT(producto.precioVenta)
                                : "N/A"}
                            </td>
                            <td className="px-2 py-1.5 text-right font-mono font-semibold text-gray-900">
                              {producto.cantidad !== undefined &&
                              producto.precioVenta !== undefined
                                ? formattMonedaGT(
                                    producto.cantidad * producto.precioVenta
                                  )
                                : "N/A"}
                            </td>

                            <td className="px-2 py-1.5 text-right font-mono font-semibold text-gray-900">
                              <span
                                className={`
        text-xs font-semibold
        ${getStatusClass(producto.estado)}
      `}
                              >
                                {ReplaceUnderlines(producto.estado)}
                              </span>
                            </td>
                          </tr>
                        )
                      )
                    ) : (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-2 py-3 text-center text-gray-500"
                        >
                          No hay productos disponibles
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Método de Pago y Total - Ultra compact */}
          <div className="grid grid-cols-2 gap-3">
            {/* Método de Pago */}
            <div className="bg-orange-50 rounded-md p-3 dark:bg-zinc-900">
              <h3 className="text-xs font-semibold text-gray-900 mb-2 flex items-center gap-1 dark:text-white">
                <CreditCard className="w-3 h-3 text-orange-600" />
                Método de Pago
              </h3>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <Type className="w-2.5 h-2.5 text-orange-600 flex-shrink-0" />
                  <span className="text-xs text-gray-600 dark:text-white">
                    Tipo: {venta?.metodoPago?.metodoPago || "N/A"}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Asterisk className="w-2.5 h-2.5 text-orange-600 flex-shrink-0" />
                  <span className="text-xs text-gray-600 break-all dark:text-white">
                    Referencia: {venta?.referenciaPago || "N/A"}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Receipt className="w-2.5 h-2.5 text-orange-600 flex-shrink-0" />
                  <span className="text-xs text-gray-600 dark:text-white ">
                    Operado con: {venta?.tipoComprobante || "N/A"}
                  </span>
                </div>
              </div>
            </div>

            {/* Total */}
            <div className="dark:bg-zinc-900 bg-green-100 rounded-md p-3 border border-green-200 ">
              <h3 className="text-xs font-semibold text-gray-900 mb-2 dark:text-white">
                Resumen de Pago
              </h3>
              <div className="text-center">
                <p className="text-xs text-gray-600 mb-1 dark:text-white">
                  Monto Total Pagado
                </p>
                <p className="text-xl font-bold text-green-700">
                  {venta?.totalVenta !== undefined
                    ? formattMonedaGT(venta.totalVenta)
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const filtroNormalizado = filtroVenta.trim().toLowerCase();
  const filter = ventas
    .filter((venta) => {
      // 1 — Fecha de la venta normalizada (00:00 GT)
      const fechaVenta = dayjs(venta.fechaVenta)
        .tz("America/Guatemala")
        .startOf("day");

      // 2 — Rango seleccionado
      const inicio = startDate
        ? dayjs(startDate).tz("America/Guatemala").startOf("day")
        : null;

      const fin = endDate
        ? dayjs(endDate).tz("America/Guatemala").endOf("day") // 23:59:59 GT
        : null;

      const coincideRango =
        (!inicio || fechaVenta.isSameOrAfter(inicio, "day")) &&
        (!fin || fechaVenta.isSameOrBefore(fin, "day"));

      // 3 — Filtro de texto (nombre, teléfono, etc.)
      const coincideTexto =
        venta.cliente?.nombre?.toLowerCase().includes(filtroNormalizado) ||
        venta.cliente?.telefono?.toLowerCase().includes(filtroNormalizado) ||
        venta.cliente?.dpi?.toLowerCase().includes(filtroNormalizado) ||
        venta.cliente?.direccion?.toLowerCase().includes(filtroNormalizado) ||
        venta.cliente?.id?.toString().includes(filtroNormalizado) ||
        venta.id.toString().includes(filtroNormalizado);

      return coincideTexto && coincideRango;
    })
    .sort(
      (a, b) => dayjs(b.fechaVenta).valueOf() - dayjs(a.fechaVenta).valueOf()
    );

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;
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

  const handleDeleteSale = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones básicas
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
  console.log("Las ventas son: ", ventas);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-lg font-bold mb-4">Historial de Ventas</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <Input
          placeholder="Filtrar por número de venta, nombre, teléfono, dpi, dirección"
          value={filtroVenta}
          onChange={(e) => setFiltroVenta(e.target.value)}
        />
        <div className="w-full flex gap-2 md:w-1/2">
          <DatePicker
            locale="es"
            selected={startDate}
            onChange={(date) => {
              setStartDate(date || undefined);
            }}
            className="w-full px-4 py-2 border rounded-md bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 dark:placeholder-gray-500"
            isClearable
            placeholderText="Inicio"
          />

          <DatePicker
            locale="es"
            selected={endDate}
            onChange={(date) => {
              setEndDate(date || undefined);
            }}
            className="w-full px-4 py-2 border rounded-md bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 dark:placeholder-gray-500"
            isClearable
            placeholderText="Fin"
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
                  <TableHead>Impresiones</TableHead>

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
                    <TableCell>{formattMonedaGT(venta.totalVenta)}</TableCell>

                    {/* Acciones de venta */}
                    <TableCell>
                      <div className="flex space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              aria-label="Ver detalles de venta"
                              className="hover:bg-blue-50 hover:border-blue-300 transition-colors bg-transparent dark:hover:bg-transparent"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl p-4">
                            <DetallesVenta venta={venta} />
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>

                    {/* Botones de impresión */}
                    <TableCell>
                      <div className="flex space-x-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Link to={`/venta/generar-factura/${venta.id}`}>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  aria-label="Imprimir Comprobante"
                                >
                                  <FileText className="h-4 w-4" />
                                </Button>
                              </Link>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Imprimir Comprobante</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Link
                                to={`/garantía/generar-garantía/${venta.id}`}
                              >
                                <Button
                                  variant="outline"
                                  size="icon"
                                  aria-label="Imprimir Garantía"
                                >
                                  <FileSpreadsheet className="h-4 w-4" />
                                </Button>
                              </Link>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Imprimir Garantía</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        {/* GENERAR EL TICKET */}
                      </div>
                    </TableCell>

                    {/* Eliminar registro */}
                    <TableCell>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Button
                              disabled={["CREDITO", "OTRO"].includes(
                                venta?.metodoPago?.metodoPago ?? ""
                              )}
                              onClick={() => {
                                setVentaEliminar((datosPrevios) => ({
                                  ...datosPrevios,
                                  usuarioId: userId,
                                  ventaId: venta?.id,
                                  clienteId: Number(venta?.cliente?.id),
                                  productos:
                                    venta?.productos?.map((prod) => ({
                                      cantidad: prod.cantidad,
                                      precioVenta: prod.precioVenta,
                                      productoId: prod.productoId,
                                    })) || [],
                                  totalVenta: venta?.totalVenta,
                                }));
                                setIsOpenDelete(true);
                              }}
                              variant="outline"
                              size="icon"
                              aria-label="Eliminar Venta"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
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
