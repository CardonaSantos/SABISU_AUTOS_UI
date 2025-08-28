// /Pedidos/Interfaces/index.ts
export interface StockSucursal {
  sucursalId: number;
  sucursalNombre: string;
  cantidad: number;
}

export interface ProductoToPedidoList {
  id: number;
  nombre: string;
  codigoProducto: string;
  codigoProveedor: string | null;
  descripcion: string;
  stockPorSucursal: StockSucursal[];
}

export interface PedidoLinea {
  productoId: number;
  cantidad: number;
  notas?: string | null;
}

export interface PedidoCreate {
  sucursalId: number | null;
  clienteId: number | null;
  usuarioId: number;
  observaciones?: string;
  lineas: PedidoLinea[];
}

// --- Listado de pedidos (respuesta del backend) ---
export type PedidoEstado =
  | "PENDIENTE"
  | "ENVIADO_COMPRAS"
  | "RECIBIDO"
  | "CANCELADO";

export interface PedidoListItem {
  id: number;
  folio: string;
  fecha: string;
  estado: PedidoEstado;
  observaciones: string | null;
  totalLineas: number;
  totalPedido: number;
  creadoEn: string;
  actualizadoEn: string;
  cliente: { id: number; nombre: string };
  sucursal: { id: number; nombre: string };
  usuario: { id: number; nombre: string };
  compra: { id: number; estado: string } | null;
  _count: { lineas: number };
  lineas: Array<{
    id: number;
    pedidoId: number;
    productoId: number;
    cantidad: number;
    precioUnitario: number;
    subtotal: number;
    notas: string | null;
    creadoEn: string;
    actualizadoEn: string;
    producto: {
      id: number;
      nombre: string;
      codigoProducto: string;
      precioCostoActual: number;
      categorias: Array<{ id: number; nombre: string }>;
    };
  }>;
}

export interface PedidosListResponse {
  data: PedidoListItem[];
  page: number | string;
  pageSize: number | string;
  totalItems: number;
  totalPages: number;
  sortBy: string;
  sortDir: "asc" | "desc";
}

export interface ClienteSelect {
  id: number;
  nombre: string;
  apellidos: string;
  observaciones?: string | null;
  telefono?: string | null;
  creadoEn: string;
  actualizadoEn: string;
}
