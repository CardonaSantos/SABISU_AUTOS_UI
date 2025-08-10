import type React from "react";
import type { LucideIcon } from "lucide-react";

export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  codigoProducto: string;
}

export interface Usuario {
  id: number;
  nombre: string;
  rol: string;
  sucursal: { nombre: string };
}

export enum EstadoPrecio {
  APROBADO = "APROBADO",
  PENDIENTE = "PENDIENTE",
  RECHAZADO = "RECHAZADO",
}

export interface Solicitud {
  id: number;
  productoId: number;
  precioSolicitado: number;
  solicitadoPorId: number;
  estado: EstadoPrecio;
  aprobadoPorId: number | null;
  fechaSolicitud: string;
  fechaRespuesta: string | null;
  producto: Producto;
  solicitadoPor: Usuario;
}

export enum EstadoSolicitudTransferencia {
  PENDIENTE = "PENDIENTE",
  APROBADO = "APROBADO",
  RECHAZADO = "RECHAZADO",
}

export interface SucursalDestino {
  nombre: string;
}

export interface SucursalOrigen {
  nombre: string;
}

export enum Rol {
  ADMIN = "ADMIN",
  MANAGER = "MANAGER",
  VENDEDOR = "VENDEDOR",
  SUPER_ADMIN = "SUPER_ADMIN",
}

export interface UsuarioSolicitante {
  rol: Rol;
  nombre: string;
}

export interface SolicitudTransferencia {
  id: number;
  productoId: number;
  producto: { nombre: string };
  sucursalDestino: SucursalDestino;
  sucursalOrigen: SucursalOrigen;
  usuarioSolicitante: UsuarioSolicitante;
  cantidad: number;
  sucursalOrigenId: number;
  sucursalDestinoId: number;
  usuarioSolicitanteId: number | null;
  estado: EstadoSolicitudTransferencia;
  fechaSolicitud: string;
  fechaAprobacion: string | null;
  administradorId: number | null;
}

export interface VentasSemanalChart {
  dia: string;
  totalVenta: number;
  ventas: number;
  fecha: string;
}

export interface MasVendidos {
  id: number;
  nombre: string;
  totalVentas: number;
}

export interface VentaReciente {
  id: number;
  fechaVenta: string;
  totalVenta: number;
  sucursal: {
    id: number;
    nombre: string;
  };
}

export interface DailyMoney {
  totalDeHoy: number;
}

export interface Cuotas {
  id: number;
  monto: number;
  fechaVencimiento: string;
  fechaPago: string;
  creadoEn: string;
}

export interface CreditoRegistro {
  id: number;
  montoTotalConInteres: number;
  totalPagado: number;
  cuotaInicial: number;
  cuotasTotales: number;
  fechaInicio: string;
  fechaContrato: string;
  diasEntrePagos: number;
  estado: string;
  cliente: { nombre: string };
  cuotas: Cuotas[];
}

export interface Reparacion {
  id: number;
  estado: string;
  problemas: string;
  observaciones: string | null;
  fechaRecibido: string;
  producto: { nombre: string } | null;
  productoExterno: string | null;
  cliente: { nombre: string };
  sucursal: { nombre: string };
  usuario: { nombre: string };
}

export interface GarantiaType {
  id: number;
  estado: EstadoGarantia;
  comentario: string;
  descripcionProblema: string;
  fechaRecepcion: string;
  productoId: number;
  cliente: {
    nombre: string;
    telefono: string;
    direccion: string;
    dpi: string;
  };
  producto: {
    nombre: string;
    descripcion: string;
  };
  proveedor: {
    nombre: string;
    telefono: string;
    telefonoContacto: string;
  } | null;
  usuarioRecibe: {
    nombre: string;
    rol: string;
    sucursal: { nombre: string };
  };
  creadoEn: string;
  actualizadoEn: string;
}

export enum EstadoGarantia {
  RECIBIDO = "RECIBIDO",
  ENVIADO_A_PROVEEDOR = "ENVIADO_A_PROVEEDOR",
  EN_REPARACION = "EN_REPARACION",
  REPARADO = "REPARADO",
  REEMPLAZADO = "REEMPLAZADO",
  CERRADO = "CERRADO",
}

export enum EstadoPago {
  PAGADA = "PAGADA",
  ATRASADA = "ATRASADA",
}

export enum EstadoCierre {
  CANCELADA = "CANCELADA",
  COMPLETADA = "COMPLETADA",
}

export interface AlertPaymentResult {
  message: string;
  type: "danger" | "warning" | "info" | "default" | "error";
  className: string;
  icon: React.ReactNode;
}

export interface FormCloseRegist {
  comentarioFinal: string;
  accionesRealizadas: string;
  estado: string;
  montoPagado: number;
}

export interface MenuItem {
  title: string;
  url: string;
  icon: LucideIcon;
}
