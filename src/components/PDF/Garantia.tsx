import React from "react";
import {
  Image,
  Text,
  View,
  Page,
  Document,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import logo from "../../assets/LOGONOVA.jpg";
import { VentaHistorialPDF } from "@/Types/PDF/VentaHistorialPDF";
import dayjs from "dayjs";
import "dayjs/locale/es";
import localizedFormat from "dayjs/plugin/localizedFormat";

dayjs.extend(localizedFormat);
dayjs.locale("es");

// Registrar fuentes personalizadas
Font.register({
  family: "Roboto",
  fonts: [
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf",
      fontWeight: 300,
    },
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf",
      fontWeight: 400,
    },
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf",
      fontWeight: 500,
    },
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf",
      fontWeight: 700,
    },
  ],
});

const formatearFecha = (fecha: string) => {
  return dayjs(fecha).format("DD/MM/YYYY");
};

interface GarantiaProps {
  venta: VentaHistorialPDF | undefined;
}
const Garantia: React.FC<GarantiaProps> = ({ venta }) => {
  const styles = StyleSheet.create({
    page: {
      fontFamily: "Roboto",
      fontSize: 11,
      padding: 40,
      backgroundColor: "#FFFFFF",
      lineHeight: 1.5,
    },
    header: {
      flexDirection: "column",
      alignItems: "center",
      marginBottom: 20,
    },
    logo: {
      width: 100,
      height: 60,
      marginBottom: 10,
    },
    title: {
      fontSize: 22,
      fontWeight: "bold",
      color: "#fcb100",
      textAlign: "center",
      marginBottom: 20,
    },
    section: {
      marginBottom: 15,
      padding: 10,
      backgroundColor: "#f7f7f7",
      borderRadius: 5,
    },
    sectionTitle: {
      fontSize: 12,
      fontWeight: "bold",
      marginBottom: 5,
    },
    row: {
      flexDirection: "row",
      marginBottom: 5,
    },
    label: {
      fontWeight: "medium",
      fontSize: 11,
      width: "35%",
    },
    value: {
      fontSize: 11,
      width: "65%",
    },
    terms: {
      marginTop: 20,
      fontSize: 10,
      lineHeight: 1.5,
    },
    termItem: {
      marginBottom: 5,
    },
    signatureSection: {
      marginTop: 30,
      textAlign: "center",
    },
    signatureLine: {
      marginTop: 40,
      borderTopWidth: 1,
      borderColor: "#000000",
      width: "60%",
      alignSelf: "center",
    },
    footer: {
      marginTop: 30,
      fontSize: 10,
      textAlign: "center",
    },
  });

  return (
    <Document>
      {venta?.productos.map((producto, index) => (
        <Page key={index} size="A4" style={styles.page}>
          <View style={styles.header}>
            <Image src={logo} style={styles.logo} />
            <Text style={styles.title}>GARANTÍA DE DISPOSITIVO</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Detalles de la Venta</Text>
            <View style={styles.row}>
              <Text style={styles.label}>Número de Garantía en venta:</Text>
              <Text style={styles.value}>
                {venta?.id ? `#${venta.id}` : "No disponible"}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Fecha de venta:</Text>
              <Text style={styles.value}>
                {venta?.fechaVenta
                  ? formatearFecha(venta.fechaVenta)
                  : "No disponible"}
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Información del Producto</Text>
            <View style={styles.row}>
              <Text style={styles.label}>Dispositivo:</Text>
              <Text style={styles.value}>
                {producto?.producto?.nombre || "No disponible"}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Descripción:</Text>
              <Text style={styles.value}>
                {producto?.producto?.descripcion || "No disponible"}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>IMEI:</Text>
              <Text style={styles.value}>{venta?.imei || "No disponible"}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Información del Cliente</Text>
            <View style={styles.row}>
              <Text style={styles.label}>Cliente:</Text>
              <Text style={styles.value}>
                {venta?.cliente?.nombre ||
                  venta?.nombreClienteFinal ||
                  "No disponible"}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>DPI:</Text>
              <Text style={styles.value}>
                {venta?.cliente?.dpi || "No disponible"}
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Términos de la Garantía</Text>
            {[
              "Cubre garantía todo defecto de fábrica, pantalla, bocinas, micrófonos, teclados, baterías o software.",
              "Tiempo de garantía es de 6 meses a partir de la fecha de venta.",
              "No cubre garantía cuando el dispositivo esté dañado por golpes, humedad, uso inadecuado o manipulación por técnico externo.",
              'En caso de software, no aplica si el teléfono está "flasheado" o liberado.',
              "Si se da en garantía, el tiempo de reparación es de 5 a 6 semanas (No se realiza devolución de dinero).",
            ].map((term, idx) => (
              <View key={idx} style={styles.termItem}>
                <Text style={styles.value}>{`${idx + 1}. ${term}`}</Text>
              </View>
            ))}
          </View>

          <View style={styles.signatureSection}>
            <Text>
              Acuso de recibo el dispositivo en correcto funcionamiento y acepto
              los términos de garantía.
            </Text>
            <View style={styles.signatureLine} />
            <Text>Firma del cliente</Text>
          </View>

          <Text style={styles.footer}>
            Este documento es un comprobante oficial de garantía. Por favor,
            consérvelo para futuras referencias.
          </Text>
        </Page>
      ))}
    </Document>
  );
};

export default Garantia;
