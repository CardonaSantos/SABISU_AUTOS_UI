import { Sucursal } from "@/Pages/ResumenesDelDia/types";
import { SucursalApi } from "../Interfaces/interfaces";

// /sucursales/utils/parseSucursal.ts
export function parseSucursal(api: SucursalApi): Sucursal {
  return {
    id: api.id,
    nombre: api.nombre.trim(),
  };
}
