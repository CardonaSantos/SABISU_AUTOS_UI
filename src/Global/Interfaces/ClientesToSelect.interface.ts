export type ISODateString = string;

export interface ClienteToSelect {
  id: number;
  nombre: string;
  apellidos: string | null;
  observaciones: string | null;
  telefono: string | null;
  creadoEn: ISODateString; // <- llega como string
  actualizadoEn: ISODateString; // <- llega como string
}
