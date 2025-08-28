// queries/clientes.ts
import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import { parseCliente } from "../utils/parseCliente";
import { ClienteToSelect, ClienteToSelectApi } from "../clientes-interfaces";
import { axiosClient } from "./axiosClient";

export type ClientesParams = {
  search?: string;
  page?: number;
  pageSize?: number;
};

export const clientesKey = {
  all: ["clientes"] as const,
  select: (params: ClientesParams = {}) =>
    ["clientes", "select", params] as const,
};

export const clientesSelectQueryOptions = (params: ClientesParams = {}) =>
  queryOptions({
    queryKey: clientesKey.select(params),
    queryFn: async ({ signal }): Promise<ClienteToSelect[]> => {
      console.info("🔎 useClientesSelect → params:", params);
      const { data } = await axiosClient.get<ClienteToSelectApi[]>(
        "/client/clientes-to-select",
        {
          signal,
          params: {
            q: params.search,
            page: params.page,
            pageSize: params.pageSize,
          },
        }
      );
      return data.map(parseCliente);
    },
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: false, // 🔕 desactiva retries mientras depuras
  });
