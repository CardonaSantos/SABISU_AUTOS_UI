import { cn } from "@/lib/utils";

export enum EstadoTurnoCaja {
  ABIERTO = "ABIERTO",
  CERRADO = "CERRADO",
  ARQUEO = "ARQUEO",
  AJUSTADO = "AJUSTADO",
  ANULADO = "ANULADO",
}

export const getEstadoStyles = (estado: string) => {
  const baseClasses =
    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";

  switch (estado) {
    case EstadoTurnoCaja.ABIERTO:
      return cn(
        baseClasses,
        "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      );
    case EstadoTurnoCaja.CERRADO:
      return cn(
        baseClasses,
        "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
      );
    case EstadoTurnoCaja.ARQUEO:
      return cn(
        baseClasses,
        "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
      );
    case EstadoTurnoCaja.AJUSTADO:
      return cn(
        baseClasses,
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
      );
    case EstadoTurnoCaja.ANULADO:
      return cn(
        baseClasses,
        "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
      );
    default:
      return cn(
        baseClasses,
        "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
      );
  }
};

export const getEstadoIcon = (estado: string) => {
  switch (estado) {
    case EstadoTurnoCaja.ABIERTO:
      return "🟢";
    case EstadoTurnoCaja.CERRADO:
      return "⚫";
    case EstadoTurnoCaja.ARQUEO:
      return "🔵";
    case EstadoTurnoCaja.AJUSTADO:
      return "🟡";
    case EstadoTurnoCaja.ANULADO:
      return "🔴";
    default:
      return "⚪";
  }
};
