export type MetodoPago = "CONTADO" | "TARJETA" | "TRANSFERENCIA";
export type TipoComprobante = "RECIBO" | "FACTURA";

export interface Cliente {
  id: number | null;
  nombre: string;
}

export interface Usuario {
  id: number;
  nombre: string;
  rol: string;
  correo: string;
}

export interface Sucursal {
  id: number;
  nombre: string;
  direccion: string;
}

export interface Producto {
  id: number;
  nombre: string;
  descripcion: string | null;
  codigoProducto: string;
}

export interface ProductoVenta {
  id: number;
  cantidad: number;
  precioVenta: number;
  producto: Producto;
  estado: EstadoDetalleVenta;
}

export enum EstadoDetalleVenta {
  VENDIDO = "VENDIDO",
  PARCIAL_GARANTIA = "PARCIAL_GARANTIA",
  ANULADO = "ANULADO",
  REEMPLAZADO = "REEMPLAZADO=",
  GARANTIA_REPARADO = "GARANTIA_REPARADO",
  REEMBOLSADO = "REEMBOLSADO ",
}

export interface VentaHistorialItem {
  id: number;
  imei: string;
  fechaVenta: string; // ISO
  metodoPago: MetodoPago;
  referenciaPago: string | null;
  tipoComprobante: TipoComprobante;
  cliente: Cliente;
  usuario: Usuario;
  sucursal: Sucursal;
  productos: ProductoVenta[];
}

export interface ProductoVentaToTable {
  id: number;
  cantidad: number;
  precioVenta: number;
  producto: {
    id: number;
    nombre: string;
    descripcion: string | null;
    codigoProducto: string;
  };
}

export type OptionType = { value: number; label: string };

export type VentasHistorial = VentaHistorialItem[];
