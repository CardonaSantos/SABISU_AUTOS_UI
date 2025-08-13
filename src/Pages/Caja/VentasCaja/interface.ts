export interface VentaLigadaACaja {
  id: number;
  cliente: {
    id: number;
    nombre: string;
  } | null;
  totalVenta: number;
  tipoComprobante: string;
  referenciaPago: string | null;
  metodoPago: {
    metodoPago: string;
  };
  horaVenta: string; // o Date si lo parseas antes
  productos: ProductoVenta[];
}

export interface ProductoVenta {
  lineaId: number;
  precioVenta: number;
  estado: string;
  cantidad: number;
  productoId: number;
  nombre: string;
  codigoProducto: string;
}
