type Stock = {
  id: number;
  cantidad: number;
  fechaIngreso: string; // En formato ISO
  fechaVencimiento: string; // En formato ISO
};

type Producto = {
  id: number;
  nombre: string;
  descripcion: string;
  precioVenta: number;
  codigoProducto: string;
  creadoEn: string; // En formato ISO
  actualizadoEn: string; // En formato ISO
  stock: Stock[];
};

export type ProductosResponse = Producto;
export type ProductosCart = Producto;
