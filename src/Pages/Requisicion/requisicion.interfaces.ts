/** Estados válidos según tu enum de Prisma */
export type RequisitionEstado =
  | "BORRADOR"
  | "PENDIENTE"
  | "APROBADA"
  | "ENVIADA"
  | "RECIBIDA"
  | "COMPLETADA"
  | "CANCELADA"
  | "ENVIADA_COMPRAS";

/* ---- resúmenes anidados ---- */
export interface ProductoResumen {
  id: number;
  codigoProducto: string;
  nombre: string;
  precioCostoActual: number;
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

  cantidadRecibida?: number;

  fechaExpiracion?: Date | null;
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

  ingresadaAStock: boolean;
  /* relaciones embebidas */
  usuario: UsuarioResumen;
  sucursal: SucursalResumen;
  lineas: RequisitionLine[];
}
//DTO PARA LA GENERACION DE RE-INGRESO
export interface CreateRequisicionRecepcionLinea {
  requisicionLineaId: number; // referencia a la línea original (para trazabilidad)
  cantidadSolicitada: number; // cantidad que se solicitó
  cantidadRecibida: number; // cantidad que realmente se recibió
  ingresadaAStock?: boolean; // si ya se ingresó al stock (opcional)
  productoId: number;

  fechaIngreso?: string; // opcional
  fechaVencimiento?: string; // opcional
  precioUnitario: number;
  fechaExpiracion?: Date | null;
}

export interface CreateRequisicionRecepcion {
  requisicionId: number; // id de la requisición que se está recibiendo
  usuarioId: number; // id del usuario que hace la recepción
  observaciones?: string; // notas opcionales
  lineas: CreateRequisicionRecepcionLinea[]; // array de líneas

  sucursalId: number; // para trackeo
  proveedorId: number; // para generar entrega stock
}

// Para cuando la requisición está en curso o pendiente
interface PendingRequisition extends RequisitionResponse {
  estado: "BORRADOR" | "PENDIENTE" | "APROBADA" | "ENVIADA";
}

// Para cuando ya se ha recibido/completado
interface FinishedRequisition extends RequisitionResponse {
  estado: "RECIBIDA" | "COMPLETADA";
  fechaRecepcion: string; // lo que guarde tu DB
  recepcionLineas: RequisitionLine[];
}

export type RequisitionPrintable = PendingRequisition | FinishedRequisition;

export interface RequestRequisitionOrFinished extends RequisitionResponse {}
