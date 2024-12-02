import { useState, useEffect } from "react";
import axios from "axios";
import Handlebars from "handlebars";
import html2pdf from "html2pdf.js";
import "@react-pdf-viewer/core/lib/styles/index.css";
const API_URL = import.meta.env.VITE_API_URL;
import { Button } from "@/components/ui/button";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";

dayjs.extend(localizedFormat);
dayjs.locale("es");
type Testigo = {
  nombre: string;
  direccion: string;
  telefono: string;
};

type Producto = {
  id: number;
  ventaId: number;
  productoId: number;
  cantidad: number;
  creadoEn: string;
  precioVenta: number;
  producto: {
    id: number;
    nombre: string;
    codigoProducto: string;
  };
};

type Sucursal = {
  id: number;
  nombre: string;
  direccion: string;
};

type Usuario = {
  id: number;
  nombre: string;
};

type Cliente = {
  id: number;
  nombre: string;
};

type VentaCuota = {
  id: number;
  clienteId: number;
  usuarioId: number;
  sucursalId: number;
  totalVenta: number;
  cuotaInicial: number;
  cuotasTotales: number;
  fechaInicio: string;
  estado: "ACTIVA" | "COMPLETADA" | "CANCELADA";
  creadoEn: string;
  actualizadoEn: string;
  dpi: string;
  testigos: Testigo[];
  fechaContrato: string;
  montoVenta: number;
  garantiaMeses: number;
  cliente: Cliente;
  productos: Producto[];
  sucursal: Sucursal;
  usuario: Usuario;
  diasEntrePagos: number;
  interes: number;
};

