export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  codigoProducto: string;
  creadoEn: string;
  actualizadoEn: string;
  precioCostoActual: number;
}

export interface Cliente {
  id: number;
  nombre: string;
  telefono: string;
  direccion: string;
  creadoEn: string;
  actualizadoEn: string;
  municipioId: number | null;
  departamentoId: number | null;
  dpi: string;
}

export interface ProveedoresResponse {
  id: number;
  nombre: string;
}

export interface GarantiaFormData {
  clienteId: number | null;
  sucursalId: number;
  productoId: number | null;
  proveedorId: number | null;
  comentario: string;
  descripcionProblema: string;
  usuarioIdRecibe: number | null;
  estado: "" | "ENVIADO_A_PROVEEDOR" | "EN_REPARACION";
  ventaId: number | null;
  cantidad: number;
  cantidadDevuelta?: number;
  ventaProductoID: number;
}

export interface RegistroGarantia {
  id: number;
  estado: string;
  fechaRegistro: string;
  conclusion: string;
  accionesRealizadas: string;
  garantia: {
    id: number;
    cliente: Cliente;
  };
  producto: Producto;
  usuario: {
    nombre: string;
    sucursal: {
      nombre: string;
      direccion: string;
    };
  };
}

export interface OptionType {
  label: string;
  value: number;
}
