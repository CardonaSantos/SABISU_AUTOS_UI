import { User } from "../CrmTickets/ticketTypes";

export enum RolUsuario {
  TECNICO = "TECNICO",
  OFICINA = "OFICINA",
  ADMIN = "ADMIN",
  SUPER_ADMIN = "SUPER_ADMIN",
  COBRADOR = "COBRADOR",
}

export interface UserProfile {
  id: number;
  nombre: string;
  correo: string;
  contrasena: string;
  telefono: string;
  rol: RolUsuario;
  activo: boolean;
  creadoEn: string;
  actualizadoEn: string;
}

export interface UsersProfile extends UserProfile {}

//PARA EL DIALOG Y ELIMINACIONES
export interface UserDialog extends User {}
