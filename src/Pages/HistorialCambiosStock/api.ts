import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

//Para historial de stock en base a requisiciones
export const getHistorialStockRequisiciones = async (
  page: number,
  pageSize: number
) => {
  return axios.get(
    `${API_URL}/historial-stock/requisiciones?page=${page}&pageSize=${pageSize}`
  );
};

// Para historial de Stock en Ventas
export const getHistorialStockVentas = async (
  page: number,
  pageSize: number
) => {
  return axios.get(
    `${API_URL}/historial-stock/salida-ventas?page=${page}&pageSize=${pageSize}`
  );
};

// Para historial de ajustes stocks en Ventas
export const getHistorialAjusteStock = async (
  page: number,
  pageSize: number
) => {
  return axios.get(
    `${API_URL}/historial-stock/ajuste-stocks?page=${page}&pageSize=${pageSize}`
  );
};

// Para historial de eliminacion de stocks
export const getHistorialStockEliminacion = async (
  page: number,
  pageSize: number
) => {
  return axios.get(
    `${API_URL}/historial-stock/eliminacion-stock?page=${page}&pageSize=${pageSize}`
  );
};

// Para historial de eliminacion de stocks
export const getHistorialStockVentaEliminada = async (
  page: number,
  pageSize: number
) => {
  return axios.get(
    `${API_URL}/historial-stock/venta-eliminada?page=${page}&pageSize=${pageSize}`
  );
};
// Para historial de transferencias stock entre sucursales
export const getTransferenciaStockTracker = async (
  page: number,
  pageSize: number
) => {
  return axios.get(
    `${API_URL}/historial-stock/transferencia-stock?page=${page}&pageSize=${pageSize}`
  );
};
// Para historiasl de entregas de stock manuales

export const getEntregasStockTracker = async (
  page: number,
  pageSize: number
) => {
  return axios.get(
    `${API_URL}/historial-stock/entregas-stock?page=${page}&pageSize=${pageSize}`
  );
};

//Para historial de stock en base a requisiciones
export const getHistorialStockGarantias = async (
  page: number,
  pageSize: number
) => {
  return axios.get(
    `${API_URL}/historial-stock/garantias-stock?page=${page}&pageSize=${pageSize}`
  );
};
