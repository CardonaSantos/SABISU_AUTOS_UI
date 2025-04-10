export interface Sector {
  id: number;
  nombre: string;
  descripcion: string | null;
  municipioId: number;
  municipio?: Municipio;
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
  // Otros campos que pueda tener el cliente
}
