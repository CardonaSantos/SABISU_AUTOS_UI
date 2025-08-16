// ==== DIARIO ====
export interface ResumenDiarioSucursal {
  fecha: string; // 'YYYY-MM-DD'
  sucursal: { id: number; nombre: string };
  saldoInicio: number;
  totales: {
    ventasEfectivo: number;
    otrosIngresos: number;
    gastosOperativos: number;
    costoVenta: number;
    depositosProveedor: number;
    depositosCierre: number;
    otrosEgresos: number;
  };
  ingresos: number; // ventasEfectivo + otrosIngresos
  egresos: number; // costos + gastos + depósitos + otros
  saldoFinal: number;
  registros: number; // cierres/arqueos del día
}

export interface ResumenDiarioResponse {
  fecha: string; // ISO del inicio del día en TZ GT
  items: ResumenDiarioSucursal[];
}

// ==== HISTÓRICO (rango) ====
export interface TotalesCajaBanco {
  caja: {
    saldoInicio: number;
    ingresos: number;
    egresos: number;
    saldoFinal: number;
    resultadoOperativo: number; // ventas - costo - gastos operativos
    registros: number;
  };
  banco: {
    ingresos: number; // depósitos de cierre que “entran” a Banco (Admin)
    egresos: number; // (por ahora 0 si no modelas salidas de banco)
  };
}

export interface ResumenHistoricoDia {
  fecha: string; // ISO del día (inicio día TZ GT)
  items: ResumenDiarioSucursal[]; // mismas tarjetas de diario, por sucursal
}

export interface ResumenHistoricoResponse {
  desde: string; // ISO
  hasta: string; // ISO
  dias: ResumenHistoricoDia[];
  totales: TotalesCajaBanco; // suma del rango (caja + banco)
}

// ==== FLUJO MENSUAL ====
export interface FlujoMensualSeriesPoint {
  fecha: string; // 'YYYY-MM-DD'
  ingresos: number; // caja
  egresos: number; // caja
  depositoBanco: number; // suma depósitos de cierre (ingreso para admin)
  pnl: number; // ventas - costo - gastos operativos
}

export interface FlujoMensualResponse {
  mes: string; // 'YYYY-MM'
  sucursalId: number | null;
  series: FlujoMensualSeriesPoint[];
  totales: TotalesCajaBanco; // resumen del mes
}
