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
  telefono: string;
  direccion: string;
  dpi: string;
};

type Testigo = {
  nombre: string;
  telefono: string;
  direccion: string;
};

type VentaCuota = {
  id: number; // Código único del contrato
  fechaContrato: string; // Fecha del contrato
  cliente: Cliente; // Información del cliente
  usuario: Usuario; // Información del vendedor
  testigos: Testigo[]; // Lista de testigos
  sucursal: Sucursal; // Información de la sucursal
  productos: Producto[]; // Lista de productos vendidos
  montoVenta: number; // Monto total de la venta
  cuotaInicial: number; // Pago inicial
  cuotasTotales: number; // Número total de cuotas
  garantiaMeses: number; // Meses de garantía
  dpi: string; // DPI del cliente (puede ser vacío)
  diasEntrePagos: number; // Días entre cada cuota
  interes: number; // Interés aplicado
  totalVenta: number; // Monto total de la venta con intereses
  montoTotalConInteres: number;
  totalPagado: number;
};

//------------

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
    montoTotalConInteres,
    totalPagado,
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

  function formatearMoneda(cantidad: number) {
    return new Intl.NumberFormat("es-GT", {
      style: "currency",
      currency: "GTQ",
    }).format(cantidad);
  }
  const calcularDetallesCredito = () => {
    // const saldoRestante = montoTotalConInteres - totalPagado;
    const montoPorCuota = (montoTotalConInteres - cuotaInicial) / cuotasTotales;

    return {
      montoPorCuota,
    };
  };
  const { montoPorCuota } = calcularDetallesCredito();
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
    cuotaMensual: formatearMoneda(montoPorCuota),
    garantiaMeses,
    testigos: testigosData,
    cuotasFechas: cuotasFechas,
    montoTotalConInteres,
    totalPagado,
    montoPorCuota: montoPorCuota,
  };
  // Generar el HTML usando Handlebars
  const htmlOutput = template(data);

  // Función para generar el PDF usando html2pdf.js
  const generarPDF = () => {
    // Incluir los estilos usados en el editor enriquecido
    const element = document.createElement("div");
    element.innerHTML = `
      <style>
        /* Estilos personalizados usados en el editor enriquecido */
        .ql-align-justify {
          text-align: justify;
        }
        .ql-align-center {
          text-align: center;
        }
        .ql-align-right {
          text-align: right;
        }
        p {
          margin: 0; /* Asegurarte de que no haya márgenes extraños */
        }
      </style>
      ${htmlOutput} <!-- Usamos el HTML generado por Handlebars -->
    `;

    const options = {
      margin: [15, 15, 15, 15],
      filename: "contrato.pdf",
      html2canvas: {
        scale: 3,
        logging: true,
        useCORS: true,
        letterRendering: true, // Mejor renderizado de texto
      },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    // Generar el PDF
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
