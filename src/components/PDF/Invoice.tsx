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
  const { id } = useParams(); // Extrae el valor de id
  const [venta, setVenta] = useState<VentaHistorialPDF | null>(null);
  const [loadingVenta, setLoadingVenta] = useState(true); // Indicador de carga
  const [sucursal, setSucursal] = useState<Sucursal | null>(null);
  const [loadingSucursal, setLoadingSucursal] = useState(true); // Indicador de carga

  const getSale = async () => {
    try {
      const response = await axios.get(`${API_URL}/venta/get-sale/${id}`);
      if (response.status === 200) {
        setVenta(response.data);
      }
    } catch (error) {
      console.log("Error al conseguir el registro de venta");
      toast.error("Error al encontrar registro de venta");
    } finally {
      setLoadingVenta(false); // Finaliza la carga
    }
  };

  useEffect(() => {
    if (id) {
      getSale();
    }
  }, [id]);

  const sucursalId = useStore((state) => state.sucursalId);

  const getInfoSucursal = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/sucursales/get-info-sucursal/${sucursalId}`
      );
      setSucursal(response.data);
    } catch (error) {
      console.log("Error al conseguir datos de la sucursal");
      toast.error("Error al conseguir datos de la sucursal");
    } finally {
      setLoadingSucursal(false); // Finaliza la carga
    }
  };

  useEffect(() => {
    if (sucursalId) {
      getInfoSucursal();
    }
  }, [sucursalId]);

  // Verifica que los datos estén completamente cargados
  if (loadingVenta || loadingSucursal) {
    return (
      <p className="text-center font-extrabold text-xl">Cargando PDF...</p>
    );
  }

  // Maneja el caso en que no se encuentren los datos
  if (!venta || !sucursal) {
    return (
      <p className="text-center font-extrabold text-xl">Datos no encontrados</p>
    );
  }

  return (
    <div>
      <PDFViewer width="100%" height="600">
        <Factura venta={venta} sucursal={sucursal} />
      </PDFViewer>
    </div>
  );
}

export default Invoice;
