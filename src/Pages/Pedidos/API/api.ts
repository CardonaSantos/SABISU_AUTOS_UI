import { getApiErrorMessageAxios } from "@/Pages/Utils/UtilsErrorApi";
import axios from "axios";
import { toast } from "sonner";
import { PedidoCreate, PedidosListResponse } from "../interfaces";
const API_URL = import.meta.env.VITE_API_URL;

export const getProductToList = async () => {
  try {
    const { data } = await axios.get(`${API_URL}/pedidos/productos-to-pedido`);
    return data;
  } catch (error) {
    console.log("El error es: ", error);
    toast.error(getApiErrorMessageAxios(error));
  }
};

//

export async function createPedido(body: PedidoCreate) {
  const { data } = await axios.post(`${API_URL}/pedidos/create-pedido`, body);
  return data;
}

export async function getPedidos(params: {
  page?: number;
  pageSize?: number;
  search?: string;
  estado?: string;
  sucursalId?: number | null;
  clienteId?: number;
  fechaFrom?: string;
  fechaTo?: string;
  sortBy?: string;
  sortDir?: "asc" | "desc";
}) {
  const { data } = await axios.get<PedidosListResponse>(`${API_URL}/pedidos`, {
    params,
  });
  return {
    ...data,
    page: Number(data.page),
    pageSize: Number(data.pageSize),
  };
}

export async function deletePedidoRegist(pedidoID: number) {
  return await axios.delete(
    `${API_URL}/pedido/delete-regist-pedido/${pedidoID}`
  );
}
