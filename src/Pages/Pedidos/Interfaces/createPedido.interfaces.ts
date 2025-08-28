export enum PedidoPrioridad {
  ALTA = "ALTA",
  BAJA = "BAJA",
  MEDIA = "MEDIA",
}

export enum TipoPedido {
  INTERNO = "INTERNO",
  CLIENTE = "CLIENTE", // 👈 corregido
}
// --- Interfaces ---
export interface PedidoLinea {
  productoId: number;
  cantidad: number;
  notas?: string | null; // <- ahora acepta null
  precioCostoActual: number;
}

export type PedidoLineaUI = PedidoLinea & {
  showNota?: boolean; // flag de UI, no viaja al backend
};

export interface PedidoCreate {
  sucursalId: number | null;
  clienteId: number | null;
  usuarioId: number;
  observaciones?: string; // opcional
  lineas: PedidoLineaUI[];
  prioridad: PedidoPrioridad;
  tipo: TipoPedido;
}
