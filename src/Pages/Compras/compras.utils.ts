import { format } from "date-fns";
import { es } from "date-fns/locale";

export function formatFechaWithMinutes(fecha: string | null): string {
  if (!fecha) return "—";
  try {
    const date = new Date(fecha);
    return format(date, "dd/MM/yyyy HH:mm", { locale: es });
  } catch {
    return "—";
  }
}

export function formatMonedaGT(amount: number | null): string {
  if (amount === null || amount === undefined) return "Q 0.00";
  return new Intl.NumberFormat("es-GT", {
    style: "currency",
    currency: "GTQ",
    minimumFractionDigits: 2,
  }).format(amount);
}

export function getEstadoStyles(estado: string): string {
  const styles = {
    RECIBIDO:
      "text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/20",
    CANCELADO: "text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/20",
    RECIBIDO_PARCIAL:
      "text-yellow-600 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-900/20",
    ESPERANDO_ENTREGA:
      "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20",
  };
  return styles[estado as keyof typeof styles] || "text-gray-600 bg-gray-50";
}

export function getEstadoIcon(estado: string): string {
  const icons = {
    RECIBIDO: "✅",
    CANCELADO: "❌",
    RECIBIDO_PARCIAL: "⚠️",
    ESPERANDO_ENTREGA: "⏳",
  };
  return icons[estado as keyof typeof icons] || "📦";
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}
