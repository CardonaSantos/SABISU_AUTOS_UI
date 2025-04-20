"use client";

import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import * as pdfjs from "pdfjs-dist";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { useParams } from "react-router-dom";

import dayjs from "dayjs";
import "dayjs/locale/es";
import utc from "dayjs/plugin/utc";
import localizedFormat from "dayjs/plugin/localizedFormat";
import logoNova from "@/assets/logoNovaSinFondo.png";
dayjs.extend(utc);
dayjs.extend(localizedFormat);
dayjs.locale("es");

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const VITE_CRM_API_URL = import.meta.env.VITE_CRM_API_URL;

export interface BoletaSoporteDto {
  ticketId: number;
  titulo: string;
  descripcion: string;
  estado: "NUEVO" | "ABIERTA" | "EN_PROCESO" | "CERRADA";
  prioridad: "BAJA" | "MEDIA" | "ALTA";
  fechaApertura: string; // ISO date string
  fechaCierre: string | null;
  fechaGeneracionBoleta: string; // fecha de impresión o emisión

  cliente: {
    id: number;
    nombreCompleto: string;
    telefono: string;
    direccion: string;
  };

  tecnico: {
    id: number;
    nombre: string;
  } | null;

  empresa: {
    id: number;
    nombre: string;
    direccion: string;
    correo: string;
    telefono: string;
    pbx: string;
  };
}

