export interface ClienteInternet {
  id: number;
  nombre: string;
  // Puedes agregar más campos si los necesitas en pantalla
}

export interface FacturaInternet {
  id: number;
  // Puedes agregar más campos si los necesitas en pantalla
}

export interface FacturacionZona {
  id: number;
  nombre: string;
  empresaId: number;

  // Configuración de generación y recordatorios
  diaGeneracionFactura: number;
  enviarRecordatorioGeneracion: boolean;

  diaPago: number;
  enviarAvisoPago: boolean;

  diaRecordatorio: number;
  enviarRecordatorio1: boolean;

  diaSegundoRecordatorio: number;
  enviarRecordatorio2: boolean;

  horaRecordatorio: string;
  enviarRecordatorio: boolean;

  // Corte y suspensión
  diaCorte?: number | null;
  suspenderTrasFacturas?: number | null;

  // Notificaciones
  // whatsapp?: boolean;
  // email?: boolean;
  // sms?: boolean;
  // llamada?: boolean;
  // telegram?: boolean; // Lo dejé aunque no se usa ahora, por si lo planeas

  // Timestamps
  creadoEn: string;
  actualizadoEn: string;

  // Relaciones y contadores
  clientesCount?: number;
  facturasCount?: number;
}

export interface NuevaFacturacionZona {
  nombre: string;
  empresaId: number;

  // Configuración de generación y recordatorios
  diaGeneracionFactura: number;
  enviarRecordatorioGeneracion: boolean;

  diaPago: number;
  enviarAvisoPago: boolean;

  diaRecordatorio: number;
  enviarRecordatorio1: boolean;

  diaSegundoRecordatorio: number;
  enviarRecordatorio2: boolean;

  horaRecordatorio: string;
  enviarRecordatorio: boolean;

  // Corte y suspensión
  diaCorte?: number | null;
  suspenderTrasFacturas?: number | null;

  // Notificaciones
  whatsapp?: boolean;
  email?: boolean;
  sms?: boolean;
  llamada?: boolean;
  telegram?: boolean;
}
