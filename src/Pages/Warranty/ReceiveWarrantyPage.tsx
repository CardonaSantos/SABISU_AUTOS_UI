"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";

import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import SelectComponent from "react-select";
import { useStore } from "@/components/Context/ContextSucursal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Eye,
  FileText,
  HammerIcon,
  Package,
  RefreshCw,
  User,
  BuildingIcon,
  FileTextIcon,
  FileSpreadsheet,
  CheckCircleIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { RegistroGarantia } from "@/Types/Warranty/WarrantyRegist";
import { ScrollArea } from "@/components/ui/scroll-area";

const API_URL = import.meta.env.VITE_API_URL;
import dayjs from "dayjs";
import "dayjs/locale/es";
import utc from "dayjs/plugin/utc";
import localizedFormat from "dayjs/plugin/localizedFormat";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

dayjs.extend(utc);
dayjs.extend(localizedFormat);
dayjs.locale("es");

const formatearFecha = (fecha: string) => {
  // Formateo en UTC sin conversión a local
  return dayjs(fecha).format("DD/MM/YYYY hh:mm A");
};

interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  codigoProducto: string;
  creadoEn: string;
  actualizadoEn: string;
  precioCostoActual: number;
}

interface Cliente {
  id: number;
  nombre: string;
  telefono: string;
  direccion: string;
  creadoEn: string;
  actualizadoEn: string;
  municipioId: number | null;
  departamentoId: number | null;
  dpi: string;
}

interface GarantiaFormData {
  clienteId: number;
  productoId: number | null;
  proveedorId: number | null;
  comentario: string;
  descripcionProblema: string;
  usuarioIdRecibe: number | null;
  estado: "" | "ENVIADO_A_PROVEEDOR" | "EN_REPARACION"; // Permitir estos valores específicos
}

