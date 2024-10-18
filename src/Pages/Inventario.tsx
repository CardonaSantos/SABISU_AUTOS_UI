import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SelectM, { MultiValue } from "react-select"; // Importación correcta de react-select
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Badge } from "@/components/ui/badge";
import { ArrowDownUp, Barcode, Download, Edit, Trash } from "lucide-react";
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
const API_URL = import.meta.env.VITE_API_URL;

interface ProductCreate {
  nombre: string;
  descripcion: string;
  categorias: number[];
  codigoProducto: string;
  precioVenta: number;
}

interface Categorias {
  id: number;
  nombre: string;
}

export default function Inventario() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [supplierFilter, setSupplierFilter] = useState<string>("");
  const [stockFilter, setStockFilter] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  // CREAR NUEVO PRODUCTO
  const handleAddProduct = async () => {
    console.log("Enviando...");

    if (
      !productCreate.nombre ||
      productCreate.categorias.length <= 0 ||
      !productCreate.codigoProducto ||
      !productCreate.precioVenta
    ) {
      toast.info("Algunos campos son obligatorios");
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/products`, {
        ...productCreate,
      });

      if (response.status === 201) {
        toast.success("Producto creado");
        setProductCreate({
          codigoProducto: "",
          categorias: [],
          descripcion: "",
          nombre: "",
          precioVenta: 0,
        });
        getProductosInventario();
      }
    } catch (error) {
      console.log(error);
      toast.error("Error al crear producto");
    }
  };

  // const handleEditProduct = async (productId: number, formData: FormData) => {
  //   console.log("Editing product:", productId, formData);
  // };

  const handleDeleteProduct = (productId: number) => {
    // Logic to delete product
    console.log("Deleting product:", productId);
  };

  const handleExport = (format: string) => {
    // Logic to export inventory data
    console.log("Exporting inventory data as:", format);
  };

  const [categorias, setCategorias] = useState<Categorias[]>([]);
  const [proveedores, setProveedores] = useState<SimpleProvider[]>([]);

  const [productCreate, setProductCreate] = useState<ProductCreate>({
    codigoProducto: "",
    categorias: [],
    descripcion: "",
    nombre: "",
    precioVenta: 0,
  });

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

  console.log("El producto a crear es: ", productCreate);

  console.log("las categorias son: ", categorias);
  console.log("Los proveedores son: ", proveedores);

  const [productsInventary, setProductsInventary] = useState<
    ProductsInventary[]
  >([]);

  console.log("Los productos del inventario son: ", productsInventary);

  console.log("Los productos del inventario son: ", productsInventary);

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
  const filteredProducts = productsInventary
    .filter((product) => {
      const hasStock = product.stock.length > 0;
      const firstStock = hasStock ? product.stock[0] : null;

      // Filtrado por nombre de producto o código de producto
      const matchesSearchTerm =
        product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.codigoProducto.toLowerCase().includes(searchTerm.toLowerCase());

      // Filtrado por categoría
      const matchesCategory =
        categoryFilter === "" ||
        (product.categorias.length > 0 &&
          product.categorias[0].nombre === categoryFilter);

      // Filtrado por proveedor
      const matchesSupplier =
        supplierFilter === "" ||
        (firstStock &&
          firstStock.entregaStock?.proveedor?.nombre === supplierFilter);

      // Filtrado por cantidad en stock
      const matchesStockFilter =
        stockFilter === "" ||
        (firstStock &&
          ((stockFilter === "low" && firstStock.cantidad <= 10) ||
            (stockFilter === "out" && firstStock.cantidad === 0)));

      // Se filtra por el término de búsqueda y luego por los demás filtros
      return (
        matchesSearchTerm &&
        matchesCategory &&
        matchesSupplier &&
        matchesStockFilter
      );
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

  // Calcular el total del inventario
  const totalInventoryCount = filteredProducts.reduce((sum, product) => {
    const stockQuantity =
      product.stock.length > 0 ? product.stock[0].cantidad : 0;
    return sum + stockQuantity;
  }, 0);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Administrador de inventario</h1>
      <div className="bg-muted p-4 rounded-lg mb-4 ">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4">
          <div className="text-xl font-semibold">
            Inventario Total: {totalInventoryCount} items
          </div>
          <div className="flex space-x-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button>Añadir Producto</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="text-center">
                    Añadir nuevo producto
                  </DialogTitle>
                </DialogHeader>
                {/* LA RAZÓN POR LA QUE AL USAR EL E DENTRO DE LOS SET NO DA ERROR, ES PORQUE EN EL ONSUBMIT YA LO HEMOS TIPADO */}
                <form
                  onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                    e.preventDefault();
                    handleAddProduct();
                  }}
                >
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="nombre" className="text-right">
                        Producto
                      </Label>
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
                        className="col-span-3"
                      />
                    </div>

                    {/* Dropdown de categorías con selección múltiple */}
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="categorias" className="text-right">
                        Categoría
                      </Label>
                      <div className="col-span-3">
                        <SelectM
                          placeholder="Seleccionar..."
                          isMulti
                          name="categorias"
                          options={categorias.map((categoria) => ({
                            value: categoria.id,
                            label: categoria.nombre,
                          }))}
                          className="basic-multi-select"
                          classNamePrefix="select"
                          onChange={(
                            selectedOptions: MultiValue<{
                              value: number;
                              label: string;
                            }>
                          ) => {
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
                              productCreate.categorias.includes(categoria.id)
                            )
                            .map((categoria) => ({
                              value: categoria.id,
                              label: categoria.nombre,
                            }))}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="code" className="text-right">
                        Código Producto
                      </Label>
                      <Input
                        value={productCreate.codigoProducto}
                        onChange={(e) =>
                          setProductCreate({
                            ...productCreate,
                            codigoProducto: e.target.value,
                          })
                        }
                        id="code"
                        name="code"
                        placeholder="Código de producto"
                        className="col-span-3"
                      />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="desc" className="text-right">
                        Descripción
                      </Label>
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
                        className="col-span-3"
                      />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="price" className="text-right">
                        Precio Venta
                      </Label>
                      <Input
                        value={productCreate.precioVenta}
                        onChange={(e) =>
                          setProductCreate({
                            ...productCreate,
                            precioVenta: Number(e.target.value),
                          })
                        }
                        id="price"
                        name="price"
                        type="number"
                        step="0.5"
                        placeholder="Precio del producto"
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Añadir Producto</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            <Button variant="outline" onClick={() => handleExport("csv")}>
              <Download className="mr-2 h-4 w-4" />
              Exportar CSV
            </Button>
          </div>
        </div>
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
          <div className="flex items-center space-x-2">
            <Input
              type="text"
              placeholder="Buscar producto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
            <Barcode className="h-6 w-6 text-gray-500" />
          </div>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Categoría" />
            </SelectTrigger>
            <SelectContent>
              {categorias &&
                categorias.map((cat) => (
                  <SelectItem key={cat.id} value={cat.nombre}>
                    {cat.nombre}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          <Select value={supplierFilter} onValueChange={setSupplierFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Proveedores" />
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
          <Select value={stockFilter} onValueChange={setStockFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Stock" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todo Stock</SelectItem>
              <SelectItem value="low">Bajo Stock</SelectItem>
              <SelectItem value="out">Fuera de Stock</SelectItem>
            </SelectContent>
          </Select>

          <div className="">
            <Button variant={"destructive"} className="w-full md:w-[180px]">
              Limpiar filtro
            </Button>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Producto</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("quantity")}
              >
                Cantidad en Stock
                {sortBy === "quantity" && (
                  <ArrowDownUp className="inline ml-1" size={16} />
                )}
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("price")}
              >
                Precio por unidad
                {sortBy === "price" && (
                  <ArrowDownUp className="inline ml-1" size={16} />
                )}
              </TableHead>
              <TableHead>Día de entrada</TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("expiration")}
              >
                Fecha de expiración
                {sortBy === "expiration" && (
                  <ArrowDownUp className="inline ml-1" size={16} />
                )}
              </TableHead>
              <TableHead>Proveedor</TableHead>

              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.nombre}</TableCell>
                <TableCell>
                  {product.categorias.map((cat) => cat.nombre).join(",")}
                </TableCell>
                <TableCell>
                  {product.stock.length === 0 ? (
                    <Badge className="bg-red-600 text-white">
                      No disponible
                    </Badge>
                  ) : (
                    product.stock.map((stock) => (
                      <span className="ml-2 font-extrabold" key={stock.id}>
                        {stock.cantidad}
                      </span> // Muestra la cantidad
                    ))
                  )}
                </TableCell>

                <TableCell>
                  {new Intl.NumberFormat("es-GT", {
                    style: "currency",
                    currency: "GTQ",
                  }).format(product.precioVenta)}
                </TableCell>
                <TableCell>
                  {product.stock.length === 0 ? (
                    <Badge className="ml-2 bg-orange-500 text-white">
                      Sin stock asignado
                    </Badge>
                  ) : (
                    product.stock
                      .map((stock) =>
                        new Date(stock.fechaIngreso).toLocaleDateString()
                      )
                      .join(", ")
                  )}
                </TableCell>

                <TableCell>
                  {product.stock.length > 0 ? (
                    product.stock.map((stock, index) => (
                      <div key={index}>
                        {/* Mostrar la fecha de vencimiento si existe */}
                        {stock.fechaVencimiento ? (
                          <>
                            {new Date(
                              stock.fechaVencimiento
                            ).toLocaleDateString()}
                            {/* Verificar si está vencido */}
                            {new Date(stock.fechaVencimiento).setHours(
                              23,
                              59,
                              59,
                              999
                            ) <= new Date().getTime() && (
                              <Badge
                                variant="destructive"
                                className="ml-2 text-white"
                              >
                                Expirado
                              </Badge>
                            )}
                          </>
                        ) : (
                          <Badge className="ml-2 bg-violet-600 text-white">
                            N/A
                          </Badge>
                        )}
                      </div>
                    ))
                  ) : (
                    <Badge className="ml-2 bg-rose-600 text-white">
                      Sin stock asignado
                    </Badge>
                  )}
                </TableCell>

                <TableCell>
                  {product && product.stock && product.stock.length > 0 ? (
                    <Popover>
                      <PopoverTrigger>
                        <Button variant="link">Ver</Button>{" "}
                        {/* Botón que activa el popover */}
                      </PopoverTrigger>
                      <PopoverContent>
                        <div className="p-4">
                          <p className="font-bold">Proveedores</p>
                          {product.stock
                            .map(
                              (stock) =>
                                stock.entregaStock?.proveedor?.nombre ?? "N/A"
                            )
                            .join(", ")}
                        </div>
                      </PopoverContent>
                    </Popover>
                  ) : (
                    "No asignado"
                  )}
                </TableCell>

                <TableCell>
                  <div className="flex space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Editar Product</DialogTitle>
                          <DialogDescription>
                            Detalles a actualizar{" "}
                          </DialogDescription>
                        </DialogHeader>
                        <form
                          onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                            e.preventDefault();
                            handleAddProduct;
                          }}
                        >
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="edit-name" className="text-right">
                                Producto
                              </Label>
                              <Input
                                id="edit-name"
                                name="name"
                                defaultValue={product.nombre}
                                className="col-span-3"
                              />
                            </div>
                            {/* Dropdown de categorías con selección múltiple */}
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label
                                htmlFor="categorias"
                                className="text-right"
                              >
                                Categoría
                              </Label>
                              <div className="col-span-3">
                                <SelectM
                                  placeholder="Seleccionar..."
                                  isMulti
                                  name="categorias"
                                  options={categorias.map((categoria) => ({
                                    value: categoria.id,
                                    label: categoria.nombre,
                                  }))}
                                  className="basic-multi-select"
                                  classNamePrefix="select"
                                  onChange={(
                                    selectedOptions: MultiValue<{
                                      value: number;
                                      label: string;
                                    }>
                                  ) => {
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

                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="code" className="text-right">
                                Código Producto
                              </Label>
                              <Input
                                value={productCreate.codigoProducto}
                                onChange={(e) =>
                                  setProductCreate({
                                    ...productCreate,
                                    codigoProducto: e.target.value,
                                  })
                                }
                                id="code"
                                name="code"
                                placeholder="Código de producto"
                                className="col-span-3"
                              />
                            </div>

                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="desc" className="text-right">
                                Descripción
                              </Label>
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
                                className="col-span-3"
                              />
                            </div>

                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label
                                htmlFor="edit-price"
                                className="text-right"
                              >
                                Precio venta
                              </Label>
                              <Input
                                id="edit-price"
                                name="price"
                                type="number"
                                step="0.5"
                                defaultValue={product.precioVenta}
                                className="col-span-3"
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button type="submit">Update Product</Button>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
