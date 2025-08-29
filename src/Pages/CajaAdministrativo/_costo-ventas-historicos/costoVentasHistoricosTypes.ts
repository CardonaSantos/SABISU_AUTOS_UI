// src/Pages/CostosVenta/types.ts
export type CostoVentaTipo =
  | "MERCADERIA"
  | "FLETE"
  | "ENCOMIENDA"
  | "TRANSPORTE"
  | "OTROS";

export interface PeriodoTZ {
  from: string;
  to: string;
  timezone: string;
}
export interface SucursalLite {
  id: number;
  nombre: string;
}

export interface CostoVentaResumenUI {
  totalGeneral: number;
  porCategoria: Record<CostoVentaTipo, number>;
  porCanal: { caja: number; banco: number };
  porFactura: { conFactura: number; sinFactura: number };
  proveedoresTop: { proveedorId: number; nombre: string; total: number }[];
}

export interface CostoVentaPorDiaUI {
  fecha: string; // YYYY-MM-DD
  total: number;
  caja: number;
  banco: number;
  MERCADERIA: number;
  FLETE: number;
  ENCOMIENDA: number;
  TRANSPORTE: number;
  OTROS: number;
}

export interface CostoVentaDetalleUI {
  id: number;
  fecha: string; // ISO
  fechaDia: string; // YYYY-MM-DD (TZ GT)
  sucursal: SucursalLite | null;
  proveedor: { id: number; nombre: string } | null;
  tipo: CostoVentaTipo;
  motivo: string | null;
  conFactura: boolean;
  deltaCaja: number; // signado (DB)
  deltaBanco: number; // signado (DB)
  egresoCaja: number; // max(0, -deltaCaja)
  egresoBanco: number; // max(0, -deltaBanco)
  monto: number; // egresoCaja + egresoBanco (positivo)
  descripcion: string;
  referencia: string;
}

export interface CostoVentaResponseUI {
  periodo: PeriodoTZ;
  sucursal: SucursalLite | null;
  resumen: CostoVentaResumenUI;
  porDia: CostoVentaPorDiaUI[];
  detalle: CostoVentaDetalleUI[];
}
