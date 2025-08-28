// ==============================
// src/Pages/FlujoEfectivo/types.ts
// ==============================
export interface FlujoEfectivoResumenUI {
  ingresosCaja: number;
  egresosCaja: number;
  ingresosBanco: number;
  egresosBanco: number;
  saldoNetoCaja: number;
  saldoNetoBanco: number;
  saldoNetoTotal: number;
}

export interface FlujoEfectivoPorDiaUI {
  fecha: string; // YYYY-MM-DD
  ingresosCaja: number;
  egresosCaja: number;
  ingresosBanco: number;
  egresosBanco: number;
  saldoFinalCaja: number;
  saldoFinalBanco: number;
  saldoFinalTotal: number;
}

export interface FlujoEfectivoDetalleUI {
  id: number;
  fecha: string; // ISO
  sucursal: { id: number; nombre: string };
  clasificacion: string; // COSTO_VENTA, GASTO_OPERATIVO, VENTA, etc.
  motivo: string; // COMPRA_MERCADERIA, GASTO_OPERATIVO, etc.
  deltaCaja: number; // + ingreso, - egreso
  deltaBanco: number; // + ingreso, - egreso
  monto: number; // valor absoluto del movimiento
  descripcion: string | null;
  referencia: string | null;
}

export interface FlujoEfectivoResponseUI {
  resumen: FlujoEfectivoResumenUI;
  porDia: FlujoEfectivoPorDiaUI[];
  detalle: FlujoEfectivoDetalleUI[];
}

export type SucursalOption = { value: number; label: string };
