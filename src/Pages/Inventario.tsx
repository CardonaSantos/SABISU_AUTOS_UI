import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertCircle,
  Ban,
  Building,
  Building2,
  Calendar,
  CalendarDays,
  CircleUserRound,
  Clock,
  InfinityIcon,
  MapPin,
  PlusCircle,
  Search,
  TagIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Boxes } from "lucide-react";
import { Label } from "@/components/ui/label";
import SelectM from "react-select"; // Importación correcta de react-select
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
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ArrowDownUp,
  Barcode,
  Box,
  ChevronLeft,
  ChevronRight,
  Coins,
  Edit,
  Eye,
  FileText,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { toast } from "sonner";
import { SimpleProvider } from "@/Types/Proveedor/SimpleProveedor";
import { ProductsInventary } from "@/Types/Inventary/ProductsInventary";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Link } from "react-router-dom";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useStore } from "@/components/Context/ContextSucursal";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

const API_URL = import.meta.env.VITE_API_URL;

import dayjs from "dayjs";
import "dayjs/locale/es";
import utc from "dayjs/plugin/utc";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ImageCropperUploader } from "./Cropper";
import { PrecioProducto } from "./Inventario/preciosInterfaces.interface";
import AddPrices from "./Inventario/AddPrices";
import { formattMonedaGT } from "@/utils/formattMoneda";

dayjs.extend(utc);
dayjs.extend(localizedFormat);
dayjs.locale("es");

const formatearFecha = (fecha: string) => {
  return dayjs.utc(fecha).format("DD/MM/YYYY");
};

interface ProductCreate {
  nombre: string;
  descripcion: string;
  categorias: number[];
  codigoProducto: string;
  codigoProveedor: string;

  precioVenta: number[];
  creadoPorId: number | null;
  precioCostoActual: number | null;
  stockMinimo: number | null;
  imagenes: number[];
}

interface Categorias {
  id: number;
  nombre: string;
}

type CroppedImage = {
  fileName: string;
  blob: Blob;
  url: string;
  originalIndex: number;
};

