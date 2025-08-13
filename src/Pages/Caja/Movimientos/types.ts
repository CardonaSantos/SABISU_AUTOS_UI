// src/lib/types.ts

export enum TipoMovimientoCaja {
  INGRESO = "INGRESO",
  EGRESO = "EGRESO",
  DEPOSITO_BANCO = "DEPOSITO_BANCO",
  // ABONO = "ABONO",
  // RETIRO = "RETIRO",
  // CHEQUE = "CHEQUE",
  // TRANSFERENCIA = "TRANSFERENCIA",
  // AJUSTE = "AJUSTE",
  // DEVOLUCION = "DEVOLUCION",
  // OTRO = "OTRO",
}

export enum CategoriaMovimiento {
  COSTO_VENTA = "COSTO_VENTA",
  DEPOSITO_CIERRE = "DEPOSITO_CIERRE",
  DEPOSITO_PROVEEDOR = "DEPOSITO_PROVEEDOR",
  GASTO_OPERATIVO = "GASTO_OPERATIVO",
}

export interface CreateMovimientoCajaDto {
  tipo: TipoMovimientoCaja;
  categoria: CategoriaMovimiento | undefined;
  monto: number;
  usuarioId: number;
  descripcion?: string;
  referencia?: string;
  banco?: string;
  numeroBoleta?: string;
  usadoParaCierre?: boolean;
  proveedorId?: number;
  sucursalId: number;
  fecha?: string; // ISO 8601 string
}

export interface Proveedor {
  id: number;
  nombre: string;
  // Agrega otros campos de proveedor si son necesarios
}

export interface MovimientoCajaFormErrors {
  tipo?: string;
  categoria?: string;
  monto?: string;
  usuarioId?: string;
  proveedorId?: string;
  banco?: string;
  numeroBoleta?: string;
  fecha?: string;
}
