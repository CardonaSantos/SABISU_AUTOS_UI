import { useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import type { RequisitionResponse } from "../requisicion.interfaces";
import { getOneRequisicion } from "../requisicion.api";
import { useParams } from "react-router-dom";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import currency from "currency.js";
const zona = "America/Guatemala";

dayjs.extend(utc);
dayjs.extend(timezone);

const formatearFecha = (value: string | Date) => {
  return dayjs(value).tz(zona).format("DD/MM/YYYY");
};

export const formatearMoneda = (
  value: string | number,
  decimales = 2
): string => {
  return currency(value, {
    precision: decimales,
    symbol: "Q ",
    separator: ",",
    decimal: ".",
    pattern: "!#", // símbolo antes del número ("Q 1,234.50")
  }).format(); // ← ahora devuelve string
};

const RequisicionPDF = () => {
  const { id } = useParams();
  const [requisicion, setRequisicion] = useState<RequisitionResponse | null>(
    null
  );
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const requisicionRef = useRef<HTMLDivElement>(null);

  // Obtener datos de la requisición
  useEffect(() => {
    const fetchRequisicion = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        const data = await getOneRequisicion(Number(id));
        setRequisicion(data);
      } catch (error) {
        console.error("Error al cargar la requisición:", error);
        setError("Error al cargar la requisición");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequisicion();
  }, [id]);

  // Generar PDF cuando los datos estén listos
  useEffect(() => {
    if (!requisicion || !requisicionRef.current) return;

    const generarPDF = async () => {
      try {
        const canvas = await html2canvas(requisicionRef.current!, {
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
        setPdfUrl(URL.createObjectURL(blob));
      } catch (error) {
        console.error("Error al generar PDF:", error);
      }
    };

    generarPDF();

    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [requisicion]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-center">Cargando requisición...</p>
      </div>
    );
  }

  if (error || !requisicion) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-center text-red-600">
          {error || "Requisición no encontrada"}
        </p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div
        ref={requisicionRef}
        className={`shadow-md rounded-lg ${pdfUrl ? "hidden" : "block"}`}
        style={{
          width: "210mm",
          minHeight: "297mm",
          margin: "0 auto",
          backgroundColor: "#ffffff",
          color: "#000000",
          padding: "20px 24px",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        {/* Header con número de documento destacado */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-lg font-semibold text-gray-800">
              REQUISICIÓN DE PRODUCTOS
            </h1>
          </div>
          <div
            className="text-right px-4 py-2 rounded"
            style={{
              border: "1px solid #e5e7eb",
              backgroundColor: "#f9fafb",
            }}
          >
            <p className="text-xs text-gray-500">Folio</p>
            <p className="text-lg font-semibold text-gray-800">
              {requisicion.folio}
            </p>
          </div>
        </div>

        {/* Información principal en grid */}
        <div
          className="grid grid-cols-2 gap-4 mb-6 p-4 rounded"
          style={{
            backgroundColor: "#f9fafb",
            border: "1px solid #e5e7eb",
          }}
        >
          <div>
            <table className="w-full text-sm">
              <tbody>
                <tr>
                  <td className="py-1 text-gray-500 font-medium">Fecha:</td>
                  <td className="py-1 pl-2">
                    {formatearFecha(requisicion.fecha)}
                  </td>
                </tr>
                <tr>
                  <td className="py-1 text-gray-500 font-medium">Sucursal:</td>
                  <td className="py-1 pl-2">{requisicion.sucursal.nombre}</td>
                </tr>
                <tr>
                  <td className="py-1 text-gray-500 font-medium">
                    Solicitante:
                  </td>
                  <td className="py-1 pl-2">{requisicion.usuario.nombre}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div>
            <table className="w-full text-sm">
              <tbody>
                <tr>
                  <td className="py-1 text-gray-500 font-medium">
                    Total líneas:
                  </td>
                  <td className="py-1 pl-2">{requisicion.totalLineas}</td>
                </tr>
                <tr>
                  <td className="py-1 text-gray-500 font-medium">
                    Total estimado:
                  </td>
                  <td className="py-1 pl-2 font-semibold">
                    {formatearMoneda(requisicion.totalRequisicion)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Observaciones */}
        {requisicion.observaciones && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-1">
              Observaciones
            </h3>
            <div
              className="p-3 rounded text-sm"
              style={{
                backgroundColor: "#f3f4f6",
                border: "1px solid #e5e7eb",
              }}
            >
              <p className="text-gray-600">{requisicion.observaciones}</p>
            </div>
          </div>
        )}

        {/* Título de sección */}
        <div className="mb-2">
          <h3 className="text-sm font-medium text-gray-700">
            Detalle de productos solicitados
          </h3>
        </div>

        {/* Tabla de productos */}
        <div
          className="mb-6 rounded"
          style={{
            border: "1px solid #e5e7eb",
            overflow: "hidden",
          }}
        >
          <table
            className="w-full"
            style={{
              fontSize: "10px",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#f3f4f6" }}>
                <th className="py-2 px-2 text-left text-gray-700 font-medium border-b border-gray-200">
                  Código
                </th>
                <th className="py-2 px-2 text-left text-gray-700 font-medium border-b border-gray-200">
                  Producto
                </th>
                <th className="py-2 px-2 text-center text-gray-700 font-medium border-b border-gray-200">
                  Stock Actual
                </th>
                <th className="py-2 px-2 text-center text-gray-700 font-medium border-b border-gray-200">
                  Stock Mín.
                </th>
                <th className="py-2 px-2 text-center text-gray-700 font-medium border-b border-gray-200">
                  Cant. Sugerida
                </th>
                <th className="py-2 px-2 text-right text-gray-700 font-medium border-b border-gray-200">
                  Precio Unit.
                </th>
                <th className="py-2 px-2 text-right text-gray-700 font-medium border-b border-gray-200">
                  Subtotal
                </th>
              </tr>
            </thead>
            <tbody>
              {requisicion.lineas.map((linea, index) => (
                <tr
                  key={linea.id}
                  style={{
                    backgroundColor: index % 2 === 0 ? "#ffffff" : "#f9fafb",
                  }}
                >
                  <td className="py-2 px-2 border-b border-gray-100 font-mono text-xs">
                    {linea.producto.codigoProducto}
                  </td>
                  <td className="py-2 px-2 border-b border-gray-100">
                    {linea.producto.nombre}
                  </td>
                  <td className="py-2 px-2 text-center border-b border-gray-100">
                    {linea.cantidadActual}
                  </td>
                  <td className="py-2 px-2 text-center border-b border-gray-100">
                    {linea.stockMinimo}
                  </td>
                  <td className="py-2 px-2 text-center border-b border-gray-100 font-medium">
                    {linea.cantidadSugerida}
                  </td>
                  <td className="py-2 px-2 text-right border-b border-gray-100">
                    {formatearMoneda(linea.precioUnitario)}
                  </td>
                  <td className="py-2 px-2 text-right border-b border-gray-100 font-medium">
                    {formatearMoneda(
                      linea.precioUnitario * linea.cantidadSugerida
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Resumen totales */}
        <div className="flex justify-end mb-8">
          <div
            className="w-64 rounded"
            style={{
              border: "1px solid #e5e7eb",
            }}
          >
            <table className="w-full text-xs">
              <tbody>
                <tr>
                  <td className="py-2 px-3 border-b border-gray-100 text-gray-600">
                    Total de productos:
                  </td>
                  <td className="py-2 px-3 border-b border-gray-100 text-right font-medium">
                    {requisicion.totalLineas}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-3 border-b border-gray-100 text-gray-600">
                    Total de unidades:
                  </td>
                  <td className="py-2 px-3 border-b border-gray-100 text-right font-medium">
                    {requisicion.lineas.reduce(
                      (acc, linea) => acc + linea.cantidadSugerida,
                      0
                    )}
                  </td>
                </tr>
                <tr style={{ backgroundColor: "#f9fafb" }}>
                  <td className="py-2 px-3 text-gray-700 font-medium">
                    TOTAL ESTIMADO:
                  </td>
                  <td className="py-2 px-3 text-right font-semibold">
                    {formatearMoneda(requisicion.totalRequisicion)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Vista previa del PDF */}
      {pdfUrl && (
        <div className="mt-6">
          <iframe
            src={pdfUrl}
            className="w-full h-[80vh] border rounded-lg"
            title="Vista previa PDF de requisición"
          />
        </div>
      )}
    </div>
  );
};

export default RequisicionPDF;
