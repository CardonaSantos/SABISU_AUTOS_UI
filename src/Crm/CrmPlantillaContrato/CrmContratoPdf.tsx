"use client";

import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useParams, useSearchParams } from "react-router-dom";
import html2pdf from "html2pdf.js";

import dayjs from "dayjs";
import "dayjs/locale/es";
import utc from "dayjs/plugin/utc";
import localizedFormat from "dayjs/plugin/localizedFormat";
import logoNova from "@/assets/logoNovaSinFondo.png";
dayjs.extend(utc);
dayjs.extend(localizedFormat);
dayjs.locale("es");

const VITE_CRM_API_URL = import.meta.env.VITE_CRM_API_URL;

export interface ClienteContrato {
  id: number;
  nombre: string;
  apellidos: string | null;
  telefono?: string | null;
  direccion?: string | null;
}

export interface ContratoServicio {
  id: number;
  clienteId: number;
  fechaInstalacionProgramada: string | null;
  costoInstalacion: number | null;
  fechaPago: string | null;
  observaciones: string | null;
  ssid: string | null;
  wifiPassword: string | null;
  creadoEn: string;
  actualizadoEn: string;
  cliente: ClienteContrato;
}

export interface PlantillaContrato {
  id: number;
  nombre: string;
  body: string;
  empresaId: number;
  creadoEn: string;
}

export interface ContratoVistaResponse {
  contrato: ContratoServicio;
  plantilla: PlantillaContrato;
  contratoFinal: string;
  empresa: Empresa;
}

export interface Empresa {
  id: number;
  nombre: string;
  direccion: string;
  telefono: string;
  correo: string;
  pbx: string;
  sitioWeb: string;
}

function ContratoServicioPDF() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();

  const contratoId = Number.parseInt(id || "0");
  const plantillaId = Number.parseInt(searchParams.get("plantilla") || "0");

  const [contratoData, setContratoData] =
    useState<ContratoVistaResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const contratoRef = useRef<HTMLDivElement>(null);

  const getInfoContrato = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${VITE_CRM_API_URL}/contrato-cliente/get-one-contrato/${contratoId}/${plantillaId}`
      );

      if (response.status === 200) {
        setContratoData(response.data);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error al obtener datos del contrato");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return dayjs(dateString).format("DD/MM/YYYY");
  };

  const formatCurrency = (amount: number | null) => {
    if (amount === null) return "N/A";
    return `Q${amount.toFixed(2)}`;
  };

  const generarPDF = () => {
    if (!contratoRef.current || !contratoData) return;

    const element = contratoRef.current;
    const opt = {
      margin: 10,
      filename: `Contrato_Servicio_${contratoData.contrato.id}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    html2pdf().from(element).set(opt).save();
  };

  useEffect(() => {
    getInfoContrato();
  }, [contratoId, plantillaId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!contratoData) {
    return (
      <div className="text-center p-8">
        <h2 className="text-xl font-semibold text-red-600">
          No se pudo cargar la información del contrato
        </h2>
        <button
          onClick={getInfoContrato}
          className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
        >
          Reintentar
        </button>
      </div>
    );
  }

  const { contrato, contratoFinal, empresa } = contratoData;

  return (
    <div className="container mx-auto px-4 py-6">
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
            Generar PDF
          </button>
        </div>

        <div
          ref={contratoRef}
          className="bg-white p-8 rounded-lg shadow-lg border border-gray-200"
          style={{ width: "210mm", maxWidth: "100%", margin: "0 auto" }}
        >
          <div className="flex justify-between items-start border-b border-gray-300 pb-6 mb-6">
            <div className="flex items-center">
              <div className="mr-4">
                <div className="w-24 h-24 flex items-center justify-center rounded">
                  <img
                    src={logoNova || "/placeholder.svg"}
                    alt="Logo de la empresa"
                  />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-primary mb-1">
                  {empresa?.nombre}
                </h1>
                <p className="text-gray-600">{empresa?.direccion}</p>
                <p className="text-gray-600">Tel: {empresa?.telefono}</p>
                <p className="text-gray-600">PBX: {empresa?.pbx}</p>
                <p className="text-gray-600">Email: {empresa?.correo}</p>
              </div>
            </div>
            <div className="text-right">
              <h2 className="font-semibold">CONTRATO DE SERVICIO</h2>
              <p className="text-gray-600">
                No. Contrato:{" "}
                <span className="font-semibold">{contrato.id}</span>
              </p>
              <p className="text-gray-600">
                Fecha de emisión:{" "}
                <span className="font-semibold">
                  {formatDate(contrato.creadoEn)}
                </span>
              </p>
            </div>
          </div>

          <div className="mb-6 bg-gray-50 p-4 rounded-md">
            <h2 className="text-lg font-bold text-gray-700 mb-2 border-b border-gray-200 pb-1">
              Información del Cliente
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">
                  Nombre:{" "}
                  <span className="font-semibold">
                    {contrato.cliente.nombre} {contrato.cliente.apellidos || ""}
                  </span>
                </p>
                <p className="text-gray-600">
                  Dirección:{" "}
                  <span className="font-semibold">
                    {contrato.cliente.direccion || "N/A"}
                  </span>
                </p>
              </div>
              <div>
                <p className="text-gray-600">
                  Teléfono:{" "}
                  <span className="font-semibold">
                    {contrato.cliente.telefono || "N/A"}
                  </span>
                </p>
                <p className="text-gray-600">
                  ID Cliente:{" "}
                  <span className="font-semibold">{contrato.cliente.id}</span>
                </p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-700 mb-2 border-b border-gray-200 pb-1">
              Detalles del Contrato
            </h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-gray-600">
                  Fecha de instalación programada:{" "}
                  <span className="font-semibold">
                    {formatDate(contrato.fechaInstalacionProgramada)}
                  </span>
                </p>
                <p className="text-gray-600">
                  Costo de instalación:{" "}
                  <span className="font-semibold">
                    {formatCurrency(contrato.costoInstalacion)}
                  </span>
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-gray-600">
                  Fecha de pago mensual:{" "}
                  <span className="font-semibold">
                    {formatDate(contrato.fechaPago)}
                  </span>
                </p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="font-semibold text-gray-700 mb-2">
                Observaciones:
              </h3>
              <p className="text-gray-700 whitespace-pre-line">
                {contrato.observaciones || "Sin observaciones adicionales."}
              </p>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-700 mb-2 border-b border-gray-200 pb-1">
              Términos del Contrato
            </h2>
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-gray-700 whitespace-pre-line">
                {contratoFinal}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 mt-12 mb-6">
            <div className="text-center">
              <div className="border-t border-gray-400 pt-2 mx-auto w-64">
                <p className="font-semibold">Firma del Cliente</p>
                <p className="text-sm text-gray-600">
                  {contrato.cliente.nombre} {contrato.cliente.apellidos || ""}
                </p>
              </div>
            </div>
            <div className="text-center">
              <div className="border-t border-gray-400 pt-2 mx-auto w-64">
                <p className="font-semibold">Firma del Representante</p>
                <p className="text-sm text-gray-600">{empresa?.nombre}</p>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-4 border-t border-gray-300 text-center text-gray-500 text-sm">
            <p>
              Este documento es un contrato oficial de servicio de{" "}
              {empresa?.nombre}
            </p>
            <p>
              Para cualquier consulta, comuníquese al teléfono (502){" "}
              {empresa?.telefono} | pbx: {empresa?.pbx}
            </p>
            <p className="mt-2">Generado el {dayjs().format("DD/MM/YYYY")}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default ContratoServicioPDF;
