export interface ClienteDto {
  id: number;
  nombreCompleto: string;
  // nombreCompleto: string;
  estado: EstadoCliente;
  telefono: string;
  dpi: string;
  direccion: string;
  creadoEn: string;
  actualizadoEn: Date;
  departamento: string;
  municipio: string;
  municipioId: number;
  departamentoId: number;
  direccionIp: string;
  servicios: ServicioInternetDto[];
  facturacionZona: string;
  facturacionZonaId: number;
  sector: Sector;
  sectorId: number;
}

export enum EstadoCliente {
  ACTIVO = "ACTIVO", // Pago al día
  PENDIENTE_ACTIVO = "PENDIENTE_ACTIVO", // Tiene un recibo pendiente
  PAGO_PENDIENTE = "PAGO_PENDIENTE", // Tiene un pago pendiente vencido
  MOROSO = "MOROSO", // Más de 3 meses sin pagar y cortado
  ATRASADO = "ATRASADO", // Dos facturas
  SUSPENDIDO = "SUSPENDIDO", // Servicio cortado
  DESINSTALADO = "DESINSTALADO", // Desintalado
  EN_INSTALACION = "EN_INSTALACION",
}
interface Sector {
  id: number;
  nombre: string;
  clientesCount: number;
}

export interface ServicioInternetDto {
  id: number;
  nombreServicio: string;
  velocidad: string;
  precio: number;
  estado: string;
  creadoEn: Date;
  actualizadoEn: Date;
}
