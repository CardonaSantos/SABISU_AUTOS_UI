import { getApiErrorMessageAxios } from "@/Pages/Utils/UtilsErrorApi";
import axios from "axios";
import { RegistroCajaResponse } from "../CajaRegistros/interfaces/registroscajas.interfaces";

const API_URL = import.meta.env.VITE_API_URL;

export async function getRegistroCaja(cajaID: number) {
  try {
    const { data } = await axios.get<RegistroCajaResponse>(
      `${API_URL}/caja-registros/caja/${cajaID}`
    );
    return data;
  } catch (err) {
    throw new Error(getApiErrorMessageAxios(err));
  }
}
