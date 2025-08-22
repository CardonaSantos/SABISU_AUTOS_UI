// src/lib/types.ts

export enum TipoMovimientoCaja {
  INGRESO = "INGRESO",
  EGRESO = "EGRESO",
  DEPOSITO_BANCO = "DEPOSITO_BANCO",
  // Si luego los usas, descomenta:
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

/** 🔴 NUEVO: debe coincidir 1:1 con tu enum de Prisma */
export enum GastoOperativoTipo {
  SALARIO = "SALARIO",
  ENERGIA = "ENERGIA",
  RENTA = "RENTA",
  LOGISTICA = "LOGISTICA",
  INTERNET = "INTERNET",
  PUBLICIDAD = "PUBLICIDAD",
  VIATICOS = "VIATICOS",
  OTROS = "OTROS",
}

/** 🔴 NUEVO: opciones listas para el Select del subtipo */
export const GASTO_OPERATIVO_OPTIONS: ReadonlyArray<{
  value: GastoOperativoTipo;
  label: string;
}> = [
  { value: GastoOperativoTipo.ENERGIA, label: "ENERGÍA " },

  { value: GastoOperativoTipo.INTERNET, label: "INTERNET " },
  {
    value: GastoOperativoTipo.LOGISTICA,
    label: "LOGISTICA",
  },
  { value: GastoOperativoTipo.RENTA, label: "RENTA " },
  { value: GastoOperativoTipo.SALARIO, label: "SALARIO" },
  { value: GastoOperativoTipo.VIATICOS, label: "VIATICOS" },
  { value: GastoOperativoTipo.PUBLICIDAD, label: "PUBLICIDAD" },
  { value: GastoOperativoTipo.OTROS, label: "OTROS" },
];

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

  /** 🔴 NUEVO: requerido solo si categoria === GASTO_OPERATIVO */
  gastoOperativoTipo?: GastoOperativoTipo;

  /** 🔴 NUEVO: lo usas en depósito de cierre (total/parcial) */
  depositarTodo?: boolean;
}

export interface Proveedor {
  id: number;
  nombre: string;
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

  /** 🔴 NUEVO: mensaje de error para el subtipo */
  gastoOperativoTipo?: string;
}
