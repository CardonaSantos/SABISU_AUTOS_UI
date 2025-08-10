// Este archivo ya existe en el proyecto por defecto de v0.
// Solo se añade la función formatearFecha.
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import dayjs from "dayjs";
import "dayjs/locale/es";
import utc from "dayjs/plugin/utc";
import localizedFormat from "dayjs/plugin/localizedFormat";

dayjs.extend(utc);
dayjs.extend(localizedFormat);
dayjs.locale("es");

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatearFecha = (fecha: string | Date) => {
  // Formateo en UTC sin conversión a local
  return dayjs(fecha).format("DD/MM/YYYY hh:mm A");
};
