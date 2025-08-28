import { ProductoToPedidoList } from "@/Pages/Pedidos/Interfaces/productsList.interfaces";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL; // p.ej. http://localhost:3000

type ProductsResponse = {
  data: ProductoToPedidoList[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
};

export function useProductosToPedidos(params: {
  page: number;
  pageSize: number;
  search?: string;
}) {
  return useQuery<ProductsResponse>({
    queryKey: ["productos-to-pedidos", params],
    queryFn: async () => {
      const { data } = await axios.get<ProductsResponse>(
        `${API_URL}/pedidos/productos-to-pedido`,
        {
          params: {
            page: params.page,
            pageSize: params.pageSize,
            search: params.search, // ✅ aquí el fix
          },
        }
      );
      return data;
    },
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
  });
}
