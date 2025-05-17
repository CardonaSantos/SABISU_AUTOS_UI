// Pago de factura principal
export interface Pago {
  id: number;
  metodoPago: string;
  montoPagado: number;
  fechaPago: string;
  creadoEn: string;
  numeroBoleta: string;
}

// Información del cliente
export interface Cliente {
  id: number;
  nombre: string;
  apellidos: string;
  dpi: string;
}

// Información de la empresa
export interface Empresa {
  id: number;
  nombre: string;
  direccion: string;
  correo: string;
  pbx: string;
  sitioWeb: string;
  telefono: string;
  nit: string;
}

// Un servicio “individual” dentro de un servicio adicional
export interface ServicioDetalle {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
}

// El pago mínimo que recibe cada servicio adicional
export interface PagoServicio {
  id: number;
  montoPagado: number;
}

// Cada “línea” de servicio adicional ligada a la factura de internet
export interface ServicioAdicional {
  facturaId: number;
  nombre: string;
  monto: number;
  pagado: number;
  fecha: string;
  estado: string;
}

// La factura principal de internet, ahora con el nuevo array
export interface FacturaInternet {
  id: number;
  estadoFacturaInternet: string; // e.g. 'PAGADA' | 'PENDIENTE' | …
  montoPago: number;
  detalleFactura: string;
  creadoEn: string;
  fechaPagoEsperada: string;
  saldoPendiente: number;
  cliente: Cliente;
  empresa: Empresa;
  pagos: Pago[];
  servicios: ServicioAdicional[];
}
