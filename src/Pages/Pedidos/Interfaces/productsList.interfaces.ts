export interface ProductoToPedidoList {
  id: number;
  nombre: string;
  codigoProducto: string;
  codigoProveedor: string | null;
  descripcion: string;
  precioCostoActual: number;
  stockPorSucursal: StockSucursal[];
}

export interface StockSucursal {
  sucursalId: number;
  sucursalNombre: string;
  cantidad: number;
}
