import { useEffect, useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  Package,
  Calendar,
  Eye,
  Building,
  Coins,
  User2Icon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import axios from "axios";
import { useStore } from "@/components/Context/ContextSucursal";
import { toast } from "sonner";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

// Tipos
type Producto = {
  nombre: string;
  codigoProducto: string;
};

type Sucursal = {
  id: number;
  nombre: string;
  direccion: string;
};

type Usuario = {
  id: number;
  nombre: string;
  rol: string;
};

type Proveedor = {
  id: number;
  nombre: string;
  correo: string;
  telefono: string;
};

type StockEntregado = {
  id: number;
  productoId: number;
  cantidad: number;
  costoTotal: number;
  creadoEn: string;
  fechaIngreso: string;
  fechaVencimiento: string;
  precioCosto: number;
  entregaStockId: number;
  sucursalId: number;
  producto: Producto;
  sucursal: Sucursal;
};

type EntregaStock = {
  id: number;
  proveedorId: number;
  montoTotal: number;
  fechaEntrega: string;
  recibidoPorId: number;
  sucursalId: number;
  proveedor: Proveedor;
  usuarioRecibido: Usuario;
  stockEntregado: StockEntregado[];
  sucursal: Sucursal;
};
const API_URL = import.meta.env.VITE_API_URL;

export default function EntregasStock() {
  const sucursalID = useStore((state) => state.sucursalId);
  const [entregas, setEntregas] = useState<EntregaStock[]>([]);
  const [selectedEntrega, setSelectedEntrega] = useState<EntregaStock | null>(
    null
  );

  // Función para formatear la fecha
  const formatDate = (date: string) => {
    return format(new Date(date), "dd 'de' MMMM 'de' yyyy", { locale: es });
  };

  const getEntregasRegist = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/entrega-stock/get-my-delivery-stock/${sucursalID}`
      );

      if (response.status === 200) {
        setEntregas(response.data);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error al conseguir los registros de entregas");
    }
  };

  useEffect(() => {
    if (sucursalID) {
      getEntregasRegist();
    }
  }, [sucursalID]);

  console.log("Las entregas: ", entregas);

  // Componente para mostrar los detalles de la entrega
  const EntregaDetails = ({ entrega }: { entrega: EntregaStock }) => (
    <ScrollArea className="h-[400px] w-full">
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold">Información General</h3>
          <p>ID: {entrega.id}</p>
          <p>Monto Total: Q{entrega.montoTotal.toFixed(2)}</p>
          <p>Fecha de Entrega: {formatDate(entrega.fechaEntrega)}</p>
        </div>
        <div>
          <h3 className="font-semibold">Proveedor</h3>
          <p>{entrega.proveedor.nombre}</p>
          <p>{entrega.proveedor.correo}</p>
          <p>{entrega.proveedor.telefono}</p>
        </div>
        <div>
          <h3 className="font-semibold">Recibido Por</h3>
          <p>
            {entrega.usuarioRecibido.nombre} ({entrega.usuarioRecibido.rol})
          </p>
        </div>
        <div>
          <h3 className="font-semibold">Sucursal</h3>
          <p>{entrega.sucursal.nombre}</p>
          <p>{entrega.sucursal.direccion}</p>
        </div>
        <div>
          <h3 className="font-semibold">Stock Entregado</h3>
          {entrega.stockEntregado.map((stock) => (
            <div key={stock.id} className="border-t pt-2 mt-2">
              <p>
                <strong>{stock.producto.nombre}</strong>
              </p>
              <p>Código: {stock.producto.codigoProducto}</p>
              <p>Cantidad: {stock.cantidad}</p>
              <p>Costo Total: Q{stock.costoTotal.toFixed(2)}</p>
              <p>Precio Costo: Q{stock.precioCosto.toFixed(2)}</p>
              <p>Fecha de Ingreso: {formatDate(stock.fechaIngreso)}</p>
              <p>Fecha de Vencimiento: {formatDate(stock.fechaVencimiento)}</p>
            </div>
          ))}
        </div>
      </div>
    </ScrollArea>
  );

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  const totalPages = Math.ceil(entregas.length / itemsPerPage);

  // Calcular el índice del último elemento de la página actual
  const indexOfLastItem = currentPage * itemsPerPage;
  // Calcular el índice del primer elemento de la página actual
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // Obtener los elementos de la página actual
  const currentItems = entregas.slice(indexOfFirstItem, indexOfLastItem);

  // Cambiar de página
  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="container mx-auto py-10">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Entrega</TableHead>
            <TableHead>Proveedor</TableHead>
            <TableHead>Fecha de Entrega</TableHead>
            <TableHead>Sucursal</TableHead>
            <TableHead>Productos</TableHead>

            <TableHead>Monto Total</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentItems &&
            currentItems.map((entrega) => (
              <TableRow key={entrega.id}>
                <TableCell>#{entrega.id}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <User2Icon className="mr-2" size={16} />
                    {entrega.proveedor.nombre}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Calendar className="mr-2" size={16} />
                    {formatDate(entrega.fechaEntrega)}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Building className="mr-2" size={16} />
                    {entrega.sucursal.nombre}
                  </div>
                </TableCell>

                <TableCell>
                  <div className="flex items-center">
                    <Package className="mr-2" size={16} />
                    {entrega.stockEntregado.reduce(
                      (total, prod) => total + prod.cantidad,
                      0
                    )}
                  </div>
                </TableCell>

                <TableCell>
                  <div className="flex items-center">
                    <Coins className="mr-2" size={16} />
                    {new Intl.NumberFormat("es-GT", {
                      style: "currency",
                      currency: "GTQ",
                    }).format(entrega.montoTotal)}
                  </div>
                </TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedEntrega(entrega)}
                      >
                        <Eye className="mr-2" size={16} />
                        Ver Detalles
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl">
                      <DialogHeader>
                        <DialogTitle>
                          Detalles de la Entrega #{entrega.id}
                        </DialogTitle>
                      </DialogHeader>
                      {selectedEntrega && (
                        <EntregaDetails entrega={selectedEntrega} />
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
    </div>
  );
}
