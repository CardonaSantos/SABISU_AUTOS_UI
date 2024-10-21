type Proveedor = {
  nombre: string;
};

type EntregaStock = {
  proveedor: Proveedor;
};

type Sucursal = {
  id: number;
  nombre: string;
};

type Stock = {
  id: number;
  cantidad: number;
  fechaIngreso: string; // En formato ISO
  fechaVencimiento: string; // En formato ISO
  entregaStock: EntregaStock;
  sucursal: Sucursal;
};

type Categoria = {
  id: number;
  nombre: string;
};

type Producto = {
  id: number;
  nombre: string;
  descripcion: string;
  precioVenta: number;
  codigoProducto: string;
  creadoEn: string; // En formato ISO
  actualizadoEn: string; // En formato ISO
  categorias: Categoria[];
  stock: Stock[];
};

export type ProductsInventary = Producto;
