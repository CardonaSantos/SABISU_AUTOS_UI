// src/pages/movimiento-caja/movimiento-caja-enums.ts
import { TipoMovimientoCaja, CategoriaMovimiento } from "./types";

export const TIPO_MOVIMIENTO_CAJA_OPTIONS = Object.values(
  TipoMovimientoCaja
).map((value) => ({
  value,
  label: value.replace(/_/g, " "), // Formatea para mejor lectura
}));

export const CATEGORIA_MOVIMIENTO_OPTIONS = Object.values(
  CategoriaMovimiento
).map((value) => ({
  value,
  label: value.replace(/_/g, " "), // Formatea para mejor lectura
}));
