import { TipoMovimientoStock } from "../interfaces";
import {
  HistorialAjusteStock,
  HistorialEliminacionStock,
  HistorialEliminacionVenta,
  HistorialEntregaStock,
  HistorialIngresoRequisicion,
  HistorialSalidaVenta,
  HistorialTransferenciaProducto,
} from "./interfacesData";

// 1) Un DTO unificado
export interface HistorialStockDTO {
  id: number;
  comentario: string | null;
  tipo: TipoMovimientoStock;
  cantidadAnterior: number | null;
  cantidadNueva: number | null;
  fechaCambio: string; // ISO
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

  // Todas las relaciones posibles, opcionalmente
  requisicion?: HistorialIngresoRequisicion["requisicion"];
  venta?: HistorialSalidaVenta["venta"];
  ajusteStock?: HistorialAjusteStock["ajusteStock"];
  eliminacionStock?: HistorialEliminacionStock["eliminacionStock"];
  eliminacionVenta?: HistorialEliminacionVenta["eliminacionVenta"];
  transferenciaProducto?: HistorialTransferenciaProducto["transferenciaProducto"];
  entregaStock?: HistorialEntregaStock["entregaStock"];
}

// 2) Wrapper genérico de paginación
export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

// 3) Tipo concreto para tu historial
export type PaginatedHistorialStock = PaginatedResponse<HistorialStockDTO>;
