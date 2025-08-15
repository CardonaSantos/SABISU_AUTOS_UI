// src/api/caja/getRegistrosMovimientos.ts
import axios from "axios";
import { getApiErrorMessageAxios } from "@/Pages/Utils/UtilsErrorApi";
import type { PagedResponseMovimientos } from "../Interfaces/registroCajas";
const API_URL = import.meta.env.VITE_API_URL;
import qs from "qs";
export type GetMovimientosQuery = {
  page?: number;
  limit?: number;
  sucursalId?: number;
  search?: string;
  usadoParaCierre?: boolean;
  groupBySucursal?: boolean;

  // filtros por movimiento
  tipo?: string | string[]; // p.ej: ["INGRESO","EGRESO"]
  categoria?: string | string[]; // p.ej: ["DEPOSITO_CIERRE","GASTO_OPERATIVO"]
  fechaInicio?: string;
  fechaFin?: string;
};

export async function getRegistrosMovimientos(
  params: GetMovimientosQuery = {}
) {
  try {
    // armamos el query omitiendo undefineds
    const query: Record<string, any> = {};

    if (params.page && params.page >= 1) query.page = params.page;
    if (params.limit && params.limit >= 1) query.limit = params.limit;
    if (params.sucursalId && params.sucursalId >= 1)
      query.sucursalId = params.sucursalId;

    if (params.search) query.search = params.search;
    if (typeof params.usadoParaCierre === "boolean")
      query.usadoParaCierre = params.usadoParaCierre;
    if (typeof params.groupBySucursal === "boolean")
      query.groupBySucursal = params.groupBySucursal;

    // arrays o string individuales
    if (params.tipo) query.tipo = params.tipo;
    if (params.categoria) query.categoria = params.categoria;

    // rangos de fecha de MOVIMIENTO
    if (params.fechaInicio) query.fechaInicio = params.fechaInicio;
    if (params.fechaFin) query.fechaFin = params.fechaFin;

    const { data } = await axios.get<PagedResponseMovimientos>(
      `${API_URL}/movimientos-cajas`,
      {
        params: query,
        // muy importante para serializar arrays como:
        // ?tipo=INGRESO&tipo=EGRESO&categoria=DEPOSITO_CIERRE
        paramsSerializer: (p) =>
          qs.stringify(p, {
            arrayFormat: "repeat",
            skipNulls: true,
            encode: true,
          }),
      }
    );

    return data;
  } catch (err) {
    throw new Error(getApiErrorMessageAxios(err));
  }
}
