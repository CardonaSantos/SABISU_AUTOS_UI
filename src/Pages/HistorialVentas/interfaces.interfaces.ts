import { Venta } from "@/Types/SalesHistory/HistorialVentas";

export interface DetallesVentaProps {
  venta: Venta;
}

interface Producto {
  productoId: number;
  cantidad: number;
  precioVenta: number;
}

export interface VentaToDelete {
  sucursalId: number;
  ventaId: number;
  usuarioId: number;
  motivo: string;
  totalVenta: number;
  clienteId: number;
  productos: Producto[];
}
