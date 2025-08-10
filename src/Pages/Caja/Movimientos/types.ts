// src/lib/types.ts

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

export interface CreateMovimientoCajaDto {
  registroCajaId?: number;
  fecha?: string; // ISO 8601 string
  tipo: TipoMovimientoCaja;
  categoria: CategoriaMovimiento;
  monto: number;
  descripcion?: string;
  referencia?: string;
  banco?: string;
  numeroBoleta?: string;
  usadoParaCierre?: boolean;
  proveedorId?: number;
  usuarioId: number;
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
