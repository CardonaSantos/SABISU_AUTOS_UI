export interface VencimientoResponse {
  id: number;
  fechaVencimiento: string;
  estado: string;
  descripcion: string;
  stockId: number;
  stock: Stock;
  fechaCreacion: string;
}
interface Stock {
  sucursal: Sucursal;
  producto: Producto;
}
interface Sucursal {
  id: number;
  nombre: string;
}
interface Producto {
  id: number;
  nombre: string;
  codigoProducto: string;
}