function BoletaTicket() {
  const { ticketId } = useParams();
  const [boleta, setBoleta] = useState<BoletaSoporteDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const boletaRef = useRef<HTMLDivElement>(null);

  const getInfoBoleta = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${VITE_CRM_API_URL}/tickets-soporte/get-ticket-boleta/${ticketId}`
      );

      if (response.status === 200) {
        setBoleta(response.data);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error al obtener datos del ticket");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return dayjs(dateString).format("DD/MM/YYYY HH:mm");
  };

  const getPrioridadColor = (prioridad: string) => {
    switch (prioridad) {
      case "ALTA":
        return "text-red-600";
      case "MEDIA":
        return "text-amber-600";
      case "BAJA":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "NUEVO":
        return "text-blue-600";
      case "ABIERTA":
        return "text-blue-600";
      case "EN_PROCESO":
        return "text-amber-600";
      case "CERRADA":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  const generarPDF = async () => {
    if (!boletaRef.current) return;

    try {
      setPreviewMode(true);
      toast.info("Generando PDF, por favor espere...");

      // Esperar a que el DOM se actualice con el modo de vista previa
      await new Promise((resolve) => setTimeout(resolve, 100));

      const element = boletaRef.current;
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
    if (!boleta) return;

    // Usar la URL del PDF ya generado
    if (pdfUrl) {
      const link = document.createElement("a");
      link.href = pdfUrl;
      link.download = `Boleta_Soporte_${boleta.ticketId}.pdf`;
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
    getInfoBoleta();

    return () => {
      // Limpiar URL al desmontar
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [ticketId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!boleta) {
    return (
      <div className="text-center p-8">
        <h2 className="text-xl font-semibold text-red-600">
          No se pudo cargar la información del ticket
        </h2>
        <button
          onClick={getInfoBoleta}
          className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
        >
          Reintentar
        </button>
      </div>
    );
  }

  // Para pruebas, puedes usar estos datos de ejemplo
  const datosEjemplo: BoletaSoporteDto = {
    ticketId: 44,
    titulo: "Señal inestable",
    descripcion: "Su señal no es estable durante el día",
    estado: "NUEVO",
    prioridad: "MEDIA",
    fechaApertura: "2025-04-16T15:54:53.678Z",
    fechaCierre: null,
    cliente: {
      id: 2247,
      nombreCompleto: "Nidia Mariceli Jiménez Mendoza",
      telefono: "52011724",
      direccion: "Zona 1, Ciudad de Guatemala",
    },
    tecnico: {
      id: 3,
      nombre: "Pedro",
    },
    empresa: {
      id: 1,
      nombre: "Nova Sistemas S.A.2",
      correo: "correo",
      direccion: "Zona 1, Ciudad de Guatemala",
      pbx: "2222-2222",
      telefono: "2222-2222",
    },
    fechaGeneracionBoleta: "2025-04-16T16:00:45.244Z",
  };

  // Usar datos reales o de ejemplo según sea necesario
  const datosBoleta = boleta || datosEjemplo;

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
                    style={{ width: "100%", height: "80vh" }}
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
            ref={boletaRef}
            className="bg-white p-8 rounded-lg shadow-lg border border-gray-200"
            style={{ width: "210mm", maxWidth: "100%", margin: "0 auto" }}
          >
            {/* Encabezado con logo */}
            <div className="flex justify-between items-start border-b border-gray-300 pb-6 mb-6">
              <div className="flex items-center">
                {/* Espacio para el logo */}
                <div className="mr-4">
                  {/* Aquí puedes colocar el logo de la empresa */}
                  <div className="w-24 h-24  flex items-center justify-center rounded">
                    <img src={logoNova} />
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl font-semibold text-primary mb-1">
                    {datosBoleta.empresa?.nombre || "Empresa"}
                  </h1>
                  <p className="text-gray-600">
                    {datosBoleta.empresa.direccion}
                  </p>
                  <p className="text-gray-600">
                    Tel: {datosBoleta.empresa.telefono}
                  </p>
                  <p className="text-gray-600">
                    PBX: {datosBoleta.empresa.pbx}
                  </p>

                  <p className="text-gray-600">
                    Email: {datosBoleta.empresa.correo}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className=" text-black px-4 py-2 rounded-md inline-block mb-2">
                  <h2 className="font-semibold">BOLETA DE SOPORTE TÉCNICO</h2>
                </div>
                <p className="text-gray-600">
                  No. Ticket:{" "}
                  <span className="font-semibold">{datosBoleta.ticketId}</span>
                </p>
                <p className="text-gray-600">
                  Fecha de emisión:{" "}
                  <span className="font-semibold">
                    {formatDate(datosBoleta.fechaGeneracionBoleta)}
                  </span>
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
                      {datosBoleta.cliente?.nombreCompleto ||
                        "Cliente no especificado"}
                    </span>
                  </p>
                  <p className="text-gray-600">
                    Dirección:{" "}
                    <span className="font-semibold">
                      {datosBoleta.cliente?.direccion || "N/A"}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">
                    Teléfono:{" "}
                    <span className="font-semibold">
                      {datosBoleta.cliente?.telefono || "N/A"}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Detalles del ticket */}
            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-700 mb-2 border-b border-gray-200 pb-1">
                Detalles del Ticket
              </h2>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-gray-600">
                    Título:{" "}
                    <span className="font-semibold">{datosBoleta.titulo}</span>
                  </p>
                  <p className="text-gray-600">
                    Estado:{" "}
                    <span
                      className={`font-semibold ${getEstadoColor(
                        datosBoleta.estado
                      )}`}
                    >
                      {datosBoleta.estado}
                    </span>
                  </p>
                  <p className="text-gray-600">
                    Prioridad:{" "}
                    <span
                      className={`font-semibold ${getPrioridadColor(
                        datosBoleta.prioridad
                      )}`}
                    >
                      {datosBoleta.prioridad}
                    </span>
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-gray-600">
                    Fecha de ticket:{" "}
                    <span className="font-semibold">
                      {formatDate(datosBoleta.fechaApertura)}
                    </span>
                  </p>

                  <p className="text-gray-600">
                    Técnico asignado:{" "}
                    <span className="font-semibold">
                      {datosBoleta.tecnico?.nombre || "No asignado"}
                    </span>
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="font-semibold text-gray-700 mb-2">
                  Descripción del problema:
                </h3>
                <p className="text-gray-700 whitespace-pre-line">
                  {datosBoleta.descripcion}
                </p>
              </div>
            </div>

            {/* Trabajo realizado */}
            {/* <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-700 mb-2 border-b border-gray-200 pb-1">
                Trabajo Realizado
              </h2>
              <div className="bg-gray-50 p-4 rounded-md min-h-[100px]">
                <p className="text-gray-500 italic">
                  {datosBoleta.estado === "CERRADA"
                    ? "Detalles del trabajo realizado por el técnico."
                    : "Pendiente de completar por el técnico."}
                </p>
              </div>
            </div> */}

            {/* Observaciones */}
            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-700 mb-2 border-b border-gray-200 pb-1">
                Observaciones
              </h2>
              <div className="bg-gray-50 p-4 rounded-md min-h-[80px]">
                {/* Espacio para observaciones */}
              </div>
            </div>

            {/* Firmas */}
            <div className="grid grid-cols-2 gap-8 mt-12 mb-6">
              <div className="text-center">
                <div className="border-t border-gray-400 pt-2 mx-auto w-64">
                  <p className="font-semibold">Firma del Cliente</p>
                  <p className="text-sm text-gray-600">
                    {datosBoleta.cliente?.nombreCompleto}
                  </p>
                </div>
              </div>
              <div className="text-center">
                <div className="border-t border-gray-400 pt-2 mx-auto w-64">
                  <p className="font-semibold">Firma del Técnico</p>
                  <p className="text-sm text-gray-600">
                    {datosBoleta.tecnico?.nombre || "Técnico no asignado"}
                  </p>
                </div>
              </div>
            </div>

            {/* Pie de página */}
            <div className="mt-12 pt-4 border-t border-gray-300 text-center text-gray-500 text-sm">
              <p>
                Este documento es una boleta oficial de soporte técnico de{" "}
                {datosBoleta.empresa?.nombre || "la empresa"}.
              </p>
              <p>
                Para cualquier consulta, comuníquese al teléfono (502){" "}
                {datosBoleta.empresa.telefono}
              </p>
              <p className="mt-2">
                Generado el {formatDate(datosBoleta.fechaGeneracionBoleta)}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default BoletaTicket;
