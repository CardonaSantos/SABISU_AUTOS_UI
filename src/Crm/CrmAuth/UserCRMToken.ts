enum RolUsuario {
  TECNICO = "TECNICO",
  OFICINA = "OFICINA",
  ADMIN = "ADMIN",
  SUPER_ADMIN = "SUPER_ADMIN",
}
interface UserTokenCRM {
  nombre: string;
  correo: string;
  rol: RolUsuario;
  id: number;
  activo: boolean;
  empresaId: number;
}

export type UserCrmToken = UserTokenCRM;
