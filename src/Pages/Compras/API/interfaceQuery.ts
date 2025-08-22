export type EstadoCompra =
  | "RECIBIDO"
  | "CANCELADO"
  | "RECIBIDO_PARCIAL"
  | "ESPERANDO_ENTREGA";

export type OrderByCompra = "fecha" | "creadoEn" | "total";
export type OrderDir = "asc" | "desc";

export interface GetRegistrosComprasQuery {
  page?: number;
  limit?: number;
  sucursalId?: number;
  estado?: EstadoCompra;
  proveedorId?: number;
  conFactura?: boolean;
  fechaInicio?: string; // 'YYYY-MM-DD' o ISO
  fechaFin?: string;
  creadoInicio?: string; // opcional
  creadoFin?: string; // opcional
  minTotal?: number;
  maxTotal?: number;
  search?: string;
  orderBy?: OrderByCompra; // default 'fecha'
  order?: OrderDir; // default 'desc'
  groupByProveedor?: boolean;
  withDetalles?: boolean; // default true
}
