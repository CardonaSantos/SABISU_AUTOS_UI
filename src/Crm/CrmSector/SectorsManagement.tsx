import { useState, useEffect, useMemo } from "react";
import { Plus, Search, MapPin, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { CreateSectorDialog } from "./CreateSectorDialog";
import { SectorDetailsDialog } from "./SectorDetailsDialog";
import type { Sector } from "./types";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import utc from "dayjs/plugin/utc";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import axios from "axios";
import EditSectorDialog from "./EditSectorDialog";
import { Departamentos } from "../CrmCustomerEdition/types";
const VITE_CRM_API_URL = import.meta.env.VITE_CRM_API_URL;

dayjs.extend(utc);
dayjs.extend(localizedFormat);
dayjs.locale("es");

// const formatearFecha = (fecha: string) => {
//   // Formateo en UTC sin conversión a local
//   return dayjs(fecha).format("DD/MM/YYYY");
// };

const columns: ColumnDef<Sector>[] = [
  { accessorKey: "clientesLenght", header: "Clientes" },
  { accessorKey: "cliente", header: "Nombre" },
  { accessorKey: "cantidad", header: "Descripcion" },
  { accessorKey: "fechaCreado", header: "Municipio" },
  { accessorKey: "", header: "Accion" },
];

export default function SectorsManagement() {
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [municipios, setMunicipios] = useState<Municipio[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedSector, setSelectedSector] = useState<Sector | null>(null);
  const [editSector, setEditSector] = useState<Sector | null>(null);
  const [openEditSecto, setOpenEditSector] = useState(false);

  // const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const response = await axios.get<Sector[]>(`${VITE_CRM_API_URL}/sector`);
      if (response.status === 200) {
        setSectors(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCreateSector = async (
    newSector: Omit<Sector, "id" | "creadoEn" | "actualizadoEn" | "clientes">
  ) => {
    try {
      const response = await axios.post(
        `${VITE_CRM_API_URL}/sector`,
        newSector
      );
      if (response.status === 200) {
        toast.success("El sector ha sido creado exitosamente");
      }

      setIsCreateDialogOpen(false);
    } catch (error) {
      toast("No se pudo crear el sector. Intente nuevamente.");
    }
  };
  interface Municipio {
    id: number;
    nombre: string;
  }

  const [departamentos, setDepartamentos] = useState<Departamentos[]>([]);
  // const [municipios, setMunicipios] = useState<Municipios[]>([]);

  const [depaSelected, setDepaSelected] = useState<string | null>("8");
  const [muniSelected, setMuniSelected] = useState<string | null>(null);
  console.log(muniSelected);

  const getDepartamentos = async () => {
    try {
      const response = await axios.get(
        `${VITE_CRM_API_URL}/location/get-all-departamentos`
      );

      if (response.status === 200) {
        setDepartamentos(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getMunicipios = async () => {
    try {
      const response = await axios.get(
        `${VITE_CRM_API_URL}/location/get-municipio/${Number(depaSelected)}`
      );

      if (response.status === 200) {
        setMunicipios(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Obtener municipios cuando depaSelected cambia
  useEffect(() => {
    getDepartamentos();
    if (depaSelected) {
      getMunicipios();
    } else {
      setMunicipios([]);
      setMuniSelected(null);
    }
  }, [depaSelected]);

  // Memorizar el filtrado
  const filteredSectors = useMemo(() => {
    return sectors.filter(
      (sector) =>
        sector.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sector.descripcion?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        municipios
          .find((m) => m.id === sector.municipioId)
          ?.nombre.toLowerCase()
          .includes(searchQuery.toLowerCase())
    );
  }, [sectors, municipios, searchQuery]); // Solo recalcula cuando estos valores cambian

  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [filter, setFilter] = useState("");

  const table = useReactTable({
    data: filteredSectors, // Usamos filteredSectors
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter: filter,
      pagination,
    },
    onGlobalFilterChange: setFilter,
    onPaginationChange: setPagination,
    globalFilterFn: (row, columnId, value) => {
      console.log(columnId);

      const search = value.toLowerCase().trim();
      const sector = row.original as Sector;
      return (
        (sector.nombre || "").toString().toLowerCase().includes(search) ||
        (sector.municipio || "").toString().toLowerCase().includes(search) ||
        (sector.id || "").toString().toLowerCase().includes(search)
      );
    },
  });

  const handleSubmitEdit = async (data: Partial<Sector>) => {
    try {
      const response = await axios.patch(
        `${VITE_CRM_API_URL}/sector/update-sector/${editSector?.id}`,
        data
      );
      if (response.status === 200) {
        toast.success("El sector ha sido editado exitosamente");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar sectores..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Sector
          </Button>
        </div>
      </div>

      {/* Items por página */}
      <div className="space-y-1 w-full sm:w-[200px]">
        <Label>Items por página</Label>
        <Select
          onValueChange={(value) =>
            setPagination({ ...pagination, pageSize: Number(value) })
          }
          defaultValue={String(pagination.pageSize)}
        >
          <SelectTrigger className="text-xs">
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

      {filteredSectors.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-muted/20">
          <MapPin className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">No hay sectores</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {searchQuery
              ? "No se encontraron resultados para tu búsqueda."
              : "Comienza creando un nuevo sector."}
          </p>
          {!searchQuery && (
            <Button
              className="mt-4"
              onClick={() => setIsCreateDialogOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Sector
            </Button>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-md border border-gray-200 shadow-sm dark:border-gray-800 dark:bg-transparent dark:shadow-gray-900/30">
          <table className="w-full border-collapse text-xs">
            <thead className="bg-gray-50 dark:bg-transparent dark:border-b dark:border-gray-800">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-3 py-2 text-left font-medium text-gray-600 dark:text-gray-300"
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {table.getRowModel().rows.map((row) => (
                <motion.tr
                  key={row.id}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  transition={{
                    type: "spring",
                    stiffness: 120,
                    damping: 22,
                  }}
                  className="bg-white hover:bg-gray-50 dark:bg-transparent dark:hover:bg-gray-900/20 dark:text-gray-100"
                >
                  <td className="px-3 py-2 text-center font-medium">
                    {row.original.clientes?.length}
                  </td>

                  <td className="px-3 py-2 truncate max-w-[100px] hover:text-emerald-600 dark:hover:text-emerald-400 hover:underline">
                    {row.original.nombre}
                  </td>

                  <td className="px-3 py-2 truncate max-w-[100px] text-gray-600 dark:text-gray-400">
                    {row.original.descripcion}
                  </td>

                  <td className="px-3 py-2 truncate max-w-[50px] whitespace-nowrap text-gray-600 dark:text-gray-400">
                    {row.original.municipio?.nombre || "Sin municipio"}
                  </td>

                  <td className="px-3 py-2">
                    <div className="flex justify-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800/30 dark:text-gray-300"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="w-40 dark:bg-gray-900/90 dark:border-gray-800 dark:text-gray-200"
                        >
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedSector(row.original);
                            }}
                            className="cursor-pointer dark:hover:bg-gray-800/50 dark:focus:bg-gray-800/50"
                          >
                            Ver detalles
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="dark:bg-gray-800" />
                          <DropdownMenuItem
                            onClick={() => {
                              setOpenEditSector(true);
                              setEditSector(row.original);
                            }}
                            className="cursor-pointer dark:hover:bg-gray-800/50 dark:focus:bg-gray-800/50"
                          >
                            Editar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>

          {/* **Controles de Paginación** */}
          <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50 px-4 py-3 text-xs dark:border-gray-800 dark:bg-transparent dark:text-gray-300">
            <Button
              variant="outline"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="h-8 rounded-md border-gray-300 px-3 py-1 text-xs font-medium transition-colors disabled:opacity-50 dark:border-gray-700 dark:bg-transparent dark:text-gray-300 dark:hover:bg-gray-800/30"
            >
              Anterior
            </Button>

            <span className="text-sm text-gray-700 dark:text-gray-300">
              Página{" "}
              <span className="font-medium">{pagination.pageIndex + 1}</span> de{" "}
              <span className="font-medium">{table.getPageCount()}</span>
            </span>

            <Button
              variant="outline"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="h-8 rounded-md border-gray-300 px-3 py-1 text-xs font-medium transition-colors disabled:opacity-50 dark:border-gray-700 dark:bg-transparent dark:text-gray-300 dark:hover:bg-gray-800/30"
            >
              Siguiente
            </Button>
          </div>
        </div>
      )}

      <CreateSectorDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        // municipios={municipios}
        onSubmit={handleCreateSector}
        //depas y municipios
        departamentos={departamentos}
        municipios={municipios}
        getMunicipios={getMunicipios}
        setMunicipios={setMunicipios}
        setDepaSelected={setDepaSelected}
        depaSelected={depaSelected}
      />

      <EditSectorDialog
        handleSubmitEdit={handleSubmitEdit}
        openEditSecto={openEditSecto}
        sector={editSector}
        setOpenEditSector={setOpenEditSector}
        departamentos={departamentos}
        municipios={municipios}
        getMunicipios={getMunicipios}
        setMunicipios={setMunicipios}
        setDepaSelected={setDepaSelected}
        depaSelected={depaSelected}
      />

      {selectedSector && (
        <SectorDetailsDialog
          sector={selectedSector}
          municipio={municipios.find(
            (m) => m.id === selectedSector.municipioId
          )}
          open={!!selectedSector}
          onOpenChange={(open: boolean) => !open && setSelectedSector(null)}
        />
      )}
    </div>
  );
}
