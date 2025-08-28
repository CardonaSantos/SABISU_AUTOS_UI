import axios from "axios";
import qs from "qs";
import {
  FlujoEfectivoResponseUI,
  SucursalOption,
} from "../Interface/flujoEfectivo";

const API_URL = import.meta.env.VITE_API_URL;

export async function getFlujoEfectivo(params: {
  from: string; // YYYY-MM-DD (TZ GT)
  to: string; // YYYY-MM-DD (TZ GT)
  sucursalId?: number | null;
}): Promise<FlujoEfectivoResponseUI> {
  const url = `${API_URL}/caja-administrativo/flujo-efectivo`;
  const { data } = await axios.get<FlujoEfectivoResponseUI>(url, {
    params: {
      from: params.from,
      to: params.to,
      sucursalId: params.sucursalId ?? undefined,
    },
    paramsSerializer: (p) => qs.stringify(p),
  });
  return data;
}

export async function getSucursalesOptions(): Promise<SucursalOption[]> {
  const url = `${API_URL}/sucursales/to-select`;
  const { data } = await axios.get<Array<{ id: number; nombre: string }>>(url);
  return data.map((s) => ({ value: s.id, label: s.nombre }));
}
