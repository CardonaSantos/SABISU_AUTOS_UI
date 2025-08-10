export interface MetodoPagoDTO {
  id: number;
  metodoPago: string;
  monto: number;
}

export interface ClienteDTO {
  id: number;
  nombre: string;
  telefono: string;
  direccion: string;
}

export interface VentaProductoDetalleDTO {
  id: number;
  productoId: number;
  cantidad: number;
  precioVenta: number;
  producto: {
    id: number;
    nombre: string;
    codigoProducto: string;
  };
}

export interface VentaDetalleDTO {
  id: number;
  fechaVenta: string;
  horaVenta: string;
  totalVenta: number;
  imei: string;
  metodoPago: MetodoPagoDTO;
  cliente: ClienteDTO | null;
  productos: VentaProductoDetalleDTO[];
  sucursal: {
    id: number;
    nombre: string;
    direccion: string;
  };
}

export interface HistorialSalidaVentaItemDTO {
  id: number;
  comentario: string;
  cantidadAnterior: number;
  cantidadNueva: number;
  tipo: "SALIDA_VENTA";
  fechaCambio: string;
  sucursal: {
    id: number;
    nombre: string;
    direccion: string;
  };
  usuario: {
    id: number;
    nombre: string;
    rol: string;
    correo: string;
  };
  producto: {
    id: number;
    nombre: string;
    codigoProducto: string;
  };
  venta: VentaDetalleDTO;
}

export interface PaginatedHistorialSalidaVentaDTO {
  data: HistorialSalidaVentaItemDTO[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}
