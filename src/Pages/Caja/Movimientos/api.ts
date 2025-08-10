// src/lib/api.ts
import axios from "axios";
import type { CreateMovimientoCajaDto, Proveedor } from "./types";

const API_BASE_URL = "http://localhost:3000"; // Reemplaza con tu URL base

export async function createMovimientoCaja(
  data: CreateMovimientoCajaDto
): Promise<any> {
  try {
    const res = await axios.post(`${API_BASE_URL}/movimiento-caja`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (error: any) {
    const message =
      error.response?.data?.message || "Error al crear movimiento de caja";
    throw new Error(message);
  }
}

export async function getProveedores(): Promise<Proveedor[]> {
  try {
    const res = await axios.get(`${API_BASE_URL}/proveedores`, {
      headers: {
        // Authorization: `Bearer ${token}` // si necesitas token
      },
    });
    return res.data;
  } catch (error: any) {
    // Si la API falla, puedes devolver datos dummy
    console.error("Error al obtener proveedores:", error);
    return [
      { id: 1, nombre: "Proveedor A" },
      { id: 2, nombre: "Proveedor B" },
      { id: 3, nombre: "Proveedor C" },
    ];
  }
}
