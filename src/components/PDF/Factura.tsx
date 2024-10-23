import React, { Fragment } from "react";
import {
  Image,
  Text,
  View,
  Page,
  Document,
  StyleSheet,
} from "@react-pdf/renderer";
import logo from "../../assets/nv2.png";
import { VentaHistorialPDF } from "@/Types/PDF/VentaHistorialPDF";
import dayjs from "dayjs";
import "dayjs/locale/es"; // Importa el idioma español
import localizedFormat from "dayjs/plugin/localizedFormat";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(localizedFormat);
dayjs.extend(customParseFormat);
dayjs.locale("es");
const formatearFecha = (fecha: string) => {
  let nueva_fecha = dayjs(fecha).format("DD MMMM YYYY, hh:mm:ss A");
  return nueva_fecha;
};

interface VentaProps {
  venta: VentaHistorialPDF | undefined;
}

const Factura: React.FC<VentaProps> = ({ venta }) => {
  const styles = StyleSheet.create({
    page: {
      fontSize: 11,
      paddingTop: 10,
      paddingLeft: 40,
      paddingRight: 40,
      lineHeight: 1.5,
      flexDirection: "column",
    },

    spaceBetween: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      color: "#3E3E3E",
    },

    titleContainer: { flexDirection: "row", marginTop: 24 },

    logo: { width: 70 },

    reportTitle: { fontSize: 16, textAlign: "center" },

    addressTitle: { fontSize: 11, fontWeight: "bold" },

    invoice: { fontWeight: "bold", fontSize: 15 },

    invoiceNumber: { fontSize: 11, fontWeight: "bold" },

    address: { fontWeight: 400, fontSize: 10 },

    theader: {
      marginTop: 20,
      fontSize: 10,
      fontWeight: "bold",
      paddingTop: 4,
      paddingLeft: 7,
      flex: 1,
      height: 20,
      backgroundColor: "#DEDEDE",
      borderColor: "whitesmoke",
      borderRightWidth: 1,
      borderBottomWidth: 1,
    },

    theader2: { flex: 2, borderRightWidth: 0, borderBottomWidth: 1 },

    tbody: {
      fontSize: 9,
      paddingTop: 4,
      paddingLeft: 7,
      flex: 1,
      borderColor: "whitesmoke",
      borderRightWidth: 1,
      borderBottomWidth: 1,
    },

    total: {
      fontSize: 9,
      paddingTop: 4,
      paddingLeft: 7,
      flex: 1.5,
      borderColor: "whitesmoke",
      borderBottomWidth: 1,
    },

    tbody2: { flex: 2, borderRightWidth: 1 },
  });

  const InvoiceTitle = () => (
    <View style={styles.titleContainer}>
      <View style={styles.spaceBetween}>
        <Image style={styles.logo} src={logo} />
      </View>
    </View>
  );

  const Address = () => (
    <View style={styles.titleContainer}>
      <View style={styles.spaceBetween}>
        <View>
          <Text style={styles.invoice}>Nova Sistemas</Text>
          <Text style={styles.invoiceNumber}>
            Factura número: #{venta?.id ? venta.id : "No disponible"}
          </Text>
        </View>
        <View>
          <Text style={styles.addressTitle}>
            {" "}
            Sucursal: C. Central Juan Pablo II, Jacaltenango
          </Text>
          <Text style={styles.addressTitle}>Teléfono: +502 5375 2853</Text>
        </View>
      </View>
    </View>
  );

  const UserAddress = () => (
    <View style={styles.titleContainer}>
      <View style={styles.spaceBetween}>
        <View style={{ maxWidth: 200 }}>
          <Text style={styles.addressTitle}>Factura a</Text>
          <Text style={styles.address}>
            {venta?.cliente?.nombre || venta?.nombreClienteFinal || "CF"}
          </Text>

          <Text style={styles.address}>
            {venta?.cliente?.telefono ?? venta?.telefonoClienteFinal ?? null}
          </Text>

          <Text style={styles.address}>
            {venta?.cliente?.direccion ?? venta?.direccionClienteFinal ?? null}
          </Text>

          <Text style={styles.address}>
            Pago:{" "}
            {venta?.metodoPago
              ? venta.metodoPago.metodoPago
              : "Sin método de pago"}
          </Text>
          {/* {venta?.cliente?.direccion ?? venta?.direccionClienteFinal ?? null} */}

          {/* <Text style={styles.address}>
            Encargado: Kandyy
          </Text> */}
        </View>
        <Text style={styles.addressTitle}>
          {venta?.fechaVenta
            ? formatearFecha(venta.fechaVenta)
            : "Fecha no disponible"}
        </Text>
      </View>
    </View>
  );
  const TableHead = () => (
    <View style={{ width: "100%", flexDirection: "row", marginTop: 10 }}>
      <View style={[styles.theader, styles.theader2]}>
        <Text>Productos</Text>
      </View>
      <View style={styles.theader}>
        <Text>Precio</Text>
      </View>
      <View style={styles.theader}>
        <Text>Cantidad</Text>
      </View>
      <View style={styles.theader}>
        <Text>Sub total</Text>
      </View>
    </View>
  );
  const TableBody = () =>
    venta?.productos?.length ? (
      venta.productos.map((productoVenta) => (
        <Fragment key={productoVenta.id}>
          <View style={{ width: "100%", flexDirection: "row" }}>
            <View style={[styles.tbody, styles.tbody2]}>
              <Text>
                {productoVenta?.producto?.nombre
                  ? productoVenta.producto.nombre
                  : "Producto no disponible"}
              </Text>
            </View>
            <View style={styles.tbody}>
              <Text>
                {productoVenta?.producto?.precioVenta
                  ? new Intl.NumberFormat("es-GT", {
                      style: "currency",
                      currency: "GTQ",
                    }).format(productoVenta.producto.precioVenta)
                  : "No disponible"}
              </Text>
            </View>
            <View style={styles.tbody}>
              <Text>
                {productoVenta?.cantidad ? productoVenta.cantidad : "N/A"}
              </Text>
            </View>
            <View style={styles.tbody}>
              <Text>
                {productoVenta?.producto?.precioVenta && productoVenta.cantidad
                  ? new Intl.NumberFormat("es-GT", {
                      style: "currency",
                      currency: "GTQ",
                    }).format(
                      productoVenta.producto.precioVenta *
                        productoVenta.cantidad
                    )
                  : "N/A"}
              </Text>
            </View>
          </View>
        </Fragment>
      ))
    ) : (
      <Text>No hay productos disponibles</Text>
    );

  const TableTotal = () => (
    <View style={{ width: "100%", flexDirection: "row" }}>
      <View style={styles.total}>
        <Text></Text>
      </View>
      <View style={styles.total}>
        <Text> </Text>
      </View>
      <View style={styles.tbody}>
        <Text>Total</Text>
      </View>
      <View style={styles.tbody}>
        <Text>
          {venta?.productos
            ? new Intl.NumberFormat("es-GT", {
                style: "currency",
                currency: "GTQ",
              }).format(
                venta.productos.reduce(
                  (sum, item) =>
                    sum +
                    (item?.producto?.precioVenta
                      ? item.producto.precioVenta * item.cantidad
                      : 0),
                  0
                )
              )
            : "N/A"}
        </Text>
      </View>
    </View>
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <InvoiceTitle />
        <Address />
        <UserAddress />
        <TableHead />
        <TableBody />
        <TableTotal />
      </Page>
    </Document>
  );
};

export default Factura;
