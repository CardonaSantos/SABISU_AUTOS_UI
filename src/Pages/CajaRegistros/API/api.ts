import axios from "axios";
import qs from "qs";
import { getApiErrorMessageAxios } from "@/Pages/Utils/UtilsErrorApi";
import type { PaginatedRegistrosCajaResponse } from "../interfaces/registroscajas.interfaces";

const API_URL = import.meta.env.VITE_API_URL;

export type GetCajasQuery = {
  page?: number;
  limit?: number;
  sucursalId?: number;
  estado?: "ABIERTO" | "CERRADO" | "ARQUEO";
  depositado?: boolean;

  // rangos de CAJA
  fechaAperturaInicio?: string;
  fechaAperturaFin?: string;
  fechaCierreInicio?: string;
  fechaCierreFin?: string;

  // filtros por movimientos dentro de la caja
  tipo?: string | string[]; // ej: ["DEPOSITO_BANCO","EGRESO"]
  categoria?: string | string[]; // ej: ["DEPOSITO_CIERRE"]
  fechaMovInicio?: string;
  fechaMovFin?: string;
  search?: string;

  groupBySucursal?: boolean;
};

export async function getRegistrosCajas(params: GetCajasQuery = {}) {
  try {
    const query: Record<string, any> = {};
    if (params.page && params.page >= 1) query.page = params.page;
    if (params.limit && params.limit >= 1) query.limit = params.limit;
    if (params.sucursalId && params.sucursalId >= 1)
      query.sucursalId = params.sucursalId;
    if (params.estado) query.estado = params.estado;
    if (typeof params.depositado === "boolean")
      query.depositado = params.depositado;

    if (params.fechaAperturaInicio)
      query.fechaAperturaInicio = params.fechaAperturaInicio;
    if (params.fechaAperturaFin)
      query.fechaAperturaFin = params.fechaAperturaFin;
    if (params.fechaCierreInicio)
      query.fechaCierreInicio = params.fechaCierreInicio;
    if (params.fechaCierreFin) query.fechaCierreFin = params.fechaCierreFin;

    if (params.tipo) query.tipo = params.tipo;
    if (params.categoria) query.categoria = params.categoria;
    if (params.fechaMovInicio) query.fechaMovInicio = params.fechaMovInicio;
    if (params.fechaMovFin) query.fechaMovFin = params.fechaMovFin;
    if (params.search) query.search = params.search;

    if (typeof params.groupBySucursal === "boolean")
      query.groupBySucursal = params.groupBySucursal;

    const { data } = await axios.get<PaginatedRegistrosCajaResponse>(
      `${API_URL}/caja-registros`,
      {
        params: query,
        paramsSerializer: {
          // serializa arrays como ?tipo=A&tipo=B&categoria=C
          serialize: (p) =>
            qs.stringify(p, {
              arrayFormat: "repeat",
              skipNulls: true,
              encode: true,
            }),
        },
      }
    );

    return data;
  } catch (err) {
    throw new Error(getApiErrorMessageAxios(err));
  }
}
