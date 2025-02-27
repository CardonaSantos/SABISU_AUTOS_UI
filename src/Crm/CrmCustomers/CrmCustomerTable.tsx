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
import { Edit } from "lucide-react";
import { motion } from "framer-motion";

type Cliente = {
  id: number;
  nombre: string;
  telefono?: string;
  direccion?: string;
  dpi?: string;
  iPInternet?: string;
  creadoEn: string;
};

// **Datos de Prueba**
const clientesData: Cliente[] = [
  {
    id: 12,
    nombre: "Mari Mileidy Camposeco Montejo Silvestre",
    telefono: "4001-7273",
    direccion:
      "Cantón Parroquia salida a San Antonio Huista, en la entrada de un callejón al lado derecho al fondo, una casa de color azul",
    dpi: "1234567890101",
    iPInternet: "192.168.1.100",
    creadoEn: "2025-02-25",
  },

  {
    id: 1,
    nombre: "Juan Pérez",
    telefono: "555-1234",
    direccion: "Calle 1, Zona 2",
    dpi: "1234567890101",
    iPInternet: "192.168.1.1",
    creadoEn: "2025-02-25",
  },
  {
    id: 2,
    nombre: "María López",
    telefono: "555-5678",
    direccion: "Avenida Central, Zona 5",
    dpi: "9876543210101",
    iPInternet: "192.168.1.2",
    creadoEn: "2025-02-20",
  },
  {
    id: 3,
    nombre: "Carlos Gómez",
    telefono: "555-8765",
    direccion: "Colonia Jardines",
    dpi: "4567891230101",
    iPInternet: "192.168.1.3",
    creadoEn: "2025-02-18",
  },
  {
    id: 4,
    nombre: "Ana Rodríguez",
    telefono: "555-4321",
    direccion: "Residenciales Las Flores",
    dpi: "7412589630101",
    iPInternet: "192.168.1.4",
    creadoEn: "2025-02-15",
  },
  {
    id: 5,
    nombre: "Luis Méndez",
    telefono: "555-7890",
    direccion: "Centro Histórico",
    dpi: "8523697410101",
    iPInternet: "192.168.1.5",
    creadoEn: "2025-02-10",
  },
  {
    id: 1,
    nombre: "Juan Pérez",
    telefono: "555-1234",
    direccion: "Calle 1, Zona 2",
    dpi: "1234567890101",
    iPInternet: "192.168.1.1",
    creadoEn: "2025-02-25",
  },
  {
    id: 2,
    nombre: "María López",
    telefono: "555-5678",
    direccion: "Avenida Central, Zona 5",
    dpi: "9876543210101",
    iPInternet: "192.168.1.2",
    creadoEn: "2025-02-20",
  },
  {
    id: 3,
    nombre: "Carlos Gómez",
    telefono: "555-8765",
    direccion: "Colonia Jardines",
    dpi: "4567891230101",
    iPInternet: "192.168.1.3",
    creadoEn: "2025-02-18",
  },
  {
    id: 4,
    nombre: "Ana Rodríguez",
    telefono: "555-4321",
    direccion: "Residenciales Las Flores",
    dpi: "7412589630101",
    iPInternet: "192.168.1.4",
    creadoEn: "2025-02-15",
  },
  {
    id: 5,
    nombre: "Luis Méndez",
    telefono: "555-7890",
    direccion: "Centro Histórico",
    dpi: "8523697410101",
    iPInternet: "192.168.1.5",
    creadoEn: "2025-02-10",
  },
  {
    id: 1,
    nombre: "Juan Pérez",
    telefono: "555-1234",
    direccion: "Calle 1, Zona 2",
    dpi: "1234567890101",
    iPInternet: "192.168.1.1",
    creadoEn: "2025-02-25",
  },
  {
    id: 2,
    nombre: "María López",
    telefono: "555-5678",
    direccion: "Avenida Central, Zona 5",
    dpi: "9876543210101",
    iPInternet: "192.168.1.2",
    creadoEn: "2025-02-20",
  },
  {
    id: 3,
    nombre: "Carlos Gómez",
    telefono: "555-8765",
    direccion: "Colonia Jardines",
    dpi: "4567891230101",
    iPInternet: "192.168.1.3",
    creadoEn: "2025-02-18",
  },
  {
    id: 4,
    nombre: "Ana Rodríguez",
    telefono: "555-4321",
    direccion: "Residenciales Las Flores",
    dpi: "7412589630101",
    iPInternet: "192.168.1.4",
    creadoEn: "2025-02-15",
  },
  {
    id: 5,
    nombre: "Luis Méndez",
    telefono: "555-7890",
    direccion: "Centro Histórico",
    dpi: "8523697410101",
    iPInternet: "192.168.1.5",
    creadoEn: "2025-02-10",
  },
  {
    id: 1,
    nombre: "Juan Pérez",
    telefono: "555-1234",
    direccion: "Calle 1, Zona 2",
    dpi: "1234567890101",
    iPInternet: "192.168.1.1",
    creadoEn: "2025-02-25",
  },
  {
    id: 2,
    nombre: "María López",
    telefono: "555-5678",
    direccion: "Avenida Central, Zona 5",
    dpi: "9876543210101",
    iPInternet: "192.168.1.2",
    creadoEn: "2025-02-20",
  },
  {
    id: 3,
    nombre: "Carlos Gómez",
    telefono: "555-8765",
    direccion: "Colonia Jardines",
    dpi: "4567891230101",
    iPInternet: "192.168.1.3",
    creadoEn: "2025-02-18",
  },
  {
    id: 4,
    nombre: "Ana Rodríguez",
    telefono: "555-4321",
    direccion: "Residenciales Las Flores",
    dpi: "7412589630101",
    iPInternet: "192.168.1.4",
    creadoEn: "2025-02-15",
  },
  {
    id: 5,
    nombre: "Luis Méndez",
    telefono: "555-7890",
    direccion: "Centro Histórico",
    dpi: "8523697410101",
    iPInternet: "192.168.1.5",
    creadoEn: "2025-02-10",
  },
  {
    id: 1,
    nombre: "Juan Pérez",
    telefono: "555-1234",
    direccion: "Calle 1, Zona 2",
    dpi: "1234567890101",
    iPInternet: "192.168.1.1",
    creadoEn: "2025-02-25",
  },
  {
    id: 2,
    nombre: "María López",
    telefono: "555-5678",
    direccion: "Avenida Central, Zona 5",
    dpi: "9876543210101",
    iPInternet: "192.168.1.2",
    creadoEn: "2025-02-20",
  },
  {
    id: 3,
    nombre: "Carlos Gómez",
    telefono: "555-8765",
    direccion: "Colonia Jardines",
    dpi: "4567891230101",
    iPInternet: "192.168.1.3",
    creadoEn: "2025-02-18",
  },
  {
    id: 4,
    nombre: "Ana Rodríguez",
    telefono: "555-4321",
    direccion: "Residenciales Las Flores",
    dpi: "7412589630101",
    iPInternet: "192.168.1.4",
    creadoEn: "2025-02-15",
  },
  {
    id: 5,
    nombre: "Luis Méndez",
    telefono: "555-7890",
    direccion: "Centro Histórico",
    dpi: "8523697410101",
    iPInternet: "192.168.1.5",
    creadoEn: "2025-02-10",
  },
  {
    id: 1,
    nombre: "Juan Pérez",
    telefono: "555-1234",
    direccion: "Calle 1, Zona 2",
    dpi: "1234567890101",
    iPInternet: "192.168.1.1",
    creadoEn: "2025-02-25",
  },
  {
    id: 2,
    nombre: "María López",
    telefono: "555-5678",
    direccion: "Avenida Central, Zona 5",
    dpi: "9876543210101",
    iPInternet: "192.168.1.2",
    creadoEn: "2025-02-20",
  },
  {
    id: 3,
    nombre: "Carlos Gómez",
    telefono: "555-8765",
    direccion: "Colonia Jardines",
    dpi: "4567891230101",
    iPInternet: "192.168.1.3",
    creadoEn: "2025-02-18",
  },
  {
    id: 4,
    nombre: "Ana Rodríguez",
    telefono: "555-4321",
    direccion: "Residenciales Las Flores",
    dpi: "7412589630101",
    iPInternet: "192.168.1.4",
    creadoEn: "2025-02-15",
  },
  {
    id: 5,
    nombre: "Luis Méndez",
    telefono: "555-7890",
    direccion: "Centro Histórico",
    dpi: "8523697410101",
    iPInternet: "192.168.1.5",
    creadoEn: "2025-02-10",
  },
  {
    id: 1,
    nombre: "Juan Pérez",
    telefono: "555-1234",
    direccion: "Calle 1, Zona 2",
    dpi: "1234567890101",
    iPInternet: "192.168.1.1",
    creadoEn: "2025-02-25",
  },
  {
    id: 2,
    nombre: "María López",
    telefono: "555-5678",
    direccion: "Avenida Central, Zona 5",
    dpi: "9876543210101",
    iPInternet: "192.168.1.2",
    creadoEn: "2025-02-20",
  },
  {
    id: 3,
    nombre: "Carlos Gómez",
    telefono: "555-8765",
    direccion: "Colonia Jardines",
    dpi: "4567891230101",
    iPInternet: "192.168.1.3",
    creadoEn: "2025-02-18",
  },
  {
    id: 4,
    nombre: "Ana Rodríguez",
    telefono: "555-4321",
    direccion: "Residenciales Las Flores",
    dpi: "7412589630101",
    iPInternet: "192.168.1.4",
    creadoEn: "2025-02-15",
  },
  {
    id: 5,
    nombre: "Luis Méndez",
    telefono: "555-7890",
    direccion: "Centro Histórico",
    dpi: "8523697410101",
    iPInternet: "192.168.1.5",
    creadoEn: "2025-02-10",
  },
  {
    id: 1,
    nombre: "Juan Pérez",
    telefono: "555-1234",
    direccion: "Calle 1, Zona 2",
    dpi: "1234567890101",
    iPInternet: "192.168.1.1",
    creadoEn: "2025-02-25",
  },
  {
    id: 2,
    nombre: "María López",
    telefono: "555-5678",
    direccion: "Avenida Central, Zona 5",
    dpi: "9876543210101",
    iPInternet: "192.168.1.2",
    creadoEn: "2025-02-20",
  },
  {
    id: 3,
    nombre: "Carlos Gómez",
    telefono: "555-8765",
    direccion: "Colonia Jardines",
    dpi: "4567891230101",
    iPInternet: "192.168.1.3",
    creadoEn: "2025-02-18",
  },
  {
    id: 4,
    nombre: "Ana Rodríguez",
    telefono: "555-4321",
    direccion: "Residenciales Las Flores",
    dpi: "7412589630101",
    iPInternet: "192.168.1.4",
    creadoEn: "2025-02-15",
  },
  {
    id: 5,
    nombre: "Luis Méndez",
    telefono: "555-7890",
    direccion: "Centro Histórico",
    dpi: "8523697410101",
    iPInternet: "192.168.1.5",
    creadoEn: "2025-02-10",
  },
];

