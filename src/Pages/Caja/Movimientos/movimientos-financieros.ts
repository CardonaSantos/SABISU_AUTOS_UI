import { EstadoTurnoCaja } from "../interfaces";

// ===== Enums espejo de Prisma (frontend) =====
export type ClasificacionAdmin =
  | "INGRESO"
  | "COSTO_VENTA"
  | "GASTO_OPERATIVO"
  | "TRANSFERENCIA"
  | "AJUSTE"
  | "CONTRAVENTA";

// export type MotivoMovimiento =
//   | "VENTA"
//   | "OTRO_INGRESO"
//   | "GASTO_OPERATIVO"
//   | "COMPRA_MERCADERIA"
//   | "COSTO_ASOCIADO"
//   | "DEPOSITO_CIERRE"
//   | "DEPOSITO_PROVEEDOR"
//   | "PAGO_PROVEEDOR_BANCO"
//   | "AJUSTE_SOBRANTE"
//   | "AJUSTE_FALTANTE"
//   | "DEVOLUCION";
export type MotivoMovimiento =
  // | "VENTA"
  | "OTRO_INGRESO"
  | "GASTO_OPERATIVO"
  | "COMPRA_MERCADERIA"
  | "COSTO_ASOCIADO"
  | "DEPOSITO_CIERRE"
  | "DEPOSITO_PROVEEDOR"
  | "PAGO_PROVEEDOR_BANCO"
  | "AJUSTE_SOBRANTE"
  | "AJUSTE_FALTANTE"
  | "DEVOLUCION"
  | "BANCO_A_CAJA";

export type MetodoPago =
  | "EFECTIVO"
  | "TRANSFERENCIA"
  | "DEPOSITO"
  | "TARJETA"
  | "CHEQUE"
  | "OTRO";

export type GastoOperativoTipo =
  | "SALARIO"
  | "ENERGIA"
  | "LOGISTICA"
  | "RENTA"
  | "INTERNET"
  | "PUBLICIDAD"
  | "VIATICOS"
  | "OTROS";

export type CostoVentaTipo =
  | "MERCADERIA"
  | "FLETE"
  | "ENCOMIENDA"
  | "TRANSPORTE"
  | "OTROS";

// ===== Entidades simples para selects =====
export interface Proveedor {
  id: number;
  nombre: string;
}

export interface CuentaBancaria {
  id: number;
  banco: string;
  numero: string;
  alias?: string | null;
}

export interface CajaAbierta {
  id: number;
  saldoInicial: number;
  comentario?: string;
  fechaApertura: Date;
  sucursalId: number;
  sucursalNombre: string;
  usuarioInicioId: number;
  usuarioInicioNombre: string;
  estado: EstadoTurnoCaja;
  fondoFijo?: number;
}

// ===== DTO que el front enviará al backend =====
export interface CrearMovimientoFinancieroDto {
  sucursalId: number;
  usuarioId: number;

  // Requerido solo si impacta efectivo (deltaCaja ≠ 0)
  registroCajaId?: number;

  // Negocio
  motivo: MotivoMovimiento;
  metodoPago?: MetodoPago; // define si entra/sale por caja o banco
  monto: number;

  descripcion?: string;
  referencia?: string;

  // Depósitos (flags obligatorios para diferenciar)
  esDepositoCierre?: boolean; // true => caja(-), banco(+), transferencia
  esDepositoProveedor?: boolean; // true => caja(-), costo de venta

  // Relacionales y subtipos
  proveedorId?: number;
  cuentaBancariaId?: number;
  gastoOperativoTipo?: GastoOperativoTipo;
  costoVentaTipo?: CostoVentaTipo;
}

// ===== Props que pedirá el nuevo formulario =====
export interface MovimientoFinancieroFormProps {
  userID: number;
  proveedores: Proveedor[];
  cuentasBancarias: CuentaBancaria[];
  reloadContext: () => Promise<void>;
  // APIs que ya tienes o que crearás
  //   getCajaAbierta: () => Promise<CajaAbierta | null>;
  getPreviaCerrar?: (
    sucursalId: number
  ) => Promise<{ efectivoDisponible: number }>;
  //   createMovimiento: (payload: CrearMovimientoFinancieroDto) => Promise<void>;

  // Opcional: refrescar contextos/tablas
}

