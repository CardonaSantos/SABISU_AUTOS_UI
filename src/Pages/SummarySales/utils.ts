export enum ResumenPeriodo {
  DIARIO = "DIARIO",
  SEMANAL = "SEMANAL",
  MENSUAL = "MENSUAL",
}
interface Producto {
  id: number; // ID del producto
  nombre: string; // nombre del producto
  codigoProducto: string; // código del producto
}
export interface DetalleResumenVentaPayload {
  productoId: number; // ID del producto
  producto: Producto; // nombre del producto
  cantidadVendida: number; // unidades vendidas de este producto
  montoVenta: number; // total facturado de este producto
}

export interface SucursalInfo {
  id: number; // ID de la sucursal
  nombre: string; // nombre de la sucursal
}

export interface CreateSalesSummaryPayload {
  titulo: string;
  sucursalId?: number; // opcional, si filtras por sucursal
  usuarioId?: number; // opcional, si filtras por usuario
  periodo: ResumenPeriodo; // DIARIO | SEMANAL | MENSUAL | …
  fechaInicio: Date; // ISO 8601, p.ej. "2025-05-27T00:00:00.000Z"
  fechaFin: Date; // ISO 8601, p.ej. "2025-05-27T23:59:59.999Z"
  totalVentas: number; // suma de montos
  totalTransacciones: number; // número de tickets/facturas
  unidadesVendidas: number; // suma de unidades vendidas
  ticketPromedio?: number; // opcional, totalVentas / totalTransacciones
  productoTopId?: number; // opcional, producto con más ventas
  observaciones?: string; // notas adicionales
}

export interface DtoCreateSummary {
  fechaInicio: string;
  fechaFin: string;
  titulo?: string;
  observaciones?: string;
  sucursalId: number;
  usuarioId: number;
}

///INTERFACE PARA RECIBIR
// Si ya exportas el enum desde tu cliente/back:

// Producto anidado en cada detalle
export interface ProductoEnDetalle {
  id: number;
  codigoProducto: string;
  nombre: string;
}
export interface DataAuto {
  periodo: "DIARIO" | "SEMANAL" | "MENSUAL";
  sucursalId: number;
  usuarioId: number;
}

// Un ítem de detalle de resumen
export interface DetalleResumenVentaResponse {
  id: number;
  cantidadVendida: number;
  montoVenta: number;
  producto: ProductoEnDetalle;
}

// Datos del producto top
export interface ProductoTopResponse {
  id: number;
  codigoProducto: string;
  nombre: string;
  descripcion: string;
  codigoProveedor: string;
}

// Sucursal asociada al resumen
export interface SucursalResponse {
  id: number;
  nombre: string;
  direccion: string;
}

// Usuario que generó el resumen
export interface UsuarioResponse {
  id: number;
  nombre: string;
  rol: string;
}

// Interfaz principal para un resumen de ventas
export interface SalesSummaryResponse {
  id: number;
  titulo?: string;
  sucursalId?: number;
  usuarioId?: number;
  periodo: ResumenPeriodo;
  fechaInicio: string; // ISO 8601: p.ej. "2025-05-10T06:00:00.000Z"
  fechaFin: string; // ISO 8601
  totalVentas: number;
  totalTransacciones: number;
  unidadesVendidas: number;
  ticketPromedio: number;
  productoTopId?: number;
  cantidadProductoTop?: number;
  creadoEn: string; // ISO 8601
  actualizadoEn: string; // ISO 8601
  observaciones?: string;

  detalles: DetalleResumenVentaResponse[];
  productoTop: ProductoTopResponse;
  sucursal: SucursalResponse;
  usuario: UsuarioResponse;
}

// Si la API devuelve un array de ellos:
// export type SalesSummariesResponse = SalesSummaryResponse[];
