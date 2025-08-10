import axios from "axios";
import {
  RegistroCajaFormData,
  RegistroCajaInicioFormData,
  RegistroAbierto,
  VentaWithOutCashRegist,
} from "./types";
import { Movimiento } from "./interface";

const API_URL = import.meta.env.VITE_API_URL;

export const cashRegisterApi = {
  openCashRegister: async (
    data: Omit<RegistroCajaInicioFormData, "saldoInicial">
  ) => {
    const res = await axios.post(`${API_URL}/caja/open-cash-regist`, data);
    return res.data;
  },

  // 2. Consultar turno abierto
  getCashRegistOpen: async (sucursalId: number, usuarioId: number) => {
    const res = await axios.get(
      `${API_URL}/caja/find-cash-regist-open/${sucursalId}/${usuarioId}`
    );
    return res.data as RegistroAbierto | null;
  },

  // 3. Cerrar turno
  closeCashRegister: async (
    data: RegistroCajaFormData & { ventasIds: number[]; id: number }
  ) => {
    const res = await axios.patch(`${API_URL}/caja/close-box`, data);
    return res.data;
  },

  // 4. Saldo anterior
  getSaldoFinalAnterior: async (sucursalId: number): Promise<number> => {
    const res = await axios.get<{ saldoFinal: number }>(
      `${API_URL}/caja/saldo-anterior/${sucursalId}`
    );
    return res.data.saldoFinal;
  },

  // 5. Movimientos del turno
  getMovimientos: async (registroCajaId: number) => {
    const res = await axios.get<Movimiento[]>(
      `${API_URL}/caja/movimientos/${registroCajaId}`
    );
    return res.data;
  },

  // 6. Ventas siguen igual
  getSales: async (sucursalId: number, usuarioId: number) => {
    const res = await axios.get<VentaWithOutCashRegist[]>(
      `${API_URL}/venta/get-ventas-caja/${sucursalId}/${usuarioId}`
    );
    return res.data;
  },

  getDepositosEgresos: async (cajaID: number) => {
    const res = await axios.get<Movimiento[]>(
      `${API_URL}/caja/movimientos/${cajaID}}`
    );
    return res.data;
  },
};
