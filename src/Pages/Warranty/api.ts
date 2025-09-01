import axios from "axios";
import type {
  GarantiaFormData,
  ProveedoresResponse,
} from "./interfaces.interfaces";
import { VentasHistorial } from "./interfaces2.interfaces";
import { GarantiaDto } from "./interfacesTable";

// Usar process.env.NEXT_PUBLIC_API_URL para Next.js
const API_URL = import.meta.env.VITE_API_URL;

export const fetchVentas = async (): Promise<VentasHistorial> => {
  try {
    const response = await axios.get(`${API_URL}/venta/venta-to-garantia`);
    return response.data;
  } catch (error) {
    console.error("Error fetching customers:", error);
    throw new Error("Error al cargar los clientes");
  }
};

export const fetchGarantias = async (): Promise<GarantiaDto[]> => {
  try {
    const response = await axios.get(
      `${API_URL}/warranty/get-regists-warranties`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching customers:", error);
    throw new Error("Error al cargar los clientes");
  }
};

export const fetchAllGarantias = async (): Promise<GarantiaDto[]> => {
  try {
    const response = await axios.get(
      `${API_URL}/warranty/get-regists-warranties-historial`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching customers:", error);
    throw new Error("Error al cargar los clientes");
  }
};

export const fetchProvidersToWarranty = async (): Promise<
  ProveedoresResponse[]
> => {
  try {
    const response = await axios.get(
      `${API_URL}/proveedor/get-provider-to-warranty`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching providers:", error);
    throw new Error("Error al cargar los proveedores");
  }
};

export const submitWarrantyRegistration = async (
  formData: GarantiaFormData
) => {
  try {
    const response = await axios.post(`${API_URL}/warranty`, formData);
    return response;
  } catch (error) {
    console.error("Error submitting warranty:", error);
    throw error;
  }
};
