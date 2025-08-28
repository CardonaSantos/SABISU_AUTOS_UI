export type FlujoSucursalRecord = {
  fecha: string; // ISO string
  saldoInicioCaja: number;
  ingresosCaja: number;
  egresosCaja: number;
  saldoFinalCaja: number;
  saldoInicioBanco: number;
  ingresosBanco: number;
  egresosBanco: number;
  saldoFinalBanco: number;
};

export type FlujoCajaSucursalUI = FlujoSucursalRecord[];

export type FlujoGlobalRecord = {
  fecha: string | Date; // backend retorna Date en getFlujoGlobal (lo normalizamos en el front)
  saldoTotalCaja: number;
  ingresosTotalCaja: number;
  egresosTotalCaja: number;
  saldoTotalBanco: number;
  ingresosTotalBanco: number;
  egresosTotalBanco: number;
};

export type FlujoCajaGlobalUI = FlujoGlobalRecord[];

export type SucursalOption = { value: number; label: string };
