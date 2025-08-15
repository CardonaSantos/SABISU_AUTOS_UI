"use client";

import { createColumnHelper, type ColumnDef } from "@tanstack/react-table";
import type {
  MovimientoCajaItem,
  TipoMovimientoCaja,
} from "./Interfaces/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
  Building2,
  FileText,
  Hash,
} from "lucide-react";
import {
  getTipoStyles,
  getTipoIcon,
  getCategoriaStyles,
} from "./utils/movimiento-styles";
import { Link } from "react-router-dom";

const ch = createColumnHelper<MovimientoCajaItem>();

// Función helper para formatear fechas
const formatDate = (fecha: string) => {
  const date = new Date(fecha);
  const fechaStr = date.toLocaleDateString("es-GT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const horaStr = date.toLocaleTimeString("es-GT", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return { fecha: fechaStr, hora: horaStr };
};

// Función helper para formatear moneda
const formatMoneda = (monto: number) => {
  return new Intl.NumberFormat("es-GT", {
    style: "currency",
    currency: "GTQ",
    minimumFractionDigits: 2,
  }).format(monto);
};

// Función helper para truncar texto
const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

export const columnasMovimientos: ColumnDef<MovimientoCajaItem, any>[] = [
  ch.accessor("id", {
    header: () => (
      <div className="flex items-center gap-1">
        <Hash className="h-3 w-3" />
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

  ch.accessor("tipo", {
    header: () => (
      <div className="flex items-center gap-1">
        <span className="font-medium text-xs">Tipo</span>
      </div>
    ),
    cell: (info) => (
      <div className="flex items-center gap-1">
        <Badge
          className={`${getTipoStyles(info.getValue())} text-xs px-1.5 py-0.5`}
        >
          <span className="mr-1">{getTipoIcon(info.getValue())}</span>
          {info.getValue()}
        </Badge>
      </div>
    ),
    enableSorting: true,
    enableColumnFilter: true,
    size: 110,
  }),

  ch.accessor("fecha", {
    header: () => (
      <div className="flex items-center gap-1">
        <Calendar className="h-3 w-3" />
        <span className="font-medium text-xs">Fecha</span>
      </div>
    ),
    cell: (info) => {
      const { fecha, hora } = formatDate(info.getValue());
      return (
        <div className="text-xs">
          <div className="font-medium">{fecha}</div>
          <div className="text-xs text-muted-foreground">{hora}</div>
        </div>
      );
    },
    enableSorting: true,
    enableColumnFilter: true,
    size: 85,
  }),

  ch.accessor("monto", {
    header: () => (
      <div className="flex items-center gap-1">
        <DollarSign className="h-3 w-3" />
        <span className="font-medium text-xs">Monto</span>
      </div>
    ),
    cell: (info) => {
      const tipo = info.row.original.tipo;
      const isIngreso = tipo === "INGRESO" || tipo === "VENTA";
      return (
        <div
          className={`font-mono text-xs font-semibold ${
            isIngreso
              ? "text-green-600 dark:text-green-400"
              : "text-red-600 dark:text-red-400"
          }`}
        >
          {formatMoneda(info.getValue())}
        </div>
      );
    },
    enableSorting: true,
    enableColumnFilter: true,
    size: 90,
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

  ch.accessor("categoria", {
    header: () => (
      <div className="flex items-center gap-1">
        <span className="font-medium text-xs">Categoría</span>
      </div>
    ),
    cell: (info) => {
      const categoria = info.getValue();
      return categoria ? (
        <Badge
          className={`${getCategoriaStyles(categoria)} text-xs px-1.5 py-0.5`}
        >
          {categoria.replace(/_/g, " ")}
        </Badge>
      ) : (
        <span className="text-xs text-muted-foreground">—</span>
      );
    },
    enableSorting: true,
    enableColumnFilter: true,
    size: 120,
  }),

  ch.accessor("descripcion", {
    header: () => (
      <div className="flex items-center gap-1">
        <FileText className="h-3 w-3" />
        <span className="font-medium text-xs">Descripción</span>
      </div>
    ),
    cell: (info) => (
      <div className="text-xs">
        {info.getValue() ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="cursor-help">
                  {truncateText(info.getValue(), 25)}
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">{info.getValue()}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <span className="text-muted-foreground">—</span>
        )}
      </div>
    ),
    enableSorting: true,
    enableColumnFilter: true,
    size: 150,
  }),

  ch.accessor("caja.id", {
    header: () => (
      <div className="flex items-center gap-1">
        <Building2 className="h-3 w-3" />
        <span className="font-medium text-xs">Caja</span>
      </div>
    ),
    cell: (info) => {
      const caja = info.row.original.caja;
      return caja ? (
        <div className="text-xs">
          <div className="font-medium">#{caja.id}</div>
          <div className="text-xs text-muted-foreground">
            {caja.sucursal.nombre}
          </div>
        </div>
      ) : (
        <span className="text-xs text-muted-foreground">—</span>
      );
    },
    enableSorting: true,
    enableColumnFilter: true,
    size: 80,
  }),

  ch.display({
    id: "acciones",
    header: () => <span className="font-medium text-xs">Acciones</span>,
    cell: (info) => {
      const movimiento = info.row.original;
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
                  <div className="text-xs font-semibold">
                    Movimiento #{movimiento.id}
                  </div>
                  <Badge
                    className={`${getTipoStyles(
                      movimiento.tipo as TipoMovimientoCaja
                    )} text-xs`}
                  >
                    {movimiento.tipo}
                  </Badge>
                </div>

                <div className="text-xs text-muted-foreground">
                  <div className="font-medium">
                    {movimiento.usuario?.nombre || "Sin usuario"}
                  </div>
                  <div>
                    {formatDate(movimiento.fecha).fecha} -{" "}
                    {formatDate(movimiento.fecha).hora}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-2 text-xs">
                  <div className="space-y-0.5">
                    <div className="text-xs text-muted-foreground">Monto</div>
                    <div
                      className={`font-semibold ${
                        movimiento.tipo === "INGRESO" ||
                        movimiento.tipo === "VENTA"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {formatMoneda(movimiento.monto)}
                    </div>
                  </div>
                </div>

                {movimiento.descripcion && (
                  <div className="text-xs">
                    <div className="text-muted-foreground">Descripción:</div>
                    <div className="font-medium">
                      {truncateText(movimiento.descripcion, 50)}
                    </div>
                  </div>
                )}

                {movimiento.banco && (
                  <div className="text-xs">
                    <span className="text-muted-foreground">Banco: </span>
                    <span className="font-medium">{movimiento.banco}</span>
                  </div>
                )}

                {movimiento.numeroBoleta && (
                  <div className="text-xs">
                    <span className="text-muted-foreground">Boleta: </span>
                    <span className="font-medium">
                      {movimiento.numeroBoleta}
                    </span>
                  </div>
                )}

                <Link to={`/movimiento-caja/${movimiento.id}`}>
                  <span className="text-xs pt-2 font-semibold text-blue-500 hover:underline hover:text-blue-600">
                    Ver movimiento completo
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
                    info.table.options.meta?.onOpenDetalle?.(movimiento)
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
