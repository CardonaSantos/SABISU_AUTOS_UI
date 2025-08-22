import axios from "axios";
import { CerrarCajaV2Dto, PreviaCierreResponse } from "./cierre.types";
const API_URL = import.meta.env.VITE_API_URL;

export async function getPreviaCierre(registroCajaId: number) {
  const { data } = await axios.get(`${API_URL}/caja/previa-cierre`, {
    params: { registroCajaId },
  });
  return data as PreviaCierreResponse;
}

export async function cerrarCajaV2(payload: CerrarCajaV2Dto) {
  const { data } = await axios.post(`${API_URL}/caja/cerrar-v2`, payload);
  return data as {
    turnoCerrado: { id: number; saldoFinal: number; depositoRealizado: number };
    movimientoDeposito?: { id: number };
    nuevoTurno?: { id: number; saldoInicial: number };
    enCajaAntes: number;
  };
}
