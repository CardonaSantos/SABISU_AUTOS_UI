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
  //   { salesDeletedRecords }: SalesDeletedProps

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
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">
        Registros de Ventas Eliminadas
      </h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>No.</TableHead>
            <TableHead>Motivo</TableHead>
            <TableHead>Total Venta</TableHead>
            <TableHead>Fecha Eliminación</TableHead>
            <TableHead>Usuario</TableHead>
            <TableHead>Acción</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {salesDeletedRecords.map((sale) => (
            <TableRow key={sale.id || Math.random()}>
              <TableCell>#{sale.id || "N/A"}</TableCell>
              <TableCell>{sale.motivo || "Sin motivo especificado"}</TableCell>
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
              <TableCell>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      onClick={() => setSelectedSale(sale)}
                    >
                      Ver Detalles
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl">
                    <DialogHeader>
                      <DialogTitle>Detalles de Venta Eliminada</DialogTitle>
                    </DialogHeader>
                    {selectedSale && (
                      <div className="mt-4">
                        <h3 className="text-lg font-semibold mb-2">
                          Información General
                        </h3>
                        <p>
                          <strong>No.</strong> #{selectedSale.id || "N/A"}
                        </p>
                        <p>
                          <strong>Motivo:</strong>{" "}
                          {selectedSale.motivo || "Sin motivo especificado"}
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
                        <p>
                          <strong>Fecha Eliminación:</strong>{" "}
                          {selectedSale.fechaEliminacion
                            ? formatearFecha(selectedSale.fechaEliminacion)
                            : "Sin fecha"}
                        </p>
                        <p>
                          <strong>Cliente:</strong>{" "}
                          {selectedSale.cliente?.nombre || "Cliente final"}
                        </p>
                        <p>
                          <strong>Usuario:</strong>{" "}
                          {selectedSale.usuario?.nombre ||
                            "Usuario desconocido"}{" "}
                          ({selectedSale.usuario?.rol || "Rol no disponible"})
                        </p>

                        <h3 className="text-lg font-semibold mt-4 mb-2">
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
                            {selectedSale.VentaEliminadaProducto?.length > 0 ? (
                              selectedSale.VentaEliminadaProducto.map(
                                (product) => (
                                  <TableRow key={product.id || Math.random()}>
                                    <TableCell>
                                      {product.producto?.nombre || "N/A"}
                                    </TableCell>
                                    <TableCell>
                                      {product.producto?.codigoProducto ||
                                        "N/A"}
                                    </TableCell>
                                    <TableCell>
                                      {product.cantidad || "N/A"}
                                    </TableCell>
                                    <TableCell>
                                      {product.precioVenta
                                        ? `$${product.precioVenta.toFixed(2)}`
                                        : "N/A"}
                                    </TableCell>
                                  </TableRow>
                                )
                              )
                            ) : (
                              <TableRow>
                                <TableCell colSpan={4} className="text-center">
                                  Sin productos disponibles
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
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
