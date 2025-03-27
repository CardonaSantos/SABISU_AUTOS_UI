// Definición de la interfaz para un pago
export interface Pago {
  id: number;
  metodoPago: string;
  montoPagado: number;
  fechaPago: string;
  creadoEn: string;

  numeroBoleta: string;
}

// Definición de la interfaz para la información del cliente
interface Cliente {
  id: number;
  nombre: string;
  apellidos: string;
  dpi: string;
}

// Definición de la interfaz para la información de la empresa
interface Empresa {
  id: number;
  nombre: string;
  direccion: string;
  correo: string;
  pbx: string;
  sitioWeb: string;
  telefono: string;
  nit: string;
}

// Definición de la interfaz principal para la factura de Internet
export interface FacturaInternet {
  id: number;
  estadoFacturaInternet: string;
  montoPago: number;
  detalleFactura: string;
  creadoEn: string;
  fechaPagoEsperada: string;
  saldoPendiente: number;
  cliente: Cliente;
  empresa: Empresa;
  pagos: Pago[];
}
