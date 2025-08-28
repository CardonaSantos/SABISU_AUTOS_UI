import axios from "axios";
import qs from "qs";
import { CostosVentaHistoricoResponse } from "../costoVentasHistoricosTypes";
import { SucursalOption } from "../../interfaces/FlujoCajaHsitoricoTypes";

const API_URL = import.meta.env.VITE_API_URL;

/**
 * GET histórico de costos de venta
 * Ajusta la ruta si tu backend usa otra.
 * Ejemplo esperado en el backend: GET /caja-administrativo/costos-venta/historico?from&to&sucursalId
 */
export async function getCostosVentaHistorico(params: {
  from: string; // ISO startOfDay
  to: string; // ISO endOfDay
  sucursalId?: number | null;
}): Promise<CostosVentaHistoricoResponse> {
  const url = `${API_URL}/caja-administrativo/costos-venta-historico`;
  const { data } = await axios.get<CostosVentaHistoricoResponse>(url, {
    params: {
      from: params.from,
      to: params.to,
      sucursalId: params.sucursalId ?? undefined,
    },
    paramsSerializer: (p) => qs.stringify(p),
  });
  return data;
}

// (Reutilizable) obtener sucursales para el selector. Ajusta endpoint según tu API real.
export async function getSucursalesOptions(): Promise<SucursalOption[]> {
  const url = `${API_URL}/sucursales/to-select`;
  const { data } = await axios.get<Array<{ id: number; nombre: string }>>(url);
  return data.map((s) => ({ value: s.id, label: s.nombre }));
}
