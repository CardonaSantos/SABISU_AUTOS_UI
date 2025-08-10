export interface HistorialStockEliminacionResponse {
  data: HistorialStockEliminacionItem[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface HistorialStockEliminacionItem {
  id: number;
  comentario: string;
  usuario: Usuario;
  cantidadAnterior: number;
  cantidadNueva: number;
  tipo: "ELIMINACION_STOCK"; // si puede haber otros tipos, podrías usar string
  fechaCambio: string; // ISO date
  sucursal: Sucursal;
  producto: Producto;
  eliminacionStock: EliminacionStock;
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

export interface EliminacionStock {
  id: number;
  createdAt: string; // ISO date
  producto: Producto;
  usuario: Usuario;
  sucursal: Sucursal;
  cantidadAnterior: number;
  motivo: string;
  stockRestante: number;
  cantidadStockEliminada: number;
}
