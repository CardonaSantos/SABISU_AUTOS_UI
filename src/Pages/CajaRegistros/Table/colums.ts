import { createColumnHelper, ColumnDef } from "@tanstack/react-table";

import { RegistroCajaResponse } from "../interfaces/registroscajas.interfaces";

const ch = createColumnHelper<RegistroCajaResponse>();

export const columnas: ColumnDef<RegistroCajaResponse, any>[] = [
  ch.accessor("id", {
    header: "ID",
    cell: (info) => info.getValue(),
    enableSorting: true,
    enableColumnFilter: true,
  }),

  ch.accessor("usuarioInicio.nombre", {
    header: "Nombre",
    cell: (info) => info.getValue(),
    enableSorting: true,
    enableColumnFilter: true,
  }),
  ch.accessor("fechaApertura", {
    header: "F. Inicio",
    cell: (info) => info.getValue(),
    enableSorting: true,
    enableColumnFilter: true,
  }),

  ch.accessor("saldoInicial", {
    header: "Saldo Inicial",
    cell: (info) => info.getValue(),
    enableSorting: true,
    enableColumnFilter: true,
  }),

  ch.accessor("fechaCierre", {
    header: "F. Cierre",
    cell: (info) => info.getValue(),
    enableSorting: true,
    enableColumnFilter: true,
  }),
  ch.accessor("saldoFinal", {
    header: "Saldo Final",
    cell: (info) => info.getValue(),
    enableSorting: true,
    enableColumnFilter: true,
  }),
  ch.accessor("movimientoCaja", {
    header: "Movimientos",
    cell: (info) => info.getValue(),
    enableSorting: true,
    enableColumnFilter: true,
  }),
  ch.accessor("movimientosLenght", {
    header: "No. Movimientos Caja",
    cell: (info) => info.getValue(),
    enableSorting: true,
    enableColumnFilter: true,
  }),
  ch.accessor("ventasLenght", {
    header: "No. Ventas",
    cell: (info) => info.getValue(),
    enableSorting: true,
    enableColumnFilter: true,
  }),
];
