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
      lineHeight: 1.5,
      flexDirection: "column",
      backgroundColor: "#FFFFFF",
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 20,
    },
    logo: {
      width: 120,
      marginBottom: 10,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      color: "#fcb100",
      textAlign: "center",
      marginBottom: 20,
    },
    section: {
      marginBottom: 10,
      padding: 10,
      backgroundColor: "#f7f7f7",
      borderRadius: 5,
    },
    row: {
      flexDirection: "row",
      marginBottom: 5,
    },
    label: {
      fontWeight: "medium",
      fontSize: 11,
      width: "30%",
    },
    text: {
      fontSize: 11,
      width: "70%",
    },
    terms: {
      marginTop: 20,
      fontSize: 10,
      lineHeight: 1.5,
    },
    termItem: {
      marginBottom: 5,
    },
    signature: {
      marginTop: 30,
      fontSize: 11,
      textAlign: "center",
    },
    signatureLine: {
      marginTop: 40,
      borderTopWidth: 1,
      borderColor: "#000000",
      width: "60%",
      alignSelf: "center",
    },
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Image style={styles.logo} src={logo} />
        </View>

        <Text style={styles.title}>GARANTÍA DE DISPOSITIVO</Text>

        <View style={styles.section}>
          <View style={styles.row}>
            <Text style={styles.label}>Fecha de venta:</Text>
            <Text style={styles.text}>
              {venta?.fechaVenta
                ? formatearFecha(venta.fechaVenta)
                : "No disponible"}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Dispositivo:</Text>
            <Text style={styles.text}>
              {venta?.productos[0]?.producto?.nombre || "No disponible"}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Descripción:</Text>
            <Text style={styles.text}>
              {venta?.productos[0]?.producto?.descripcion || "No disponible"}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Cliente:</Text>
            <Text style={styles.text}>
              {venta?.cliente?.nombre ||
                venta?.nombreClienteFinal ||
                "No disponible"}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>IMEI:</Text>
            <Text style={styles.text}>{venta?.imei || "No disponible"}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>DPI:</Text>
            <Text style={styles.text}>
              {venta?.cliente?.dpi || "No disponible"}
            </Text>
          </View>
        </View>

        <View style={styles.terms}>
          <Text style={[styles.label, { marginBottom: 10 }]}>
            Términos de garantía:
          </Text>
          {[
            "Cubre garantía todo defecto de fábrica, pantalla, bocinas, micrófonos, teclados, baterías o software.",
            "Tiempo de garantía es de 6 meses a partir de la fecha de venta.",
            "No cubre garantía cuando el dispositivo esté dañado por golpes, humedad, uso inadecuado o manipulación por técnico externo.",
            'En caso de software, no aplica si el teléfono está "flasheado" o liberado.',
            "Si se da en garantía, el tiempo de reparación es de 5 a 6 semanas (No se realiza devolución de dinero).",
          ].map((term, index) => (
            <View key={index} style={styles.termItem}>
              <Text style={styles.text}>
                {index + 1}. {term}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.signature}>
          <Text>
            Acuso de recibo el dispositivo en correcto funcionamiento y acepto
            los términos de garantía.
          </Text>
          <View style={styles.signatureLine} />
          <Text style={{ marginTop: 5 }}>Firma del cliente</Text>
        </View>
      </Page>
    </Document>
  );
};

export default Garantia;
