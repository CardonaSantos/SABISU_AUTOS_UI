"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Eye,
  MoreVertical,
  CreditCard,
  User,
  Building2,
  Package,
  FileText,
  MessageSquareText,
} from "lucide-react";
import { CreditoRegistro } from "./CreditosType";

import dayjs from "dayjs";
import "dayjs/locale/es";
import utc from "dayjs/plugin/utc";
import localizedFormat from "dayjs/plugin/localizedFormat";
import axios from "axios";
import { toast } from "sonner";
import { Link } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL;
dayjs.extend(utc);
dayjs.extend(localizedFormat);
dayjs.locale("es");

interface CreditRecordsTableProps {
  records: CreditoRegistro[];
}

interface Cuota {
  id: number;
  creadoEn: string;
  estado: string;
  fechaPago: string;
  monto: number;
  comentario: string;
  usuario: {
    id: number;
    nombre: string;
  };
}
interface CuotasCardProps {
  cuotas: Cuota[];
}
//===================================================>
interface Plantillas {
  id: number;
  texto: string;
  nombre: string;
}

const FormatearFecha = (fecha: string) => {
  // Formateo en UTC sin conversión a local
  return dayjs(fecha).format("DD/MM/YYYY hh:mm A");
};

const formatearMoneda = (cantidad: number) => {
  const nuevoFormato = new Intl.NumberFormat("es-GT", {
    style: "currency",
    currency: "GTQ",
  }).format(cantidad);
  return nuevoFormato;
};

