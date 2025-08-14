import { createColumnHelper, ColumnDef } from "@tanstack/react-table";
import { RegistroCajaResponse } from "../interfaces/registroscajas.interfaces";
import { formattFechaWithMinutes } from "@/Pages/Utils/Utils";
import { formattMonedaGT } from "@/utils/formattMoneda";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info, Eye, User, Calendar, DollarSign } from "lucide-react";
import { getEstadoStyles, getEstadoIcon } from "../utils/estadoStyles";
import { truncateText } from "../utils/textUtils";
import { Link } from "react-router-dom";

const ch = createColumnHelper<RegistroCajaResponse>();

export const columnas: ColumnDef<RegistroCajaResponse, any>[] = [
  ch.accessor("id", {
    header: () => (
      <div className="flex items-center gap-1">
        <span className="font-medium text-xs">ID</span>
      </div>
    ),
    cell: (info) => (
      <div className="font-mono text-xs font-medium">#{info.getValue()}</div>
    ),
    enableSorting: true,
    enableColumnFilter: true,
    size: 50,
  }),

  ch.accessor("usuarioInicio.nombre", {
    header: () => (
      <div className="flex items-center gap-1">
        <User className="h-3 w-3 " />
        <span className="font-medium text-xs">Usuario</span>
      </div>
    ),
    cell: (info) => (
      <div className="flex items-center gap-1.5">
        <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center">
          <User className="h-2.5 w-2.5 text-primary dark:text-white" />
        </div>
        <span className="font-medium text-xs">
          {truncateText(info.getValue() || "Sin usuario", 12)}
        </span>
      </div>
    ),
    enableSorting: true,
    enableColumnFilter: true,
    size: 120,
  }),

  ch.accessor("fechaApertura", {
    header: () => (
      <div className="flex items-center gap-1">
        <Calendar className="h-3 w-3" />
        <span className="font-medium text-xs">F. Inicio</span>
      </div>
    ),
    cell: (info) => (
      <div className="text-xs">
        {info.getValue() ? (
          <div className="space-y-0.5">
            <div className="font-medium">
              {formattFechaWithMinutes(info.getValue<string>()).split(" ")[0]}
            </div>
            <div className="text-xs text-muted-foreground">
              {formattFechaWithMinutes(info.getValue<string>()).split(" ")[1]}
            </div>
          </div>
        ) : (
          <span className="text-muted-foreground">—</span>
        )}
      </div>
    ),
    enableSorting: true,
    enableColumnFilter: true,
    size: 85,
  }),

  ch.accessor("saldoInicial", {
    header: () => (
      <div className="flex items-center gap-1">
        <DollarSign className="h-3 w-3" />
        <span className="font-medium text-xs">S. Inicial</span>
      </div>
    ),
    cell: (info) => (
      <div className="font-mono text-xs font-semibold text-green-600 dark:text-green-400">
        {info.getValue() ? formattMonedaGT(info.getValue()) : "—"}
      </div>
    ),
    enableSorting: true,
    enableColumnFilter: true,
    size: 90,
  }),

  ch.accessor("fechaCierre", {
    header: () => (
      <div className="flex items-center gap-1">
        <Calendar className="h-3 w-3" />
        <span className="font-medium text-xs">F. Cierre</span>
      </div>
    ),
    cell: (info) => (
      <div className="text-xs">
        {info.getValue() ? (
          <div className="space-y-0.5">
            <div className="font-medium">
              {formattFechaWithMinutes(info.getValue<string>()).split(" ")[0]}
            </div>
            <div className="text-xs text-muted-foreground">
              {formattFechaWithMinutes(info.getValue<string>()).split(" ")[1]}
            </div>
          </div>
        ) : (
          <span className="text-muted-foreground italic text-xs">
            Pendiente
          </span>
        )}
      </div>
    ),
    enableSorting: true,
    enableColumnFilter: true,
    size: 85,
  }),

  ch.accessor("saldoFinal", {
    header: () => (
      <div className="flex items-center gap-1">
        <DollarSign className="h-3 w-3" />
        <span className="font-medium text-xs">S. Final</span>
      </div>
    ),
    cell: (info) => (
      <div className="font-mono text-xs font-semibold text-blue-600 dark:text-blue-400">
        {info.getValue() ? formattMonedaGT(info.getValue()) : "—"}
      </div>
    ),
    enableSorting: true,
    enableColumnFilter: true,
    size: 90,
  }),

  ch.accessor("movimientosLenght", {
    header: () => <span className="font-medium text-xs">Mov.</span>,
    cell: (info) => (
      <div className="flex items-center justify-center">
        <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-medium bg-blue-100 text-blue-800 rounded-full dark:bg-blue-900/20 dark:text-blue-400">
          {info.getValue()}
        </span>
      </div>
    ),
    enableSorting: true,
    enableColumnFilter: true,
    size: 60,
  }),

  ch.accessor("ventasLenght", {
    header: () => <span className="font-medium text-xs">Ventas</span>,
    cell: (info) => (
      <div className="flex items-center justify-center">
        <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-medium bg-green-100 text-green-800 rounded-full dark:bg-green-900/20 dark:text-green-400">
          {info.getValue()}
        </span>
      </div>
    ),
    enableSorting: true,
    enableColumnFilter: true,
    size: 60,
  }),

  ch.accessor("estado", {
    header: () => <span className="font-medium text-xs">Estado</span>,
    cell: (info) => (
      <div className="flex items-center gap-1">
        <span className="text-xs">{getEstadoIcon(info.getValue())}</span>
        <span className={`${getEstadoStyles(info.getValue())} text-xs`}>
          {info.getValue()}
        </span>
      </div>
    ),
    enableSorting: true,
    enableColumnFilter: true,
    size: 90,
  }),

  ch.display({
    id: "acciones",
    header: () => <span className="font-medium text-xs">Acciones</span>,
    cell: (info) => {
      const caja = info.row.original;
      return (
        <div className="flex items-center gap-1">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-6 w-6 p-0 bg-transparent"
              >
                <Info className="h-3 w-3" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72" align="end">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-semibold">Caja #{caja.id}</div>
                  <span className={`${getEstadoStyles(caja.estado)} text-xs`}>
                    {caja.estado}
                  </span>
                </div>

                <div className="text-xs text-muted-foreground">
                  <div className="font-medium">{caja.sucursal.nombre}</div>
                  <div>
                    {formattFechaWithMinutes(caja.fechaApertura)} —{" "}
                    {caja.fechaCierre
                      ? formattFechaWithMinutes(caja.fechaCierre)
                      : "En curso"}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="space-y-0.5">
                    <div className="text-xs text-muted-foreground">Inicial</div>
                    <div className="font-semibold text-green-600">
                      {formattMonedaGT(caja.saldoInicial)}
                    </div>
                  </div>
                  <div className="space-y-0.5">
                    <div className="text-xs text-muted-foreground">Final</div>
                    <div className="font-semibold text-blue-600">
                      {formattMonedaGT(caja.saldoFinal)}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between text-xs">
                  <span>{caja.movimientosLenght} mov.</span>
                  <span>{caja.ventasLenght} ventas</span>
                </div>

                <Link to={`/caja/${caja.id}`}>
                  <span className="text-xs pt-2 font-semibold text-blue-500 hover:underline hover:text-blue-600">
                    Ver caja completa
                  </span>
                </Link>
              </div>
            </PopoverContent>
          </Popover>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  className="h-6 px-2 text-xs"
                  onClick={() => info.table.options.meta?.onOpenDetalle?.(caja)}
                >
                  <Eye className="h-3 w-3 mr-1" />
                  <span className="hidden sm:inline">Ver</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Ver detalle completo</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      );
    },
    size: 90,
  }),
];
