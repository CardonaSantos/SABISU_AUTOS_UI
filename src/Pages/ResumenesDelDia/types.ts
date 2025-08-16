export type ResumenDiarioSucursal = {
  fecha: string; // "2025-08-15"
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
  egresos: number; // suma de egresos del desglose (incluye depósitos)
  saldoFinal: number; // snapshot del día o fórmula
  registros: number; // # turnos cerrados/arqueo del día
};

export type ResumenDiarioResponse = {
  fecha: string; // ISO del día consultado
  items: ResumenDiarioSucursal[];
};

export type Sucursal = {
  id: number;
  nombre: string;
};
