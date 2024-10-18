interface UserTokenInfo {
  nombre: string;
  correo: string;
  rol: string;
  sub: number;
  activo: boolean;
}

export type UserToken = UserTokenInfo;