function ContratoCredito() {
  const { recordId, plantillaId } = useParams();
  const [plantilla, setPlantilla] = useState<string | null>(null);
  const [cuota, setCuotas] = useState<VentaCuota | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responsePlantilla = await axios.get(
          `${API_URL}/cuotas/get/plantilla/${plantillaId}`
        );
        if (responsePlantilla.status === 200) {
          setPlantilla(responsePlantilla.data);
        }

        const responseCreateVentaCuotaForm = await axios.get(
          `${API_URL}/cuotas/get/cuota/${recordId}`
        );
        if (responseCreateVentaCuotaForm.status === 200) {
          setCuotas(responseCreateVentaCuotaForm.data);
        }
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, [recordId, plantillaId]);

  console.log("Cuotas: ", cuota);
  console.log("Plantilla: ", plantilla);

  if (!plantilla || !cuota) return null;

  const template = Handlebars.compile(plantilla);

  const {
    id, // Código único del contrato
    fechaContrato, // Fecha del contrato
    cliente, // Información del cliente
    usuario, // Información del vendedor
    testigos, // Lista de testigos
    sucursal, // Sucursal involucrada
    productos, // Lista de productos vendidos
    montoVenta, // Monto total de la venta
    cuotaInicial, // Pago inicial
    cuotasTotales, // Número total de cuotas
    garantiaMeses, // Meses de garantía
    dpi, // DPI del cliente
    diasEntrePagos,

    interes,
    totalVenta,
  } = cuota;

  let diaInicio = dayjs(fechaContrato);
  console.log("el dia de inicio es: ", diaInicio);
  const cuotasFechas = [];

  for (let index = 0; index < cuotasTotales; index++) {
    const fechaAPagar = diaInicio.add(diasEntrePagos, "day");
    // cuotasFechas.push(fechaAPagar.format("YYYY-MMMM-DD"));
    cuotasFechas.push(fechaAPagar.format("D [de] MMMM [de] YYYY"));

    diaInicio = fechaAPagar;
  }
  console.log("Las fechas a pagar cada x días son: ", cuotasFechas);

  // Preparación de datos adicionales para el contrato
  const vendedor = {
    nombre: usuario.nombre, // Nombre del vendedor
    dpi: usuario.id, // Asumiendo que es un identificador
  };

  const comprador = {
    nombre: cliente.nombre, // Nombre del cliente
    dpi: dpi, // DPI del cliente
  };

  const testigosData = testigos.map((testigo) => ({
    nombre: testigo.nombre,
    direccion: testigo.direccion,
    telefono: testigo.telefono,
  }));

  const productosData = productos.map((producto) => ({
    nombre: producto.producto.nombre, // Nombre del producto
    codigoProducto: producto.producto.codigoProducto, // Código del producto
    cantidad: producto.cantidad, // Cantidad adquirida
    precioVenta: formatearMoneda(producto.precioVenta), // Precio de venta
  }));

  const sucursalData = {
    nombre: sucursal.nombre, // Nombre de la sucursal
    direccion: sucursal.direccion, // Dirección de la sucursal
  };
  // Cálculo de cuota mensual
  const calcularCuotas = () => {
    const montoInteres = totalVenta * (interes / 100);
    // Total con interés
    const montoTotalConInteres = totalVenta + montoInteres;
    // Saldo restante después del enganche
    const saldoRestante = montoTotalConInteres - cuotaInicial;
    // Pago por cuota
    const pagoPorCuota = saldoRestante / cuotasTotales;

    return {
      saldoRestante,
      montoInteres,
      montoTotalConInteres,
      pagoPorCuota,
    };
  };

  function formatearMoneda(cantidad: number) {
    return new Intl.NumberFormat("es-GT", {
      style: "currency",
      currency: "GTQ",
    }).format(cantidad);
  }

  // Datos listos para la plantilla Handlebars
  const data = {
    id, // Código del contrato
    fechaContrato: new Date(fechaContrato).toLocaleDateString(), // Fecha formateada
    vendedorNombre: vendedor.nombre,
    vendedorDpi: vendedor.dpi,
    compradorNombre: comprador.nombre,
    compradorDpi: comprador.dpi,
    sucursalNombre: sucursalData.nombre,
    sucursalDireccion: sucursalData.direccion,
    productos: productosData,
    montoVenta,
    interes,
    cuotaInicial: formatearMoneda(cuotaInicial),
    cuotasTotales,
    cuotaMensual: formatearMoneda(calcularCuotas().pagoPorCuota),
    garantiaMeses,
    testigos: testigosData,
    cuotasFechas: cuotasFechas,
  };

  // Generar el HTML usando Handlebars
  const htmlOutput = template(data);

  // Función para generar el PDF usando html2pdf.js
  const generarPDF = () => {
    const element = document.createElement("div");
    element.innerHTML = htmlOutput; // Usamos el HTML generado por Handlebars

    const options = {
      margin: [15, 15, 15, 15],
      filename: "contrato.pdf",
      html2canvas: {
        scale: 3,
        logging: true,
        useCORS: true,
        letterRendering: true, // Habilitar el renderizado de letras
        x: 0,
        y: 0,
      },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    // Convertir el contenido HTML a PDF
    html2pdf()
      .from(element)
      .set(options)
      .toPdf()
      .get("pdf")
      .then((pdf: { output: (arg0: string) => any }) => {
        const pdfBlob = pdf.output("blob");
        const pdfUrl = URL.createObjectURL(pdfBlob);
        setPdfUrl(pdfUrl); // Establecer la URL del PDF
      });
  };

  return (
    <div>
      <h2 className="text-center font-semibold">
        Generar y Previsualizar Contrato
      </h2>
      <div className="flex justify-center items-center">
        <Button
          variant={"default"}
          className="text-center mt-5 w-full max-w-xl"
          onClick={generarPDF}
        >
          Generar PDF
        </Button>
      </div>

      {/* Si pdfUrl está disponible, mostrar el visualizador */}
      {pdfUrl && (
        <div>
          <h3>Previsualizar Contrato</h3>
          <iframe
            className="text-[9px]"
            src={pdfUrl}
            width="100%"
            height="600px"
            style={{ border: "none" }}
            title="Previsualización PDF"
          />
        </div>
      )}
    </div>
  );
}

export default ContratoCredito;
