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
interface OptionSelected {
  value: string; // Cambiar 'number' a 'string'
  label: string;
}

// O si quieres mantener los textos descriptivos pero de forma más limpia:
const estadosConDescripcion = [
  { value: "ACTIVO", label: "ACTIVO " },
  { value: "PENDIENTE_ACTIVO", label: "PENDIENTE ACTIVO " },
  { value: "PAGO_PENDIENTE", label: "PAGO PENDIENTE " },
  { value: "MOROSO", label: "MOROSO " },
  { value: "ATRASADO", label: "ATRASADO " },
  { value: "SUSPENDIDO", label: "SUSPENDIDO " },
  { value: "DESINSTALADO", label: "DESINSTALADO" },
  { value: "EN_INSTALACION", label: "EN INSTALACION" },
];

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
  const [sectores, setSectores] = useState<Sector[]>([]);
  const [sectorSelected, setSectorSelected] = useState<string | null>(null);
  const [estadoSelected, setEstadoSelected] = useState<string | null>(null);

  const handleSelectEstado = (selectedOption: OptionSelected | null) => {
    setEstadoSelected(selectedOption ? selectedOption.value : null);
  };

  interface Sector {
    id: number;
    nombre: string;
    clientesCount: number;
  }

  const getSectores = async () => {
    try {
      const response = await axios.get(
        `${VITE_CRM_API_URL}/sector/sectores-to-select`
      );

      if (response.status === 200) {
        setSectores(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getFacturacionZona();
    getDepartamentos();
    getSectores();
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

  const optionsSectores: OptionSelected[] = sectores.map((sector) => ({
    value: sector.id.toString(),
    label: `${sector.nombre}  Clientes: (${sector.clientesCount})`,
  }));

  const handleSelectSector = (selectedOption: OptionSelected | null) => {
    setSectorSelected(selectedOption ? selectedOption.value : null);
  };

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

      const matchesPorSector = sectorSelected
        ? cliente?.sectorId === Number(sectorSelected)
        : true;

      const matchesPorEstado = estadoSelected
        ? cliente?.estado === estadoSelected
        : true;

      return (
        matchesMunicipio &&
        matchesDepartamento &&
        matchesPorZonas &&
        matchesPorEstado &&
        matchesPorSector
      );
    });
  }, [
    clientes,
    zonasFacturacionSelected,
    muniSelected,
    depaSelected,
    sectorSelected,
    estadoSelected,
  ]);

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

            {/* Sector */}
            <div className="space-y-1">
              <Label htmlFor="municipioId-all">Sector</Label>
              <ReactSelectComponent
                placeholder="Seleccione un sector"
                isClearable
                options={optionsSectores}
                onChange={handleSelectSector}
                value={
                  sectorSelected
                    ? {
                        value: sectorSelected,
                        label:
                          sectores.find(
                            (muni) => muni.id.toString() == sectorSelected
                          )?.nombre || "",
                      }
                    : null
                }
                className="text-xs text-black"
              />
            </div>

            {/* ESTADO CLIENTE */}
            <div className="space-y-1">
              <Label htmlFor="municipioId-all">Estado</Label>
              <ReactSelectComponent
                placeholder="Seleccione un estado"
                options={estadosConDescripcion}
                onChange={handleSelectEstado}
                value={
                  estadosConDescripcion.find(
                    (opt) => opt.value === estadoSelected
                  ) || null
                }
                isClearable
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
        <div className="overflow-x-auto rounded-md border border-gray-200 shadow-sm dark:border-gray-800 dark:bg-transparent dark:shadow-gray-900/30">
          <table className="w-full border-collapse text-xs">
            <thead className="bg-gray-50 dark:bg-transparent dark:border-b dark:border-gray-800">
              <tr>
                <th className="px-3 py-2 text-left font-medium text-gray-600 dark:text-gray-300">
                  ID
                </th>
                <th className="px-3 py-2 text-left font-medium text-gray-600 dark:text-gray-300">
                  Nombre Completo
                </th>
                <th className="px-3 py-2 text-left font-medium text-gray-600 dark:text-gray-300">
                  Teléfono
                </th>
                <th className="px-3 py-2 text-left font-medium text-gray-600 dark:text-gray-300">
                  IP
                </th>
                <th className="px-3 py-2 text-left font-medium text-gray-600 dark:text-gray-300">
                  Servicios
                </th>
                <th className="px-3 py-2 text-left font-medium text-gray-600 dark:text-gray-300">
                  Zona de Facturación
                </th>
                <th className="px-3 py-2 text-left font-medium text-gray-600 dark:text-gray-300">
                  Acciones
                </th>
              </tr>
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
                    {row.original.id}
                  </td>
                  <Link
                    to={`/crm/cliente/${row.original.id}`}
                    className="contents"
                  >
                    <td className="px-3 py-2 truncate max-w-[120px] hover:text-emerald-600 dark:hover:text-emerald-400 hover:underline">
                      {`${row.original.nombreCompleto}`.trim()}
                    </td>
                  </Link>
                  <td className="px-3 py-2 truncate max-w-[90px] whitespace-nowrap text-gray-600 dark:text-gray-400">
                    {row.original.telefono}
                  </td>
                  <td className="px-3 py-2 truncate max-w-[150px] whitespace-nowrap text-gray-600 dark:text-gray-400">
                    {row.original.direccionIp}
                  </td>
                  <td className="px-3 py-2 truncate max-w-[120px] whitespace-nowrap text-gray-600 dark:text-gray-400">
                    {row.original.servicios
                      .map((s) => s.nombreServicio)
                      .join(", ")}
                  </td>
                  <td className="px-3 py-2 truncate max-w-[100px] whitespace-nowrap text-gray-600 dark:text-gray-400">
                    {row.original.facturacionZona}
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex justify-center">
                      <Link to={`/crm/cliente-edicion/${row.original.id}`}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800/30 dark:text-gray-300"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* **Controles de Paginación** */}
        <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50 px-4 py-3 text-xs dark:border-gray-800 dark:bg-transparent dark:text-gray-300 mt-0 rounded-b-md">
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
      </CardContent>
    </Card>
  );
}
