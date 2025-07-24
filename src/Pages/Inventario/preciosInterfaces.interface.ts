export interface PrecioProducto {
  precio: string;
  orden: number;
  rol: RolPrecio;
}

export enum RolPrecio {
  PUBLICO = "PUBLICO",
  MAYORISTA = "MAYORISTA",
  ESPECIAL = "ESPECIAL",
  DISTRIBUIDOR = "DISTRIBUIDOR",
}

export enum TipoPrecio {
  CREADO_POR_SOLICITUD = "CREADO_POR_SOLICITUD",
  ESTANDAR = "ESTANDAR",
}
