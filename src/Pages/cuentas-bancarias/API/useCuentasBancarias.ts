// Pages/CuentasBancarias/API/useCuentasBancarias.ts
import { useQueryClient } from "@tanstack/react-query";
import { keepPreviousData } from "@tanstack/react-query";
import {
  useApiQuery,
  useApiMutation,
} from "@/hooks/genericoCall/genericoCallHook";
import { toast } from "sonner";
import {
  CuentasResponse,
  CuentaCreatePayload,
  CuentaUpdatePayload,
} from "../Interfaces/CuentaBancariaResumen";

const KEY = (params: any) => ["cuentas-bancarias-resumen", params] as const;

export function useCuentasBancarias(params: {
  page: number;
  limit: number;
  search: string;
  incluirInactivas: boolean;
}) {
  return useApiQuery<CuentasResponse>(
    KEY(params) as unknown as (string | number)[],
    "/cuentas-bancarias/resumen-page",
    { params },
    { placeholderData: keepPreviousData } // v5
  );
}

export function useCuentaBancariaMutations(paramsForInvalidate: {
  page: number;
  limit: number;
  search: string;
  incluirInactivas: boolean;
}) {
  const qc = useQueryClient();
  const invalidate = () =>
    qc.invalidateQueries({ queryKey: KEY(paramsForInvalidate) });

  // POST /cuentas-bancarias
  const crear = useApiMutation<any, CuentaCreatePayload>(
    "post",
    "/cuentas-bancarias",
    undefined,
    {
      onSuccess: () => {
        toast.success("Cuenta creada");
        invalidate();
      },
    }
  );

  // Para las siguientes, el endpoint depende del id.
  // Creamos "factories" que retornan el mutation listo con el endpoint final.

  const actualizarFactory = (id: number) =>
    useApiMutation<any, CuentaUpdatePayload>(
      "patch",
      `/cuentas-bancarias/${id}`,
      undefined,
      {
        onSuccess: () => {
          toast.success("Cuenta actualizada");
          invalidate();
        },
      }
    );

  const activarFactory = (id: number) =>
    useApiMutation<any, void>(
      "patch",
      `/cuentas-bancarias/${id}/activar`,
      undefined,
      {
        onSuccess: () => {
          toast.success("Cuenta activada");
          invalidate();
        },
      }
    );

  const desactivarFactory = (id: number) =>
    useApiMutation<any, void>(
      "patch",
      `/cuentas-bancarias/${id}/desactivar`,
      undefined,
      {
        onSuccess: () => {
          toast.success("Cuenta desactivada");
          invalidate();
        },
      }
    );

  const eliminarFactory = (id: number) =>
    useApiMutation<any, void>("delete", `/cuentas-bancarias/${id}`, undefined, {
      onSuccess: () => {
        toast.success("Cuenta eliminada");
        invalidate();
      },
    });

  return {
    crear,
    actualizarFactory,
    activarFactory,
    desactivarFactory,
    eliminarFactory,
  };
}
