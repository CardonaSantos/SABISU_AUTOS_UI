export interface RutaCobroInterface {
  id: number;
  nombreRuta: string;
  creadoEn: string;
  actualizadoEn: string;
  cobrador: {
    id: number;
    nombre: string;
    correo: string;
  };
  clientes: Cliente[];
}

interface Cliente {
  id: number;
  nombreCompleto: string;
  telefono: string;
  direccion: string;
  contactoReferencia: {
    telefono: string;
    nombre: string;
  };
  ubicacion: {
    latitud: number;
    longitud: number;
  };
  facturas: Factura[];
  saldo: {
    saldoFavor: number;
    saldoPendiente: number;
    ultimoPago: string;
  };
  imagenes: string[];
}

interface Factura {
  id: number;
  montoPago: number;
  estadoFactura: string;
  saldoPendiente: number;
  creadoEn: string;
  detalleFactura: string;
}
