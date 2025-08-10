// Categoría asociada al producto
export interface CategoriaDTO {
  id: number;
  nombre: string;
}

// Información mínima de imagen (aquí vacío en el payload)
export type ImagenProductoDTO = unknown;

// Representa el producto en el historial
export interface ProductoDTO {
  id: number;
  nombre: string;
  codigoProducto: string;
  codigoProveedor: string | null;
  categorias: CategoriaDTO[];
  descripcion: string;
  imagenesProducto: ImagenProductoDTO[];
}

// Usuario genérico
export interface UsuarioDTO {
  id: number;
  nombre: string;
  correo: string;
  rol: string;
}

// Datos de stock asociados al ajuste
export interface StockInfoDTO {
  id: number;
  fechaIngreso: string;
  fechaVencimiento: string;
  cantidadInicial: number | null;
  creadoEn: string;
  actualizadoEn: string;
}

// Detalle específico del ajuste de stock
export interface AjusteStockDTO {
  id: number;
  cantidadAjustada: number;
  descripcion: string;
  fechaHora: string;
  tipoAjuste: string;
  usuario: UsuarioDTO;
  stock: StockInfoDTO;
}

// Registro de historial para tipo AJUSTE_STOCK
export interface HistorialAjusteStockItemDTO {
  id: number;
  comentario: string;
  usuario: UsuarioDTO;
  cantidadAnterior: number;
  cantidadNueva: number;
  tipo: "AJUSTE_STOCK";
  fechaCambio: string;
  sucursal: {
    id: number;
    nombre: string;
    direccion: string;
  };
  producto: ProductoDTO;
  ajusteStock: AjusteStockDTO;
}

// Paginación genérica de historial de ajustes de stock
export interface PaginatedHistorialAjusteStockDTO {
  data: HistorialAjusteStockItemDTO[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}
