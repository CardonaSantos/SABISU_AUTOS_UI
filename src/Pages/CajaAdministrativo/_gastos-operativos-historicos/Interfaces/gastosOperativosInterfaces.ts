// src/Pages/GastosOperativos/types.ts

export type GastoOperativoTipo =
  | "SALARIO"
  | "ENERGIA"
  | "LOGISTICA"
  | "RENTA"
  | "INTERNET"
  | "PUBLICIDAD"
  | "VIATICOS"
  | "OTROS";

export interface PeriodoTZ {
  from: string; // ISO con TZ: "2025-08-20T00:00:00-06:00"
  to: string; // ISO con TZ
  timezone: string; // "America/Guatemala"
}

export interface SucursalLite {
  id: number;
  nombre: string;
}

// ---- DETALLE ----
export interface GastoOperativoDetalleUI {
  id: number;
  fecha: string; // ISO
  fechaDia: string; // YYYY-MM-DD (TZ Guatemala)
  sucursal: SucursalLite | null;
  proveedor: { id: number; nombre: string } | null;

  tipo: GastoOperativoTipo | null;
  conFactura: boolean;

  // Crudo (signado): en base de datos los egresos vienen negativos
  deltaCaja: number;
  deltaBanco: number;

  // Derivados para UI (positivos):
  egresoCaja: number; // max(0, -deltaCaja)
  egresoBanco: number; // max(0, -deltaBanco)
  monto: number; // egresoCaja + egresoBanco

  descripcion: string;
  referencia: string;
}

// ---- RESUMEN ----
export interface GastoOperativoResumenUI {
  totalGeneral: number; // suma de todos los gastos del periodo (positivos)

  porCategoria: Record<GastoOperativoTipo, number>; // SALARIO, ENERGIA, etc.

  porCanal: {
    // ¿por dónde salieron?
    caja: number; // suma de egresos hechos en efectivo
    banco: number; // suma de egresos hechos por banco
  };

  porFactura: {
    // control fiscal
    conFactura: number;
    sinFactura: number;
  };

  proveedoresTop: {
    // Top 10 proveedores por gasto
    proveedorId: number;
    nombre: string;
    total: number;
  }[];
}

// ---- POR DÍA ----
export interface GastoOperativoPorDiaUI {
  fecha: string; // YYYY-MM-DD (TZ Guatemala)
  total: number; // total del día (positivo)
  caja: number; // egresos por caja del día (positivo)
  banco: number; // egresos por banco del día (positivo)

  // Breakdown por categoría (siempre presentes para evitar opcionales)
  SALARIO: number;
  ENERGIA: number;
  LOGISTICA: number;
  RENTA: number;
  INTERNET: number;
  PUBLICIDAD: number;
  VIATICOS: number;
  OTROS: number;
}

// ---- RESPUESTA ----
export interface GastoOperativoResponseUI {
  periodo: PeriodoTZ;
  sucursal: SucursalLite | null;
  resumen: GastoOperativoResumenUI;
  porDia: GastoOperativoPorDiaUI[];
  detalle: GastoOperativoDetalleUI[];
}

export type SucursalOption = { value: number; label: string };
