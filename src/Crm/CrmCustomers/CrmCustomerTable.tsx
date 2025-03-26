import { useEffect, useState } from "react";
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
import { ClienteDto } from "./CustomerTable";
import axios from "axios";
import { toast } from "sonner";
import dayjs from "dayjs";
import "dayjs/locale/es";
import utc from "dayjs/plugin/utc";
import localizedFormat from "dayjs/plugin/localizedFormat";
// const API_URL = import.meta.env.VITE_API_URL;

dayjs.extend(utc);
dayjs.extend(localizedFormat);
dayjs.locale("es");

// const formatearFecha = (fecha: string) => {
//   // Formateo en UTC sin conversión a local
//   return dayjs(fecha).format("DD/MM/YYYY hh:mm A");
// };

const VITE_CRM_API_URL = import.meta.env.VITE_CRM_API_URL;

// **Definir columnas de la tabla**
const columns: ColumnDef<ClienteDto>[] = [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "nombreCompleto", header: "Nombre" },
  { accessorKey: "telefono", header: "Teléfono" },
  { accessorKey: "direccionIp", header: "IP" },
  { accessorKey: "creadoEn", header: "Plan Internet" },
  { accessorKey: "facturacionZona", header: "Zona Facturación" },
];

export default function ClientesTable() {
  const [filter, setFilter] = useState("");
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 }); // 🔥 FIX: Agregamos pageIndex

  const [clientes, setClientes] = useState<ClienteDto[]>([]);

  const getClientes = async () => {
    try {
      const response = await axios.get(
        `${VITE_CRM_API_URL}/internet-customer/customer-to-table`
      );
      if (response.status === 200) {
        setClientes(response.data);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error al conseguir datos de clientes");
    }
  };

  useEffect(() => {
    getClientes();
  }, []);
  console.log(clientes);

  // **Configuración de la tabla**
  const table = useReactTable({
    data: clientes,
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
    globalFilterFn: (row, columId, value) => {
      console.log(columId);

      const search = value.trim().toLocaleLowerCase();
      const cliente = row.original as ClienteDto;

      return (
        cliente.nombreCompleto
          .toString()
          .toLocaleLowerCase()
          .trim()
          .includes(search) ||
        cliente.telefono
          .toString()
          .toLocaleLowerCase()
          .trim()
          .includes(search) ||
        cliente.direccionIp
          .toString()
          .toLocaleLowerCase()
          .trim()
          .includes(search) ||
        cliente.direccion
          .toString()
          .toLocaleLowerCase()
          .trim()
          .includes(search) ||
        cliente.dpi.toString().toLocaleLowerCase().trim().includes(search)
      );
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
          <table className="w-full border border-gray-300 text-xs">
            <thead className="bg-gray-100 dark:bg-gray-800">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-2 py-1 border font-semibold"
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </th>
                  ))}
                  <th className="px-2 py-1 border font-semibold">Acciones</th>
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <motion.tr
                  key={row.id}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  transition={{ type: "spring", stiffness: 120, damping: 22 }}
                  className="hover:bg-gray-200 dark:hover:bg-gray-700 border-b border-gray-300"
                >
                  <td className="px-2 py-1 text-center">{row.original.id}</td>
                  <Link
                    to={`/crm/cliente/${row.original.id}`}
                    className="contents"
                  >
                    <td className="px-2 py-1 truncate max-w-[120px] hover:underline">
                      {row.original.nombreCompleto}
                    </td>
                  </Link>
                  <td className="px-2 py-1 truncate max-w-[90px] whitespace-nowrap">
                    {row.original.telefono}
                  </td>
                  <td className="px-2 py-1 truncate max-w-[150px] whitespace-nowrap">
                    {row.original.direccionIp}
                  </td>
                  <td className="px-2 py-1 truncate max-w-[120px] whitespace-nowrap">
                    {row.original.servicios
                      .map((s) => s.nombreServicio)
                      .join(", ")}
                  </td>
                  <td className="px-2 py-1 truncate max-w-[100px] whitespace-nowrap">
                    {row.original.facturacionZona}
                  </td>
                  <td className="px-2 py-1 flex justify-center items-center">
                    <Link to={`/crm/cliente-edicion/${row.original.id}`}>
                      <Button
                        variant="outline"
                        size="icon"
                        // onClick={() =>
                        //   alert(`Acción con cliente ID: ${row.original.id}`)
                        // }
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
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
