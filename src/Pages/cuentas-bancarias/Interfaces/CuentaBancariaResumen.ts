// src/interfaces/CuentaBancariaResumen.ts
export type TipoCuenta = "AHORRO" | "CORRIENTE" | "TARJETA";

export interface CuentaBancariaResumen {
  id: number;
  banco: string;
  numero: string;
  alias: string | null;
  tipo: TipoCuenta;
  activa: boolean;
  creadoEn: string;
  actualizadoEn: string;
  movimientosCount: number;
  saldoActual: number;
  ultimoMovimiento?: string;
}

export interface CuentasResponse {
  page: number;
  limit: number;
  total: number;
  items: CuentaBancariaResumen[];
}

export interface CuentaCreatePayload {
  banco: string;
  numero: string;
  alias?: string | null;
  tipo?: TipoCuenta; // opcional: usa default en server
  activa?: boolean;
}
export interface CuentaUpdatePayload extends Partial<CuentaCreatePayload> {}
