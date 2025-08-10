export interface RegistroCajaFormData {
  saldoInicial: number;
  saldoFinal: number;
  fechaInicio: string;
  fechaCierre: string;
  estado: "ABIERTO" | "CERRADO";
  comentario: string;
  usuarioId: number | null;
  sucursalId: number | null;
}

export interface RegistroCajaInicioFormData {
  saldoInicial: number;
  estado: "ABIERTO" | "CERRADO";
  comentario: string;
  usuarioId: number | null;
  sucursalId: number | null;
}

export interface RegistroAbierto {
  id: number;
  sucursalId: number;
  usuarioId: number;
  saldoInicial: number;
  saldoFinal: number;
  fechaInicio: string;
  fechaCierre: string;
  estado: "ABIERTO" | "CERRADO";
  comentario: string | null;
  usuario: {
    id: number;
    nombre: string;
    rol: "ADMIN" | "VENDEDOR";
  };
}

export interface Usuario {
  id: number;
  nombre: string;
  rol: string;
}

export interface Deposito {
  id: number;
  registroCajaId: number | null;
  monto: number;
  numeroBoleta: string;
  banco: string;
  fechaDeposito: string;
  usadoParaCierre: boolean;
  descripcion: string;
  sucursalId: number;
  usuarioId: number | null;
  usuario: Usuario | null;
  sucursal: {
    id: number;
    nombre: string;
  };
}

export interface UsuarioEgreso {
  id: number;
  nombre: string;
  rol: string;
}

export interface Egreso {
  id: number;
  registroCajaId: number | null;
  descripcion: string;
  monto: number;
  fechaEgreso: string;
  sucursalId: number;
  usuarioId: number;
  usuario: UsuarioEgreso;
}

export interface Productos {
  cantidad: number;
  producto: {
    id: number;
    nombre: string;
    codigoProducto: string;
  };
}

export interface VentaWithOutCashRegist {
  id: number;
  clienteId: number | null;
  fechaVenta: string;
  horaVenta: string;
  totalVenta: number;
  sucursalId: number;
  nombreClienteFinal: string | null;
  telefonoClienteFinal: string | null;
  direccionClienteFinal: string | null;
  imei: string | null;
  registroCajaId: number | null;
  productos: Productos[];
}
