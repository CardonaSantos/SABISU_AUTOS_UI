import { EstadoGarantia } from "../../types/dashboard";

export interface TimeLineDto {
  userID: number | null;
  garantiaID: number | null;
  estado: EstadoGarantia;
  conclusion: string | null;
  accionesRealizadas: string;
}
