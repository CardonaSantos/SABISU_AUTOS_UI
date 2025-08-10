export interface HistorialStockTransferenciaResponse {
  data: HistorialStockTransferenciaItem[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface HistorialStockTransferenciaItem {
  id: number;
  comentario: string;
  usuario: Usuario;
  cantidadAnterior: number;
  cantidadNueva: number;
  tipo: "TRANSFERENCIA"; // puedes extender si hay más tipos
  fechaCambio: string;
  sucursal: Sucursal;
  producto: ProductoConCategorias;
  transferenciaProducto: TransferenciaProducto;
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

export interface Categoria {
  id: number;
  nombre: string;
}

export interface ProductoConCategorias {
  id: number;
  nombre: string;
  codigoProducto: string;
  codigoProveedor: string | null;
  descripcion: string;
  categorias: Categoria[];
  imagenesProducto: any[]; // si tienes una estructura específica, la definimos
}

export interface ProductoSinCategorias {
  id: number;
  nombre: string;
  codigoProducto: string;
  codigoProveedor: string | null;
  descripcion: string;
}

export interface TransferenciaProducto {
  id: number;
  cantidad: number;
  fechaTransferencia: string;
  producto: ProductoSinCategorias;
  sucursalDestino: Sucursal;
  sucursalOrigen: Sucursal;
  usuarioEncargado: Usuario;
}
