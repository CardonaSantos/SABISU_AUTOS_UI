// ====== cierres.types.ts ======
export type ModoCierre =
  | "SIN_DEPOSITO"
  | "DEPOSITO_AUTO"
  | "DEPOSITO_PARCIAL"
  | "DEPOSITO_TODO"
  | "CAMBIO_TURNO";

export interface PreviaCierreResponse {
  registroCajaId: number;
  sucursalId?: number;
  saldoInicial?: number;
  enCaja: number; // saldoInicial + Σ deltaCaja del turno (puede ser negativo)
  enCajaOperable?: number; // sugerido por el backend (== max(0, enCaja))
  fondoFijoActual: number;
  sugeridoDepositarAuto: number;
  puedeDepositarHasta: number; // ***usa este*** para límites del depósito
  warnings?: string[];
}

export interface CerrarCajaV2Dto {
  registroCajaId: number;
  usuarioCierreId: number;
  comentarioFinal?: string;

  modo: ModoCierre;

  // si hay depósito:
  cuentaBancariaId?: number;
  montoParcial?: number; // solo en DEPOSITO_PARCIAL
  objetivoFondo?: number; // si DEPOSITO_AUTO/CAMBIO_TURNO (default: fondoFijo)

  // si CAMBIO_TURNO:
  abrirSiguiente?: boolean; // default true en CAMBIO_TURNO
  usuarioInicioSiguienteId?: number;
  fondoFijoSiguiente?: number;
  comentarioAperturaSiguiente?: string;
}
