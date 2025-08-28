"use client";

import { createColumnHelper, type ColumnDef } from "@tanstack/react-table";

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
import {
  Info,
  Eye,
  User,
  Calendar,
  DollarSign,
  Package,
  FileText,
  Building,
} from "lucide-react";
import { getEstadoIcon, getEstadoStyles, truncateText } from "./compras.utils";
import { formattFechaWithMinutes } from "../Utils/Utils";
import { formattMonedaGT } from "@/utils/formattMoneda";
import { CompraListItem } from "./Interfaces/Interfaces1";
import { Link } from "react-router-dom";

const ch = createColumnHelper<CompraListItem>();

export const comprasColumns: ColumnDef<CompraListItem, any>[] = [
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

  ch.accessor("fecha", {
    header: () => (
      <div className="flex items-center gap-1">
        <Calendar className="h-3 w-3" />
        <span className="font-medium text-xs">Fecha</span>
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

  ch.accessor("usuario.nombre", {
    header: () => (
      <div className="flex items-center gap-1">
        <User className="h-3 w-3" />
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

  ch.accessor("proveedor.nombre", {
    header: () => (
      <div className="flex items-center gap-1">
        <Building className="h-3 w-3" />
        <span className="font-medium text-xs">Proveedor</span>
      </div>
    ),
    cell: (info) => (
      <div className="text-xs">
        {info.getValue() ? (
          <span className="font-medium">
            {truncateText(info.getValue(), 15)}
          </span>
        ) : (
          <span className="text-muted-foreground italic">Sin proveedor</span>
        )}
      </div>
    ),
    enableSorting: true,
    enableColumnFilter: true,
    size: 120,
  }),

  ch.accessor("folioOrigen", {
    header: () => (
      <div className="flex items-center gap-1">
        <FileText className="h-3 w-3" />
        <span className="font-medium text-xs">Requisición | Pedido</span>
      </div>
    ),
    cell: (info) => (
      <div className="text-xs">
        {info.getValue() ? (
          <span className="font-mono font-medium text-blue-600 dark:text-blue-400">
            {info.getValue()}
          </span>
        ) : (
          <span className="text-muted-foreground">—</span>
        )}
      </div>
    ),
    enableSorting: true,
    enableColumnFilter: true,
    size: 100,
  }),

  ch.accessor("total", {
    header: () => (
      <div className="flex items-center gap-1">
        <DollarSign className="h-3 w-3" />
        <span className="font-medium text-xs">Total</span>
      </div>
    ),
    cell: (info) => (
      <div className="font-mono text-xs font-semibold text-green-600 dark:text-green-400">
        {formattMonedaGT(info.getValue())}
      </div>
    ),
    enableSorting: true,
    enableColumnFilter: true,
    size: 90,
  }),

  ch.accessor("resumen.items", {
    header: () => (
      <div className="flex items-center gap-1">
        <Package className="h-3 w-3" />
        <span className="font-medium text-xs">Items</span>
      </div>
    ),
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

  ch.accessor("resumen.cantidadTotal", {
    header: () => <span className="font-medium text-xs">Cant.</span>,
    cell: (info) => (
      <div className="flex items-center justify-center">
        <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-medium bg-purple-100 text-purple-800 rounded-full dark:bg-purple-900/20 dark:text-purple-400">
          {info.getValue()}
        </span>
      </div>
    ),
    enableSorting: true,
    enableColumnFilter: true,
    size: 60,
  }),

  ch.accessor("conFactura", {
    header: () => <span className="font-medium text-xs">Factura</span>,
    cell: (info) => (
      <div className="flex items-center justify-center">
        {info.getValue() ? (
          <span className="text-green-600 dark:text-green-400">✓</span>
        ) : (
          <span className="text-red-600 dark:text-red-400">✗</span>
        )}
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
        <span
          className={`${getEstadoStyles(
            info.getValue()
          )} text-xs px-2 py-1 rounded-full font-medium`}
        >
          {info.getValue().replace("_", " ")}
        </span>
      </div>
    ),
    enableSorting: true,
    enableColumnFilter: true,
    size: 140,
  }),

  ch.accessor("tipoOrigen", {
    header: () => <span className="font-medium text-xs">Tipo</span>,
    cell: (info) => (
      <div className="flex items-center gap-1">
        <span className="text-xs">{getEstadoIcon(info.getValue())}</span>
        <span
          className={`${getEstadoStyles(
            info.getValue()
          )} text-xs px-2 py-1 rounded-full font-medium`}
        >
          {info.getValue().replace("_", " ")}
        </span>
      </div>
    ),
    enableSorting: true,
    enableColumnFilter: true,
    size: 140,
  }),

  ch.display({
    id: "acciones",
    header: () => <span className="font-medium text-xs">Acciones</span>,
    cell: (info) => {
      const compra = info.row.original;
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
            <PopoverContent className="w-80" align="end">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-semibold">
                    Compra #{compra.id}
                  </div>
                  <span
                    className={`${getEstadoStyles(
                      compra.estado
                    )} text-xs px-2 py-1 rounded-full font-medium`}
                  >
                    {compra.estado.replace("_", " ")}
                  </span>
                </div>

                <div className="text-xs text-muted-foreground space-y-1">
                  <div className="font-medium">
                    Usuario: {compra.usuario.nombre}
                  </div>
                  <div>Fecha: {formattFechaWithMinutes(compra.fecha)}</div>
                  {compra.proveedor && (
                    <div>Proveedor: {compra.proveedor.nombre}</div>
                  )}
                  {compra.requisicion && (
                    <div>
                      Requisición:{" "}
                      {compra.requisicion.folio
                        ? compra.requisicion.folio
                        : compra.pedido.folio}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="space-y-0.5">
                    <div className="text-xs text-muted-foreground">Total</div>
                    <div className="font-semibold text-green-600">
                      {formattMonedaGT(compra.total)}
                    </div>
                  </div>
                  <div className="space-y-0.5">
                    <div className="text-xs text-muted-foreground">Items</div>
                    <div className="font-semibold text-blue-600">
                      {compra.resumen.items} ({compra.resumen.cantidadTotal}{" "}
                      unidades)
                    </div>
                  </div>
                </div>

                <div className="flex justify-between text-xs">
                  <span>Factura: {compra.conFactura ? "Sí" : "No"}</span>
                  <span>Detalles: {compra.detalles.length}</span>
                </div>

                <Link to={`/compra/${compra.id}`}>
                  <span className="text-xs pt-2 font-semibold text-blue-500 hover:underline hover:text-blue-600">
                    Ver compra completa
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
                  onClick={() =>
                    info.table.options.meta?.onOpenDetalle?.(compra)
                  }
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
