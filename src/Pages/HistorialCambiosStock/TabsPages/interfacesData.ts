export enum TipoMovimientoStock {
  INGRESO_COMPRA = "INGRESO_COMPRA",
  INGRESO_REQUISICION = "INGRESO_REQUISICION",
  INGRESO_DEVOLUCION_CLIENTE = "INGRESO_DEVOLUCION_CLIENTE",
  INGRESO_TRANSFERENCIA = "INGRESO_TRANSFERENCIA",
  INGRESO_AJUSTE = "INGRESO_AJUSTE",
  SALIDA_VENTA = "SALIDA_VENTA",
  AJUSTE_STOCK = "AJUSTE_STOCK", // nuevo
  ELIMINACION_VENTA = "ELIMINACION_VENTA", // nuevo
  TRANSFERENCIA = "TRANSFERENCIA", // nuevo
  ENTREGA_STOCK = "ENTREGA_STOCK", // nuevo
  SALIDA_DEVOLUCION_PROVEEDOR = "SALIDA_DEVOLUCION_PROVEEDOR",
  SALIDA_AJUSTE = "SALIDA_AJUSTE",
  SALIDA_TRANSFERENCIA = "SALIDA_TRANSFERENCIA",
  SALIDA_REPARACION = "SALIDA_REPARACION",
  ELIMINACION = "ELIMINACION",
  ELIMINACION_STOCK = "ELIMINACION_STOCK",
  INVENTARIO_INICIAL = "INVENTARIO_INICIAL",
  OTRO = "OTRO",
}

//WRAPPER CON GENERICO
export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

//TYPES A USAR:

export type PaginatedRequisiciones =
  PaginatedResponse<HistorialIngresoRequisicion>;

export type PaginatedVentas = PaginatedResponse<HistorialSalidaVenta>;

export type PaginatedAjustesStock = PaginatedResponse<HistorialAjusteStock>;

export type PaginatedEliminacionesStock =
  PaginatedResponse<HistorialEliminacionStock>;

export type PaginatedEliminacionesVenta =
  PaginatedResponse<HistorialEliminacionVenta>;

export type PaginatedTransferenciasProducto =
  PaginatedResponse<HistorialTransferenciaProducto>;

export type PaginatedEntregasStock = PaginatedResponse<HistorialEntregaStock>;

//TYPES A USAR

export interface HistorialStockBase {
  id: number;
  comentario: string | null;
  tipo: TipoMovimientoStock;
  cantidadAnterior: number | null;
  cantidadNueva: number | null;
  fechaCambio: Date;
  usuario: { id: number; nombre: string; rol: string; correo: string };
  sucursal: { id: number; nombre: string; direccion: string };
  producto: {
    id: number;
    nombre: string;
    codigoProducto: string;
    codigoProveedor: string;
    categorias: unknown[];
    descripcion: string | null;
    imagenesProducto: unknown[];
  };
}

// Para el caso de requisición x
export interface HistorialIngresoRequisicion extends HistorialStockBase {
  tipo: TipoMovimientoStock.INGRESO_REQUISICION;
  requisicion: {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    estado: string;
    folio: string;
    fecha: Date;
    fechaRecepcion: Date;
    ingresadaAStock: boolean;
    sucursal: { id: number; nombre: string };
    observaciones: string | null;
    usuario: { id: number; nombre: string; rol: string };
  };
}

// SALIDA VENTA x
export interface HistorialSalidaVenta extends HistorialStockBase {
  tipo: TipoMovimientoStock.SALIDA_VENTA;
  venta: {
    id: number;
    cantidad: number;
    creadoEn: Date;
    precioVenta: number;
    producto: {
      id: number;
      nombre: string;
      codigoProducto: string;
    };
    venta: {
      id: number;
      metodoPago: string;
      cliente: {
        id: number;
        nombre: string;
        telefono: string;
      };
      fechaVenta: Date;
      sucursal: {
        id: number;
        nombre: string;
        direccion: string;
      };
    };
  };
}

//AJUSTE STOCK
export interface HistorialAjusteStock extends HistorialStockBase {
  tipo: TipoMovimientoStock.AJUSTE_STOCK;
  ajusteStock: {
    id: number;
    cantidadAjustada: number;
    descripcion: string | null;
    fechaHora: Date;
    tipoAjuste: string;
    usuario: {
      id: number;
      nombre: string;
      correo: string;
      rol: string;
    };
    stock: {
      id: number;
      fechaIngreso: Date;
      fechaVencimiento: Date | null;
      cantidadInicial: number | null;
      creadoEn: Date;
      actualizadoEn: Date;
    };
  };
}

//ELIMINACION STOCK
export interface HistorialEliminacionStock extends HistorialStockBase {
  tipo: TipoMovimientoStock.ELIMINACION_STOCK;
  eliminacionStock: {
    id: number;
    createdAt: Date;
    producto: {
      id: number;
      nombre: string;
      codigoProducto: string;
      codigoProveedor: string;
      descripcion: string;
    };
    usuario: {
      id: number;
      nombre: string;
      correo: string;
      rol: string;
    };
    sucursal: {
      id: number;
      nombre: string;
      direccion: string;
    };
    cantidadAnterior: number;
    motivo: string;
    stockRestante: number;
    cantidadStockEliminada: number;
  };
}
//ELIMINACION VENTA
export interface HistorialEliminacionVenta extends HistorialStockBase {
  tipo: TipoMovimientoStock.ELIMINACION_VENTA;
  eliminacionVenta: {
    id: number;
    cliente: {
      id: number;
      nombre: string;
    };
    fechaEliminacion: Date;
    sucursal: {
      id: number;
      nombre: string;
      direccion: string;
    };
    motivo: string;
    usuario: {
      id: number;
      nombre: string;
      correo: string;
      rol: string;
    };
  };
}

//TRANSFERENCIA
export interface HistorialTransferenciaProducto extends HistorialStockBase {
  tipo: TipoMovimientoStock.TRANSFERENCIA;
  transferenciaProducto: {
    id: number;
    cantidad: number;
    fechaTransferencia: Date;
    producto: {
      id: number;
      nombre: string;
      codigoProducto: string;
      codigoProveedor: string;
      descripcion: string;
    };
    sucursalDestino: {
      id: number;
      nombre: string;
      direccion: string;
    };
    sucursalOrigen: {
      id: number;
      nombre: string;
      direccion: string;
    };
    usuarioEncargado: {
      id: number;
      nombre: string;
      correo: string;
      rol: string;
    };
  };
}

//ENTREGA STOCK
export interface HistorialEntregaStock extends HistorialStockBase {
  tipo: TipoMovimientoStock.ENTREGA_STOCK;
  entregaStock: {
    id: number;
    fechaEntrega: Date;
    montoTotal: number;
    sucursal: {
      id: number;
      nombre: string;
      direccion: string;
    };
    proveedor: {
      id: number;
      nombre: string;
    };
    usuarioRecibido: {
      id: number;
      nombre: string;
      correo: string;
      rol: string;
    };
  };
}

export type HistorialStockItem =
  | HistorialIngresoRequisicion
  | HistorialSalidaVenta
  | HistorialAjusteStock
  | HistorialEliminacionStock
  | HistorialEliminacionVenta
  | HistorialTransferenciaProducto
  | HistorialEntregaStock;