// **Definir columnas de la tabla**
const columns: ColumnDef<Cliente>[] = [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "nombre", header: "Nombre" },
  { accessorKey: "telefono", header: "Teléfono" },
  { accessorKey: "direccion", header: "Dirección" },
  { accessorKey: "dpi", header: "DPI" },
  { accessorKey: "iPInternet", header: "IP" },
  { accessorKey: "creadoEn", header: "Fecha Creación" },
];

export default function ClientesTable() {
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
      const search = value.toLowerCase();
      return String(row.getValue(columnId)).toLowerCase().includes(search);
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
                  <th className="p-2 border font-semibold text-sm">Acciones</th>{" "}
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
                      {row.original.nombre}
                    </td>
                    <td className="p-2 truncate max-w-[100px]">
                      {row.original.telefono}
                    </td>
                    <td className="p-2 truncate max-w-[200px]">
                      {row.original.direccion}
                    </td>
                    <td className="p-2 truncate max-w-[120px]">
                      {row.original.dpi}
                    </td>
                    <td className="p-2 truncate max-w-[100px]">
                      {row.original.iPInternet}
                    </td>
                    <td className="p-2">{row.original.creadoEn}</td>
                  </Link>

                  {/* **Botón de Acción (Fuera del Link)** */}
                  <td className="p-2 flex gap-2 justify-center items-center">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        alert(`Acción con cliente ID: ${row.original.id}`)
                      }
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </td>
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
