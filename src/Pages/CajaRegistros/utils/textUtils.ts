export const truncateText = (text: string, maxLength: number = 20): string => {
  if (!text) return "—";
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("es-GT", {
    style: "currency",
    currency: "GTQ",
  }).format(amount);
};
