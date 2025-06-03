import axios from "axios";
import { CreateRequisitionDto, StockAlertItem } from "./utils";
import { RequisitionResponse } from "./requisicion.interfaces";
const API_URL = import.meta.env.VITE_API_URL;

export const fetchStockAlerts = (sucursalId: number) =>
  axios
    .get<StockAlertItem[]>(`${API_URL}/requisicion/preview`, {
      params: { sucursalId },
    })
    .then((r) => r.data);

export const createRequisition = (dto: CreateRequisitionDto) =>
  axios
    .post<RequisitionResponse>(`${API_URL}/requisicion`, dto)
    .then((r) => r.data);

//get de registros de requisiciones
export const getRequisicionesRegist = async (): Promise<
  RequisitionResponse[]
> => {
  return axios
    .get<RequisitionResponse[]>(`${API_URL}/requisicion`)
    .then((data) => data.data);
};

export const deleteRequisicionRegis = async (id: number): Promise<void> => {
  return axios.delete(`${API_URL}/requisicion/${id}`).then(() => {});
};

export const getOneRequisicion = async (
  id: number
): Promise<RequisitionResponse> => {
  return axios
    .get<RequisitionResponse>(`${API_URL}/requisicion/one-requisicion/${id}`)
    .then((data) => data.data);
};
