// /Pages/Pedidos/API/api.ts
import axios from "axios";
import {
  PedidoPrioridad,
  TipoPedido,
  PedidoLinea,
} from "../Interfaces/createPedido.interfaces";

const API_URL = import.meta.env.VITE_API_URL;

export type PedidoDetalle = {
  id: number;
  folio: string;
  fecha: string;
  sucursalId: number;
  clienteId: number | null;
  prioridad: PedidoPrioridad;
  tipo: TipoPedido;
  observaciones?: string | null;
  lineas: Array<{
    productoId: number;
    cantidad: number;
    precioCostoActual?: number;
    notas?: string;
    // opcionalmente viene info del producto
    producto?: {
      id: number;
      nombre: string;
      codigoProducto: string;
      descripcion?: string | null;
      precioCostoActual?: number;
    };
  }>;
};

export type PedidoUpdate = {
  sucursalId: number;
  clienteId: number | null;
  prioridad: PedidoPrioridad;
  tipo: TipoPedido;
  observaciones?: string | null;
  lineas: PedidoLinea[]; // { productoId, cantidad, precioCostoActual? }
};

export async function getPedidoDetalle(id: number): Promise<PedidoDetalle> {
  const { data } = await axios.get<PedidoDetalle>(`${API_URL}/pedidos/${id}`);
  return data;
}

export async function patchPedido(id: number, body: PedidoUpdate) {
  const { data } = await axios.patch(`${API_URL}/pedidos/${id}`, body);
  return data;
}
