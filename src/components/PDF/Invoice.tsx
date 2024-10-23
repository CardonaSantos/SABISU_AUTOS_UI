import { PDFViewer } from "@react-pdf/renderer";
import { useEffect, useState } from "react";
import Factura from "./Factura";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { VentaHistorialPDF } from "@/Types/PDF/VentaHistorialPDF";
import { useStore } from "../Context/ContextSucursal";
import { Sucursal } from "@/Types/Sucursal/Sucursal_Info";
const API_URL = import.meta.env.VITE_API_URL;

function Invoice() {
  // Obtén el parámetro idSale de la URL
  const { id } = useParams(); // Extrae el valor de idSale
  console.log("El id del param es: ", id);

  const [venta, setVenta] = useState<VentaHistorialPDF>();

  const getSale = async () => {
    try {
      // Asegúrate de concatenar correctamente el idSale a la URL
      const response = await axios.get(`${API_URL}/venta/get-sale/${id}`);
      if (response.status === 200) {
        setVenta(response.data);
      }
    } catch (error) {
      console.log("Error al conseguir el registro de venta");
      toast.error("Error al encontrar registro de venta");
      setError("Error al cargar el registro de venta");
    }
  };

  useEffect(() => {
    if (id) {
      getSale();
    }
  }, [id]); // Escucha por cambios en idSale

  console.log("La venta recuperada es: ", venta);

  const sucursalId = useStore((state) => state.sucursalId);
  const [sucursal, setSucursal] = useState<Sucursal>();
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const getInfoSucursal = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/sucursales/get-info-sucursal/${sucursalId}`
        );
        setSucursal(response.data);
      } catch (error) {
        console.log(error);
        toast.error("Error al conseguir datos de la sucursal");
        setError("Error al cargar los datos de la sucursal");
      }
    };

    if (sucursalId) {
      getInfoSucursal();
    }
  }, [sucursalId]);

  console.log("Los datos de la sucursal en pdf son: ", sucursal);

  return (
    <div>
      {error ? (
        <p className="text-center font-extrabold text-xl text-red-500">
          {error}
        </p>
      ) : venta && sucursal ? (
        <PDFViewer width="100%" height="600">
          <Factura venta={venta} sucursal={sucursal} />
        </PDFViewer>
      ) : (
        <p className="text-center font-extrabold text-xl">Cargando PDF...</p>
      )}
    </div>
  );
}

export default Invoice;
