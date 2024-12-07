interface Cliente {
  id: number;
  nombre: string;
  telefono: string;
  dpi: string;
  direccion: string;
}

interface Usuario {
  id: number;
  nombre: string;
  rol: string;
}

interface Producto {
  id: number;
  nombre: string;
  codigoProducto: string;
  descripcion: string;
}

interface Sucursal {
  id: number;
  nombre: string;
  direccion: string;
}

interface RegistroReparacion {
  id: number;
  estado: string;
  accionesRealizadas: string;
  comentarioFinal: string; // Campo adicional para el comentario final
  fechaRegistro: string;
  montoPagado: number; // Campo adicional para el monto pagado
  usuario: Usuario;
}

export interface Reparacion {
  id: number;
  usuarioId: number;
  sucursalId: number;
  clienteId: number;
  productoId: number | null;
  productoExterno: string | null;
  problemas: string;
  observaciones: string | null;
  fechaRecibido: string;
  fechaEntregado: string | null;
  estado: string;
  hojaSolucion: string | null;
  creadoEn: string;
  actualizadoEn: string;
  cliente: Cliente;
  usuario: Usuario;
  producto: Producto | null;
  sucursal: Sucursal;
  registros: RegistroReparacion[]; // Lista de registros relacionados
}
