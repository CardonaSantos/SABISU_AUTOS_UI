// grouping.ts

import { TipoMovimientoStock } from "./interfaces";

export const TiposEntradas = [
  TipoMovimientoStock.INGRESO_COMPRA,
  TipoMovimientoStock.INGRESO_REQUISICION,
  //   TipoMovimientoStock.INGRESO_DEVOLUCION_CLIENTE,
  TipoMovimientoStock.INGRESO_TRANSFERENCIA,
  TipoMovimientoStock.INGRESO_AJUSTE,
  TipoMovimientoStock.ENTREGA_STOCK,
  //   TipoMovimientoStock.INVENTARIO_INICIAL,
] as const;

export type TipoMovimientoEntrada = (typeof TiposEntradas)[number];

export const TiposSalidas = [
  TipoMovimientoStock.SALIDA_VENTA,
  //   TipoMovimientoStock.SALIDA_DEVOLUCION_PROVEEDOR,
  TipoMovimientoStock.SALIDA_AJUSTE,
  TipoMovimientoStock.SALIDA_TRANSFERENCIA,
  TipoMovimientoStock.SALIDA_REPARACION,
] as const;

export const TiposAjustesElim = [
  TipoMovimientoStock.AJUSTE_STOCK,
  TipoMovimientoStock.ELIMINACION_STOCK,
  TipoMovimientoStock.ELIMINACION_VENTA,
  TipoMovimientoStock.ELIMINACION,
  TipoMovimientoStock.OTRO,
] as const;
