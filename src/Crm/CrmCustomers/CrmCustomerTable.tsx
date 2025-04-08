import { useEffect, useMemo, useState } from "react";
import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
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
import ReactSelectComponent from "react-select";
import { FacturacionZona } from "../CrmFacturacion/FacturacionZonaTypes";

import { useDeferredValue } from "react";
import { Label } from "@/components/ui/label";

dayjs.extend(utc);
dayjs.extend(localizedFormat);
dayjs.locale("es");

const VITE_CRM_API_URL = import.meta.env.VITE_CRM_API_URL;
function parseIp(ipString: string) {
  const parts = ipString.split(".");
  const octets = parts.map((p) => parseInt(p, 10));
  while (octets.length < 4) {
    octets.push(0);
  }
  return octets;
}

function compareIp(a: string, b: string) {
  const octA = parseIp(a);
  const octB = parseIp(b);

  for (let i = 0; i < 4; i++) {
    if (octA[i] < octB[i]) return -1;
    if (octA[i] > octB[i]) return 1;
  }
  return 0;
}
// **Definir columnas de la tabla**
const columns: ColumnDef<ClienteDto>[] = [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "nombreCompleto", header: "Nombre" },
  { accessorKey: "telefono", header: "Teléfono" },
  {
    accessorKey: "direccionIp",
    header: "IP",
    sortingFn: (rowA, rowB, columnId) => {
      // Aseguramos que los valores de las celdas sean strings
      const ipA = rowA.getValue(columnId) as string; // Aseguramos que ipA sea un string
      const ipB = rowB.getValue(columnId) as string; // Aseguramos que ipB sea un string
      return compareIp(ipA, ipB); // Compara IPs numéricamente
    },
  },

  { accessorKey: "creadoEn", header: "Plan Internet" },
  { accessorKey: "facturacionZona", header: "Zona Facturación" },
];

interface OptionSelect {
  value: string;
  label: string;
}

interface Departamentos {
  id: number;
  nombre: string;
}

interface Municipios {
  id: number;
  nombre: string;
}

