import { CategoriaMovimiento } from "../RegistrosCaja";
import { TipoMovimientoCaja } from "./types";

// qué categorías aplican para cada tipo
export const CATS_BY_TIPO: Record<
  TipoMovimientoCaja,
  CategoriaMovimiento[] | null
> = {
  INGRESO: null,
  EGRESO: ["COSTO_VENTA", "GASTO_OPERATIVO"] as CategoriaMovimiento[],
  DEPOSITO_BANCO: [
    "DEPOSITO_CIERRE",
    "DEPOSITO_PROVEEDOR",
  ] as CategoriaMovimiento[],
  //   ABONO: null,
  //   RETIRO: null,
  //   CHEQUE: null,
  //   TRANSFERENCIA: null,
  //   AJUSTE: null,
  //   DEVOLUCION: null,
  //   OTRO: null,
};
