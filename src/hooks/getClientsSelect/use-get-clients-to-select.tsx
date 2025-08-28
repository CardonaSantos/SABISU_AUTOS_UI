// hooks/getClientsSelect/use-get-clients-to-select.ts
import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { ClientesParams, clientesSelectQueryOptions } from "./Queries/clientes";

type UseClientesSelectOpts = {
  enabled?: boolean;
  onError?: (e: unknown) => void; // <-- tu callback opcional
};

export function useClientesSelect(
  params: ClientesParams = {},
  opts?: UseClientesSelectOpts
) {
  const q = useQuery({
    ...clientesSelectQueryOptions(params),
    enabled: opts?.enabled ?? true,
    // ❌ no pongas onError aquí: v5 no lo acepta
  });

  // Evita toasts duplicados en StrictMode (dev)
  const lastErrorMsgRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (q.isError) {
      const msg = (q.error as Error | undefined)?.message;
      if (opts?.onError && msg !== lastErrorMsgRef.current) {
        opts.onError(q.error);
        lastErrorMsgRef.current = msg;
      }
    }
  }, [q.isError, q.error, opts]);

  return q;
}

export default useClientesSelect;
