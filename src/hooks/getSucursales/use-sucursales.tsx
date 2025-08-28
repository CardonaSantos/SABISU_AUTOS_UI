// /hooks/use-sucursales.ts
import { useQuery } from "@tanstack/react-query";
import { sucursalesQueryOptions } from "./Queries/sucursales";

export default function useGetSucursales() {
  return useQuery(sucursalesQueryOptions());
}
