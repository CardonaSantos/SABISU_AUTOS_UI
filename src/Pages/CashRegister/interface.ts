export enum TipoMovimientoCaja {
  INGRESO = "INGRESO",
  EGRESO = "EGRESO",
  VENTA = "VENTA",
  ABONO = "ABONO",
  RETIRO = "RETIRO",
  DEPOSITO_BANCO = "DEPOSITO_BANCO",
  CHEQUE = "CHEQUE",
  TRANSFERENCIA = "TRANSFERENCIA",
  AJUSTE = "AJUSTE",
  DEVOLUCION = "DEVOLUCION",
  OTRO = "OTRO",
}

export enum CategoriaMovimiento {
  COSTO_VENTA = "COSTO_VENTA",
  DEPOSITO_CIERRE = "DEPOSITO_CIERRE",
  DEPOSITO_PROVEEDOR = "DEPOSITO_PROVEEDOR",
  GASTO_OPERATIVO = "GASTO_OPERATIVO",
}
export interface Movimiento {
  id: number;
  registroCajaId: number;
  fecha: string; // ISO date string
  tipo: TipoMovimientoCaja;
  categoria: CategoriaMovimiento;
  monto: number;
  descripcion?: string;
  referencia?: string;
  // Campos extra para depósitos
  banco?: string;
  numeroBoleta?: string;
  usadoParaCierre?: boolean;
  // Campos extra para egresos/costo de venta
  proveedorId?: number;
  // Quién registró
  usuarioId: number;
  // Timestamps
  creadoEn: string; // ISO date
  actualizadoEn: string; // ISO date
}
