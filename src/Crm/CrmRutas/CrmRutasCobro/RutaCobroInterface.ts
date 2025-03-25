export interface RutaCobroInterface {
  id: number;
  nombreRuta: string;
  creadoEn: Date;
  actualizadoEn: Date;
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
    ultimoPago: Date;
  };
}

interface Factura {
  id: number;
  montoPago: number;
  estadoFactura: string;
  saldoPendiente: number;
  creadoEn: Date;
  detalleFactura: string;
}
