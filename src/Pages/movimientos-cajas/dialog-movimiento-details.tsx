import type React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type {
  MovimientoCajaItem,
  TipoMovimientoCaja,
} from "./Interfaces/types";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Calendar,
  DollarSign,
  Building2,
  FileText,
  CreditCard,
  Hash,
  Banknote,
  UserCheck,
} from "lucide-react";
import {
  getTipoStyles,
  getTipoIcon,
  getCategoriaStyles,
} from "./utils/movimiento-styles";
import { CategoriaMovimiento } from "../Caja/Movimientos/types";
import { formattMonedaGT } from "@/utils/formattMoneda";
import { formateDateWithMinutes } from "@/Crm/Utils/FormateDate";

interface PropsDialogQuickView {
  selected: MovimientoCajaItem | null;
  setOpenDetalle: React.Dispatch<React.SetStateAction<boolean>>;
  openDetalle: boolean;
}

function DialogMovimientoDetails({
  openDetalle,
  selected,
  setOpenDetalle,
}: PropsDialogQuickView) {
  if (!selected) {
    return null;
  }

  const isIngreso = selected.tipo === "INGRESO" || selected.tipo === "VENTA";

  return (
    <Dialog open={openDetalle} onOpenChange={setOpenDetalle}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Detalle de Movimiento #{selected.id}
            <Badge
              className={getTipoStyles(selected.tipo as TipoMovimientoCaja)}
            >
              <span className="mr-1">
                {getTipoIcon(selected.tipo as TipoMovimientoCaja)}
              </span>
              {selected.tipo}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 p-4">
          {/* Monto */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <DollarSign
                className={`h-4 w-4 ${
                  isIngreso ? "text-green-600" : "text-red-600"
                }`}
              />
              <span className="text-xs font-medium text-muted-foreground">
                Monto
              </span>
            </div>
            <p
              className={`text-lg font-bold ${
                isIngreso ? "text-green-600" : "text-red-600"
              }`}
            >
              {formattMonedaGT(selected.monto)}
            </p>
          </div>

          {/* Fecha */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground">
                Fecha
              </span>
            </div>
            <p className="text-sm font-semibold">
              {formateDateWithMinutes(selected.fecha)}
            </p>
          </div>

          {/* Usuario */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground">
                Usuario
              </span>
            </div>
            <p className="text-sm font-semibold">
              {selected.usuario?.nombre ?? "Sin usuario"}
            </p>
            {selected.usuario?.correo && (
              <p className="text-xs text-muted-foreground">
                {selected.usuario.correo}
              </p>
            )}
          </div>

          {/* Caja */}
          {selected.caja && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground">
                  Caja
                </span>
              </div>
              <p className="text-sm font-semibold">Caja #{selected.caja.id}</p>
              <p className="text-xs text-muted-foreground">
                {selected.caja.sucursal.nombre}
              </p>
            </div>
          )}

          {/* Categoría */}
          {selected.categoria && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Hash className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground">
                  Categoría
                </span>
              </div>
              <Badge
                className={`${getCategoriaStyles(
                  selected.categoria as CategoriaMovimiento
                )} text-xs px-2 py-1`}
              >
                {selected.categoria.replace(/_/g, " ")}
              </Badge>
            </div>
          )}

          {/* Banco */}
          {selected.banco && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Banknote className="h-4 w-4 text-blue-600" />
                <span className="text-xs font-medium text-muted-foreground">
                  Banco
                </span>
              </div>
              <p className="text-sm font-semibold text-blue-600">
                {selected.banco}
              </p>
            </div>
          )}

          {/* Número de Boleta */}
          {selected.numeroBoleta && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground">
                  Número de Boleta
                </span>
              </div>
              <p className="text-sm font-semibold font-mono">
                {selected.numeroBoleta}
              </p>
            </div>
          )}

          {/* Referencia */}
          {selected.referencia && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Hash className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground">
                  Referencia
                </span>
              </div>
              <p className="text-xs font-mono">{selected.referencia}</p>
            </div>
          )}

          {/* Proveedor */}
          {selected.proveedor && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <UserCheck className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground">
                  Proveedor
                </span>
              </div>
              <p className="text-sm font-semibold">
                {selected.proveedor.nombre}
              </p>
            </div>
          )}
        </div>

        {/* Descripción - Sección completa si existe */}
        {selected.descripcion && (
          <div className="px-4 pb-2">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground">
                  Descripción
                </span>
              </div>
              <p className="text-xs leading-relaxed bg-muted/50 p-2 rounded">
                {selected.descripcion}
              </p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-muted-foreground px-4 pb-4 border-t pt-2">
          <span>
            Usado para cierre: {selected.usadoParaCierre ? "Sí" : "No"}
          </span>
          <span>Creado: {formateDateWithMinutes(selected.creadoEn)}</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default DialogMovimientoDetails;
