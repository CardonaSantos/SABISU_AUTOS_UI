export type Sucursal = {
  id: number;
  nombre: string;
};

// src/lib/types.ts  (o el mismo archivo donde tienes estos tipos)

export type Agg = { monto: number; cantidad: number };

export type GastoOperativoTipo =
  | "SALARIO"
  | "ENTREGA_DOMICILIO"
  | "ENERGIA_ELECTRICA"
  | "AGUA"
  | "INTERNET"
  | "ALQUILER"
  | "MANTENIMIENTO"
  | "TRANSPORTE"
  | "ENCOMIENDA"
  | "OTRO";

export type BreakdownMovimientos = {
  porTipo: Partial<
    Record<
      | "INGRESO"
      | "EGRESO"
      | "VENTA"
      | "ABONO"
      | "RETIRO"
      | "DEPOSITO_BANCO"
      | "CHEQUE"
      | "TRANSFERENCIA"
      | "AJUSTE"
      | "DEVOLUCION"
      | "OTRO",
      Agg
    >
  >;

  porCategoria: Partial<
    Record<
      | "GASTO_OPERATIVO"
      | "COSTO_VENTA"
      | "DEPOSITO_PROVEEDOR"
      | "DEPOSITO_CIERRE",
      Agg
    >
  >;

  ingresosPorTipo: Partial<Record<"INGRESO" | "ABONO" | "TRANSFERENCIA", Agg>>;

  // NUEVO: lo que te falta para que compile
  gastosOperativosPorTipo?: Partial<Record<GastoOperativoTipo, Agg>>;

  ventasEfectivo: number;

  top: Array<{
    id: number;
    fecha: string;
    tipo: string;
    categoria: string | null;
    monto: number;
    descripcion: string | null;
    proveedor?: { id: number; nombre: string } | null;
  }>;
};

export interface ResumenDiarioSucursal {
  fecha: string;
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
  ingresos: number;
  egresos: number;
  saldoFinal: number;
  registros: number;
  breakdown: BreakdownMovimientos;
}

export interface ResumenDiarioResponse {
  fecha: string;
  items: ResumenDiarioSucursal[];
}

// Si envías el subtipo desde el form, agrégalo también a tu DTO del front:
export interface CreateMovimientoCajaDto {
  // ...lo que ya tienes
  gastoOperativoTipo?: GastoOperativoTipo; // NUEVO
}
