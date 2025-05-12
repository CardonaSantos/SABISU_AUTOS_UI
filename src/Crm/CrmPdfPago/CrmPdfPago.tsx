"use client";

import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { useParams } from "react-router-dom";
import logoCrm from "../../assets/logoNovaSinFondo.png";
import dayjs from "dayjs";
import "dayjs/locale/es";
import utc from "dayjs/plugin/utc";
import localizedFormat from "dayjs/plugin/localizedFormat";

import type { FacturaInternet } from "./PdfPagoInterface";

dayjs.extend(utc);
dayjs.extend(localizedFormat);
dayjs.locale("es");

const VITE_CRM_API_URL = import.meta.env.VITE_CRM_API_URL;

export default function CrmPdfPago() {
  const { factudaId } = useParams<{ factudaId: string }>();
  const [factura, setFactura] = useState<FacturaInternet | null>(null);
  const [loading, setLoading] = useState(true);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const invoiceRef = useRef<HTMLDivElement>(null);

  const formatDate = (dateString: string) =>
    dayjs(dateString).format("DD/MM/YYYY");

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("es-GT", {
      style: "currency",
      currency: "GTQ",
      minimumFractionDigits: 2,
    }).format(amount);

  // Fetch invoice data
  useEffect(() => {
    const fetchFactura = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${VITE_CRM_API_URL}/facturacion/factura-to-pdf/${factudaId}`
        );
        if (response.status === 200) {
          setFactura(response.data);
        } else {
          toast.error("Error al cargar la factura");
        }
      } catch (error) {
        console.error(error);
        toast.error("Error al obtener datos de la factura");
      } finally {
        setLoading(false);
      }
    };
    fetchFactura();
  }, [factudaId]);

  // Generate PDF when data is ready
  useEffect(() => {
    if (!factura || !invoiceRef.current) return;
    const generarPDF = async () => {
      try {
        if (!invoiceRef.current) {
          throw new Error("Invoice reference is null");
        }
        const canvas = await html2canvas(invoiceRef.current, {
          scale: 2,
          useCORS: true,
          backgroundColor: "#ffffff",
        });
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF({ unit: "mm", format: "a4" });
        const imgWidth = 210;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
        const blob = pdf.output("blob");
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
      } catch (error) {
        console.error("Error al generar PDF:", error);
        // toast.error("Error al generar PDF");
      }
    };
    generarPDF();
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [factura]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
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
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
        >
          Reintentar
        </button>
      </div>
    );
  }

  const totalPagado = factura.pagos.reduce(
    (sum, pago) => sum + pago.montoPagado,
    0
  );

  return (
    <div className="p-6">
      <div
        ref={invoiceRef}
        className={`${
          pdfUrl ? "hidden" : "block"
        } mx-auto shadow-lg rounded-lg bg-white text-black`}
        style={{ width: "210mm", minHeight: "297mm", padding: "32px 48px" }}
      >
        {/* Header */}
        <div className="flex justify-between items-start border-b border-gray-300 p-5 rounded-t-lg">
          <div className="flex items-center">
            <div className="w-24 h-24  border-gray-200  overflow-hidden mr-4">
              <img
                src={logoCrm}
                alt="Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h1 className="text-lg font-semibold tracking-tight">
                {factura.empresa.nombre}
              </h1>
              {factura.empresa.nit && (
                <p className="text-xs text-gray-600">
                  NIT: {factura.empresa.nit}
                </p>
              )}
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs font-medium text-gray-700">
              FACTURA #{factura.id}
            </p>
            <p className="text-xs text-gray-600">
              {formatDate(factura.creadoEn)}
            </p>
          </div>
        </div>

        {/* Empresa & Estado */}
        <div className="flex justify-between mt-5 text-xs text-gray-600">
          <div>
            <p>{factura.empresa.direccion}</p>
            <p>
              Tel: {factura.empresa.telefono} | PBX: {factura.empresa.pbx}
            </p>
            <p>{factura.empresa.correo}</p>
            <p>{factura.empresa.sitioWeb}</p>
          </div>
          <div>
            <p className="font-medium">{factura.estadoFacturaInternet}</p>
          </div>
        </div>

        {/* Cliente Info */}
        <div className="mb-5 bg-gray-50 p-4 rounded-md border border-gray-200 mt-6 text-xs">
          <h2 className="font-medium text-gray-700 mb-2">
            Información del Cliente
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <p>
                <span className="font-medium">Nombre:</span>{" "}
                {factura.cliente.nombre} {factura.cliente.apellidos}
              </p>
              <p>
                <span className="font-medium">DPI:</span>{" "}
                {factura.cliente.dpi ? factura.cliente.dpi : "N/A"}
              </p>
            </div>
            <div>
              <p>
                <span className="font-medium">Fecha de pago esperada:</span>{" "}
                {formatDate(factura.fechaPagoEsperada)}
              </p>
            </div>
          </div>
        </div>

        {/* Detalles de Servicio */}
        <div className="mb-5 mt-4 text-xs">
          <h2 className="font-medium text-gray-700 mb-2 border-b border-gray-200 pb-1">
            Detalles del Servicio
          </h2>
          <p className="bg-gray-50 p-3 rounded-md mb-3">
            {factura.detalleFactura}
          </p>
        </div>

        {/* Pagos Realizados */}
        <div className="mb-5 text-xs">
          <h2 className="font-medium text-gray-700 mb-2 border-b border-gray-200 pb-1">
            Pagos Realizados
          </h2>
          <div className="overflow-x-auto rounded-md border border-gray-200">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-50 text-gray-700">
                  <th className="py-1.5 px-3 border-b text-left">No.</th>
                  <th className="py-1.5 px-3 border-b text-left">Método</th>
                  <th className="py-1.5 px-3 border-b text-left">Monto</th>
                  <th className="py-1.5 px-3 border-b text-left">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {factura.pagos.map((pago, idx) => (
                  <tr
                    key={pago.id}
                    className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}
                  >
                    <td className="py-1.5 px-3 border-b">{idx + 1}</td>
                    <td className="py-1.5 px-3 border-b font-medium">
                      {pago.metodoPago}
                    </td>
                    <td className="py-1.5 px-3 border-b">
                      {formatCurrency(pago.montoPagado)}
                    </td>
                    <td className="py-1.5 px-3 border-b">
                      {formatDate(pago.fechaPago)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Resumen */}
        <div className="bg-gray-50 p-3 rounded-md border border-gray-200 mb-5 text-xs">
          <div className="flex justify-between space-x-4">
            {/* Monto a pagar */}
            <div className="flex-1 flex flex-col items-center">
              <span className="text-muted-foreground">Monto a pagar</span>
              <span className="font-medium">
                {formatCurrency(factura.montoPago)}
              </span>
            </div>

            {/* Total pagado */}
            <div className="flex-1 flex flex-col items-center">
              <span className="text-muted-foreground">Total pagado</span>
              <span className="font-medium">{formatCurrency(totalPagado)}</span>
            </div>

            {/* Saldo pendiente */}
            <div className="flex-1 flex flex-col items-center">
              <span className="text-muted-foreground">Saldo pendiente</span>
              <span className="font-medium">
                {formatCurrency(factura.saldoPendiente)}
              </span>
            </div>
          </div>
        </div>

        {/* Pie de página */}
        <div className="mt-6 pt-2 border-t border-gray-200 text-center text-gray-500 text-xs">
          <p>
            Este documento es un comprobante de pago oficial de{" "}
            <span className="font-medium">{factura.empresa.nombre}</span>.
          </p>
          <p>
            Para cualquier consulta, comuníquese al teléfono{" "}
            <span className="font-medium">{factura.empresa.telefono}</span>.
          </p>
          <p className="mt-2 text-[10px]">
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

      {/* PDF Preview */}
      {pdfUrl && (
        <div className="mt-6">
          <iframe
            src={pdfUrl}
            className="w-full h-[80vh] border rounded shadow-md"
            title="Vista previa del PDF"
          />
        </div>
      )}
    </div>
  );
}
