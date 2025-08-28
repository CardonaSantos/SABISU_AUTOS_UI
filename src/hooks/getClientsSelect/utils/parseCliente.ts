import { ClienteToSelect, ClienteToSelectApi } from "../clientes-interfaces";

export function parseCliente(api: ClienteToSelectApi): ClienteToSelect {
  return {
    ...api,
    creadoEn: new Date(api.creadoEn),
    actualizadoEn: new Date(api.actualizadoEn),
  };
}
