interface Producto {
  id: number;
  nombre: string;
}

export interface StockEditionType {
  id: number;
  productoId: number;
  cantidad: number;
  costoTotal: number;
  creadoEn: string;
  fechaIngreso: string;
  fechaVencimiento: string | null;
  precioCosto: number;
  entregaStockId: number | null;
  sucursalId: number;
  producto: Producto;
}
