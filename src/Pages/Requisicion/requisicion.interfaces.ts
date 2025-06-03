/** Estados válidos según tu enum de Prisma */
export type RequisitionEstado =
  | "BORRADOR"
  | "PENDIENTE"
  | "APROBADA"
  | "ENVIADA"
  | "RECIBIDA"
  | "COMPLETADA"
  | "CANCELADA";

/* ---- resúmenes anidados ---- */
export interface ProductoResumen {
  id: number;
  codigoProducto: string;
  nombre: string;
}

export interface UsuarioResumen {
  id: number;
  nombre: string;
  rol: "ADMIN" | "USER" | "SUPERVISOR" | string; // añade los roles que manejes
}

export interface SucursalResumen {
  id: number;
  nombre: string;
}

/* ---- detalle de cada línea ---- */
export interface RequisitionLine {
  id: number;
  productoId: number;
  cantidadActual: number;
  stockMinimo: number;
  cantidadSugerida: number;
  precioUnitario: number;

  /* opcionales para versiones futuras */
  subtotal?: number; // precioUnitario * cantidadSugerida
  iva?: number; // impuesto calculado
  moneda?: string; // 'GTQ', 'USD', etc.

  createdAt: string; // ISO8601
  updatedAt: string; // ISO8601
  producto: ProductoResumen;
}

/* ---- cabecera de la requisición ---- */
export interface RequisitionResponse {
  id: number;
  folio: string;
  fecha: string; // ISO8601
  sucursalId: number;
  usuarioId: number;
  estado: RequisitionEstado;
  observaciones?: string;

  totalLineas: number;
  totalRequisicion: number; // suma de líneas; incluye o no impuestos según tu lógica
  moneda?: string; // opcional, por si manejas multi-moneda

  createdAt: string; // ISO8601
  updatedAt: string; // ISO8601

  /* relaciones embebidas */
  usuario: UsuarioResumen;
  sucursal: SucursalResumen;
  lineas: RequisitionLine[];
}
