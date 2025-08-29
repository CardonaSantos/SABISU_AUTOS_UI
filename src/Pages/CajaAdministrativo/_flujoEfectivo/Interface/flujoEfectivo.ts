// // ==============================
// // src/Pages/FlujoEfectivo/types.ts
// // ==============================
// export interface FlujoEfectivoResumenUI {
//   ingresosCaja: number;
//   egresosCaja: number;
//   ingresosBanco: number;
//   egresosBanco: number;
//   saldoNetoCaja: number;
//   saldoNetoBanco: number;
//   saldoNetoTotal: number;
// }

// export interface FlujoEfectivoPorDiaUI {
//   fecha: string; // YYYY-MM-DD
//   ingresosCaja: number;
//   egresosCaja: number;
//   ingresosBanco: number;
//   egresosBanco: number;
//   saldoFinalCaja: number;
//   saldoFinalBanco: number;
//   saldoFinalTotal: number;
// }

// export interface FlujoEfectivoDetalleUI {
//   id: number;
//   fecha: string; // ISO
//   sucursal: { id: number; nombre: string };
//   clasificacion: string; // COSTO_VENTA, GASTO_OPERATIVO, VENTA, etc.
//   motivo: string; // COMPRA_MERCADERIA, GASTO_OPERATIVO, etc.
//   deltaCaja: number; // + ingreso, - egreso
//   deltaBanco: number; // + ingreso, - egreso
//   monto: number; // valor absoluto del movimiento
//   descripcion: string | null;
//   referencia: string | null;
// }

// export interface FlujoEfectivoResponseUI {
//   resumen: FlujoEfectivoResumenUI;
//   porDia: FlujoEfectivoPorDiaUI[];
//   detalle: FlujoEfectivoDetalleUI[];
// }

// export type SucursalOption = { value: number; label: string };
// ==============================
// src/Pages/FlujoEfectivo/types.ts (NUEVOS TYPES)
// ==============================

export type DireccionTransfer = "CAJA_A_BANCO" | "BANCO_A_CAJA";

// --- RESUMEN (ahora con/sin transferencias) ---
export interface FlujoEfectivoResumenUI {
  // Totales brutos por canal (incluyen todo)
  ingresosCaja: number;
  egresosCaja: number;
  ingresosBanco: number;
  egresosBanco: number;

  // Transferencias segregadas
  transferCajaABanco: number; // caja→banco (egreso caja / ingreso banco)
  transferBancoACaja: number; // banco→caja (egreso banco / ingreso caja)

  // Netos del periodo incluyendo transferencias (visión operativa pura)
  saldoNetoCaja_conTransfers: number;
  saldoNetoBanco_conTransfers: number;
  saldoNetoTotal_conTransfers: number;

  // Totales y netos excluyendo transferencias (para comparables financieros)
  ingresosCaja_sinTransfers: number;
  egresosCaja_sinTransfers: number;
  ingresosBanco_sinTransfers: number;
  egresosBanco_sinTransfers: number;
  saldoNetoCaja_sinTransfers: number;
  saldoNetoBanco_sinTransfers: number;
  saldoNetoTotal_sinTransfers: number;
}

// --- POR DÍA (variación diaria; antes “saldoFinal*”) ---
export interface FlujoEfectivoPorDiaUI {
  fecha: string; // YYYY-MM-DD (TZ Guatemala)
  ingresosCaja: number;
  egresosCaja: number;
  ingresosBanco: number;
  egresosBanco: number;

  // Transferencias del día
  transferCajaABanco: number;
  transferBancoACaja: number;

  // Variación neta del día por canal (antes "saldoFinal*")
  movimientoNetoCaja: number; // sum(deltaCaja)
  movimientoNetoBanco: number; // sum(deltaBanco)
  movimientoNetoTotal: number; // sum(deltaCaja + deltaBanco)
}

// --- DETALLE (marcando transferencias) ---
export interface FlujoEfectivoDetalleUI {
  id: number;
  fecha: string; // ISO
  sucursal: { id: number; nombre: string } | null;

  // Puedes dejar string|null si prefieres evitar unions estrictos:
  clasificacion:
    | "INGRESO"
    | "GASTO_OPERATIVO"
    | "COSTO_VENTA"
    | "CONTRAVENTA"
    | "AJUSTE"
    | "TRANSFERENCIA"
    | string
    | null;
  motivo:
    | "VENTA"
    | "OTRO_INGRESO"
    | "COMPRA_MERCADERIA"
    | "COSTO_ASOCIADO"
    | "AJUSTE_SOBRANTE"
    | "AJUSTE_FALTANTE"
    | "DEPOSITO_CIERRE"
    | "DEPOSITO_PROVEEDOR"
    | string
    | null;

  deltaCaja: number; // + ingreso, - egreso
  deltaBanco: number; // + ingreso, - egreso
  montoAbs: number; // |deltaCaja + deltaBanco| (antes "monto")

  descripcion: string;
  referencia: string;

  esTransferencia: boolean;
  direccionTransfer?: DireccionTransfer; // si es transferencia
}

// --- RESPUESTA ---
export interface FlujoEfectivoResponseUI {
  resumen: FlujoEfectivoResumenUI;
  porDia: FlujoEfectivoPorDiaUI[];
  detalle: FlujoEfectivoDetalleUI[];
}

// Sin cambios
export type SucursalOption = { value: number; label: string };
