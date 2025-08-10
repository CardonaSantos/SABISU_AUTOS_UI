export interface HistorialStockEliminacionVentaResponse {
  data: HistorialStockEliminacionVentaItem[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface HistorialStockEliminacionVentaItem {
  id: number;
  comentario: string;
  usuario: Usuario;
  cantidadAnterior: number;
  cantidadNueva: number;
  tipo: "ELIMINACION_VENTA"; // si hay más tipos posibles, puedes usar string
  fechaCambio: string;
  sucursal: Sucursal;
  producto: Producto;
  eliminacionVenta: EliminacionVenta;
}

export interface Usuario {
  id: number;
  nombre: string;
  correo: string;
  rol: string;
}

export interface Sucursal {
  id: number;
  nombre: string;
  direccion: string;
}

export interface Producto {
  id: number;
  nombre: string;
  codigoProducto: string;
  codigoProveedor: string | null;
  descripcion: string;
}

export interface EliminacionVenta {
  id: number;
  cliente: Cliente | null;
  fechaEliminacion: string;
  sucursal: Sucursal;
  motivo: string;
  usuario: Usuario;
}

export interface Cliente {
  id: number;
  nombre: string;
  // otros campos si en algún caso el cliente no es null
}
