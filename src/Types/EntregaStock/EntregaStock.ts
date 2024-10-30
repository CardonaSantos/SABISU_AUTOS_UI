// Interfaz para el Producto
interface Producto {
  id: number;
  nombre: string;
  codigoProducto: string;
}

// Interfaz para el Stock entregado
interface StockEntregado {
  id: number;
  productoId: number;
  cantidad: number;
  costoTotal: number;
  creadoEn: Date;
  fechaIngreso: Date;
  fechaVencimiento: Date | null; // Puede ser nulo
  precioCosto: number;
  producto: Producto; // Relación con Producto
  sucursalId: number;
}

// Interfaz para el Proveedor
interface Proveedor {
  id: number;
  nombre: string;
  correo: string;
  telefono: string;
}

// Interfaz para el Usuario que recibió la entrega
interface UsuarioRecibido {
  id: number;
  nombre: string;
  rol: string;
}

// Interfaz para la Sucursal
interface Sucursal {
  id: number;
  nombre: string;
  direccion: string;
}

// Interfaz para la entrega de stock
export interface EntregaStock {
  id: number;
  proveedorId: number;
  montoTotal: number;
  fechaEntrega: string;
  recibidoPorId: number | null; // Puede ser nulo si no hay usuario
  stockEntregado: StockEntregado[]; // Arreglo de Stock entregado
  sucursalId: number;
  proveedor: Proveedor; // Relación con Proveedor
  usuarioRecibido: UsuarioRecibido; // Relación con Usuario
  sucursal: Sucursal; // Relación con Sucursal
}

// Ahora puedes usar `EntregaStock` para tipar tu respuesta en el controlador
