import axios from "axios";
import { Provider } from "./interfaces.interface";
import { ProductsInventary } from "@/Types/Inventary/ProductsInventary";
const API_URL = import.meta.env.VITE_API_URL;
// PARA ADD STOCK
export const fetchProducts = async () => {
  const response = await axios.get<ProductsInventary[]>(
    `${API_URL}/products/products/for-inventary`
  );
  return response.data;
};

export const fetchProviders = async () => {
  const response = await axios.get<Provider[]>(`${API_URL}/proveedor`);
  return response.data;
};

//CATEGORIAS
export const fetchCategorias = async () => {
  const response = await axios.get(`${API_URL}/categoria`);
  return response.data;
};

// api.ts
export const deleteOneCategory = (categoryID: number) => {
  return axios.delete(`${API_URL}/categoria/${categoryID}`);
};

// api.ts (o donde tengas tus helpers)
export const updateCategory = async (
  nombreCategory: string,
  categoryID: number
) => {
  const response = await axios.patch(
    `${API_URL}/categoria/edit-category/${categoryID}`,
    { nombre: nombreCategory }
  );
  return response.data;
};

export const createOneCategory = (nombreCategory: string) => {
  return axios.post(`${API_URL}/categoria`, {
    nombre: nombreCategory,
  });
};
