// api/http.ts
import axios from "axios";
import qs from "qs";

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL as string,
  paramsSerializer: {
    serialize: (params) =>
      qs.stringify(params, {
        arrayFormat: "repeat", // estado=RECIBIDO&estado=ESPERANDO_ENTREGA
        skipNulls: true, // no enviar null/undefined
        encodeValuesOnly: true, // no vuelve a encriptar claves
      }),
  },
});
