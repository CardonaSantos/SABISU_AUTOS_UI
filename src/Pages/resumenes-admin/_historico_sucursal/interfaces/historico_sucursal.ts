export interface HistoricoSucursalResponse {
  rango: { from: string; to: string; tz: string };
  sucursalId: number;
  days: HistoricoDay[]; // una fila por día del rango (snap o 0s)
  periodSummary: PeriodSummary; // sumatorias del rango
}

interface HistoricoDay {
  fecha: string; // 'YYYY-MM-DD' en TZ del reporte
  snapshotId: number | null; // null si no hubo snap ese día
  caja: { inicio: number; ingresos: number; egresos: number; final: number };
  banco: { inicio: number; ingresos: number; egresos: number; final: number };
  ventas: {
    total: number;
    cantidad: number;
    efectivo: number;
    porMetodo: Record<string, number>;
  };
  egresos: {
    costosVenta: number;
    gastosOperativos: number;
    depositosCajaABanco: number; // solo DEPOSITO_CIERRE -> banco(+)
  };
  depositos: {
    totalMonto: number; // suma a banco por DEPOSITO_CIERRE
    totalCantidad: number; // # depósitos
  };
  flags: {
    sinSnapshot: boolean; // true si no se encontró snap para ese día
    descuadreCajaVsEfectivo: boolean; // |neto caja operativo - efectivo ventas| > umbral
  };
  warnings: string[];
}

interface PeriodSummary {
  caja: { inicio: number; ingresos: number; egresos: number; final: number };
  banco: { inicio: number; ingresos: number; egresos: number; final: number };
  ventas: { total: number; cantidad: number; efectivo: number };
  egresos: {
    costosVenta: number;
    gastosOperativos: number;
    depositosCajaABanco: number;
  };
  depositos: { totalMonto: number; totalCantidad: number };
  alerts: string[];
}
