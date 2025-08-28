import { ProveedoresResponse } from "../interfaces/proveedores.interfaces";

export function parseProveedores(api: ProveedoresResponse) {
  return {
    ...api,
    creadoEn: new Date(api.creadoEn),
    actualizadoEn: new Date(api.actualizadoEn),
  };
}
