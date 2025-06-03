import axios from "axios";
import { DtoCreateSummary, SalesSummaryResponse, SucursalInfo } from "./utils";

const API_URL = import.meta.env.VITE_API_URL;

export const getSummarySales = (): Promise<SalesSummaryResponse[]> => {
  return axios
    .get<SalesSummaryResponse[]>(`${API_URL}/sales-summary`)
    .then((res) => res.data);
};

export const deleteSummarySales = (id: number): Promise<void> => {
  return axios
    .delete(`${API_URL}/sales-summary/delete-one-summary/${id}`)
    .then(() => {});
};

//PARA INFO ADICIONAL AL CREAR UN RESUMEN
export const getSucursales = (): Promise<SucursalInfo[]> => {
  return axios
    .get<SucursalInfo[]>(`${API_URL}/sucursales`)
    .then((res) => res.data);
};
type Period = "DIARIO" | "SEMANAL" | "MENSUAL";

interface DataAuto {
  periodo: Period;
  sucursalId: number;
  usuarioId: number;
}

export const createSummarySales = async (data: DtoCreateSummary) => {
  return axios
    .post<DtoCreateSummary>(`${API_URL}/sales-summary`, data)
    .then((res) => res.data);
};

export const createAutoSummary = async (
  dto: DataAuto
): Promise<SalesSummaryResponse> => {
  return axios
    .post<SalesSummaryResponse>(`${API_URL}/sales-summary/auto`, dto)
    .then((res) => res.data);
};
