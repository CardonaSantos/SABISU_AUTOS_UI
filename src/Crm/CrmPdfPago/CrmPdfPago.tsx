"use client";

import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import type { FacturaInternet } from "./PdfPagoInterface";
import { motion } from "framer-motion";
import * as pdfjs from "pdfjs-dist";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { useParams } from "react-router-dom";

import dayjs from "dayjs";
import "dayjs/locale/es";
import utc from "dayjs/plugin/utc";
import localizedFormat from "dayjs/plugin/localizedFormat";
// const API_URL = import.meta.env.VITE_API_URL;

dayjs.extend(utc);
dayjs.extend(localizedFormat);
dayjs.locale("es");

// const formatearFecha = (fecha: string) => {
//   // Formateo en UTC sin conversión a local
//   return dayjs(fecha).format("DD/MM/YYYY hh:mm A");
// };

// Configurar el worker de PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const VITE_CRM_API_URL = import.meta.env.VITE_CRM_API_URL;

function CrmPdfPago() {
  const { factudaId } = useParams();
  const [factura, setFactura] = useState<FacturaInternet | null>(null);
  const [loading, setLoading] = useState(true);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const facturaRef = useRef<HTMLDivElement>(null);

  const getInfoFactura = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${VITE_CRM_API_URL}/facturacion/factura-to-pdf/${factudaId}`
      );

      if (response.status === 200) {
        // toast.info("Información de factura cargada");
        setFactura(response.data);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error al obtener datos de la factura");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return dayjs(dateString).format("DD/MM/YYYY");
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-GT", {
      style: "currency",
      currency: "GTQ",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const generarPDF = async () => {
    if (!facturaRef.current) return;

    try {
      setPreviewMode(true);
      toast.info("Generando PDF, por favor espere...");

      // Esperar a que el DOM se actualice con el modo de vista previa
      await new Promise((resolve) => setTimeout(resolve, 100));

      const element = facturaRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");

      // Crear PDF con jsPDF
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

      // Generar URL del PDF para previsualización
      const pdfBlob = pdf.output("blob");
      const url = URL.createObjectURL(pdfBlob);
      setPdfUrl(url);

      toast.success("PDF generado correctamente");
    } catch (error) {
      console.error("Error al generar PDF:", error);
      toast.error("Error al generar PDF");
      setPreviewMode(false);
    }
  };

  const descargarPDF = () => {
    if (!factura) return;

    // const pdf = new jsPDF({
    //   orientation: "portrait",
    //   unit: "mm",
    //   format: "a4",
    // });

    // Usar la URL del PDF ya generado
    if (pdfUrl) {
      const link = document.createElement("a");
      link.href = pdfUrl;
      link.download = `Comprobante_Pago_${factura.id}.pdf`;
      link.click();
      toast.success("PDF descargado correctamente");
    }
  };

  const cerrarPreview = () => {
    setPreviewMode(false);
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
      setPdfUrl(null);
    }
  };

  useEffect(() => {
    getInfoFactura();

    return () => {
      // Limpiar URL al desmontar
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [factudaId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!factura) {
    return (
      <div className="text-center p-8">
        <h2 className="text-xl font-semibold text-red-600">
          No se pudo cargar la información de la factura
        </h2>
        <button
          onClick={getInfoFactura}
          className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
        >
          Reintentar
        </button>
      </div>
    );
  }

  const totalPagado = factura.pagos.reduce(
    (total, pago) => total + pago.montoPagado,
    0
  );

  return (
    <div className="container mx-auto px-4 py-6">
      {previewMode && pdfUrl ? (
        <div className="container mx-auto px-4 py-6">
          {pdfUrl && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl flex flex-col">
                <div className="p-4 border-b flex justify-between items-center">
                  <h2 className="text-xl font-bold">Vista previa del PDF</h2>
                  <div className="flex gap-2">
                    <button
                      onClick={descargarPDF}
                      className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
                    >
                      Descargar
                    </button>
                    <button
                      onClick={cerrarPreview}
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                    >
                      Cerrar
                    </button>
                  </div>
                </div>

                {/* Contenedor del iframe con ajuste automático */}
                <div className="flex-1 p-4 overflow-auto">
                  <iframe
                    src={pdfUrl}
                    className="w-full h-full border rounded"
                    style={{ width: "100%", height: "80vh" }} // Ajuste de altura en vh para que se vea mejor
                    title="Vista previa del PDF"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="max-w-4xl mx-auto"
        >
          <div className="mb-4 flex justify-end">
            <button
              onClick={generarPDF}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 flex items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              Generar PDF
            </button>
          </div>

          <div
            ref={facturaRef}
            className="bg-white p-8 rounded-lg shadow-lg border border-gray-200"
            style={{ width: "210mm", maxWidth: "100%", margin: "0 auto" }}
          >
            {/* Encabezado */}
            <div className="flex justify-between items-start border-b border-gray-300 pb-6 mb-6">
              <div>
                <h1 className="text-2xl font-bold text-primary mb-1">
                  {factura.empresa.nombre}
                </h1>
                <p className="text-gray-600">{factura.empresa.direccion}</p>
                <p className="text-gray-600">
                  Tel: {factura.empresa.telefono} | PBX: {factura.empresa.pbx}
                </p>
                <p className="text-gray-600">Email: {factura.empresa.correo}</p>
                <p className="text-gray-600">Web: {factura.empresa.sitioWeb}</p>
                <p className="text-gray-600">NIT: {factura.empresa.nit}</p>
              </div>
              <div className="text-right">
                {/* <div className="bg-primary text-white px-4 py-2 rounded-md inline-block mb-2">
                  <h2 className="font-bold">COMPROBANTE DE PAGO</h2>
                </div> */}
                <p className="text-gray-600">
                  No. Factura:{" "}
                  <span className="font-semibold">{factura.id}</span>
                </p>
                <p className="text-gray-600">
                  Fecha:{" "}
                  <span className="font-semibold">
                    {formatDate(factura.creadoEn)}
                  </span>
                </p>
                <p
                  className={`font-bold ${
                    factura.estadoFacturaInternet === "PAGADA"
                      ? "text-green-600"
                      : "text-amber-600"
                  }`}
                >
                  {factura.estadoFacturaInternet}
                </p>
              </div>
            </div>

            {/* Información del cliente */}
            <div className="mb-6 bg-gray-50 p-4 rounded-md">
              <h2 className="text-lg font-bold text-gray-700 mb-2 border-b border-gray-200 pb-1">
                Información del Cliente
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600">
                    Nombre:{" "}
                    <span className="font-semibold">
                      {factura.cliente.nombre} {factura.cliente.apellidos}
                    </span>
                  </p>
                  <p className="text-gray-600">
                    DPI:{" "}
                    <span className="font-semibold">{factura.cliente.dpi}</span>
                  </p>
                </div>
                <div>
                  {/* <p className="text-gray-600">
                    ID Cliente:{" "}
                    <span className="font-semibold">{factura.cliente.id}</span>
                  </p> */}
                  <p className="text-gray-600">
                    Fecha de pago esperada:{" "}
                    <span className="font-semibold">
                      {formatDate(factura.fechaPagoEsperada)}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Detalles de la factura */}
            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-700 mb-2 border-b border-gray-200 pb-1">
                Detalles del Servicio
              </h2>
              <p className="text-gray-700 mb-4">{factura.detalleFactura}</p>

              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-md">
                <div>
                  <p className="text-gray-600">
                    Monto Total:{" "}
                    <span className="font-semibold">
                      {formatCurrency(factura.montoPago)}
                    </span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-gray-600">
                    Saldo Pendiente:{" "}
                    <span
                      className={`font-semibold ${
                        factura.saldoPendiente === 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {formatCurrency(factura.saldoPendiente)}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Pagos realizados */}
            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-700 mb-2 border-b border-gray-200 pb-1">
                Pagos Realizados
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200                         dark:text-black">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="py-2 px-4 border-b text-left">No.</th>
                      <th className="py-2 px-4 border-b text-left">
                        Método de Pago
                      </th>
                      <th className="py-2 px-4 border-b text-left">Monto</th>
                      <th className="py-2 px-4 border-b text-left">Fecha</th>
                    </tr>
                  </thead>
                  <tbody>
                    {factura.pagos.map((pago, index) => (
                      <tr
                        key={pago.id}
                        className={index % 2 === 0 ? "bg-gray-50" : "bg-white "}
                      >
                        <td
                          className="py-2 px-4 border-b
                        "
                        >
                          {index + 1}
                        </td>
                        <td
                          className="py-2 px-4 border-b
                        "
                        >
                          {pago.metodoPago}
                        </td>
                        <td
                          className="py-2 px-4 border-b
                        "
                        >
                          {formatCurrency(pago.montoPagado)}
                        </td>
                        <td
                          className="py-2 px-4 border-b
                        "
                        >
                          {formatDate(pago.fechaPago)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Resumen */}
            <div className="border-t border-gray-300 pt-4 mt-6">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-gray-700">
                  Total Pagado:
                </span>
                <span className="font-bold text-lg">
                  {formatCurrency(totalPagado)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-700">
                  Saldo Pendiente:
                </span>
                <span
                  className={`font-bold text-lg ${
                    factura.saldoPendiente === 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {formatCurrency(factura.saldoPendiente)}
                </span>
              </div>
            </div>

            {/* Pie de página */}
            <div className="mt-12 pt-4 border-t border-gray-300 text-center text-gray-500 text-sm">
              <p>
                Este documento es un comprobante de pago oficial de{" "}
                {factura.empresa.nombre}.
              </p>
              <p>
                Para cualquier consulta, comuníquese al teléfono{" "}
                {factura.empresa.telefono}.
              </p>
              <p className="mt-2">
                Generado el{" "}
                {new Date().toLocaleDateString("es-GT", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default CrmPdfPago;