export default function ClientesTable() {
  const [filter, setFilter] = useState("");
  const filtered2 = useDeferredValue(filter);

  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [sorting, setSorting] = useState<any>([]);
  const [clientes, setClientes] = useState<ClienteDto[]>([]);

  const [departamentos, setDepartamentos] = useState<Departamentos[]>([]);
  const [municipios, setMunicipios] = useState<Municipios[]>([]);

  const [depaSelected, setDepaSelected] = useState<string | null>("8");
  const [muniSelected, setMuniSelected] = useState<string | null>(null);

  const handleSelectDepartamento = (selectedOption: OptionSelected | null) => {
    setDepaSelected(selectedOption ? selectedOption.value : null);
  };

  // Manejar el cambio en el select de municipio
  const handleSelectMunicipio = (selectedOption: OptionSelected | null) => {
    setMuniSelected(selectedOption ? selectedOption.value : null);
  };

  // Cambiar 'optionsDepartamentos' para mapear los departamentos a 'string' para 'value'
  const optionsDepartamentos: OptionSelected[] = departamentos.map((depa) => ({
    value: depa.id.toString(), // Asegúrate de convertir el 'id' a 'string'
    label: depa.nombre,
  }));

  const optionsMunis: OptionSelected[] = municipios.map((muni) => ({
    value: muni.id.toString(),
    label: muni.nombre,
  }));

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

  useEffect(() => {
    getFacturacionZona();
    getDepartamentos();
  }, []);

  // Obtener municipios cuando depaSelected cambia
  useEffect(() => {
    if (depaSelected) {
      getMunicipios();
    } else {
      setMunicipios([]);
      setMuniSelected(null);
    }
  }, [depaSelected]);

  const [zonasFacturacion, setZonasFacturacion] = useState<FacturacionZona[]>(
    []
  );

  const [zonasFacturacionSelected, setZonasFacturacionSelected] = useState<
    string | null
  >(null);

  const getFacturacionZona = async () => {
    try {
      const response = await axios.get(
        `${VITE_CRM_API_URL}/facturacion-zona/get-zonas-facturacion-to-customer`
      );

      if (response.status === 200) {
        setZonasFacturacion(response.data);
      }
    } catch (error) {
      console.log(error);
      toast.info("Error al conseguir servicios wifi");
    }
  };

  interface OptionSelected {
    value: string; // Cambiar 'number' a 'string'
    label: string;
  }

  const optionsZonasFacturacion: OptionSelected[] = zonasFacturacion
    .sort((a, b) => {
      const numA = parseInt(a.nombre.match(/\d+/)?.[0] || "0");
      const numB = parseInt(b.nombre.match(/\d+/)?.[0] || "0");
      return numA - numB;
    })
    .map((zona) => ({
      value: zona.id.toString(),
      label: `${zona.nombre} Clientes: (${zona.clientesCount})`,
    }));

  const handleSelectZonaFacturacion = (
    selectedOption: OptionSelected | null
  ) => {
    setZonasFacturacionSelected(selectedOption ? selectedOption.value : null);
  };

  const sortOptions: OptionSelect[] = [
    { label: "Ordenar por IP (asc)", value: "ip-asc" },
    { label: "Ordenar por IP (desc)", value: "ip-desc" },
    { label: "Ordenar por Nombre (asc)", value: "nombre-asc" },
    { label: "Ordenar por Nombre (desc)", value: "nombre-desc" },
    { label: "Ordenar por Fecha Creación (asc)", value: "fechapago-asc" },
    { label: "Ordenar por Fecha Creación (desc)", value: "fechapago-desc" },
  ];

  // Map the short key to the actual field in ClienteDto
  const fieldMapping: Record<string, keyof ClienteDto> = {
    ip: "direccionIp",
    nombre: "nombreCompleto",
    fechapago: "creadoEn",
  };

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
    getFacturacionZona();
  }, []);

  // Handle sort selection change from react-select
  const handleSortChange = (option: OptionSelect | null) => {
    if (!option) {
      setSorting([]);
      return;
    }
    const [fieldKey, direction] = option.value.split("-");
    const columnId = fieldMapping[fieldKey];
    if (columnId) {
      setSorting([{ id: columnId, desc: direction === "desc" }]);
    }
  };
  console.log("Cliente son: ", clientes);
  console.log("El depa seleccionado es: ", depaSelected);
  console.log("El muniSelected seleccionado es: ", muniSelected);

  useEffect(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, [zonasFacturacionSelected]); // Resetear a página 1 cuando el filtro cambie

  const filteredClientesZona = useMemo(() => {
    return clientes.filter((cliente) => {
      const matchesMunicipio = muniSelected
        ? cliente.municipioId === Number(muniSelected)
        : true;

      const matchesDepartamento = depaSelected
        ? cliente.departamentoId === Number(depaSelected)
        : true;

      const matchesPorZonas = zonasFacturacionSelected
        ? cliente.facturacionZonaId === Number(zonasFacturacionSelected)
        : true;

      return matchesMunicipio && matchesDepartamento && matchesPorZonas;
    });
  }, [clientes, zonasFacturacionSelected, muniSelected, depaSelected]);

  // **Configuración de la tabla**
  const table = useReactTable({
    data: filteredClientesZona, // Cambiar a filteredClientesZona
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter: filtered2,
      pagination,
      sorting,
    },
    onGlobalFilterChange: setFilter,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    globalFilterFn: (row, columnId, value) => {
      console.log(columnId);

      const search = value.toLowerCase().trim();
      const cliente = row.original as ClienteDto;

      return (
        (cliente.id?.toString() || "").includes(search) ||
        (cliente.nombreCompleto || "").toLowerCase().includes(search) ||
        // (cliente.apellidos || "").toLowerCase().includes(search) ||
        (cliente.telefono || "").toLowerCase().includes(search) ||
        (cliente.direccionIp || "").toLowerCase().includes(search) ||
        (cliente.direccion || "").toLowerCase().includes(search) ||
        (cliente.dpi || "").toLowerCase().includes(search)
      );
    },
  });

  return (
    <Card className="max-w-full shadow-lg">
      <CardContent>
        <div className="flex justify-between items-center mb-4"></div>
        {/* **Campo de Búsqueda** */}
        <Input
          style={{ boxShadow: "none" }}
          type="text"
          placeholder="Buscar por Nombre, Teléfono, Dirección, DPI o IP..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          // className="mb-3 border-2
          className="mb-3 text-xs px-2 py-1 border-2"
        />

        {/* **Controles: Selector de Orden y Cantidad de Filas** */}
        <div className="mb-4">
          {/* **Controles de filtrado y ordenamiento** */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
            {/* Departamento */}
            <div className="space-y-1">
              <Label htmlFor="departamentoId-all">Departamento</Label>
              <ReactSelectComponent
                placeholder="Seleccione un departamento"
                isClearable
                options={optionsDepartamentos}
                value={
                  depaSelected
                    ? {
                        value: depaSelected,
                        label:
                          departamentos.find(
                            (depa) => depa.id.toString() === depaSelected
                          )?.nombre || "",
                      }
                    : null
                }
                onChange={handleSelectDepartamento}
                className="text-xs text-black"
              />
            </div>

            {/* Municipio */}
            <div className="space-y-1">
              <Label htmlFor="municipioId-all">Municipio</Label>
              <ReactSelectComponent
                placeholder="Seleccione un municipio"
                isClearable
                options={optionsMunis}
                onChange={handleSelectMunicipio}
                value={
                  muniSelected
                    ? {
                        value: muniSelected,
                        label:
                          municipios.find(
                            (muni) => muni.id.toString() == muniSelected
                          )?.nombre || "",
                      }
                    : null
                }
                className="text-xs text-black"
              />
            </div>

            {/* Zona de Facturación */}
            <div className="space-y-1">
              <Label>Zona de Facturación</Label>
              <ReactSelectComponent
                isClearable
                placeholder="Ordenar por facturación zona"
                className="text-xs text-black"
                options={optionsZonasFacturacion}
                onChange={handleSelectZonaFacturacion}
                value={
                  zonasFacturacionSelected
                    ? {
                        value: zonasFacturacionSelected,
                        label:
                          zonasFacturacion.find(
                            (s) => s.id.toString() === zonasFacturacionSelected
                          )?.nombre || "",
                      }
                    : null
                }
              />
            </div>

            {/* Ordenamiento */}
            <div className="space-y-1">
              <Label>Ordenar por</Label>
              <ReactSelectComponent
                className="text-xs text-black"
                options={sortOptions}
                isClearable={true}
                onChange={handleSortChange}
                placeholder="Ordenar por..."
              />
            </div>

            {/* Items por página */}
            <div className="space-y-1">
              <Label>Items por página</Label>
              <Select
                onValueChange={(value) =>
                  setPagination({ ...pagination, pageSize: Number(value) })
                }
                defaultValue={String(pagination.pageSize)}
              >
                <SelectTrigger>
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
          </div>
        </div>

        {/* **Tabla** */}
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 text-xs">
            <thead className="bg-gray-100 dark:bg-gray-800">
              <tr>
                <th className="px-2 py-1 border font-semibold">ID</th>
                <th className="px-2 py-1 border font-semibold">
                  Nombre Completo
                </th>
                <th className="px-2 py-1 border font-semibold">Teléfono</th>
                <th className="px-2 py-1 border font-semibold">IP</th>
                <th className="px-2 py-1 border font-semibold">Servicios</th>
                <th className="px-2 py-1 border font-semibold">
                  Zona de Facturación
                </th>
                <th className="px-2 py-1 border font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody>
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
                  className="hover:bg-gray-200 dark:hover:bg-gray-700 border-b border-gray-300"
                >
                  <td className="px-2 py-1 text-center">{row.original.id}</td>
                  <Link
                    to={`/crm/cliente/${row.original.id}`}
                    className="contents"
                  >
                    <td className="px-2 py-1 truncate max-w-[120px] hover:underline">
                      {`${row.original.nombreCompleto}`.trim()}
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
                      <Button variant="outline" size="icon">
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
