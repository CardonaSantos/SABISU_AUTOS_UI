"use client";

import type React from "react";
import { useState, useEffect, useMemo } from "react";
import { useStoreCrm } from "../ZustandCrm/ZustandCrmContext";
import axios from "axios";
import { toast } from "sonner";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Checkbox } from "@/components/ui/checkbox";

// Icons
import {
  Users,
  MapPin,
  Search,
  ArrowUpDown,
  Loader2,
  Filter,
  AlertCircle,
  FileText,
  Phone,
  DollarSign,
} from "lucide-react";

// Custom Components
import { SelectCobradores } from "./SelectCobradores";
import { SelectZonaFacturacion } from "./SelectZonaFacturacion";

// Types
import {
  type ClienteInternet,
  EstadoCliente,
  type FacturacionZona,
  type OptionSelected,
  type CreateRutaDto,
  Sector,
} from "./rutas-types";
import { SelectSectores } from "./SelectSectores";

const VITE_CRM_API_URL = import.meta.env.VITE_CRM_API_URL;
const ITEMS_PER_PAGE = 10;

interface RutasCobroCreateProps {
  onRouteCreated: (message: string) => void;
}

export function RutasCobroCreate({ onRouteCreated }: RutasCobroCreateProps) {
  const empresaId = useStoreCrm((state) => state.empresaId) ?? 0;
  const [clientes, setClientes] = useState<ClienteInternet[]>([]);
  const [selectedClientes, setSelectedClientes] = useState<string[]>([]);
  const [searchCliente, setSearchCliente] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clienteFilter, setClienteFilter] = useState<EstadoCliente | "TODOS">(
    "TODOS"
  );
  const [zonaFacturacionId, setZonaFacturacionId] = useState<string | null>("");

  const [sectorId, setSectorId] = useState<string | null>("");

  const [facturacionZona, setFacturacionZona] = useState<FacturacionZona[]>([]);
  const [sortBy, setSortBy] = useState<"nombre" | "saldo">("nombre");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const [nuevaRuta, setNuevaRuta] = useState<CreateRutaDto>({
    nombreRuta: "",
    EmpresaId: empresaId,
    clientesIds: [],
    cobradorId: "",
    observaciones: "",
  });

  useEffect(() => {
    fetchClientes();
    fetchZonaF();
    fetchSectores();
  }, []);

  const fetchClientes = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get<ClienteInternet[]>(
        `${VITE_CRM_API_URL}/internet-customer/get-customers-ruta`
      );
      setClientes(data); // <- sin paginar aquí
    } catch (err) {
      console.error("Error al cargar clientes:", err);
      toast.error("Error al cargar clientes");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchZonaF = async () => {
    try {
      const response = await axios.get(
        `${VITE_CRM_API_URL}/facturacion-zona/get-zonas-facturacion-to-ruta`
      );
      if (response.status === 200) {
        setFacturacionZona(response.data);
      }
    } catch (err) {
      console.error("Error al cargar zonas de facturación:", err);
      toast.error("Error al cargar datos de zona");
    }
  };

  const [sectores, setSectores] = useState<Sector[]>([]);
  const fetchSectores = async () => {
    try {
      const response = await axios.get(
        `${VITE_CRM_API_URL}/sector/sectores-to-select`
      );
      if (response.status === 200) {
        setSectores(response.data);
      }
    } catch (err) {
      console.error("Error al cargar sectores:", err);
      toast.error("Error al cargar datos de zona");
    }
  };
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNuevaRuta((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleClienteSelect = (clienteId: string, checked: boolean) => {
    if (checked) {
      setSelectedClientes((prev) => [...prev, clienteId]);
    } else {
      setSelectedClientes((prev) => prev.filter((id) => id !== clienteId));
    }
  };

  const handleSelectAllInPage = (checked: boolean) => {
    if (checked) {
      const clientesIds = filteredClientes.map((c) => c.id.toString());
      setSelectedClientes((prev) => {
        const uniqueIds = new Set([...prev, ...clientesIds]);
        return Array.from(uniqueIds);
      });
    } else {
      const clientesIds = filteredClientes.map((c) => c.id.toString());
      setSelectedClientes((prev) =>
        prev.filter((id) => !clientesIds.includes(id))
      );
    }
  };

  const handleSubmitRuta = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validaciones
      if (!nuevaRuta.nombreRuta.trim()) {
        throw new Error("El nombre de la ruta es obligatorio");
      }

      if (selectedClientes.length === 0) {
        throw new Error("Debe seleccionar al menos un cliente para la ruta");
      }

      if (!nuevaRuta.EmpresaId) {
        throw new Error("Debe seleccionar una empresa");
      }

      const dataToSend = {
        nombreRuta: nuevaRuta.nombreRuta,
        cobradorId: Number(nuevaRuta.cobradorId),
        empresaId: nuevaRuta.EmpresaId,
        clientes: selectedClientes.map((c) => Number.parseInt(c)),
        observaciones: nuevaRuta.observaciones,
      };

      const response = await axios.post(
        `${VITE_CRM_API_URL}/ruta-cobro`,
        dataToSend
      );

      if (response.status === 201) {
        toast.success("Ruta creada exitosamente");
        setNuevaRuta({
          clientesIds: [],
          EmpresaId: empresaId,
          nombreRuta: "",
          cobradorId: "",
          observaciones: "",
        });
        setSelectedClientes([]);
        onRouteCreated("Ruta de cobro creada exitosamente");
      }
    } catch (err: any) {
      console.error("Error al crear ruta:", err);
      toast.error(err.message || "Error al crear la ruta de cobro");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleSort = (field: "nombre" | "saldo") => {
    if (sortBy === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortDirection("asc");
    }
    setCurrentPage(1); // Volver a la primera página al cambiar el ordenamiento
  };

  const handleSelecZona = (option: OptionSelected | null) => {
    const newValue = option ? option.value : null;
    setZonaFacturacionId(newValue);
    setCurrentPage(1); // Volver a la primera página al cambiar el filtro
  };

  const handleSectorChange = (value: string | null) => {
    setSectorId(value);
    setCurrentPage(1);
  };

  useEffect(() => {
    setNuevaRuta((prev) => ({
      ...prev,
      clientesIds: selectedClientes,
    }));
  }, [selectedClientes]);

  const getClienteEstadoBadgeColor = (estado: EstadoCliente) => {
    switch (estado) {
      case EstadoCliente.ACTIVO:
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";

      case EstadoCliente.PENDIENTE_ACTIVO:
        return "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400";

      case EstadoCliente.PAGO_PENDIENTE:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";

      case EstadoCliente.ATRASADO:
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400";

      case EstadoCliente.MOROSO:
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";

      case EstadoCliente.SUSPENDIDO:
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400";

      case EstadoCliente.DESINSTALADO:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";

      case EstadoCliente.EN_INSTALACION:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";

      default:
        return "";
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      // Si hay pocas páginas, mostrar todas
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);
      if (currentPage <= 3) {
        endPage = Math.min(totalPages - 1, 4);
      }
      if (currentPage >= totalPages - 2) {
        startPage = Math.max(2, totalPages - 3);
      }
      if (startPage > 2) {
        pages.push("ellipsis1");
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (endPage < totalPages - 1) {
        pages.push("ellipsis2");
      }

      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const clearFilters = () => {
    setSearchCliente("");
    setClienteFilter("TODOS");
    setZonaFacturacionId("");
    setCurrentPage(1);
  };
  console.log(
    "Los clientes son: ",
    clientes.slice(0, 10),
    " el id sector es: ",
    sectorId
  );

  const filteredClientes = useMemo(() => {
    const term = searchCliente.trim().toLowerCase();
    return clientes.filter((c) => {
      const fullName = `${c.nombre} ${c.apellidos ?? ""}`.toLowerCase();
      const matchesNombre = term === "" || fullName.includes(term);

      const matchesEstado =
        clienteFilter === "TODOS" || c.estadoCliente === clienteFilter;

      const matchesPorSector = sectorId
        ? c?.sector?.id === Number(sectorId)
        : true;

      const matchesFacturacionZona = zonaFacturacionId
        ? c?.facturacionZona === Number(zonaFacturacionId)
        : true;

      return (
        matchesNombre &&
        matchesEstado &&
        matchesPorSector &&
        matchesFacturacionZona
      );
    });
  }, [clientes, searchCliente, clienteFilter, zonaFacturacionId, sectorId]);

  const sortedClientes = useMemo(() => {
    return [...filteredClientes].sort((a, b) => {
      if (sortBy === "nombre") {
        const nameA = `${a.nombre} ${a.apellidos ?? ""}`.toLowerCase();
        const nameB = `${b.nombre} ${b.apellidos ?? ""}`.toLowerCase();
        return sortDirection === "asc"
          ? nameA.localeCompare(nameB)
          : nameB.localeCompare(nameA);
      } else {
        const saldoA = a.saldoPendiente ?? 0;
        const saldoB = b.saldoPendiente ?? 0;
        return sortDirection === "asc" ? saldoA - saldoB : saldoB - saldoA;
      }
    });
  }, [filteredClientes, sortBy, sortDirection]);

  const totalFiltered = sortedClientes.length;
  const totalPages = Math.ceil(totalFiltered / ITEMS_PER_PAGE);
  const paginatedClientes = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedClientes.slice(start, start + ITEMS_PER_PAGE);
  }, [sortedClientes, currentPage]);

  const areAllInPageSelected =
    paginatedClientes.length > 0 &&
    paginatedClientes.every((c) => selectedClientes.includes(c.id.toString()));

  // Sumamos el total a cobrar solo de los clientes visibles y seleccionados
  const totalACobrar = paginatedClientes
    .filter((c) => selectedClientes.includes(c.id.toString()))
    .reduce((sum, c) => sum + (c.saldoPendiente || 0), 0);

  return (
    <form onSubmit={handleSubmitRuta} className="space-y-6">
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Datos de la Ruta
          </CardTitle>
          <CardDescription>
            Ingrese la información básica de la ruta de cobro
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nombreRuta" className="text-base">
              Nombre de la Ruta <span className="text-destructive">*</span>
            </Label>
            <Input
              id="nombreRuta"
              name="nombreRuta"
              placeholder="Ej: Ruta Centro"
              value={nuevaRuta.nombreRuta}
              onChange={handleInputChange}
              className="text-base"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cobrador" className="text-base">
              Cobrador Asignado
            </Label>
            <SelectCobradores
              value={nuevaRuta.cobradorId}
              onChange={(value) =>
                setNuevaRuta((prev) => ({ ...prev, cobradorId: value }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="observaciones" className="text-base">
              Observaciones
            </Label>
            <Textarea
              id="observaciones"
              name="observaciones"
              value={nuevaRuta.observaciones || ""}
              onChange={handleInputChange}
              rows={3}
              className="resize-none text-base"
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Card className="max-w-sm mx-auto bg-muted/40">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                Resumen de la selección
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>Clientes seleccionados</span>
                </div>
                <Badge variant="outline">{selectedClientes.length}</Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <DollarSign className="h-4 w-4" />
                  <span>Total a cobrar</span>
                </div>
                <span className="font-semibold ">
                  Q{totalACobrar.toFixed(2)}
                </span>
              </div>
            </CardContent>
          </Card>

          <Button
            type="submit"
            className="w-full"
            disabled={
              isSubmitting ||
              !nuevaRuta.nombreRuta ||
              selectedClientes.length === 0
            }
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creando...
              </>
            ) : (
              <>Crear Ruta de Cobro</>
            )}
          </Button>

          {(selectedClientes.length === 0 || !nuevaRuta.nombreRuta) && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-900/30 text-sm">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <div>
                  {!nuevaRuta.nombreRuta && (
                    <p>Debe ingresar un nombre para la ruta.</p>
                  )}
                  {selectedClientes.length === 0 && (
                    <p>Debe seleccionar al menos un cliente.</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardFooter>
      </Card>
      {/* Selección de clientes - Card inferior */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-4">
            <div className="flex flex-wrap items-center gap-2 w-full">
              {/* Input de búsqueda */}
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar clientes..."
                  className="pl-8 w-full"
                  value={searchCliente}
                  onChange={(e) => {
                    setSearchCliente(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>

              {/* Botón de filtros */}
              <Button
                variant="outline"
                size="sm"
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="flex-shrink-0 gap-1"
              >
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline">Filtros</span>
              </Button>
            </div>
          </div>

          {/* Filtros expandibles */}
          {showFilters && (
            <div className="mt-4 p-4 bg-muted/50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Filtro de estado */}
                <div className="space-y-2">
                  <Label htmlFor="estado-filter">Estado del cliente</Label>
                  <Select
                    onValueChange={(value) => {
                      setClienteFilter(value as EstadoCliente | "TODOS");
                      setCurrentPage(1);
                    }}
                    value={clienteFilter}
                  >
                    <SelectTrigger id="estado-filter">
                      <SelectValue placeholder="Todos los estados" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TODOS">Todos</SelectItem>
                      <SelectItem value={EstadoCliente.ACTIVO}>
                        Activos
                      </SelectItem>
                      <SelectItem value={EstadoCliente.ATRASADO}>
                        Atrasados
                      </SelectItem>
                      <SelectItem value={EstadoCliente.MOROSO}>
                        Morosos
                      </SelectItem>
                      <SelectItem value={EstadoCliente.PAGO_PENDIENTE}>
                        Pago Pendiente
                      </SelectItem>
                      <SelectItem value={EstadoCliente.PENDIENTE_ACTIVO}>
                        Pendiente Activo
                      </SelectItem>
                      <SelectItem value={EstadoCliente.SUSPENDIDO}>
                        Suspendido
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Zona de facturación */}
                <div className="space-y-2">
                  <Label htmlFor="zona-filter">Zona de facturación</Label>
                  <SelectZonaFacturacion
                    zonas={facturacionZona}
                    value={zonaFacturacionId}
                    onChange={handleSelecZona}
                  />
                </div>

                {/* Sectores */}
                <div className="space-y-2">
                  <Label htmlFor="sector-filter">Sectores</Label>
                  <SelectSectores
                    sectores={sectores}
                    value={sectorId}
                    onChange={handleSectorChange}
                  />
                </div>
              </div>
            </div>
          )}
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="rounded-md border">
              <div className="p-4">
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-4">
                      <div className="h-4 w-4 bg-muted rounded animate-pulse"></div>
                      <div className="w-full space-y-2">
                        <div className="h-4 bg-muted rounded w-1/4 animate-pulse"></div>
                        <div className="h-3 bg-muted rounded w-1/6 animate-pulse"></div>
                      </div>
                      <div className="h-4 bg-muted rounded w-1/6 animate-pulse"></div>
                      <div className="h-4 bg-muted rounded w-1/12 animate-pulse"></div>
                      <div className="h-6 bg-muted rounded w-1/12 animate-pulse"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : filteredClientes.length === 0 ? (
            <div className="bg-muted/50 rounded-lg p-8 text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-muted rounded-full p-3">
                  <Search className="h-6 w-6 text-muted-foreground" />
                </div>
              </div>
              <h3 className="text-lg font-medium mb-1">
                No se encontraron clientes
              </h3>
              <p className="text-muted-foreground mb-4">
                Intente con otros criterios de búsqueda o limpie los filtros
              </p>
              <Button variant="outline" onClick={clearFilters}>
                Limpiar filtros
              </Button>
            </div>
          ) : (
            <>
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">
                        <Checkbox
                          checked={areAllInPageSelected}
                          onCheckedChange={handleSelectAllInPage}
                          aria-label="Seleccionar todos en esta página"
                        />
                      </TableHead>
                      <TableHead>
                        <div
                          className="flex items-center gap-1 cursor-pointer"
                          onClick={() => toggleSort("nombre")}
                        >
                          Cliente
                          <ArrowUpDown className="h-3.5 w-3.5" />
                        </div>
                      </TableHead>
                      <TableHead className="hidden md:table-cell">
                        Contacto
                      </TableHead>
                      <TableHead className="hidden md:table-cell">
                        Estado
                      </TableHead>
                      <TableHead>
                        <div
                          className="flex items-center gap-1 cursor-pointer"
                          onClick={() => toggleSort("saldo")}
                        >
                          Saldo
                          <ArrowUpDown className="h-3.5 w-3.5" />
                        </div>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedClientes.map((cliente) => (
                      <TableRow
                        key={cliente.id}
                        className={
                          selectedClientes.includes(cliente.id.toString())
                            ? "bg-primary/5"
                            : ""
                        }
                      >
                        <TableCell>
                          <Checkbox
                            checked={selectedClientes.includes(
                              cliente.id.toString()
                            )}
                            onCheckedChange={(checked) =>
                              handleClienteSelect(
                                cliente.id.toString(),
                                checked === true
                              )
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">
                            {cliente.nombre} {cliente.apellidos || ""}
                          </div>
                          <div className="flex items-start gap-1 text-sm text-muted-foreground md:hidden">
                            <MapPin className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                            <span className="truncate max-w-[200px]">
                              {cliente.direccion || "No disponible"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="space-y-1">
                            {cliente.telefono && (
                              <div className="flex items-center gap-1 text-sm">
                                <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                                <span>{cliente.telefono}</span>
                              </div>
                            )}
                            <div className="flex items-start gap-1 text-sm">
                              <MapPin className="h-3.5 w-3.5 mt-0.5 text-muted-foreground flex-shrink-0" />
                              <span className="truncate max-w-[200px]">
                                {cliente.direccion || "No disponible"}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <Badge
                            className={getClienteEstadoBadgeColor(
                              cliente.estadoCliente
                            )}
                          >
                            {cliente.estadoCliente}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">
                            Q{cliente.saldoPendiente?.toFixed(2) || "0.00"}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <FileText className="h-3 w-3" />
                            {cliente.facturasPendientes || 0} facturas
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Paginación */}
              {totalPages > 1 && (
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Mostrando {(currentPage - 1) * ITEMS_PER_PAGE + 1} -{" "}
                    {Math.min(currentPage * ITEMS_PER_PAGE, totalFiltered)} de{" "}
                    {totalFiltered} clientes
                  </div>

                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (currentPage > 1)
                              setCurrentPage(currentPage - 1);
                          }}
                          className={
                            currentPage === 1
                              ? "pointer-events-none opacity-50"
                              : ""
                          }
                        />
                      </PaginationItem>

                      {getPageNumbers().map((page, index) =>
                        page === "ellipsis1" || page === "ellipsis2" ? (
                          <PaginationItem key={`ellipsis-${index}`}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        ) : (
                          <PaginationItem key={page}>
                            <PaginationLink
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                setCurrentPage(Number(page));
                              }}
                              isActive={currentPage === page}
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        )
                      )}

                      <PaginationItem>
                        <PaginationNext
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (currentPage < totalPages)
                              setCurrentPage(currentPage + 1);
                          }}
                          className={
                            currentPage === totalPages
                              ? "pointer-events-none opacity-50"
                              : ""
                          }
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </CardContent>

        {/* Mensaje de validación */}
        {(selectedClientes.length === 0 || !nuevaRuta.nombreRuta) && (
          <CardFooter>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-900/30 text-sm w-full">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <div>
                  {!nuevaRuta.nombreRuta && (
                    <p>Debe ingresar un nombre para la ruta.</p>
                  )}
                  {selectedClientes.length === 0 && (
                    <p>Debe seleccionar al menos un cliente.</p>
                  )}
                </div>
              </div>
            </div>
          </CardFooter>
        )}
      </Card>
    </form>
  );
}
