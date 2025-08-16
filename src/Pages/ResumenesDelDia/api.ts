import axios from "axios";
import { getApiErrorMessageAxios } from "../Utils/UtilsErrorApi";
import {
  FlujoMensualResponse,
  ResumenHistoricoResponse,
} from "./interfaces-historicos.dto";

const API_URL = import.meta.env.VITE_API_URL;

export const getSucursales = async () => {
  try {
    const res = await axios.get(`${API_URL}/sucursales`);
    return res.data;
  } catch (error) {
    throw new Error(getApiErrorMessageAxios(error));
  }
};

export const getHistoricoData = async (params: {
  desde: string; // YYYY-MM-DD
  hasta: string; // YYYY-MM-DD
  sucursalId?: number;
}) => {
  try {
    const res = await axios.get<ResumenHistoricoResponse>(
      `${API_URL}/resumen-dia/resumen/historico`,
      { params }
    );
    return res.data;
  } catch (error) {
    throw new Error(getApiErrorMessageAxios(error));
  }
};

// GET /resumen-dia/flujo-mensual?mes=YYYY-MM&sucursalId=#
export const getFlujoMensual = async (params: {
  mes: string; // YYYY-MM
  sucursalId?: number;
}) => {
  try {
    const res = await axios.get<FlujoMensualResponse>(
      `${API_URL}/resumen-dia/flujo-mensual`,
      { params }
    );
    return res.data;
  } catch (error) {
    throw new Error(getApiErrorMessageAxios(error));
  }
};
