// Types
export interface ClienteInternet {
  id: number;
  nombre: string;
  // Otros campos que pueda tener el cliente
}

export interface FacturaInternet {
  id: number;
  // Otros campos que pueda tener la factura
}

export interface FacturacionZona {
  id: number;
  nombre: string;
  empresaId: number;
  diaGeneracionFactura: number;
  diaPago: number;
  diaRecordatorio: number;
  diaSegundoRecordatorio: number;
  horaRecordatorio: string;
  enviarRecordatorio: boolean;
  mediosNotificacion?: string;
  diaCorte?: number | null;
  suspenderTrasFacturas?: number | null;
  clientes?: ClienteInternet[];
  facturas?: FacturaInternet[];
  creadoEn: string;
  actualizadoEn: string;
  clientesCount?: number;
  facturasCount?: number;

  whatsapp?: boolean;
  email?: boolean;
  sms?: boolean;
  llamada?: boolean;
  telegram?: boolean;
}

export interface NuevaFacturacionZona {
  nombre: string;
  empresaId: number;
  diaGeneracionFactura: number;
  diaPago: number;
  diaRecordatorio: number;
  diaSegundoRecordatorio: number;
  horaRecordatorio: string;
  enviarRecordatorio: boolean;
  mediosNotificacion?: string;
  diaCorte?: number | null;
  suspenderTrasFacturas?: number | null;

  whatsapp?: boolean;
  email?: boolean;
  sms?: boolean;
  llamada?: boolean;
  telegram?: boolean;
}
