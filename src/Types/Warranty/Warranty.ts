export type GarantiaType = {
  id: number;
  clienteId: number;
  productoId: number;
  usuarioIdRecibe: number;
  comentario: string;
  descripcionProblema: string;
  fechaRecepcion: string; // Puede ser tipo `Date` si lo conviertes en tu código
  estado:
    | "RECIBIDO"
    // | "EN_PROCESO"
    // | "FINALIZADO"
    | "ENVIADO_A_PROVEEDOR"
    | "EN_REPARACION"
    | "REPARADO"
    | "REEMPLAZADO";
  // | "ENTREGADO_CLIENTE";
  creadoEn: string; // También podría ser `Date`
  actualizadoEn: string; // También podría ser `Date`
  cliente: {
    id: number;
    nombre: string;
    telefono: string;
    direccion: string;
    dpi: string;
  };
  proveedor: {
    id: number;
    nombre: string;
    telefono: string;
    telefonoContacto: string;
  };
  usuarioRecibe: {
    id: number;
    nombre: string;
    rol: "ADMIN" | "USUARIO" | "SUPERVISOR"; // Añade más roles según tu aplicación
    sucursal: {
      id: number;
      nombre: string;
      direccion: string;
    };
  };
  producto: {
    id: number;
    nombre: string;
    descripcion: string;
    codigoProducto: string;
  };
};
