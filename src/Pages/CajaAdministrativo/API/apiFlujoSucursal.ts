import axios from "axios";
import qs from "qs";
import {
  FlujoCajaGlobalUI,
  FlujoCajaSucursalUI,
  SucursalOption,
} from "../interfaces/FlujoCajaHsitoricoTypes";

const API_URL = import.meta.env.VITE_API_URL;

export async function getFlujoSucursal(params: {
  sucursalId: number;
  from: string; // ISO
  to: string; // ISO
}): Promise<FlujoCajaSucursalUI> {
  const url = `${API_URL}/caja-administrativo/sucursal/${params.sucursalId}`;
  const { data } = await axios.get<FlujoCajaSucursalUI>(url, {
    params: { from: params.from, to: params.to },
    paramsSerializer: (p) => qs.stringify(p),
  });
  return data;
}

export async function getFlujoGlobal(params: {
  from: string; // ISO
  to: string; // ISO
}): Promise<FlujoCajaGlobalUI> {
  const url = `${API_URL}/caja-administrativo/global`;
  const { data } = await axios.get<FlujoCajaGlobalUI>(url, {
    params: { from: params.from, to: params.to },
    paramsSerializer: (p) => qs.stringify(p),
  });
  // Normalizamos fecha a string ISO para charts/tabla
  return (data ?? []).map((r) => ({
    ...r,
    fecha: new Date(r.fecha).toISOString(),
  }));
}

// (Opcional) obtener sucursales para el selector. Ajusta endpoint según tu API real.
export async function getSucursalesOptions(): Promise<SucursalOption[]> {
  const url = `${API_URL}/sucursales/to-select`;
  const { data } = await axios.get<Array<{ id: number; nombre: string }>>(url);
  return data.map((s) => ({ value: s.id, label: s.nombre }));
}
