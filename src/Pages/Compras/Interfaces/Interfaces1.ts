// types/responses.ts
export interface CompraDetalleUI {
  id: number;
  cantidad: number;
  costoUnitario: number;
  subtotal: number;
  creadoEn: string | null;
  actualizadoEn: string | null;
  producto: {
    id: number | null;
    nombre: string;
    codigo: string;
    precioCostoActual: number | null;
  };
}

export interface CompraFacturaUI {
  numero: string | null;
  fecha: string | null;
}

export interface CompraProveedorUI {
  id: number | null;
  nombre: string;
}

export interface CompraUsuarioUI {
  id: number | null;
  nombre: string;
  correo: string;
}

export interface CompraRequisicionUI {
  id: number;
  folio: string;
  estado: string;
  fecha: string | null;
  totalLineas: number;
  usuario: CompraUsuarioUI;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface CompraResumenUI {
  items: number;
  cantidadTotal: number;
  subtotal: number;
}

export interface CompraListItem {
  id: number;
  estado: "RECIBIDO" | "CANCELADO" | "RECIBIDO_PARCIAL" | "ESPERANDO_ENTREGA";
  total: number;
  fecha: string | null;
  conFactura: boolean;
  proveedor: CompraProveedorUI | null;
  factura: CompraFacturaUI | null;
  usuario: CompraUsuarioUI;
  requisicion: CompraRequisicionUI | null;
  creadoEn: string | null;
  actualizadoEn: string | null;
  detalles: CompraDetalleUI[];
  resumen: CompraResumenUI;
}

export interface PaginatedComprasResponse {
  total: number;
  page: number;
  limit: number;
  pages: number;
  items: CompraListItem[];
}
