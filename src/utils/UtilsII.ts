export const ReplaceUnderlines = (value: string) =>
  value ? value.replace(/_/g, " ") : "";

export enum EstadoDetalleVenta {
  VENDIDO = "VENDIDO",
  PARCIAL_GARANTIA = "PARCIAL_GARANTIA",
  ANULADO = "ANULADO",
  REEMPLAZADO = "REEMPLAZADO=",
  GARANTIA_REPARADO = "GARANTIA_REPARADO",
  REEMBOLSADO = "REEMBOLSADO ",
}

export function getStatusClass(status: EstadoDetalleVenta): string {
  switch (status) {
    case EstadoDetalleVenta.VENDIDO:
      return "text-green-600";
    case EstadoDetalleVenta.PARCIAL_GARANTIA:
      return "text-yellow-600";
    case EstadoDetalleVenta.GARANTIA_REPARADO:
      return "text-teal-600";
    case EstadoDetalleVenta.REEMPLAZADO:
      return "text-blue-600";
    case EstadoDetalleVenta.ANULADO:
      return "text-red-600";
    case EstadoDetalleVenta.REEMBOLSADO:
      return "text-purple-600";
    default:
      return "text-gray-600";
  }
}
