// src/types/tanstack-table.d.ts
import "@tanstack/react-table";
import type { RowData } from "@tanstack/react-table";

declare module "@tanstack/react-table" {
  // Meta disponible en table.options.meta
  interface TableMeta<TData extends RowData> {
    onOpenDetalle?: (row: TData) => void;
  }

  //   // (Opcional) Tipar meta de columnas para clases utilitarias
  //   interface ColumnMeta<TData extends RowData, TValue> {
  //     className?: string;
  //     headerClassName?: string;
  //   }
}
