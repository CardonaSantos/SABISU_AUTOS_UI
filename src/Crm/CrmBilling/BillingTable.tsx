"use client";

import { useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link } from "react-router-dom";
// import { Edit } from "lucide-react";
import { motion } from "framer-motion";

// type Cliente = {
//   id: number;
//   nombre: string;
//   telefono?: string;
//   direccion?: string;
//   dpi?: string;
//   iPInternet?: string;
//   creadoEn: string;
// };

type Factura = {
  id: number;
  metodo: string;
  cliente: string;
  cantidad: number;
  fechaCreado: string;
  por: string;
  telefono: number;
};

// **Datos de Prueba**
// **Datos de Facturación**
const clientesData: Factura[] = [
  {
    id: 101,
    metodo: "Tarjeta",
    cliente: "Mari Mileidy Camposeco",
    cantidad: 250.75,
    fechaCreado: "2025-02-25",
    por: "Admin 1",
    telefono: 40017273,
  },
  {
    id: 102,
    metodo: "Efectivo",
    cliente: "Juan Pérez",
    cantidad: 150.0,
    fechaCreado: "2025-02-24",
    por: "Cajero 2",
    telefono: 40017209,
  },
  {
    id: 103,
    metodo: "Transferencia",
    cliente: "María López",
    cantidad: 320.5,
    fechaCreado: "2025-02-23",
    por: "Admin 1",
    telefono: 400171233,
  },
  {
    id: 104,
    metodo: "Tarjeta",
    cliente: "Carlos Gómez",
    cantidad: 180.0,
    fechaCreado: "2025-02-22",
    por: "Cajero 3",
    telefono: 4001727312,
  },
  {
    id: 105,
    metodo: "Efectivo",
    cliente: "Ana Rodríguez",
    cantidad: 90.75,
    fechaCreado: "2025-02-21",
    por: "Cajero 1",
    telefono: 40345573,
  },
  {
    id: 106,
    metodo: "Transferencia",
    cliente: "Luis Méndez",
    cantidad: 400.0,
    fechaCreado: "2025-02-20",
    por: "Admin 2",
    telefono: 40013453,
  },
  {
    id: 107,
    metodo: "Tarjeta",
    cliente: "Pedro Ramírez",
    cantidad: 220.3,
    fechaCreado: "2025-02-19",
    por: "Cajero 2",
    telefono: 46517273,
  },
  {
    id: 108,
    metodo: "Efectivo",
    cliente: "Diana Fernández",
    cantidad: 135.25,
    fechaCreado: "2025-02-18",
    por: "Cajero 1",
    telefono: 40234273,
  },
  {
    id: 109,
    metodo: "Transferencia",
    cliente: "Roberto Castro",
    cantidad: 510.9,
    fechaCreado: "2025-02-17",
    por: "Admin 1",
    telefono: 40212273,
  },
  {
    id: 110,
    metodo: "Tarjeta",
    cliente: "Gabriela Salazar",
    cantidad: 275.4,
    fechaCreado: "2025-02-16",
    por: "Cajero 3",
    telefono: 402345273,
  },
];

// **Definir columnas de la tabla**
const columns: ColumnDef<Factura>[] = [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "metodo", header: "Metódo" },
  { accessorKey: "cliente", header: "Cliente" },
  { accessorKey: "cantidad", header: "Cantidad" },
  { accessorKey: "fechaCreado", header: "Fecha Creado" },
  { accessorKey: "por", header: "Por" },
];

// interface ClienteSearch {

// }

export default function BilingTable() {
  const [filter, setFilter] = useState("");
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 }); // 🔥 FIX: Agregamos pageIndex

  // **Configuración de la tabla**
  const table = useReactTable({
    data: clientesData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter: filter,
      pagination,
    },
    onGlobalFilterChange: setFilter,
    onPaginationChange: setPagination, // 🔥 FIX: Ahora podemos cambiar la página y tamaño
    globalFilterFn: (row, columnId, value) => {
      console.log(columnId);

      const search = value.toLowerCase().trim();

      const cliente = row.original as Factura;

      return (
        cliente.telefono.toString().toLocaleLowerCase().includes(search) ||
        cliente.id.toString().toLocaleLowerCase().includes(search) ||
        cliente.cliente.toString().toLocaleLowerCase().includes(search) ||
        cliente.metodo.toString().toLocaleLowerCase().includes(search) ||
        cliente.por.toString().toLocaleLowerCase().includes(search)
      );

      // return String(row.getValue(columnId)).toLowerCase().includes(search);
    },
  });

  return (
    <Card className=" max-w-full shadow-lg">
      <CardContent>
        <div className="flex justify-between items-center mb-4"></div>
        {/* **Campo de Búsqueda** */}
        <Input
          type="text"
          placeholder="Buscar por Nombre, Teléfono, Dirección, DPI o IP..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="mb-3"
        />

        {/* **Selector de Cantidad de Filas** */}
        <div className="flex justify-end mb-3">
          <Select
            onValueChange={(value) =>
              setPagination({ ...pagination, pageSize: Number(value) })
            }
            defaultValue={String(pagination.pageSize)}
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Items por página" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* **Tabla** */}
        <div className="overflow-x-auto">
          <table className="w-full border ">
            <thead className=" ">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="p-2 border font-semibold text-sm"
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </th>
                  ))}
                  {/* Nueva columna de Acciones */}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <motion.tr
                  key={row.id}
                  whileHover={{ scale: 1.01 }} // Apenas un 2% más grande al hacer hover
                  whileTap={{ scale: 0.99 }} // Reduce un poco al hacer click para un efecto táctil
                  transition={{ type: "spring", stiffness: 120, damping: 22 }} // Menos rigidez y rebote más controlado
                  className="text-sm hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  {/* **Fila completa clickeable con el Link** */}
                  <Link
                    to={`/crm/cliente/${row.original.id}`}
                    className="contents"
                  >
                    <td className="p-2 font-medium">{row.original.id}</td>
                    <td className="p-2 truncate max-w-[150px]">
                      {row.original.metodo}
                    </td>
                    <td className="p-2 truncate max-w-[100px]">
                      {row.original.cliente}
                    </td>
                    <td className="p-2 truncate max-w-[200px]">
                      {row.original.cantidad}
                    </td>
                    <td className="p-2 truncate max-w-[120px]">
                      {row.original.fechaCreado}
                    </td>
                    <td className="p-2 truncate max-w-[100px]">
                      {row.original.por}
                    </td>
                  </Link>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* **Controles de Paginación** */}
        <div className="flex justify-between items-center mt-3">
          <Button
            variant="outline"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Anterior
          </Button>

          <span>
            Página {pagination.pageIndex + 1} de {table.getPageCount()}
          </span>

          <Button
            variant="outline"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Siguiente
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
