import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { FacturaInternet } from "./PdfPagoInterface";
import { motion } from "framer-motion";
import html2pdf from "html2pdf.js"; // Importa html2pdf.js

const VITE_CRM_API_URL = import.meta.env.VITE_CRM_API_URL;

function CrmPdfPago() {
  const [pdf, setPdf] = useState<FacturaInternet | null>(null);

  const getInfoFactura = async () => {
    try {
      const response = await axios.get(
        `${VITE_CRM_API_URL}/facturacion/factura-to-pdf/32`
      );

      if (response.status === 200) {
        toast.info("Generando PDF");
        setPdf(response.data);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error al generar pdf");
    }
  };

  const generarPDF = () => {
    const element = document.getElementById("factura-pdf")!;

    // Opciones para el PDF
    const opciones = {
      filename: "comprobante_pago.pdf",
      html2canvas: { scale: 4 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    html2pdf().from(element).set(opciones).save();
  };

  useEffect(() => {
    getInfoFactura();
  }, []);

  if (!pdf) return <div>Cargando...</div>;

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="container mx-auto px-1 py-6"
      >
        <div id="factura-pdf" className="factura-container">
          <h1>Comprobante de Pago</h1>

          <h2>Información de la Empresa</h2>
          <p>
            <strong>Empresa:</strong> {pdf.empresa.nombre}
          </p>
          <p>
            <strong>Dirección:</strong> {pdf.empresa.direccion}
          </p>
          <p>
            <strong>Teléfono:</strong> {pdf.empresa.telefono}
          </p>
          <p>
            <strong>NIT:</strong> {pdf.empresa.nit}
          </p>

          <h2>Información del Cliente</h2>
          <p>
            <strong>Cliente:</strong> {pdf.cliente.nombre}{" "}
            {pdf.cliente.apellidos}
          </p>
          <p>
            <strong>DPI:</strong> {pdf.cliente.dpi}
          </p>

          <h2>Detalles de la Factura</h2>
          <p>
            <strong>ID de Factura:</strong> {pdf.id}
          </p>
          <p>
            <strong>Estado:</strong> {pdf.estadoFacturaInternet}
          </p>
          <p>
            <strong>Monto Total:</strong> Q{pdf.montoPago}
          </p>
          <p>
            <strong>Saldo Pendiente:</strong> Q{pdf.saldoPendiente}
          </p>
          <p>
            <strong>Fecha de Pago Esperada:</strong>{" "}
            {new Date(pdf.fechaPagoEsperada).toLocaleDateString()}
          </p>

          <h2>Pagos Realizados</h2>
          <ul>
            {pdf.pagos.map((pago) => (
              <li key={pago.id}>
                <p>
                  <strong>Método de Pago:</strong> {pago.metodoPago}
                </p>
                <p>
                  <strong>Monto Pagado:</strong> Q{pago.montoPagado}
                </p>
                <p>
                  <strong>Fecha de Pago:</strong>{" "}
                  {new Date(pago.fechaPago).toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>

          <h3>Resumen</h3>
          <p>
            <strong>Total Pagado:</strong> Q
            {pdf.pagos.reduce((total, pago) => total + pago.montoPagado, 0)}
          </p>
          <p>
            <strong>Nuevo Saldo Pendiente:</strong> Q{pdf.saldoPendiente}
          </p>

          <button onClick={generarPDF} className="mt-4 btn btn-primary">
            Descargar PDF
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default CrmPdfPago;