export default function ReceiveWarrantyPage() {
  const navigate = useNavigate();
  const userID = useStore((state) => state.userId);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [formData, setFormData] = useState<GarantiaFormData>({
    clienteId: 0,
    productoId: 0,
    comentario: "",
    proveedorId: 0,
    descripcionProblema: "",
    usuarioIdRecibe: userID,
    estado: "",
  });

  console.log("El formData es: ", formData);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/products/product-to-warranty`
        );
        if (response.status === 200) {
          setProductos(response.data);
        }
      } catch (error) {
        console.error("Error fetching productos:", error);
        toast.error("Error al cargar los productos");
      }
    };

    const fetchClientes = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/client/customers-to-warranty`
        );
        if (response.status === 200) {
          setClientes(response.data);
        }
      } catch (error) {
        console.error("Error fetching clientes:", error);
        toast.error("Error al cargar los clientes");
      }
    };

    fetchProductos();
    fetchClientes();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isDisable) {
      return;
    }

    setIsDisable(true);

    if (
      formData.clienteId <= 0 ||
      formData.productoId === null ||
      formData.productoId <= 0
    ) {
      toast.warning("Debe seleccionar un producto y cliente");
      setIsDisable(false);
      return;
    }

    if (!formData.usuarioIdRecibe) {
      toast.info("Esperando datos necesarios... vuelva a intentar de nuevo");
      setIsDisable(false);
      return;
    }

    if (!formData.comentario || !formData.descripcionProblema) {
      toast.warning("Debe ingresar un comentario y descripción del problema");
      setIsDisable(false);
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/warranty`, formData);
      if (response.status === 201) {
        toast.success("Registro de garantía creado");
        setFormData({
          clienteId: 0,
          productoId: 0,
          comentario: "",
          descripcionProblema: "",
          usuarioIdRecibe: userID,
          proveedorId: 0,
          estado: "",
        });
        setTimeout(() => {
          navigate("/");
        }, 1200);
      }
    } catch (error) {
      console.error("Error submitting garantia:", error);
      toast.error("Error al registrar la garantía");
      setIsDisable(false);
    }
  };

  const productosFormato = productos.map((prod) => ({
    label: `${prod.nombre} (${prod.codigoProducto})`,
    value: prod.id,
  }));

  const clientesFormatoSelect = clientes.map((client) => ({
    label: `${client.nombre} (${client.telefono}) DPI: ${client?.dpi}`,
    value: client.id,
  }));

  interface OptionType {
    label: string;
    value: number;
  }

  const [selectedOptionProduct, setSelectedOptionProduct] =
    useState<OptionType | null>(null);

  const handleChange = (selectedOption: OptionType | null) => {
    setSelectedOptionProduct(selectedOption);
    setFormData((prevFormData) => ({
      ...prevFormData,
      productoId: selectedOption ? selectedOption.value : 0, // Usa 0 en lugar de null
    }));
  };

  //OPCIONES PARA EL SELECT DE CLIENTES
  const [selectedOptionCustomer, setSelectedOptionCustomer] =
    useState<OptionType | null>(null);

  const handleChangeCliente = (selectedOption: OptionType | null) => {
    setSelectedOptionCustomer(selectedOption);
    setFormData((prevFormData) => ({
      ...prevFormData,
      clienteId: selectedOption ? selectedOption.value : 0, // Usa 0 en lugar de null
    }));
  };

  //PARA EL TABLE

  const [registros, setRegistros] = useState<RegistroGarantia[]>([]);
  useEffect(() => {
    const getRegists = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/warranty/get-regists-warranties`
        );
        if (response.status === 200) {
          setRegistros(response.data);
        }
      } catch (error) {
        console.log(error);
        toast.error("Error al recupear registros");
      }
    };
    getRegists();
  }, []);

  interface ProveedoresResponse {
    id: number;
    nombre: string;
  }
  const [providers, setProviders] = useState<ProveedoresResponse[]>([]);
  const [selecProviderID, setSelecProviderID] = useState<OptionType | null>(
    null
  );
  const handleChangeProvider = (selectedOption: OptionType | null) => {
    setSelecProviderID(selectedOption);
    setFormData((prevFormData) => ({
      ...prevFormData,
      proveedorId: selectedOption ? selectedOption.value : 0, // Usa 0 en lugar de null
    }));
  };
  console.log("EL ID DEL PROVEEDOR SELECCIONADO ES: ", selecProviderID);

  //PROVEEDORES
  useEffect(() => {
    const getRegists = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/proveedor/get-provider-to-warranty`
        );
        if (response.status === 200) {
          setProviders(response.data);
        }
      } catch (error) {
        console.log(error);
        toast.error("Error al recupear registros");
      }
    };
    getRegists();
  }, []);

  const providerOptionSelect = providers.map((prov) => ({
    label: `${prov.nombre}`,
    value: prov.id,
  }));

  console.log("LOS  PROVEEDORES SON: ", providers);

  console.log("LOS REGISTROS SON: ", registros);
  console.log("EL FORMDATA ES: ", formData);

  const [selectedRegistro, setSelectedRegistro] =
    useState<RegistroGarantia | null>(null);

  const handleOpenDialog = (registro: RegistroGarantia) => {
    setSelectedRegistro(registro);
  };

  //=========================================================>
  // Componente para la sección de detalles
  const DetalleSeccion = ({
    titulo,
    icon,
    children,
  }: {
    titulo: string;
    icon: React.ReactNode;
    children: React.ReactNode;
  }) => (
    <div className="bg-muted p-4 rounded-lg">
      <h3 className="font-semibold mb-3 flex items-center gap-2">
        {icon}
        {titulo}
      </h3>
      <div className="space-y-2">{children}</div>
    </div>
  );

  // Componente para cada detalle
  const DetalleItem = ({ label, value }: { label: string; value: string }) => (
    <p className="text-sm">
      <span className="font-medium">{label}:</span> {value ? value : "N/A"}
    </p>
  );

  // Componente para los detalles del registro
  const DetallesRegistro = ({ registro }: { registro: RegistroGarantia }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <DetalleSeccion
        titulo="Información del Producto"
        icon={<Package className="h-5 w-5" />}
      >
        <DetalleItem label="Nombre" value={registro.producto.nombre} />
        <DetalleItem
          label="Descripción"
          value={registro.producto.descripcion}
        />
        <DetalleItem
          label="Código Producto"
          value={registro.producto.codigoProducto}
        />
      </DetalleSeccion>

      <DetalleSeccion
        titulo="Información del Cliente"
        icon={<User className="h-5 w-5" />}
      >
        <DetalleItem label="Nombre" value={registro.garantia.cliente.nombre} />
        <DetalleItem
          label="Teléfono"
          value={registro.garantia.cliente.telefono}
        />
        <DetalleItem label="DPI" value={registro.garantia.cliente.dpi} />
        <DetalleItem
          label="Dirección"
          value={registro.garantia.cliente.direccion}
        />
      </DetalleSeccion>

      <DetalleSeccion
        titulo="Detalles de la Garantía"
        icon={<FileText className="h-5 w-5" />}
      >
        {/* <DetalleItem label="Estado" value={registro.estado} /> */}
        <div className="">
          <Badge
            className={
              registro.estado === "REPARADO"
                ? "bg-green-600"
                : registro.estado === "REEMPLAZADO"
                ? "bg-red-600"
                : "bg-purple-700" // valor predeterminado en caso de que no coincida con "REPARADO" ni "REEMPLAZADO"
            }
          >
            {registro.estado}
          </Badge>
        </div>

        <DetalleItem
          label="Fecha de Registro"
          value={formatearFecha(registro.fechaRegistro)}
        />
        <DetalleItem label="Conclusión" value={registro.conclusion} />
        <DetalleItem
          label="Acciones Realizadas"
          value={registro.accionesRealizadas}
        />
      </DetalleSeccion>

      <DetalleSeccion
        titulo="Información de la Sucursal"
        icon={<BuildingIcon className="h-5 w-5" />}
      >
        <DetalleItem label="Nombre" value={registro.usuario.sucursal.nombre} />
        <DetalleItem
          label="Dirección"
          value={registro.usuario.sucursal.direccion}
        />
        <DetalleItem label="Atendido por" value={registro.usuario.nombre} />
      </DetalleSeccion>
    </div>
  );

  const [isDisable, setIsDisable] = useState(false);

  const [filtroGarantia, setFiltroGarantia] = useState("");
  const filtrados = registros.filter(
    (g) =>
      g.garantia.cliente.nombre
        .trim()
        .toLocaleLowerCase()
        .includes(filtroGarantia.trim().toLocaleLowerCase()) ||
      g.id
        .toString()
        .trim()
        .toLocaleLowerCase()
        .includes(filtroGarantia.trim().toLocaleLowerCase()) ||
      g.garantia.cliente.telefono
        .toString()
        .trim()
        .toLocaleLowerCase()
        .includes(filtroGarantia.trim().toLocaleLowerCase()) ||
      g.garantia.cliente.dpi
        .trim()
        .toLocaleLowerCase()
        .includes(filtroGarantia.trim().toLocaleLowerCase()) ||
      g.garantia.cliente.direccion
        .trim()
        .toLocaleLowerCase()
        .includes(filtroGarantia.trim().toLocaleLowerCase())
  );

  //PAGINACIÓN:
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  const totalPages = Math.ceil(filtrados.length / itemsPerPage);

  // Calcular el índice del último elemento de la página actual
  const indexOfLastItem = currentPage * itemsPerPage;
  // Calcular el índice del primer elemento de la página actual
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // Obtener los elementos de la página actual
  const currentItems = filtrados.slice(indexOfFirstItem, indexOfLastItem);

  // Cambiar de página
  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  const [openGarantia, setOpenGarantia] = useState(false);

  return (
    <div className="container mx-auto px-4 py-8">
      <Tabs defaultValue="regist" className="w-full">
        <div className="flex justify-center">
          <TabsList className="grid w-full max-w-4xl grid-cols-2">
            <TabsTrigger value="regist">Registrar Garantía</TabsTrigger>
            <TabsTrigger value="warranties">Registros</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="regist">
          <Card className="max-w-4xl mx-auto shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">
                Registro de Garantía
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="clienteId">PRODUCTO</Label>
                  <SelectComponent
                    className="bg-transparent text-black"
                    options={productosFormato}
                    isClearable={true}
                    value={selectedOptionProduct}
                    onChange={handleChange}
                    placeholder="Selecciona un producto"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="productoId">CLIENTE</Label>
                  <SelectComponent
                    className="bg-transparent text-black"
                    options={clientesFormatoSelect}
                    isClearable={true}
                    value={selectedOptionCustomer}
                    onChange={handleChangeCliente}
                    placeholder="Selecciona un cliente"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="productoId">PROVEEDOR</Label>
                  <SelectComponent
                    className="bg-transparent text-black"
                    options={providerOptionSelect}
                    isClearable={true}
                    value={selecProviderID}
                    onChange={handleChangeProvider}
                    placeholder="Selecciona un proveedor (opcional)"
                  />
                </div>

                {/* <div className="space-y-2">
                  <Label htmlFor="estado">ESTADO</Label>
                  <SelectComponent
                    className="bg-transparent text-black"
                    options={[
                      {
                        value: "ENVIADO_A_PROVEEDOR",
                        label: "Enviado a proveedor",
                      },
                      { value: "EN_REPARACION", label: "En reparación" },
                    ]}
                    isClearable
                    value={{
                      value: formData.estado,
                      label: formData.estado || "Selecciona un estado",
                    }}
                    onChange={(selectedOption) =>
                      setFormData((prev) => ({
                        ...prev,
                        estado: selectedOption ? selectedOption.value : "",
                      }))
                    }
                    placeholder="Selecciona un estado (recibido por defecto)"
                  />
                </div> */}

                <div className="space-y-2">
                  <Label htmlFor="comentario">Comentario sobre el fallo</Label>
                  <Textarea
                    id="comentario"
                    name="comentario"
                    value={formData.comentario}
                    onChange={handleInputChange}
                    placeholder="Breve descripción del fallo"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descripcionProblema">
                    Descripción detallada del problema
                  </Label>
                  <Textarea
                    id="descripcionProblema"
                    name="descripcionProblema"
                    value={formData.descripcionProblema}
                    onChange={handleInputChange}
                    placeholder="Describe detalladamente el problema"
                    rows={4}
                  />
                </div>

                <Button
                  onClick={() => setOpenGarantia(true)}
                  type="button"
                  className="w-full"
                >
                  Registrar Garantía
                </Button>
              </form>

              <Dialog open={openGarantia} onOpenChange={setOpenGarantia}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="text-center">
                      ¿Estás seguro de comenzar este registro de garantía con
                      esta información?
                    </DialogTitle>
                    <DialogDescription className="text-center">
                      ¿Continuar?
                    </DialogDescription>
                  </DialogHeader>
                  <Button
                    disabled={isDisable}
                    onClick={handleSubmit}
                    className="w-full"
                  >
                    Si, confirmar
                  </Button>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="warranties">
          <div className="container mx-auto p-4">
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle>Registros de Garantía</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="columns-1 md:columns-2 my-4">
                  <Input
                    onChange={(e) => setFiltroGarantia(e.target.value)}
                    value={filtroGarantia}
                    placeholder="Buscar por número de garantía, nombre, dpi, teléfono, dirección"
                  />
                </div>

                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Producto</TableHead>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentItems &&
                        currentItems.map((registro) => (
                          <TableRow key={registro.id}>
                            <TableCell>#{registro.id}</TableCell>
                            <TableCell>{registro.producto.nombre}</TableCell>
                            <TableCell>
                              {registro.garantia.cliente.nombre}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  registro.estado === "REPARADO"
                                    ? "default"
                                    : registro.estado === "CERRADO"
                                    ? "destructive" // Variante para el estado "CERRADO"
                                    : "secondary"
                                }
                              >
                                {registro.estado === "REPARADO" ? (
                                  <HammerIcon className="mr-1 h-3 w-3" />
                                ) : registro.estado === "CERRADO" ? (
                                  <CheckCircleIcon className="mr-1 h-3 w-3" /> // Ícono para "CERRADO"
                                ) : (
                                  <RefreshCw className="mr-1 h-3 w-3" />
                                )}
                                {registro.estado}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {formatearFecha(registro.fechaRegistro)}
                            </TableCell>
                            <TableCell className="flex gap-2">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Link
                                      to={`/ticket-garantia/${registro.garantia.id}`}
                                    >
                                      <Button variant={"outline"} size={"icon"}>
                                        <FileSpreadsheet className="h-4 w-4" />
                                      </Button>
                                    </Link>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Conseguir ticket de garantía</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>

                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Link
                                      to={`/garantia/comprobante-uso/${registro.id}`}
                                    >
                                      <Button variant={"outline"} size={"icon"}>
                                        <FileTextIcon className="h-4 w-4" />
                                      </Button>
                                    </Link>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Generar Comprobante de garantía final</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>

                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleOpenDialog(registro)}
                                  >
                                    <Eye className="mr-1 h-4 w-4" /> Ver
                                    detalles
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-4xl">
                                  <DialogHeader>
                                    <DialogTitle>
                                      Detalles del Registro de Garantía
                                    </DialogTitle>
                                  </DialogHeader>

                                  <ScrollArea className="max-h-[80vh] overflow-y-auto pr-4">
                                    {selectedRegistro && (
                                      <DetallesRegistro
                                        registro={selectedRegistro}
                                      />
                                    )}
                                  </ScrollArea>
                                </DialogContent>
                              </Dialog>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
                <CardFooter className="flex justify-center items-center">
                  <div className="flex items-center justify-center py-4">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <Button onClick={() => onPageChange(1)}>
                            Primero
                          </Button>
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={() =>
                              onPageChange(Math.max(1, currentPage - 1))
                            }
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </PaginationPrevious>
                        </PaginationItem>

                        {/* Sistema de truncado */}
                        {currentPage > 3 && (
                          <>
                            <PaginationItem>
                              <PaginationLink onClick={() => onPageChange(1)}>
                                1
                              </PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                              <span className="text-muted-foreground">...</span>
                            </PaginationItem>
                          </>
                        )}

                        {Array.from({ length: totalPages }, (_, index) => {
                          const page = index + 1;
                          if (
                            page === currentPage ||
                            (page >= currentPage - 1 && page <= currentPage + 1)
                          ) {
                            return (
                              <PaginationItem key={index}>
                                <PaginationLink
                                  onClick={() => onPageChange(page)}
                                  isActive={page === currentPage}
                                >
                                  {page}
                                </PaginationLink>
                              </PaginationItem>
                            );
                          }
                          return null;
                        })}

                        {currentPage < totalPages - 2 && (
                          <>
                            <PaginationItem>
                              <span className="text-muted-foreground">...</span>
                            </PaginationItem>
                            <PaginationItem>
                              <PaginationLink
                                onClick={() => onPageChange(totalPages)}
                              >
                                {totalPages}
                              </PaginationLink>
                            </PaginationItem>
                          </>
                        )}

                        <PaginationItem>
                          <PaginationNext
                            onClick={() =>
                              onPageChange(
                                Math.min(totalPages, currentPage + 1)
                              )
                            }
                          >
                            <ChevronRight className="h-4 w-4" />
                          </PaginationNext>
                        </PaginationItem>
                        <PaginationItem>
                          <Button
                            variant={"destructive"}
                            onClick={() => onPageChange(totalPages)}
                          >
                            Último
                          </Button>
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                </CardFooter>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
