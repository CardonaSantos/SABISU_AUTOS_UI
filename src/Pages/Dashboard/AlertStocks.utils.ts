export interface StockAlert {
  /** id del threshold */
  id: number;
  /** id del producto */
  productoId: number;
  /** nombre para mostrar */
  nombre: string;
  /** cantidad total actual en la sucursal */
  stockActual: number;
  /** cantidad mínima configurada */
  stockMinimo: number;
  /** fecha de última actualización del threshold */
  fecha: Date;
}
