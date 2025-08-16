"use client";

import { useState, useEffect, useCallback } from "react";
import type { ResumenDiarioResponse } from "./types";
import axios, { AxiosError } from "axios";
import qs from "qs";

const API_URL = import.meta.env.VITE_API_URL;

interface UseResumenDiarioParams {
  fecha: string;
  sucursalId?: number;
}

interface UseResumenDiarioReturn {
  data: ResumenDiarioResponse | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const api = axios.create({
  baseURL: API_URL, // asegúrate de tenerlo definido en tu entorno
  paramsSerializer: (params) =>
    qs.stringify(params, {
      skipNulls: true, // no envía claves con null/undefined
      arrayFormat: "repeat", // param=a&param=b (por si luego mandas arrays)
    }),
});

export function useResumenDiario({
  fecha,
  sucursalId,
}: UseResumenDiarioParams): UseResumenDiarioReturn {
  const [data, setData] = useState<ResumenDiarioResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(
    async (signal?: AbortSignal) => {
      try {
        setLoading(true);
        setError(null);

        const { data } = await api.get<ResumenDiarioResponse>(
          "/resumen-dia/resumen",
          {
            params: { fecha, sucursalId },
            signal,
          }
        );

        setData(data);
      } catch (err) {
        // Ignora cancelaciones
        if (
          axios.isCancel(err) ||
          (axios.isAxiosError(err) && err.code === "ERR_CANCELED")
        ) {
          return;
        }

        const axErr = err as AxiosError<any>;
        const msg =
          axErr.response?.data?.message ?? axErr.message ?? "Error desconocido";
        setError(msg);
      } finally {
        setLoading(false);
      }
    },
    [fecha, sucursalId]
  );

  useEffect(() => {
    const controller = new AbortController();
    fetchData(controller.signal);
    return () => controller.abort();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch: () => fetchData(),
  };
}