export function CreditRecordsTable({ records }: CreditRecordsTableProps) {
  const [selectedRecord, setSelectedRecord] = useState<CreditoRegistro | null>(
    null
  );
  const [plantillas, setPlantillas] = useState<Plantillas[]>([]);

  const getAllPlantillas = async () => {
    try {
      const response = await axios.get(`${API_URL}/cuotas/get/plantillas`);
      if (response.status === 200) {
        setPlantillas(response.data);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error");
    }
  };

  useEffect(() => {
    getAllPlantillas();
  }, []);

  const calcularCuotas = () => {
    if (selectedRecord) {
      // Monto de interés sobre el total de la venta
      const montoInteres =
        selectedRecord.totalVenta * (selectedRecord.interes / 100);

      // Total con interés
      const montoTotalConInteres = selectedRecord.totalVenta + montoInteres;

      // Saldo restante después del enganche
      const saldoRestante = montoTotalConInteres - selectedRecord.cuotaInicial;

      // Pago por cuota
      const pagoPorCuota = saldoRestante / selectedRecord.cuotasTotales;

      return {
        saldoRestante,
        montoInteres,
        montoTotalConInteres,
        pagoPorCuota,
      };
    }
    return {
      saldoRestante: 0,
      montoInteres: 0,
      montoTotalConInteres: 0,
      pagoPorCuota: 0,
    };
  };

  const calcularMontoInteres = (totalVenta: number, interes: number) => {
    // Monto de interés sobre el total de la venta
    const montoInteres = totalVenta * (interes / 100);

    // Total con interés
    const montoTotalConInteres = totalVenta + montoInteres;

    // Saldo restante después del enganche

    return {
      montoTotalConInteres,
    };
  };

  function CuotasCard({ cuotas }: CuotasCardProps) {
    return (
      <Card className="w-full shadow-sm">
        <CardHeader>
          <h2 className="font-bold text-center">Historial de pagos</h2>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-[100px]">No</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha de Pago</TableHead>
                <TableHead>Monto</TableHead>
                <TableHead>Comentarios</TableHead>
                <TableHead>Usuario</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cuotas?.length > 0 ? (
                cuotas.map((cuota) => (
                  <TableRow key={cuota.id || "sin-id"}>
                    <TableCell className="font-medium">
                      #{cuota.id ?? "N/A"}
                    </TableCell>
                    <TableCell>{cuota.estado ?? "Desconocido"}</TableCell>
                    <TableCell>
                      {cuota.fechaPago
                        ? FormatearFecha(cuota.fechaPago)
                        : "Sin fecha"}
                    </TableCell>
                    <TableCell>
                      {cuota.monto !== undefined
                        ? formatearMoneda(cuota.monto)
                        : "Sin monto"}
                    </TableCell>
                    <TableCell>{cuota.comentario ?? ""}</TableCell>
                    <TableCell>
                      {cuota.usuario?.nombre ?? "Usuario no asignado"}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    No hay cuotas disponibles
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  }
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Créditos</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Venta Total</TableHead>
              <TableHead>Monto con interés</TableHead>
              <TableHead>Total Pagado</TableHead>
              <TableHead>Por pagar</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ver Detalles</TableHead>
              <TableHead>Imprimir</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.map((record) => (
              <TableRow key={record.id}>
                <TableCell>#{record.id}</TableCell>
                <TableCell>{record.cliente.nombre}</TableCell>
                <TableCell>
                  {Intl.NumberFormat("es-GT", {
                    style: "currency",
                    currency: "GTQ",
                  }).format(record.totalVenta)}
                </TableCell>

                <TableCell>
                  {formatearMoneda(
                    calcularMontoInteres(record.totalVenta, record.interes)
                      .montoTotalConInteres
                  )}
                </TableCell>

                <TableCell>
                  {Intl.NumberFormat("es-GT", {
                    style: "currency",
                    currency: "GTQ",
                  }).format(record.totalPagado)}
                </TableCell>

                <TableCell>
                  {formatearMoneda(
                    calcularMontoInteres(record.totalVenta, record.interes)
                      .montoTotalConInteres - record.totalPagado
                  )}
                </TableCell>

                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      record.estado === "ACTIVA"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {record.estado}
                  </span>
                </TableCell>
                <TableCell>
                  <Button
                    className="flex justify-center items-center"
                    variant={"outline"}
                    onClick={() => setSelectedRecord(record)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>

                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {plantillas &&
                        plantillas.map((plantilla) => (
                          <Link
                            to={`/imprimir/contrato/${record.id}/${plantilla.id}`}
                          >
                            <DropdownMenuItem key={plantilla.id}>
                              <FileText className="mr-2 h-4 w-4" />
                              Imprimir con: {plantilla.nombre}
                            </DropdownMenuItem>
                          </Link>
                        ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      <Dialog
        open={!!selectedRecord}
        onOpenChange={(open) => !open && setSelectedRecord(null)}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Más detalles del registro</DialogTitle>
          </DialogHeader>
          {selectedRecord && (
            <ScrollArea className="h-[85vh] pr-4">
              <div className="grid grid-cols-2 gap-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <User className="mr-2 h-5 w-5" /> Información del Cliente
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>
                      <strong>Nombre:</strong> {selectedRecord.cliente.nombre}
                    </p>

                    <p>
                      <strong>Dirección:</strong>{" "}
                      {selectedRecord.cliente.direccion ?? "N/A"}
                    </p>
                    <p>
                      <strong>Teléfono:</strong>{" "}
                      {selectedRecord.cliente.telefono ?? "N/A"}
                    </p>
                    <p>
                      <strong>DPI:</strong> {selectedRecord.dpi}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <CreditCard className="mr-2 h-5 w-5" /> Detalles del
                      Crédito
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>
                      <strong>Total Venta:</strong>{" "}
                      {formatearMoneda(selectedRecord.totalVenta)}
                    </p>
                    <p>
                      <strong>Pago Enganche:</strong>{" "}
                      {formatearMoneda(selectedRecord.cuotaInicial)}
                    </p>
                    <p>
                      <strong>Cuotas Totales:</strong>{" "}
                      {selectedRecord.cuotasTotales}
                    </p>
                    <p>
                      <strong>Cuotas Pagadas:</strong>{" "}
                      {selectedRecord.cuotas.length
                        ? selectedRecord.cuotas.length
                        : "Ninguna"}
                    </p>
                    <p>
                      <strong>Pago por cuotas:</strong>{" "}
                      {formatearMoneda(calcularCuotas().pagoPorCuota)}
                    </p>
                    <p>
                      <strong>Monto Total con Interés:</strong>{" "}
                      <span className="text-green-500 font-bold">
                        {formatearMoneda(calcularCuotas().montoTotalConInteres)}
                      </span>
                    </p>
                    <p>
                      <strong>Total Pagado:</strong>{" "}
                      <span
                        className={
                          selectedRecord.totalPagado <
                          calcularCuotas().montoTotalConInteres
                            ? "text-red-500 font-bold"
                            : "text-green-500 font-bold"
                        }
                      >
                        {new Intl.NumberFormat("es-GT", {
                          style: "currency",
                          currency: "GTQ",
                        }).format(selectedRecord.totalPagado)}
                      </span>
                    </p>

                    <p>
                      <strong>Interés Aplicado:</strong>{" "}
                      {selectedRecord.interes}%
                    </p>
                    <p>
                      <strong>Garantía (Meses):</strong>{" "}
                      {selectedRecord.garantiaMeses}
                    </p>
                    <p>
                      <strong>Fecha de registro:</strong>{" "}
                      {FormatearFecha(selectedRecord.fechaInicio)}
                    </p>
                    <p>
                      <strong>Status:</strong>

                      <span
                        className={
                          selectedRecord.estado === "COMPLETADA"
                            ? "text-green-500 font-semibold"
                            : "text-red-500 font-semibold"
                        }
                      >
                        {" "}
                        {selectedRecord.estado}
                      </span>
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <Package className="mr-2 h-5 w-5" /> Productos
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5">
                      {selectedRecord.productos.map((producto) => (
                        <li key={producto.id}>
                          {producto.producto.nombre} - ({"Código: "}
                          {producto.producto.codigoProducto}) -{" "}
                          {new Intl.NumberFormat("es-GT", {
                            style: "currency",
                            currency: "GTQ",
                          }).format(producto.precioVenta)}
                          {producto.cantidad}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <User className="mr-2 h-5 w-5" /> Testigos
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedRecord &&
                      selectedRecord.testigos
                        .filter(
                          (testigo) =>
                            testigo.direccion &&
                            testigo.nombre &&
                            testigo.telefono
                        )
                        .map((testigo, index) => (
                          <div key={index} className="mb-2">
                            <p>
                              <strong>Nombre:</strong> {testigo.nombre}
                            </p>
                            <p>
                              <strong>Teléfono:</strong> {testigo.telefono}
                            </p>
                            <p>
                              <strong>Dirección:</strong> {testigo.direccion}
                            </p>
                          </div>
                        ))}
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <Building2 className="mr-2 h-5 w-5" /> Sucursal
                      Información
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>
                      <strong>Nombre:</strong> {selectedRecord.sucursal.nombre}
                    </p>
                    <p>
                      <strong>Dirección:</strong>{" "}
                      {selectedRecord.sucursal.direccion}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <User className="mr-2 h-5 w-5" /> Usuario
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>
                      <strong>Nombre:</strong> {selectedRecord.usuario.nombre}
                    </p>
                  </CardContent>
                </Card>
              </div>
              <CuotasCard cuotas={selectedRecord.cuotas} />
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <MessageSquareText className="mr-2 h-5 w-5" /> Comentario
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    {selectedRecord.comentario
                      ? selectedRecord.comentario
                      : "No hay comentarios disponibles"}
                  </p>
                </CardContent>
              </Card>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}
