interface UserTokenInfo {
  nombre: string;
  correo: string;
  rol: string;
  sub: number;
  activo: boolean;
  sucursalId: number;
}

export type UserToken = UserTokenInfo;
