export interface Sector {
  id: number;
  nombre: string;
  descripcion: string | null;
  municipioId: number;
  clientes?: ClienteInternet[];
  creadoEn: string | Date;
  actualizadoEn: string | Date;
}

export interface Municipio {
  id: number;
  nombre: string;
  provincia?: string;
  codigo?: string;
}

export interface ClienteInternet {
  id: number;
  nombre: string;
  direccion: string;
  sectorId: number;
}

export type TipoPlantilla =
  | "GENERACION_FACTURA"
  | "RECORDATORIO_1"
  | "RECORDATORIO_2"
  | "AVISO_PAGO"
  | "SUSPENSION"
  | "CORTE";

export interface PlantillaMensaje {
  id: number;
  nombre: string;
  tipo: TipoPlantilla;
  body: string;
  empresaId: number;
  creadoEn: string | Date;
  actualizadoEn: string | Date;
}

export interface Empresa {
  id: number;
  nombre: string;
}
