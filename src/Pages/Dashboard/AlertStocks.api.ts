// src/api/AlertStocks.api.ts
import axios from "axios";
import { StockAlert } from "./AlertStocks.utils";

const API_URL = import.meta.env.VITE_API_URL;

export const getAlertsStocks = (userId: number): Promise<StockAlert[]> => {
  return axios
    .get<StockAlert[]>(
      `${API_URL}/minimun-stock-alert/get-all-minimum-stocks-alert/${userId}`
    )
    .then((res) => res.data);
};

export const deleteAlertStock = (alertId: number): Promise<void> => {
  return axios
    .delete(`${API_URL}/minimun-stock-alert/${alertId}`)
    .then(() => {});
};

export const markAlertAsRead = (alertId: number): Promise<void> => {
  return axios
    .patch(`${API_URL}/minimun-stock-alert/${alertId}`, { estado: "LEIDO" })
    .then(() => {});
};
