// ==============================
// src/Pages/GastosOperativos/types.ts
// ==============================
export interface GastoOperativoDetalleUI {
  id: number;
  fecha: string; // ISO
  sucursal: { id: number; nombre: string };
  proveedor: { id: number; nombre: string } | null;
  motivo: string;
  tipo: string | null; // SALARIO, ENERGIA, LOGISTICA, RENTA, etc.
  monto: number;
  deltaCaja: number;
  deltaBanco: number;
  descripcion: string | null;
  referencia: string | null;
  conFactura: boolean;
}

export interface GastoOperativoResumenUI {
  totalGeneral: number;
  SALARIO?: number;
  ENERGIA?: number;
  LOGISTICA?: number;
  RENTA?: number;
  INTERNET?: number;
  PUBLICIDAD?: number;
  VIATICOS?: number;
  OTROS?: number;
}

export interface GastoOperativoPorDiaUI {
  fecha: string; // YYYY-MM-DD
  total: number;
  SALARIO?: number;
  ENERGIA?: number;
  LOGISTICA?: number;
  RENTA?: number;
  INTERNET?: number;
  PUBLICIDAD?: number;
  VIATICOS?: number;
  OTROS?: number;
}

export interface GastoOperativoResponseUI {
  detalle: GastoOperativoDetalleUI[];
  resumen: GastoOperativoResumenUI;
  porDia: GastoOperativoPorDiaUI[];
}

export type SucursalOption = { value: number; label: string };
