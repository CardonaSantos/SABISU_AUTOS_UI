export interface CostoVentaDetalleUI {
  id: number;
  fecha: string; // ISO
  sucursal: { id: number; nombre: string } | null;
  proveedor: { id: number; nombre: string } | null;
  clasificacion: string;
  motivo: string;
  costoVentaTipo: string | null;
  monto: number;
  deltaCaja: number;
  deltaBanco: number;
  descripcion: string;
  referencia: string;
  conFactura: boolean;
}

export interface CostosVentaResumenUI {
  totalGeneral: number;
  mercaderia: number;
  fletes: number;
  encomiendas: number;
  transporte: number;
  otros: number;
}

export interface CostosVentaPorDiaUI {
  fecha: string; // YYYY-MM-DD
  total: number;
  mercaderia: number;
  fletes: number;
  encomiendas: number;
  transporte: number;
  otros: number;
}

export interface CostosVentaHistoricoResponse {
  detalle: CostoVentaDetalleUI[];
  resumen: CostosVentaResumenUI;
  porDia: CostosVentaPorDiaUI[];
}
