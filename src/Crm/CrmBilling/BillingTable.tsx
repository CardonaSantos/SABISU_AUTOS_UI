"use client";

import { useEffect, useMemo, useState } from "react";
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
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link } from "react-router-dom";
// import { Edit } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "sonner";
import dayjs from "dayjs";
import "dayjs/locale/es";
import utc from "dayjs/plugin/utc";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { CreditCard, File, FileCheck } from "lucide-react";
import { FacturacionZona } from "../CrmFacturacion/FacturacionZonaTypes";
import ReactSelectComponent from "react-select";
import DatePicker from "react-datepicker";
import { es } from "date-fns/locale";
import { Label } from "@/components/ui/label";

dayjs.extend(utc);
dayjs.extend(localizedFormat);
dayjs.locale("es");

const formatearFecha = (fecha: string) => {
  // Formateo en UTC sin conversión a local
  return dayjs(fecha).format("DD/MM/YYYY");
};

type Factura = {
  id: number;
  metodo: string;
  estado: EstadoFactura;
  cliente: string;
  clienteObj: clienteOBJECT;
  clienteId: number;
  direccionIp: string;
  cantidad: number;
  fechaCreado: string;
  fechaPago: string;
  por: string;
  telefono: number;
  facturacionZonaId?: number;
};

interface clienteOBJECT {
  nombre: string;
  municipio: number;
  departamento: number;
  sector: number;
  sectorId: number;
}

enum EstadoFactura {
  PENDIENTE = "PENDIENTE",
  PAGADA = "PAGADA",
  VENCIDA = "VENCIDA",
  ANULADA = "ANULADA",
  PARCIAL = "PARCIAL",
}

interface FacturacionData {
  cobrados: number | null;
  facturados: number | null;
  porCobrar: number | null;
}

// **Definir columnas de la tabla**
const columns: ColumnDef<Factura>[] = [
  { accessorKey: "id", header: "ID" },
  // { accessorKey: "metodo", header: "Metódo" },
  { accessorKey: "cliente", header: "Cliente" },
  { accessorKey: "cantidad", header: "Cantidad" },
  { accessorKey: "fechaCreado", header: "Fecha Creado" },
  { accessorKey: "fechaPago", header: "Fecha de Pago" },

  { accessorKey: "telefono", header: "Tel." },

  { accessorKey: "estado", header: "Estado" },
];
const VITE_CRM_API_URL = import.meta.env.VITE_CRM_API_URL;

interface Departamentos {
  id: number;
  nombre: string;
}

interface Municipios {
  id: number;
  nombre: string;
}

