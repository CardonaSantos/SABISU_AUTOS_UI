import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RegistroCajaResponse } from "../interfaces/registroscajas.interfaces";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { User, Calendar, DollarSign, Building } from "lucide-react";
import { formattFechaWithMinutes } from "@/Pages/Utils/Utils";
import { formattMonedaGT } from "@/utils/formattMoneda";
import { getEstadoStyles } from "../utils/estadoStyles";

interface PropsDialogQuickView {
  selected: RegistroCajaResponse | null;
  setOpenDetalle: React.Dispatch<React.SetStateAction<boolean>>;
  openDetalle: boolean;
}

function DialogCajaDetails({
  openDetalle,
  selected,
  setOpenDetalle,
}: PropsDialogQuickView) {
  if (!selected) {
    return null;
  }

  return (
    <Dialog open={openDetalle} onOpenChange={setOpenDetalle}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Detalle de Caja #{selected.id}
            <Badge className={getEstadoStyles(selected.estado)}>
              {selected.estado}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Usuario</span>
                  </div>
                  <p className="text-lg font-semibold">
                    {selected.usuarioInicio?.nombre ?? "N/A"}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Sucursal</span>
                  </div>
                  <p className="text-lg font-semibold">
                    {selected.sucursal.nombre}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">
                      Fecha de Apertura
                    </span>
                  </div>
                  <p className="text-lg font-semibold">
                    {formattFechaWithMinutes(selected.fechaApertura)}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Fecha de Cierre</span>
                  </div>
                  <p className="text-lg font-semibold">
                    {selected.fechaCierre
                      ? formattFechaWithMinutes(selected.fechaCierre)
                      : "Pendiente"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">Saldo Inicial</span>
                  </div>
                  <p className="text-xl font-bold text-green-600">
                    {formattMonedaGT(selected.saldoInicial)}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium">Saldo Final</span>
                  </div>
                  <p className="text-xl font-bold text-blue-600">
                    {selected.saldoFinal
                      ? formattMonedaGT(selected.saldoFinal)
                      : "Pendiente"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  <span className="text-sm font-medium">Movimientos</span>
                  <p className="text-2xl font-bold text-blue-600">
                    {selected.movimientosLenght}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  <span className="text-sm font-medium">Ventas</span>
                  <p className="text-2xl font-bold text-green-600">
                    {selected.ventasLenght}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default DialogCajaDetails;
