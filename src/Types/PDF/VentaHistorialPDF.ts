interface MetodoPago {
  id: number;
  ventaId: number;
  monto: number;
  metodoPago: string;
  fechaPago: string; // Formato ISO string
}

interface Cliente {
  nombre: string;
  correo: string;
  telefono: string;
  direccion: string;
}

interface ProductoInfo {
  id: number;
  nombre: string;
  descripcion: string;
  precioVenta: number;
  codigoProducto: string;
  creadoEn: string; // Formato ISO string
  actualizadoEn: string; // Formato ISO string
}

interface ProductoVenta {
  id: number;
  ventaId: number;
  productoId: number;
  cantidad: number;
  creadoEn: string; // Formato ISO string
  producto: ProductoInfo;
}

interface Venta {
  id: number;
  clienteId: number | null;
  fechaVenta: string; // Formato ISO string
  horaVenta: string; // Formato ISO string
  totalVenta: number;
  cliente: Cliente | null; // Ajusta según los datos reales del cliente si existe
  metodoPago: MetodoPago;
  productos: ProductoVenta[];
  //NUEVOS CAMPOS
  nombreClienteFinal: string;
  telefonoClienteFinal: string;
  direccionClienteFinal: string;
}

export type VentaHistorialPDF = Venta;
