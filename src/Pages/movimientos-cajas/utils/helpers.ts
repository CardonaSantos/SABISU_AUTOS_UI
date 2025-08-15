export const formattFechaWithMinutes = (fecha: string): string => {
  const date = new Date(fecha);
  return date.toLocaleString("es-GT", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formattMonedaGT = (amount: number): string => {
  return new Intl.NumberFormat("es-GT", {
    style: "currency",
    currency: "GTQ",
  }).format(amount);
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

export const getEstadoIcon = (estado: string): string => {
  switch (estado.toLowerCase()) {
    case "abierto":
    case "arqueo":
      return "🔵";
    case "cerrado":
      return "⚫";
    default:
      return "⚪";
  }
};

export const getEstadoStyles = (estado: string): string => {
  switch (estado.toLowerCase()) {
    case "abierto":
    case "arqueo":
      return "text-blue-600 dark:text-blue-400 font-medium";
    case "cerrado":
      return "text-gray-600 dark:text-gray-400 font-medium";
    default:
      return "text-muted-foreground font-medium";
  }
};
