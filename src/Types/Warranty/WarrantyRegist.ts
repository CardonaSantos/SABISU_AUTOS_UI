// Definición de tipos
type Estado = "REPARADO" | "REEMPLAZADO" | "CERRADO";

interface Sucursal {
  id: number;
  nombre: string;
  direccion: string;
}

interface Usuario {
  id: number;
  nombre: string;
  sucursal: Sucursal;
}

interface Cliente {
  id: number;
  nombre: string;
  telefono: string;
  direccion: string;
  dpi: string;
}

interface Garantia {
  id: number;
  fechaRecepcion: string;
  estado: string;
  cliente: Cliente;
}

interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  codigoProducto: string;
}

export interface RegistroGarantia {
  id: number;
  garantiaId: number;
  usuarioId: number;
  productoId: number;
  estado: Estado;
  conclusion: string;
  accionesRealizadas: string;
  fechaRegistro: string;
  producto: Producto;
  usuario: Usuario;
  garantia: Garantia;
}
