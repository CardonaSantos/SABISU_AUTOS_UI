// grouping.

import { TipoMovimientoStock } from "../interfaces";

// grouping.ts
/** Movimientos que traen una requisición ligada */
export const TiposRequisicion = [
  TipoMovimientoStock.INGRESO_REQUISICION,
] as const;
export type TipoMovimientoRequisicion = (typeof TiposRequisicion)[number];

/** Movimientos de venta (traen VentaProducto) */
export const TiposVenta = [TipoMovimientoStock.SALIDA_VENTA] as const;
export type TipoMovimientoVenta = (typeof TiposVenta)[number];

/** Movimientos de ajuste de stock (traen AjusteStock) */
export const TiposAjusteStock = [TipoMovimientoStock.AJUSTE_STOCK] as const;
export type TipoMovimientoAjusteStock = (typeof TiposAjusteStock)[number];

/** Movimientos de eliminación de stock (traen EliminacionStock) */
export const TiposEliminacionStock = [
  TipoMovimientoStock.ELIMINACION_STOCK,
] as const;
export type TipoMovimientoEliminacionStock =
  (typeof TiposEliminacionStock)[number];

/** Movimientos de eliminación de venta (traen VentaEliminada) */
export const TiposEliminacionVenta = [
  TipoMovimientoStock.ELIMINACION_VENTA,
] as const;
export type TipoMovimientoEliminacionVenta =
  (typeof TiposEliminacionVenta)[number];

/** Movimientos de transferencia (traen TransferenciaProducto) */
export const TiposTransferenciaProducto = [
  TipoMovimientoStock.TRANSFERENCIA,
] as const;
export type TipoMovimientoTransferenciaProducto =
  (typeof TiposTransferenciaProducto)[number];

/** Movimientos de entrega de stock (traen EntregaStock) */
export const TiposEntregaStock = [TipoMovimientoStock.ENTREGA_STOCK] as const;
export type TipoMovimientoEntregaStock = (typeof TiposEntregaStock)[number];
