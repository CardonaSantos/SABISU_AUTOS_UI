// tipos/clientes.ts
export type ISODateString = string;

export interface ClienteToSelectApi {
  id: number;
  nombre: string;
  apellidos: string | null;
  observaciones: string | null;
  telefono: string | null;
  creadoEn: ISODateString; // <- llega como string
  actualizadoEn: ISODateString; // <- llega como string
}

export interface ClienteToSelect {
  id: number;
  nombre: string;
  apellidos: string | null;
  observaciones: string | null;
  telefono: string | null;
  creadoEn: Date; // <- parseado
  actualizadoEn: Date; // <- parseado
}
