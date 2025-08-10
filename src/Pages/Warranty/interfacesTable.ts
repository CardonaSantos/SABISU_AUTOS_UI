export enum EstadoDetalleVenta {
  VENDIDO = "VENDIDO",
  PARCIAL_GARANTIA = "PARCIAL_GARANTIA",
  ANULADO = "ANULADO",
  REEMPLAZADO = "REEMPLAZADO",
  GARANTIA_REPARADO = "GARANTIA_REPARADO",
  REEMBOLSADO = "REEMBOLSADO",
}

export enum EstadoGarantia {
  RECIBIDO = "",
  DIAGNOSTICO = "DIAGNOSTICO",
  ENVIADO_PROVEEDOR = "ENVIADO_PROVEEDOR",
  EN_REPARACION = "EN_REPARACION",
  REPARADO = "REPARADO",
  REEMPLAZADO = "REEMPLAZADO",
  ENTREGADO_CLIENTE = "ENTREGADO_CLIENTE",
  CERRADO = "CERRADO",
}
export interface RegistroGarantiaDto {
  id: number;
  estado: EstadoGarantia;
  fechaRegistro: string;
  accionesRealizadas?: string;
  conclusion?: string;
  usuario?: { id: number; nombre: string };
}

export interface MovimientoStockDto {
  id: number;
  cantidadAnterior: number;
  cantidadNueva: number;
  fechaCambio: string;
  usuario: { id: number; nombre: string };
}

export interface GarantiaDto {
  id: number;
  ventaId: number;
  venta: { id: number; fechaVenta: string };
  fechaRecepcion: string;
  estado: EstadoGarantia;
  cantidadDevuelta: number;
  cliente: { id: number; nombre: string };
  producto: {
    id: number;
    nombre: string;
    codigo: string;
    descripcion: string | null;
  };
  proveedor?: { id: number; nombre: string };
  usuarioRecibe?: { id: number; nombre: string };
  registros: RegistroGarantiaDto[];
  movimientoStock: MovimientoStockDto[];
}
