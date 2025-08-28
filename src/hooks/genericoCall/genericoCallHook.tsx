// /hooks/useApi.ts
import axios, { AxiosRequestConfig } from "axios";
import {
  useMutation,
  useQuery,
  UseMutationOptions,
  UseQueryOptions,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { getApiErrorMessageAxios } from "@/Pages/Utils/UtilsErrorApi";

const API_URL = import.meta.env.VITE_API_URL;

// -------- GET (useQuery) ----------
export function useApiQuery<TData>(
  key: (string | number)[],
  endpoint: string,
  config?: AxiosRequestConfig,
  options?: Omit<UseQueryOptions<TData>, "queryKey" | "queryFn">
) {
  return useQuery<TData>({
    queryKey: key,
    queryFn: async () => {
      const { data } = await axios.get<TData>(`${API_URL}/${endpoint}`, config);
      return data;
    },
    ...options,
  });
}

// -------- MUTATION (POST, PUT, DELETE, PATCH) ----------
export function useApiMutation<TData, TVariables = any>(
  method: "post" | "put" | "delete" | "patch",
  endpoint: string,
  config?: AxiosRequestConfig,
  options?: UseMutationOptions<TData, any, TVariables>
) {
  return useMutation<TData, any, TVariables>({
    mutationFn: async (variables: TVariables) => {
      try {
        const url = `${API_URL}/${endpoint}`;
        const { data } = await axios({
          url,
          method,
          data: variables, // para POST/PUT/PATCH se ignora
          ...config,
        });
        return data;
      } catch (err) {
        const msg = getApiErrorMessageAxios(err);
        toast.error(msg);
        throw err;
      }
    },
    ...options,
  });
}