export default function Inventario() {
  const [preciosProducto, setPreciosProducto] = useState<PrecioProducto[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [supplierFilter, setSupplierFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const userId = useStore((state) => state.userId);
  const [croppedImages, setCroppedImages] = useState<CroppedImage[]>([]);

  const [productCreate, setProductCreate] = useState<ProductCreate>({
    precioCostoActual: null,
    codigoProducto: "",
    codigoProveedor: "",
    categorias: [],
    descripcion: "",
    nombre: "",
    precioVenta: [],
    creadoPorId: userId,
    stockMinimo: null,
    imagenes: [],
  });

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const handleAddProduct = async () => {
    console.log("Enviando...");

    if (
      !productCreate.nombre ||
      productCreate.categorias.length <= 0 ||
      !productCreate.codigoProducto ||
      // !productCreate.precioVenta ||
      // productCreate.precioVenta.length <= 0 ||
      !productCreate.precioCostoActual ||
      productCreate.precioCostoActual <= 0
    ) {
      toast.info("Algunos campos son obligatorios");
      return;
    }

    if (!userId) {
      toast.warning("Falta informacion del usuario");
    }

    const formData = new FormData();
    formData.append("nombre", productCreate.nombre);
    formData.append("descripcion", productCreate.descripcion || "");
    formData.append("codigoProducto", productCreate.codigoProducto);
    formData.append("codigoProveedor", productCreate.codigoProveedor || "");
    formData.append(
      "stockMinimo",
      productCreate.stockMinimo?.toString() ?? "0"
    );
    formData.append(
      "precioCostoActual",
      productCreate.precioCostoActual!.toString()
    );

    formData.append("categorias", JSON.stringify(productCreate.categorias));
    formData.append("precioVenta", JSON.stringify(preciosProducto));

    // 3) Añadimos las imágenes
    croppedImages.forEach((img) => {
      const file = new File([img.blob], img.fileName, { type: img.blob.type });
      formData.append("images", file);
    });

    console.log("El formData a enviar es: ", formData);

    try {
      const response = await axios.post(`${API_URL}/products`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 201) {
        toast.success("Producto creado");
        setProductCreate({
          codigoProducto: "",
          codigoProveedor: "",
          categorias: [],
          descripcion: "",
          nombre: "",
          precioCostoActual: null,
          precioVenta: [],
          creadoPorId: userId,
          stockMinimo: null,
          imagenes: [],
        });
        setCroppedImages([]);
        getProductosInventario();
        setPreciosProducto([]);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error al crear producto");
    }
  };

  const [categorias, setCategorias] = useState<Categorias[]>([]);
  const [proveedores, setProveedores] = useState<SimpleProvider[]>([]);

  useEffect(() => {
    const getCategories = async () => {
      try {
        const response = await axios.get(`${API_URL}/categoria/`);
        if (response.status === 200) {
          setCategorias(response.data);
        }
      } catch (error) {
        console.log(error);
        toast.error("Error al pedir categorias");
      }
    };
    getCategories();
  }, []);

  useEffect(() => {
    const getProveedores = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/proveedor/simple-proveedor`
        );
        if (response.status === 200) {
          setProveedores(response.data);
        }
      } catch (error) {
        console.log(error);
        toast.error("Error al pedir categorias");
      }
    };
    getProveedores();
  }, []);

  const [productsInventary, setProductsInventary] = useState<
    ProductsInventary[]
  >([]);

  const getProductosInventario = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/products/products/for-inventary`
      );
      if (response.status === 200) {
        setProductsInventary(response.data);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error al pedir categorias");
    }
  };

  useEffect(() => {
    getProductosInventario();
  }, []);

  //FILTER =====>

  console.log("Los productos del inventario son: ", productsInventary);
  console.log("El producto a crear es: ", productCreate);
  console.log("las categorias son: ", categorias);
  console.log("Los proveedores son: ", proveedores);
  console.log("Los precios de venta son: ", productCreate.precioVenta);

  // PAGINACIÓN

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;

  // Filtrar productos antes de la paginación
  const filteredProducts = productsInventary
    .filter((product) => {
      const hasStock = product.stock.length > 0;
      const firstStock = hasStock ? product.stock : null;

      // Filtrado por nombre de producto o código de producto
      const matchesSearchTerm =
        product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.codigoProducto.toLowerCase().includes(searchTerm.toLowerCase());

      // Filtrado por categoría
      const matchesCategory =
        categoryFilter === "all" ||
        (product.categorias.length > 0 &&
          product.categorias.some((cat) => cat.nombre === categoryFilter));

      // Filtrado por proveedor
      const matchesSupplier =
        supplierFilter === "all" ||
        (firstStock &&
          firstStock.some(
            (stock) =>
              stock.entregaStock.proveedor.nombre.trim().toLocaleLowerCase() ===
              supplierFilter.trim().toLocaleLowerCase()
          ));

      // Se filtra por el término de búsqueda y luego por los demás filtros
      return matchesSearchTerm && matchesCategory && matchesSupplier;
    })
    .sort((a, b) => {
      const stockA = a.stock.length > 0 ? a.stock[0] : null;
      const stockB = b.stock.length > 0 ? b.stock[0] : null;

      // Ordenar por cantidad
      if (sortBy === "quantity") {
        return sortOrder === "asc"
          ? (stockA?.cantidad || 0) - (stockB?.cantidad || 0)
          : (stockB?.cantidad || 0) - (stockA?.cantidad || 0);
      }

      // Ordenar por precio
      if (sortBy === "price") {
        return sortOrder === "asc"
          ? a.precioVenta - b.precioVenta
          : b.precioVenta - a.precioVenta;
      }

      // Ordenar por fecha de vencimiento
      if (sortBy === "expiration") {
        const expirationA = stockA?.fechaVencimiento
          ? new Date(stockA.fechaVencimiento).getTime()
          : null;
        const expirationB = stockB?.fechaVencimiento
          ? new Date(stockB.fechaVencimiento).getTime()
          : null;

        if (!expirationA) return sortOrder === "asc" ? 1 : -1;
        if (!expirationB) return sortOrder === "asc" ? -1 : 1;

        return sortOrder === "asc"
          ? expirationA - expirationB
          : expirationB - expirationA;
      }

      return 0;
    });

  // PAGINACIÓN
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Calcular el total del inventario
  const totalInventoryCount = filteredProducts.reduce((sum, product) => {
    const stockQuantity =
      product.stock.length > 0 ? product.stock[0].cantidad : 0;
    return sum + stockQuantity;
  }, 0);

  return (
    <div className="container mx-auto p-4 shadow-xl">
      <h1 className="text-2xl font-bold mb-4">Administrador de inventario</h1>
      <div className="bg-muted/50 p-6 rounded-xl mb-6 shadow-sm border border-border/40 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Boxes className="h-6 w-6 text-primary dark:text-white" />
            <div className="text-xl font-semibold">
              Inventario Total:{" "}
              <span className="text-primary font-bold dark:text-white">
                {totalInventoryCount}
              </span>{" "}
              items
            </div>
          </div>
          <div className="flex space-x-2">
            <Dialog>
              <DialogTrigger>
                <Button className="flex items-center space-x-2 transition-all hover:shadow-md">
                  <PlusCircle className="h-4 w-4" />
                  <span>Añadir Producto</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[95vh] w-full">
                <DialogHeader>
                  <DialogTitle className="text-center">
                    Añadir nuevo producto
                  </DialogTitle>
                </DialogHeader>

                <Tabs defaultValue="account" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="account">Producto</TabsTrigger>
                    <TabsTrigger value="password">Imagenes</TabsTrigger>
                  </TabsList>
                  <TabsContent value="account" className="mt-4">
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleAddProduct();
                      }}
                      className="overflow-hidden"
                    >
                      <ScrollArea className="h-[calc(95vh-220px)]">
                        <div className="space-y-4 p-1">
                          {/* Todo el contenido del formulario permanece igual */}
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="nombre" className="text-sm">
                                Producto
                              </Label>
                              <div className="relative">
                                <Box className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                                <Input
                                  onChange={(e) =>
                                    setProductCreate({
                                      ...productCreate,
                                      nombre: e.target.value,
                                    })
                                  }
                                  value={productCreate.nombre}
                                  id="nombre"
                                  name="nombre"
                                  placeholder="Nombre del producto"
                                  className="pl-9 h-9 shadow-sm rounded-md"
                                />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="categorias" className="text-sm">
                                Categoría
                              </Label>
                              <SelectM
                                placeholder="Seleccionar categoría..."
                                isMulti
                                name="categorias"
                                options={categorias.map((categoria) => ({
                                  value: categoria.id,
                                  label: categoria.nombre,
                                }))}
                                className="basic-multi-select text-black"
                                classNamePrefix="select"
                                onChange={(selectedOptions) => {
                                  const selectedIds = selectedOptions.map(
                                    (option) => option.value
                                  );
                                  setProductCreate({
                                    ...productCreate,
                                    categorias: selectedIds,
                                  });
                                }}
                                value={categorias
                                  .filter((categoria) =>
                                    productCreate.categorias.includes(
                                      categoria.id
                                    )
                                  )
                                  .map((categoria) => ({
                                    value: categoria.id,
                                    label: categoria.nombre,
                                  }))}
                              />
                            </div>
                          </div>

                          {/* Fila 2: Códigos */}
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label
                                htmlFor="codigoProducto"
                                className="text-sm"
                              >
                                Código Producto
                              </Label>
                              <div className="relative">
                                <Barcode className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                                <Input
                                  value={productCreate.codigoProducto}
                                  onChange={(e) =>
                                    setProductCreate({
                                      ...productCreate,
                                      codigoProducto: e.target.value,
                                    })
                                  }
                                  id="codigoProducto"
                                  name="codigoProducto"
                                  placeholder="Código único producto"
                                  className="pl-9 h-9 shadow-sm rounded-md"
                                />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label
                                htmlFor="codigoProveedor"
                                className="text-sm"
                              >
                                Código Proveedor
                              </Label>
                              <div className="relative">
                                <Barcode className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                                <Input
                                  value={productCreate.codigoProveedor}
                                  onChange={(e) =>
                                    setProductCreate({
                                      ...productCreate,
                                      codigoProveedor: e.target.value,
                                    })
                                  }
                                  id="codigoProveedor"
                                  name="codigoProveedor"
                                  placeholder="Código Proveedor"
                                  className="pl-9 h-9 shadow-sm rounded-md"
                                />
                              </div>
                            </div>
                          </div>

                          {/* STOCK MINIMO */}
                          <div className="space-y-2">
                            <Label htmlFor="stockBajo" className="text-sm">
                              Stock Minimo
                            </Label>
                            <div className="relative">
                              <Coins className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                              <Input
                                value={productCreate.stockMinimo ?? ""}
                                onChange={(e) =>
                                  setProductCreate({
                                    ...productCreate,
                                    stockMinimo: e.target.value
                                      ? Number(e.target.value)
                                      : null,
                                  })
                                }
                                id="stockBajo"
                                name="stockBajo"
                                type="number"
                                step="1"
                                placeholder="Stock minimo (opcional)"
                                className="pl-9 h-9 shadow-sm rounded-md"
                              />
                            </div>
                          </div>

                          {/* Fila 3: Descripción */}
                          <div className="space-y-2">
                            <Label htmlFor="desc" className="text-sm">
                              Descripción
                            </Label>
                            <div className="relative">
                              <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                              <Textarea
                                value={productCreate.descripcion}
                                onChange={(e) =>
                                  setProductCreate({
                                    ...productCreate,
                                    descripcion: e.target.value,
                                  })
                                }
                                placeholder="Breve descripción..."
                                id="desc"
                                name="desc"
                                className="pl-9 shadow-sm rounded-md min-h-[60px] resize-none"
                              />
                            </div>
                          </div>

                          <div className="">
                            <div className="space-y-2">
                              <Label htmlFor="precioCosto" className="text-sm">
                                Precio Costo
                              </Label>
                              <div className="relative">
                                <Coins className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                                <Input
                                  value={productCreate.precioCostoActual ?? ""}
                                  onChange={(e) =>
                                    setProductCreate({
                                      ...productCreate,
                                      precioCostoActual: e.target.value
                                        ? Number(e.target.value)
                                        : null,
                                    })
                                  }
                                  id="precioCosto"
                                  name="precioCosto"
                                  type="number"
                                  step="1"
                                  placeholder="Precio costo del producto"
                                  className="pl-9 h-9 shadow-sm rounded-md"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="">
                            <AddPrices
                              precios={preciosProducto}
                              setPrecios={setPreciosProducto}
                            />
                          </div>
                        </div>
                      </ScrollArea>

                      <DialogFooter className="mt-4 pt-4 border-t">
                        <Button type="submit" className="w-full sm:w-auto">
                          Añadir Producto
                        </Button>
                      </DialogFooter>
                    </form>
                  </TabsContent>
                  <TabsContent value="password" className="mt-4">
                    <div className="max-w-5xl max-h-[95vh] overflow-hidden">
                      <div className="overflow-y-auto max-h-[calc(90vh-120px)] pr-2">
                        <ImageCropperUploader
                          croppedImages={croppedImages}
                          setCroppedImages={setCroppedImages}
                        />
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <div className="flex flex-col space-y-3 md:flex-row md:space-y-0 md:space-x-4">
          {/* Input de búsqueda */}
          <div className="relative w-full md:w-1/3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground dark:text-white" />
            <Input
              type="text"
              placeholder="Buscar producto por nombre, código"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-full transition-all border-border/50 focus:border-primary"
              aria-label="Buscar productos"
            />
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2"
                >
                  <Barcode className="h-4 w-4 text-muted-foreground" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Buscar por código de barras</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Filtro de categoría */}
          <div className="w-full md:w-1/3">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full border-border/50 focus:border-primary">
                <div className="flex items-center">
                  <TagIcon className="mr-2 h-4 w-4 text-muted-foreground dark:text-white" />
                  <SelectValue placeholder="Categoría" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {categorias &&
                  categorias.map((cat) => (
                    <SelectItem key={cat.id} value={cat.nombre}>
                      {cat.nombre}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          {/* Filtro de proveedores */}
          <div className="w-full md:w-1/3">
            <Select value={supplierFilter} onValueChange={setSupplierFilter}>
              <SelectTrigger className="w-full border-border/50 focus:border-primary">
                <div className="flex items-center">
                  <CircleUserRound className="mr-2 h-4 w-4 text-muted-foreground dark:text-white" />
                  <SelectValue placeholder="Proveedores" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {proveedores &&
                  proveedores.map((prov) => (
                    <SelectItem key={prov.id} value={prov.nombre}>
                      {prov.nombre}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      {/* MAPEO DE PRODUCTOS EN LA TABLA */}
      <div className="overflow-x-auto rounded-lg border border-border/40 shadow-sm">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="font-semibold">Producto</TableHead>
              <TableHead className="font-semibold">Categoria</TableHead>
              <TableHead
                className="cursor-pointer font-semibold group"
                onClick={() => handleSort("quantity")}
              >
                <div className="flex items-center">
                  Cantidad en Stock
                  {sortBy === "quantity" ? (
                    <ArrowDownUp className="ml-1 h-4 w-4 text-primary transition-transform" />
                  ) : (
                    <ArrowDownUp className="ml-1 h-4 w-4 text-muted-foreground opacity-50 group-hover:opacity-100 transition-opacity" />
                  )}
                </div>
              </TableHead>
              <TableHead className="font-semibold">Stock minimo</TableHead>
              <TableHead
                className="cursor-pointer font-semibold group"
                onClick={() => handleSort("price")}
              >
                <div className="flex items-center">
                  Precio por unidad
                  {sortBy === "price" ? (
                    <ArrowDownUp className="ml-1 h-4 w-4 text-primary transition-transform" />
                  ) : (
                    <ArrowDownUp className="ml-1 h-4 w-4 text-muted-foreground opacity-50 group-hover:opacity-100 transition-opacity" />
                  )}
                </div>
              </TableHead>
              <TableHead className="font-semibold">Día de entrada</TableHead>
              <TableHead
                className="cursor-pointer font-semibold group"
                onClick={() => handleSort("expiration")}
              >
                <div className="flex items-center">
                  Fecha de expiración
                  {sortBy === "expiration" ? (
                    <ArrowDownUp className="ml-1 h-4 w-4 text-primary transition-transform" />
                  ) : (
                    <ArrowDownUp className="ml-1 h-4 w-4 text-muted-foreground opacity-50 group-hover:opacity-100 transition-opacity" />
                  )}
                </div>
              </TableHead>
              <TableHead className="font-semibold">
                Distribución de Stock por Sucursal
              </TableHead>
              <TableHead className="font-semibold">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.map((product) => (
              <TableRow
                key={product.id}
                className="hover:bg-muted/30 transition-colors"
              >
                <TableCell className="font-medium">{product.nombre}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {product.categorias.map((cat) => (
                      <Badge
                        key={cat.nombre}
                        variant="outline"
                        className="text-xs px-2 py-0.5"
                      >
                        {cat.nombre}
                      </Badge>
                    ))}
                  </div>
                </TableCell>

                <TableCell>
                  {product.stock.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {product.stock.map(({ id, cantidad, sucursal }) => (
                        <div
                          key={id}
                          className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 dark:bg-zinc-900"
                        >
                          {/* Abreviatura o iniciales de la sucursal */}
                          <span className="text-xs font-semibold">
                            {sucursal.nombre.slice(0, 3).toUpperCase()}
                          </span>
                          {/* Cantidad */}
                          <span className="text-sm font-bold">{cantidad}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <Ban className="h-3 w-3 mr-1" />
                      N/A
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <span>{product.stockThreshold?.stockMinimo ?? "N/A"}</span>
                </TableCell>

                <TableCell>
                  <div className="space-y-1">
                    {product.precios.map((precio, idx) => (
                      <Tooltip key={idx}>
                        <TooltipTrigger asChild>
                          <span className="font-medium cursor-pointer block">
                            {formattMonedaGT(precio.precio)}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="text-xs space-y-1">
                            <p>
                              <b>No. Orden:</b> {precio.orden}
                            </p>
                            <p>
                              <b>Precio:</b> {formattMonedaGT(precio.precio)}
                            </p>
                            <p>
                              <b>Rol Precio:</b> {precio.rol}
                            </p>
                            <p>
                              <b>Tipo:</b> {precio.tipo}
                            </p>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                </TableCell>

                <TableCell>
                  {product.stock.length === 0 ? (
                    <div className="text-xs items-center flex">
                      <AlertCircle className="h-5 w-5 mr-1" />
                      Sin stock asignado
                    </div>
                  ) : (
                    product.stock.map((stock) => (
                      <div className="text-xs items-center flex">
                        <Link
                          key={stock.id}
                          to={`/stock-edicion/${stock.id}`}
                          className=" transition-colors "
                        >
                          <CalendarDays className="h-3 w-3 inline mr-1" />
                          {formatearFecha(stock.fechaIngreso)}
                        </Link>
                      </div>
                    ))
                  )}
                </TableCell>

                <TableCell>
                  {product.stock.length > 0 ? (
                    product.stock.map((stock, index) => {
                      const fechaVencimiento = new Date(stock.fechaVencimiento);
                      const hoy = new Date();
                      const estaVencido =
                        stock.fechaVencimiento &&
                        fechaVencimiento.setHours(23, 59, 59, 999) <=
                          hoy.getTime();

                      // Calcular días restantes para vencimiento
                      const diasRestantes = stock.fechaVencimiento
                        ? Math.ceil(
                            (fechaVencimiento.getTime() - hoy.getTime()) /
                              (1000 * 60 * 60 * 24)
                          )
                        : null;

                      return (
                        <div key={index} className="flex items-center">
                          {/* Si hay fecha de vencimiento */}
                          {stock.fechaVencimiento ? (
                            estaVencido ? (
                              <Badge
                                variant="destructive"
                                className="flex items-center mb-1"
                              >
                                <Clock className="h-3 w-3 mr-1" />
                                <span>
                                  Expirado-
                                  {formatearFecha(stock.fechaVencimiento)}
                                </span>
                              </Badge>
                            ) : (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Badge
                                    variant={
                                      diasRestantes && diasRestantes < 30
                                        ? "outline"
                                        : "secondary"
                                    }
                                    className={`flex items-center ${
                                      diasRestantes && diasRestantes < 30
                                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 mb-1"
                                        : ""
                                    }`}
                                  >
                                    <Calendar className="h-3 w-3 mr-1" />
                                    <span>
                                      {formatearFecha(stock.fechaVencimiento)}
                                    </span>
                                  </Badge>
                                </TooltipTrigger>
                                <TooltipContent>
                                  {diasRestantes
                                    ? `${diasRestantes} días para vencer`
                                    : "Fecha de vencimiento"}
                                </TooltipContent>
                              </Tooltip>
                            )
                          ) : (
                            <Badge
                              variant="outline"
                              className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                            >
                              <InfinityIcon className="h-3 w-3 mr-1" />
                              <span>N/A</span>
                            </Badge>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <div className="flex justify-center items-center text-xs">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Sin stock asignado
                    </div>
                  )}
                </TableCell>

                <TableCell>
                  {product && product.stock && product.stock.length > 0 ? (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center"
                        >
                          <MapPin className="h-3 w-3 mr-1" />
                          <span>Ver</span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-72">
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm flex items-center">
                            <Building2 className="h-4 w-4 mr-1" />
                            Distribución por Sucursal
                          </h4>
                          <Separator />
                          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                            {product.stock
                              .reduce(
                                (
                                  acc: {
                                    sucursal: { nombre: string };
                                    cantidad: number;
                                  }[],
                                  stock: {
                                    sucursal: { nombre: string };
                                    cantidad: number;
                                  }
                                ) => {
                                  const existingStock = acc.find(
                                    (s) =>
                                      s.sucursal.nombre ===
                                      stock.sucursal.nombre
                                  );
                                  if (existingStock) {
                                    existingStock.cantidad += stock.cantidad;
                                  } else {
                                    acc.push({ ...stock });
                                  }
                                  return acc;
                                },
                                []
                              )
                              .map((stock) => (
                                <div
                                  key={stock.sucursal.nombre}
                                  className="flex items-center justify-between p-2 rounded-lg bg-muted/50 border border-border/40"
                                >
                                  <div className="flex items-center">
                                    <Building className="h-4 w-4 mr-2" />
                                    <span className="font-medium">
                                      {stock.sucursal.nombre}
                                    </span>
                                  </div>
                                  <Badge variant="secondary">
                                    {stock.cantidad} Uds
                                  </Badge>
                                </div>
                              ))}
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  ) : (
                    <Badge
                      variant="outline"
                      className="bg-muted text-muted-foreground"
                    >
                      No asignado
                    </Badge>
                  )}
                </TableCell>

                <TableCell>
                  <div className="flex items-center space-x-2">
                    {/* Botón de HoverCard para mostrar la descripción */}
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-full"
                          aria-label="Ver detalles"
                        >
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </HoverCardTrigger>
                      <HoverCardContent className="w-80">
                        <div className="flex justify-between">
                          <h4 className="font-semibold">
                            Detalles del producto
                          </h4>
                          <Badge variant="outline">
                            {product.codigoProducto || "Sin código"}
                          </Badge>
                        </div>
                        <Separator className="my-2" />
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">
                            {product.descripcion
                              ? product.descripcion
                              : "No hay descripción disponible"}
                          </p>
                        </div>
                      </HoverCardContent>
                    </HoverCard>

                    <Link
                      to={`/editar-producto/${product.id}`}
                      className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 w-8 p-0"
                      aria-label="Editar producto"
                    >
                      <Edit className="h-4 w-4 text-blue-500" />
                      <span className="sr-only">Editar</span>
                    </Link>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-center py-4">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <Button onClick={() => onPageChange(1)}>Primero</Button>
            </PaginationItem>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
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
                  <PaginationLink onClick={() => onPageChange(totalPages)}>
                    {totalPages}
                  </PaginationLink>
                </PaginationItem>
              </>
            )}

            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  onPageChange(Math.min(totalPages, currentPage + 1))
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
    </div>
  );
}
