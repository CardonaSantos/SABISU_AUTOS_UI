import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  ShoppingCart,
  User,
  Building2,
  FileText,
  Package,
  Phone,
  MapPin,
  Text,
} from "lucide-react";

import Select from "react-select";
import { useState, useEffect } from "react";
import { formattMonedaGT } from "@/utils/formattMoneda";
import { formattFechaWithMinutes } from "@/Pages/Utils/Utils";
import { PedidoDetalleUI } from "../Interfaces/PedidoResponse";
import {
  useApiMutation,
  useApiQuery,
} from "@/hooks/genericoCall/genericoCallHook";
import { AdvancedDialog } from "@/utils/components/AdvancedDialog";
import { toast } from "sonner";
import { getApiErrorMessageAxios } from "@/Pages/Utils/UtilsErrorApi";
import { useProveedoresSelect } from "@/hooks/getProveedoresSelect/proveedores";

interface SendPedidoToCompraDto {
  proveedorId: number;
  pedidoId: number;
  userID: number;
  sucursalId: number;
}

interface Option {
  value: number;
  label: string;
}

export default function PedidoDetails() {
  const { id } = useParams();
  const pedidoID = id ? parseInt(id) : 0;
  const [openDialog, setOpenDialog] = useState(false);
  const [pedidoToSend, setPedidoToSend] =
    useState<SendPedidoToCompraDto | null>(null);

  const { data: proveedores } = useProveedoresSelect();

  const options: Option[] = (proveedores ?? []).map((p) => ({
    value: p.id,
    label: `${p.nombre} (${p.telefonoContacto ?? "Sin contacto"})`,
  }));

  const {
    data: pedido,
    isLoading,
    isError,
    refetch: refetchPedido,
  } = useApiQuery<PedidoDetalleUI>(
    ["pedido-detalle", pedidoID],
    `pedidos/get-pedido/${pedidoID}`,
    {},
    { enabled: pedidoID > 0 }
  );

  useEffect(() => {
    if (pedido) {
      setPedidoToSend({
        proveedorId: 0, // se elegirá en el select
        pedidoId: pedido.id,
        userID: pedido.usuario.id,
        sucursalId: pedido.sucursal.id,
      });
    }
  }, [pedido]);

  const crearPedidoMut = useApiMutation<any, SendPedidoToCompraDto>(
    "post",
    "pedidos/send-pedido-to-compras",
    {},
    {
      onSuccess: () => {
        toast.success("Pedido enviado a compras");
        refetchPedido();
        setOpenDialog(false);
      },
      onError: (err) => {
        toast.error(getApiErrorMessageAxios(err));
      },
    }
  );

  if (isLoading)
    return (
      <div className="flex items-center gap-2 justify-center py-6 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" /> Cargando pedido…
      </div>
    );

  if (isError || !pedido)
    return (
      <p className="text-red-600 text-center py-6">
        No se pudo cargar el pedido.
      </p>
    );
  console.log("El pedido enmviar es. ", pedidoToSend);

  const isInArray = ["ENVIADO_COMPRAS", "RECIBIDO", "CANCELADO"].includes(
    pedido.estado
  );

  return (
    <div className="space-y-6 w-full">
      {/* ---- Datos Generales ---- */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex justify-between items-center text-xl">
            <span>Pedido #{pedido.folio}</span>
            <Badge variant="secondary">{pedido.estado}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div>
            <p>
              <strong>Tipo:</strong> {pedido.tipo}
            </p>
            <p>
              <strong>Prioridad:</strong>
              <Badge className="ml-2">{pedido.prioridad}</Badge>
            </p>
            <p>
              <strong>Fecha:</strong> {formattFechaWithMinutes(pedido.fecha)}
            </p>
          </div>
          <div>
            <p className="flex items-center gap-2">
              <Building2 className="h-4 w-4" /> Sucursal:{" "}
              {pedido.sucursal?.nombre}
            </p>
            <p className="flex items-center gap-2">
              <User className="h-4 w-4" /> Usuario: {pedido.usuario?.nombre} (
              {pedido.usuario?.correo})
            </p>
          </div>
        </CardContent>
      </Card>

      {/* ---- Cliente ---- */}
      {pedido.tipo === "CLIENTE" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Cliente</CardTitle>
          </CardHeader>
          <CardContent>
            {pedido.cliente ? (
              <div className="grid gap-3 md:grid-cols-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">
                    {pedido.cliente.nombre} {pedido.cliente.apellidos ?? ""}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{pedido.cliente.telefono ?? "—"}</span>
                </div>
                <div className="flex items-center gap-2 md:col-span-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="truncate">
                    {pedido.cliente.direccion ?? "—"}
                  </span>
                </div>
                <div className="flex items-center gap-2 md:col-span-2">
                  <Text className="h-4 w-4 text-muted-foreground" />
                  <span className="truncate">
                    {pedido.cliente.observaciones ?? "—"}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">Sin cliente asignado</p>
            )}
          </CardContent>
        </Card>
      )}

      {/* ---- Observaciones ---- */}
      {pedido.observaciones && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="h-4 w-4" /> Observaciones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{pedido.observaciones}</p>
          </CardContent>
        </Card>
      )}

      {/* ---- Productos ---- */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Package className="h-4 w-4" /> Productos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="divide-y">
            {pedido.lineas.map((linea) => (
              <li key={linea.id} className="py-3 flex items-center gap-4">
                {linea.producto.imagenUrl ? (
                  <img
                    src={linea.producto.imagenUrl}
                    alt={linea.producto.nombre}
                    className="h-14 w-14 object-cover rounded"
                  />
                ) : (
                  <div className="h-14 w-14 flex items-center justify-center rounded bg-gray-100 text-gray-400">
                    📦
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium">{linea.producto.nombre}</p>
                  <p className="text-xs text-muted-foreground">
                    Código: {linea.producto.codigoProducto}
                  </p>
                  <p className="text-sm">Cantidad: {linea.cantidad}</p>
                  {linea.notas && (
                    <p className="text-xs italic text-muted-foreground">
                      Nota: {linea.notas}
                    </p>
                  )}
                </div>
                <div className="text-right text-sm font-semibold">
                  {formattMonedaGT(linea.subtotal)}
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* ---- Totales + Acciones ---- */}
      <Card>
        <CardContent className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div>
            <p>
              <strong>Items:</strong> {pedido.totalLineas}
            </p>
            <p>
              <strong>Total:</strong>{" "}
              <span className="font-bold">
                {formattMonedaGT(pedido.totalPedido)}
              </span>
            </p>
          </div>
          <Button
            disabled={isInArray}
            onClick={() => setOpenDialog(true)}
            className="flex items-center gap-2"
          >
            <ShoppingCart className="h-4 w-4" /> Enviar a módulo de compras
          </Button>
        </CardContent>
      </Card>

      {/* ---- Dialog Enviar ---- */}
      <AdvancedDialog
        open={openDialog}
        onOpenChange={setOpenDialog}
        title="Confirmar envío a Compras"
        description="Este pedido será transferido al módulo de Compras y ya no podrá editarse ni eliminarse."
        confirmButton={{
          label: "Sí, enviar a Compras",
          loadingText: "Enviando a Compras...",
          loading: crearPedidoMut.isPending,
          disabled: crearPedidoMut.isPending || !pedidoToSend?.proveedorId,
          onClick: () => {
            if (pedidoToSend) crearPedidoMut.mutate(pedidoToSend);
          },
        }}
        cancelButton={{
          label: "Cancelar",
          disabled: crearPedidoMut.isPending,
          onClick: () => setOpenDialog(false),
        }}
      >
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Seleccione el proveedor para este pedido
          </p>
          <Select
            options={options}
            value={
              pedidoToSend?.proveedorId
                ? options.find(
                    (opt) => opt.value === pedidoToSend.proveedorId
                  ) ?? null
                : null
            }
            onChange={(selected) =>
              setPedidoToSend((prev) =>
                prev
                  ? { ...prev, proveedorId: (selected as Option).value }
                  : null
              )
            }
          />
        </div>
      </AdvancedDialog>
    </div>
  );
}
