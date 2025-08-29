// src/Pages/FlujosHistoricos/types.ts
export interface FlujoSucursalDiaUI {
  fecha: string; // ISO
  fechaDia: string; // YYYY-MM-DD (TZ GT)

  saldoInicioCaja: number;
  ingresosCaja: number;
  egresosCaja: number;
  saldoFinalCaja: number;

  saldoInicioBanco: number;
  ingresosBanco: number;
  egresosBanco: number;
  saldoFinalBanco: number;

  // derivados
  saldoInicioTotal: number;
  saldoFinalTotal: number;
  movimientoNetoCaja: number;
  movimientoNetoBanco: number;
  variacionNetaDia: number;
}

export interface FlujoGlobalDiaUI {
  fecha: string; // ISO
  fechaDia: string; // YYYY-MM-DD (TZ GT)

  saldoTotalCaja: number;
  ingresosTotalCaja: number;
  egresosTotalCaja: number;

  saldoTotalBanco: number;
  ingresosTotalBanco: number;
  egresosTotalBanco: number;

  // derivados
  saldoTotal: number;
  movimientoNetoCajaTotal: number;
  movimientoNetoBancoTotal: number;
  movimientoNetoTotal: number;
}