// ===== Opciones para selects (UI helpers) =====
export const MOTIVO_OPTIONS: Array<{ value: MotivoMovimiento; label: string }> =
  [
    { value: "BANCO_A_CAJA", label: "Banco → Caja (recarga de efectivo)" }, // 👈 NUEVO
    // { value: "VENTA", label: "Venta" },
    // { value: "OTRO_INGRESO", label: "Otro ingreso" },
    { value: "GASTO_OPERATIVO", label: "Gasto operativo" },
    { value: "COMPRA_MERCADERIA", label: "Compra mercadería" },
    { value: "COSTO_ASOCIADO", label: "Costo asociado (flete/encomienda)" },
    // { value: "DEPOSITO_CIERRE", label: "Depósito de cierre (Caja → Banco)" },// ARRUINA MI LOGICA DE CIERRE
    { value: "DEPOSITO_PROVEEDOR", label: "Depósito a proveedor (efectivo)" },
    { value: "PAGO_PROVEEDOR_BANCO", label: "Pago a proveedor (Banco)" },
    // { value: "AJUSTE_SOBRANTE", label: "Ajuste sobrante" },//NO SE QUE DEBERIA HACER
    // { value: "AJUSTE_FALTANTE", label: "Ajuste faltante" }, //NO SE QUE DEBERIA HACER
    // { value: "DEVOLUCION", label: "Devolución / nota crédito" }, // NO LO USARÉ
  ];

export const METODO_PAGO_OPTIONS: Array<{ value: MetodoPago; label: string }> =
  [
    { value: "EFECTIVO", label: "Efectivo" },
    { value: "TRANSFERENCIA", label: "Transferencia/Depósito en banco" },
    { value: "TARJETA", label: "Tarjeta" },
    { value: "CHEQUE", label: "Cheque" },
  ];

type UiRuleFlags = {
  esDepositoCierre?: boolean;
  esDepositoProveedor?: boolean;
};

type UiRule = {
  // puede ser un boolean fijo o función que depende del método de pago
  needsCajaIf: boolean | ((mp?: MetodoPago) => boolean);

  // todas opcionales; algunas reglas no las usan
  requireProveedor?: boolean;
  requireCuenta?: boolean | ((mp?: MetodoPago) => boolean);
  requireSubtipoGO?: boolean;
  requireCostoVentaTipo?: boolean;
  flags?: UiRuleFlags;
};

// Matriz de visibilidad/requerimientos por motivo (guía para la UI)
export const UI_RULES: Record<MotivoMovimiento, UiRule> = {
  // VENTA: {
  //   needsCajaIf: (mp) => mp === "EFECTIVO",
  //   requireProveedor: false,
  //   requireCuenta: (mp) => mp !== "EFECTIVO",
  // },
  BANCO_A_CAJA: {
    // Afecta caja y banco ⇒ requiere caja abierta y cuenta
    needsCajaIf: () => true,
    requireCuenta: () => true,
  },
  OTRO_INGRESO: {
    needsCajaIf: (mp) => mp === "EFECTIVO",
    requireProveedor: false,
    requireCuenta: (mp) => mp !== "EFECTIVO",
  },
  GASTO_OPERATIVO: {
    needsCajaIf: (mp) => mp === "EFECTIVO",
    requireProveedor: false,
    requireSubtipoGO: true,
    requireCuenta: (mp) => mp !== "EFECTIVO",
  },
  COMPRA_MERCADERIA: {
    needsCajaIf: (mp) => mp === "EFECTIVO",
    requireProveedor: true,
    requireCostoVentaTipo: true,
    requireCuenta: (mp) => mp !== "EFECTIVO",
  },
  COSTO_ASOCIADO: {
    needsCajaIf: (mp) => mp === "EFECTIVO",
    requireProveedor: false,
    requireCostoVentaTipo: true,
    requireCuenta: (mp) => mp !== "EFECTIVO",
  },
  DEPOSITO_CIERRE: {
    needsCajaIf: () => true,
    requireProveedor: false,
    requireCuenta: () => true,
    flags: { esDepositoCierre: true },
  },
  DEPOSITO_PROVEEDOR: {
    needsCajaIf: () => true,
    requireProveedor: true,
    requireCuenta: () => false,
    flags: { esDepositoProveedor: true },
  },
  PAGO_PROVEEDOR_BANCO: {
    needsCajaIf: () => false,
    requireProveedor: true,
    requireCuenta: () => true,
  },
  AJUSTE_SOBRANTE: {
    needsCajaIf: () => true,
  },
  AJUSTE_FALTANTE: {
    needsCajaIf: () => true,
  },
  DEVOLUCION: {
    needsCajaIf: (mp) => mp === "EFECTIVO",
    requireCuenta: (mp) => mp !== "EFECTIVO",
  },
};
