import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

export const getHistorialStockRequisiciones = async (
  page: number,
  pageSize: number
) => {
  return axios.get(
    `${API_URL}/historial-stock/requisiciones?page=${page}&pageSize=${pageSize}`
  );
};
