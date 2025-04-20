/**
 * Tipos centralizados para el módulo de Servicios CRM
 */

// Estado del servicio
export type EstadoServicio = "ACTIVO" | "INACTIVO";

// Interfaz para un tipo de servicio
export interface TipoServicio {
  id: number;
  nombre: string;
  descripcion: string;
  estado: EstadoServicio;
  creadoEn: string;
  actualizadoEn: string;
}

// Interfaz para un servicio existente
export interface Servicio {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  estado: EstadoServicio;
  tipoServicioId: number;
  empresaId: number;
  creadoEn: string;
  actualizadoEn: string;
  clientesCount?: number; // Campo opcional para mostrar clientes vinculados
}

// Interfaz para crear un nuevo servicio
export interface NuevoServicio {
  id?: number; // Opcional para cuando se edita un servicio existente
  nombre: string;
  descripcion: string;
  precio: number;
  estado: EstadoServicio;
  tipoServicioId: string | null;
  empresaId: number;
}

// Interfaz para crear un nuevo tipo de servicio
export interface NuevoTipoServicio {
  nombre: string;
  descripcion: string;
  estado: EstadoServicio;
}

// Interfaz para las opciones de select
export interface OptionSelected {
  value: string;
  label: string;
}

// Función auxiliar para formatear moneda
export const formatearMoneda = (monto: number): string => {
  return currency(monto, {
    symbol: "Q",
    separator: ",",
    decimal: ".",
    precision: 2,
  }).format();
};

// Importación necesaria para la función formatearMoneda
import currency from "currency.js";
