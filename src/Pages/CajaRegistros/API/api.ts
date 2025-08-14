import { getApiErrorMessageAxios } from "@/Pages/Utils/UtilsErrorApi";
import axios from "axios";
import { PaginatedRegistrosCajaResponse } from "../interfaces/registroscajas.interfaces";

const API_URL = import.meta.env.VITE_API_URL;
type GetRegistrosParams = {
  page?: number; // opcional para usar defaults del server si quieres
  limit?: number;
  sucursalId?: number; // solo si >=1
};

export async function getRegistrosCajas(params: GetRegistrosParams) {
  try {
    const query: Record<string, number> = {};
    if (params.page && params.page >= 1) query.page = params.page;
    if (params.limit && params.limit >= 1) query.limit = params.limit;
    if (params.sucursalId && params.sucursalId >= 1)
      query.sucursalId = params.sucursalId;

    const { data } = await axios.get<PaginatedRegistrosCajaResponse>(
      `${API_URL}/caja-registros`,
      { params: query }
    );
    return data;
  } catch (err) {
    throw new Error(getApiErrorMessageAxios(err));
  }
}