export default function BilingTable() {
  const [filter, setFilter] = useState("");
  const [facturas, setFactuas] = useState<Factura[]>([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 }); // 🔥 FIX: Agregamos pageIndex

  const [departamentos, setDepartamentos] = useState<Departamentos[]>([]);
  const [municipios, setMunicipios] = useState<Municipios[]>([]);

  const [depaSelected, setDepaSelected] = useState<string | null>("8");
  const [muniSelected, setMuniSelected] = useState<string | null>(null);

  const [sectores, setSectores] = useState<Sector[]>([]);
  const [sectorSelected, setSectorSelected] = useState<string | null>(null);

  interface Sector {
    id: number;
    nombre: string;
    clientesCount: number;
  }

  const handleSelectSector = (selectedOption: OptionSelected | null) => {
    setSectorSelected(selectedOption ? selectedOption.value : null);
  };

  console.log("el departamento selecionado es: ", depaSelected);
  console.log("el muniSelected selecionado es: ", muniSelected);
  console.log("las facturas son : ", facturas);

  const [facutracionData, setFacturacionData] = useState<FacturacionData>({
    cobrados: null,
    facturados: null,
    porCobrar: null,
  });

  const [zonasFacturacion, setZonasFacturacion] = useState<FacturacionZona[]>(
    []
  );

  const [zonasFacturacionSelected, setZonasFacturacionSelected] = useState<
    string | null
  >(null);

  const optionsZonasFacturacion: OptionSelected[] = zonasFacturacion
    .sort((a, b) => {
      const numA = parseInt(a.nombre.match(/\d+/)?.[0] || "0");
      const numB = parseInt(b.nombre.match(/\d+/)?.[0] || "0");
      return numA - numB;
    })
    .map((zona) => ({
      value: zona.id.toString(),
      label: `${zona.nombre} Clientes: (${zona.clientesCount}) Facturas: (${zona.facturasCount})`,
    }));

  const handleSelectZonaFacturacion = (
    selectedOption: OptionSelected | null
  ) => {
    setZonasFacturacionSelected(selectedOption ? selectedOption.value : null);
  };

  console.log("Las facturas son: ", facturas);

  const getFacturas = async () => {
    try {
      const response = await axios.get(
        `${VITE_CRM_API_URL}/facturacion/facturacion-to-table`
      );

      if (response.status === 200) {
        setFactuas(response.data.facturasMapeadas);
        setFacturacionData({
          cobrados: response.data.cobrados,
          facturados: response.data.facturados,
          porCobrar: response.data.porCobrar,
        });
      }
    } catch (error) {
      console.log(error);
      toast.error("Error al conseguir facturación");
    }
  };

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

  const handleSelectDepartamento = (selectedOption: OptionSelected | null) => {
    setDepaSelected(selectedOption ? selectedOption.value : null);
  };

  // Manejar el cambio en el select de municipio
  const handleSelectMunicipio = (selectedOption: OptionSelected | null) => {
    setMuniSelected(selectedOption ? selectedOption.value : null);
  };

  interface OptionSelected {
    value: string; // Cambiar 'number' a 'string'
    label: string;
  }

  // Cambiar 'optionsDepartamentos' para mapear los departamentos a 'string' para 'value'
  const optionsDepartamentos: OptionSelected[] = departamentos.map((depa) => ({
    value: depa.id.toString(), // Asegúrate de convertir el 'id' a 'string'
    label: depa.nombre,
  }));

  const optionsMunis: OptionSelected[] = municipios.map((muni) => ({
    value: muni.id.toString(),
    label: muni.nombre,
  }));

  const optionsSectores: OptionSelected[] = sectores.map((sector) => ({
    value: sector.id.toString(),
    label: `${sector.nombre}  Clientes: (${sector.clientesCount})`,
  }));

  useEffect(() => {
    getFacturas();
    getFacturacionZona();
    // getMunicipios();
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

  const opcionesEstadoFactura = [
    "TODOS",
    "PENDIENTE",
    "PAGADA",
    "VENCIDA",
    "ANULADA",
    "PARCIAL",
  ];

  // Tipos para las fechas
  type DateRange = {
    startDate: Date | undefined;
    endDate: Date | undefined;
  };

  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: undefined,
    endDate: undefined,
  });

  const [estadoFactura, setEstadoFactura] = useState<string>("");
  const handleSelectEstadoFactura = (estado: EstadoFactura) => {
    setEstadoFactura(estado);
  };
  console.log("El estado de la factura es: ", estadoFactura);

  const filteredFacturas = useMemo(() => {
    return facturas.filter((factura) => {
      // Filtros existentes
      const matchesZona = zonasFacturacionSelected
        ? factura?.facturacionZonaId === Number(zonasFacturacionSelected)
        : true;

      const matchesMunicipio = muniSelected
        ? factura?.clienteObj.municipio === Number(muniSelected)
        : true;

      const matchesDepartamento = depaSelected
        ? factura?.clienteObj.departamento === Number(depaSelected)
        : true;

      const matchesEstado =
        estadoFactura === "TODOS" || estadoFactura === ""
          ? true
          : factura?.estado === estadoFactura;

      const matchesSector = sectorSelected
        ? factura.clienteObj.sectorId === Number(sectorSelected)
        : true;

      // filtro de fechas
      const matchesDate = () => {
        if (!dateRange.startDate && !dateRange.endDate) return true;

        const ticketDate = new Date(factura.fechaPago);

        const start = dateRange.startDate
          ? new Date(dateRange.startDate)
          : new Date(0);
        start.setHours(0, 0, 0, 0);

        const end = dateRange.endDate
          ? new Date(dateRange.endDate)
          : new Date();
        end.setHours(23, 59, 59, 999);

        return ticketDate >= start && ticketDate <= end;
      };

      return (
        matchesZona &&
        matchesEstado &&
        matchesDepartamento &&
        matchesMunicipio &&
        matchesSector &&
        matchesDate()
      );
    });
  }, [
    facturas,
    zonasFacturacionSelected,
    estadoFactura,
    dateRange,
    depaSelected,
    muniSelected,
    sectorSelected,
  ]); // Añadir dateRange como dependencia
  // **Configuración de la tabla**
  const table = useReactTable({
    data: filteredFacturas,
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
      //tomar el row, la columnaId y el valor del input de la tabla
      const search = value.toLowerCase().trim(); //input
      const cliente = row.original as Factura; //tomamos de donde vamos a filtrar

      return (
        (cliente.telefono || "")
          .toString()
          .toLocaleLowerCase()
          .includes(search) ||
        (cliente.id || "").toString().toLocaleLowerCase().includes(search) ||
        (cliente.cliente || "")
          .toString()
          .toLocaleLowerCase()
          .includes(search) ||
        (cliente.metodo || "")
          .toString()
          .toLocaleLowerCase()
          .includes(search) ||
        (cliente.direccionIp || "")
          .toString()
          .toLocaleLowerCase()
          .includes(search) ||
        (cliente.por || "").toString().toLocaleLowerCase().includes(search)
      );
    },
  });

  const cobrados = facturas.filter((fac) => {
    return !["PENDIENTE", "PARCIAL", "VENCIDA", "ANULADA"].includes(fac.estado);
  });

  const facturados = facturas.filter((fac) => fac.estado !== "PAGADA");
  console.log("Los facturados sin aun pagar son: ", facturados);

  console.log("Los facturados son: ", cobrados);

  return (
    <Card className="max-w-full shadow-lg border border-gray-300 text-xs">
      <CardContent>
        <div className="flex justify-between items-center mb-4"></div>
        {/* **Campo de Búsqueda** */}
        <Input
          style={{ boxShadow: "none" }}
          type="text"
          placeholder="Buscar por nombre, telefono o ip"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="mb-3 text-xs px-2 py-1 border-2"
        />

        {/* **Selector de Cantidad de Filas** */}
        <div>
          {/* **Filtros de Facturación** */}
          <div className="space-y-4 mb-4">
            {/* Resumen de facturación */}
            <div className="flex flex-wrap items-center gap-4 p-2 bg-muted/20 rounded-lg">
              <div className="flex items-center">
                <File className="h-5 w-5 mr-2 dark:text-white" />
                <span className="text-sm font-semibold">
                  Facturados: {facutracionData.facturados}
                </span>
              </div>
              <div className="flex items-center">
                <CreditCard className="h-5 w-5 mr-2 dark:text-white" />
                <span className="text-sm font-semibold">
                  Cobrados: {facutracionData.cobrados}
                </span>
              </div>
              <div className="flex items-center">
                <FileCheck className="h-5 w-5 mr-2 dark:text-white" />
                <span className="text-sm font-semibold">
                  Por Cobrar: {facutracionData.porCobrar}
                </span>
              </div>
            </div>

            {/* Filtros */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {/* Rango de fechas */}
              <div className="space-y-1">
                <label className="text-xs font-medium">
                  Rango de fechas pago
                </label>
                <div className="flex gap-2">
                  <DatePicker
                    locale={es}
                    selected={dateRange.startDate || null}
                    onChange={(date: Date | null) =>
                      setDateRange((prev) => ({
                        ...prev,
                        startDate: date || undefined,
                      }))
                    }
                    selectsStart
                    startDate={dateRange.startDate}
                    endDate={dateRange.endDate}
                    placeholderText="Fecha inicial"
                    className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    dateFormat="dd/MM/yyyy"
                    isClearable
                  />

                  <DatePicker
                    selected={dateRange.endDate || null}
                    onChange={(date: Date | null) =>
                      setDateRange((prev) => ({
                        ...prev,
                        endDate: date || undefined,
                      }))
                    }
                    selectsEnd
                    startDate={dateRange.startDate}
                    endDate={dateRange.endDate}
                    minDate={dateRange.startDate}
                    placeholderText="Fecha final"
                    className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    dateFormat="dd/MM/yyyy"
                    isClearable
                  />
                </div>
              </div>

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
                <Label htmlFor="sectorid-all">Sector</Label>
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
                              (s) =>
                                s.id.toString() === zonasFacturacionSelected
                            )?.nombre || "",
                        }
                      : null
                  }
                />
              </div>

              {/* Estado Factura */}
              <div className="space-y-1">
                <Label>Estado Factura</Label>
                <Select onValueChange={handleSelectEstadoFactura}>
                  <SelectTrigger className="text-xs">
                    <SelectValue placeholder="Estado Factura" />
                  </SelectTrigger>
                  <SelectContent>
                    {opcionesEstadoFactura.map((state) => (
                      <SelectGroup key={state}>
                        <SelectItem value={state}>{state}</SelectItem>
                      </SelectGroup>
                    ))}
                  </SelectContent>
                </Select>
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
            </div>
          </div>
        </div>

        {/* **Tabla** */}
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
                  transition={{ type: "spring", stiffness: 120, damping: 22 }}
                  className="bg-white hover:bg-gray-50 dark:bg-transparent dark:hover:bg-gray-900/20 dark:text-gray-100"
                >
                  <td className="px-3 py-2 text-center font-medium">
                    {row.original.id}
                  </td>

                  <Link
                    to={`/crm/cliente/${row.original.clienteId}`}
                    className="contents"
                  >
                    <td className="px-3 py-2 truncate max-w-[100px] hover:text-emerald-600 dark:hover:text-emerald-400 hover:underline">
                      {row.original.cliente}
                    </td>
                  </Link>

                  <td className="px-3 py-2 truncate max-w-[150px] whitespace-nowrap text-gray-600 dark:text-gray-400">
                    {row.original.cantidad}
                  </td>

                  <td className="px-3 py-2 truncate max-w-[120px] whitespace-nowrap text-gray-600 dark:text-gray-400">
                    {formatearFecha(row.original.fechaCreado)}
                  </td>

                  <Link to={`/crm/facturacion/pago-factura/${row.original.id}`}>
                    <td className="px-3 py-2 truncate max-w-[120px] whitespace-nowrap hover:text-emerald-600 dark:hover:text-emerald-400 hover:underline">
                      {formatearFecha(row.original.fechaPago)}
                    </td>
                  </Link>

                  <td className="px-3 py-2 truncate max-w-[100px] whitespace-nowrap text-gray-600 dark:text-gray-400">
                    {row.original.telefono
                      ? row.original.telefono
                      : "Sin telefono"}
                  </td>

                  <td className="px-3 py-2 truncate max-w-[100px] whitespace-nowrap text-gray-600 dark:text-gray-400">
                    {row.original.por ? row.original.estado : "Sin cobrar"}
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
