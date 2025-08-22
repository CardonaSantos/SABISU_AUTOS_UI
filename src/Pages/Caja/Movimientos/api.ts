// src/lib/api.ts
import axios from "axios";
import type { Proveedor } from "./types";
import { PreviewCierreInterface } from "./previaCerrar.interface";
import {
  CrearMovimientoFinancieroDto,
  CuentaBancaria,
} from "./movimientos-financieros";

const API_URL = import.meta.env.VITE_API_URL;

type NestErrorBody =
  | string
  | {
      statusCode?: number;
      message?: string | string[];
      error?: string;
      code?: string;
    };

function getApiErrorMessage(err: unknown): string {
  const fallback = "Error al registrar el movimiento.";
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as NestErrorBody | undefined;
    if (!data) return err.message || fallback;

    if (typeof data === "string") return data;
    if (Array.isArray(data.message)) return data.message.join(", ");
    if (typeof data.message === "string") return data.message;
    if (data.error) return data.error;
    return `HTTP ${err.response?.status ?? ""}`.trim();
  }
  if (err instanceof Error) return err.message || fallback;
  return fallback;
}

export async function createMovimientoFinanciero(
  data: CrearMovimientoFinancieroDto
) {
  try {
    const res = await axios.post(`${API_URL}/movimiento-financiero`, data);
    return res.data;
  } catch (err) {
    throw new Error(getApiErrorMessage(err));
  }
}
export async function getProveedores(): Promise<Proveedor[]> {
  const res = await axios.get(`${API_URL}/proveedor`);
  return res.data;
}

//conseguir previa a cerrar
export async function getPreviaCerrar(sucursalID: number, userID: number) {
  try {
    const res = await axios.get<PreviewCierreInterface>(
      `${API_URL}/caja/get-previo-cierre/${sucursalID}/${userID}`
    );
    return res.data;
  } catch (err) {
    throw new Error(getApiErrorMessage(err));
  }
}

//GET PARA SELECT DE CUENTAS BANCARIAS
export async function getCuentasBancariasArray() {
  try {
    const res = await axios.get<CuentaBancaria[]>(
      `${API_URL}/cuentas-bancarias/get-simple-select`
    );
    return res.data;
  } catch (err) {
    throw new Error(getApiErrorMessage(err));
  }
}
