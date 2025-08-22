// Interfaces que se usan en el componente CajaForm
export interface CajaAbierta {
  id: number;
  saldoInicial: number;
  fechaApertura: Date | string;
  usuarioId: number;
  // agregar más campos según tu modelo
}

export interface IniciarCaja {
  saldoInicial: number | string;
  comentario?: string;
  usuarioId?: number;
}

export interface CerrarCaja {
  comentarioFinal?: string;
  registroCajaId?: number;
  usuarioCierreId?: number;
}
