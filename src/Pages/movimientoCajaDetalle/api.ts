import { getApiErrorMessageAxios } from "@/Pages/Utils/UtilsErrorApi";
import axios from "axios";
import { MovimientoCajaDetail } from "./interface";

const API_URL = import.meta.env.VITE_API_URL;

export async function getMovimientoCajaDetail(cajaID: number) {
  try {
    const { data } = await axios.get<MovimientoCajaDetail>(
      `${API_URL}/movimientos-cajas/${cajaID}`
    );
    return data;
  } catch (err) {
    throw new Error(getApiErrorMessageAxios(err));
  }
}
