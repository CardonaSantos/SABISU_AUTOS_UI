type User = {
  id: number;
  nombre: string;
  rol: string;
};

type Deposit = {
  id: number;
  banco: string;
  descripcion: string;
  fechaDeposito: string;
  monto: number;
  numeroBoleta: string;
  usadoParaCierre: boolean;
  usuario: User;
};

type Expense = {
  id: number;
  descripcion: string;
  fechaEgreso: string;
  monto: number;
  usuario: User;
};

type Branch = {
  id: number;
  nombre: string;
};

// Tipo para los productos en las ventas
type SaleProduct = {
  cantidad: number;
  producto: {
    id: number;
    nombre: string;
    codigoProducto: string;
  };
};

// Tipo para las ventas
type Sale = {
  id: number;
  fechaVenta: string;
  productos: SaleProduct[]; // Arreglo de productos asociados a la venta
};

export type CashRegisterShift = {
  id: number;
  sucursalId: number;
  usuarioId: number;
  saldoInicial: number;
  saldoFinal: number;
  fechaInicio: string;
  fechaCierre: string;
  estado: string;
  comentario: string;
  ventas: Sale[]; // Agregado el arreglo de ventas con productos
  depositos: Deposit[];
  egresos: Expense[];
  sucursal: Branch;
  usuario: User;
};
