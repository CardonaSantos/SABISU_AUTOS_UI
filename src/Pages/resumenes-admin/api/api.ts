import axios from "axios";
import { ResumenDiarioAdminResponse } from "../interfaces/resumen";
import { getApiErrorMessageAxios } from "@/Pages/Utils/UtilsErrorApi";
const API_URL = import.meta.env.VITE_API_URL;

export async function fetchResumen(
  sucursalId: string,
  date: string | null
): Promise<ResumenDiarioAdminResponse> {
  const url = `${API_URL}/resumenes-admin/admin/resumen-diario`;

  try {
    const res = await axios.get<ResumenDiarioAdminResponse>(url, {
      params: { sucursalId, date },
    });
    return res.data;
  } catch (error) {
    console.error("Error al cargar resumen", error);
    throw new Error("Error al cargar resumen");
  }
}

export const getSucursalesArray = async () => {
  try {
    const res = await axios.get(`${API_URL}/sucursales`);
    return res.data;
  } catch (error) {
    console.log(error);
    throw new Error(getApiErrorMessageAxios(error));
  }
};
export const getSucursalHistorico = async (
  sucursalId: number,
  from: Date | null,
  to: Date | null,
  tz: string = "-06:00"
) => {
  try {
    const res = await axios.get(
      `${API_URL}/resumenes-admin/historico-sucursal`,
      {
        params: {
          sucursalId,
          from: from ? from.toISOString() : undefined,
          to: to ? to.toISOString() : undefined,
          tz,
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error(error);
    throw new Error(getApiErrorMessageAxios(error));
  }
};

export const getHistoricoGlobal = async (
  from: string | null,
  to: string | null,
  tz: string = "-06:00"
) => {
  try {
    const res = await axios.get(`${API_URL}/resumenes-admin/historico-global`, {
      params: {
        from: from ? from : undefined,
        to: to ? to : undefined,
        tz,
      },
    });
    return res.data;
  } catch (error) {
    console.error(error);
    throw new Error(getApiErrorMessageAxios(error));
  }
};
