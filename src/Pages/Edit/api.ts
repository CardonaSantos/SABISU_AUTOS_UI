import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

export const deleteOnePrice = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/products/delete-one-price-from-product/${id}`);
};
