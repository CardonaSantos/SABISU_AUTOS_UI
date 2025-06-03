import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Barcode,
  CheckCircle,
  CirclePlus,
  Coins,
  Eye,
  Package,
  Search,
  ShoppingBag,
  ShoppingCart,
  Trash2,
  User,
  UserPlus,
  X,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import axios from "axios";
import { toast } from "sonner";
import { ProductosResponse } from "@/Types/Venta/ProductosResponse";
import React from "react";
import { useStore } from "@/components/Context/ContextSucursal";

import SelectM from "react-select"; // Importación correcta de react-select
import { Link } from "react-router-dom";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import dayjs from "dayjs";
import "dayjs/locale/es";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { Badge } from "@/components/ui/badge";
import DialogImages from "./DialogImages";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import sinFoto from "@/assets/sin foto.png";
import { Separator } from "@/components/ui/separator";
import { formatearMoneda } from "@/Crm/CrmServices/crm-service.types";
import { Textarea } from "@/components/ui/textarea";

dayjs.extend(localizedFormat);
dayjs.locale("es");

function formatearFechaUTC(fecha: string) {
  return dayjs(fecha).format("DD/MM/YYYY hh:mm A");
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("es-GT", {
    style: "currency",
    currency: "GTQ",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
    .format(amount)
    .replace("GTQ", "Q");
};

const API_URL = import.meta.env.VITE_API_URL;

//========================================>
type Stock = {
  id: number;
  cantidad: number;
  fechaIngreso: string;
  fechaVencimiento: string;
};

type Precios = {
  id: number;
  precio: number;
};

type Producto = {
  id: number;
  nombre: string;
  descripcion: string;
  precioVenta?: number; // Este campo no lo veo en el objeto, pero lo mencionas en el botón
  codigoProducto: string;
  creadoEn: string;
  actualizadoEn: string;
  stock: Stock[];
  precios: Precios[];
};
interface CartItem extends Producto {
  quantity: number; // Cantidad del producto en el carrito
  selectedPriceId: number; // ID del precio seleccionado
  selectedPrice: number; // Precio para mostrar en el resumen
}

type Client = {
  id: number;
  nombre: string;
  telefono: string;
  dpi: string;
  iPInternet: string;
  direccion: string;
  actualizadoEn: Date;
};

interface Venta {
  id: number;
  clienteId: number | null;
  fechaVenta: string;
  horaVenta: string;
  totalVenta: number;
  direccionClienteFinal: string | null;
  nombreClienteFinal: string | null;
  sucursalId: number;
  telefonoClienteFinal: string | null;
  imei: string;
}

interface Customer {
  id: number;
  nombre: string;
  telefono?: string;
  dpi?: string;
}

interface CustomerOption {
  value: number;
  label: string;
}

export default function PuntoVenta() {
  const userId = useStore((state) => state.userId) ?? 0;
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const sucursalId = useStore((state) => state.sucursalId);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [productos, setProductos] = useState<ProductosResponse[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<string>("CONTADO");
  const [openSection, setOpenSection] = useState(false);
  const [ventaResponse, setventaResponse] = useState<Venta | null>(null);

  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null
  );
  const [precioReques, setPrecioRequest] = useState<number | null>(null);
  const [openReques, setOpenRequest] = useState(false);
  const [openImage, setOpenImage] = useState(false);
  const [imagesProduct, setImagesProduct] = useState<string[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [isDisableButton, setIsDisableButton] = useState(false);
  const [selectedCustomerID, setSelectedCustomerID] = useState<Customer | null>(
    null
  );

  //CLIENTE
  const [activeTab, setActiveTab] = useState("existing");
  const [nombre, setNombre] = useState<string>("");
  const [dpi, setDpi] = useState<string>("");
  const [imei, setImei] = useState<string>("");
  const [telefono, setTelefono] = useState<string>("");
  const [direccion, setDireccion] = useState<string>("");
  const [observaciones, setObservaciones] = useState<string>("");

  useEffect(() => {
    const getCustomers = async () => {
      try {
        const response = await axios.get(`${API_URL}/client/get-all-customers`);

        if (response.status === 200) {
          setClients(response.data);
        }
      } catch (error) {
        console.log(error);
        toast.error("Error al conseguir clientes previos");
      }
    };
    getCustomers();
  }, []);

  useEffect(() => {
    if (sucursalId) {
      getProducts();
    }
  }, [sucursalId]);

  const addToCart = (product: Producto) => {
    const existingItem = cart.find((item) => item.id === product.id);

    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      const initialPriceId = product.precios[0]?.id; // Guardar solo el ID del primer precio
      const initialPrice = product.precios[0]?.precio || 0; // Precio para mostrar en el resumen

      const newCartItem: CartItem = {
        ...product,
        quantity: 1,
        selectedPriceId: initialPriceId, // Cambiar a ID del precio
        selectedPrice: initialPrice, // Mantener el precio para mostrar
      };

      setCart([...cart, newCartItem]);
    }
  };

  const removeFromCart = (productId: number) => {
    setCart(cart.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId: number, newQuantity: number) => {
    setCart(
      cart.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const calculateTotal = (): number => {
    return cart.reduce(
      (total, item) => total + item.selectedPrice * item.quantity,
      0
    );
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleClose = () => {
    setOpenSection(false);
  };

  const handleCompleteSale = async () => {
    setIsDisableButton(true);

    const saleData = {
      usuarioId: userId,
      sucursalId: sucursalId,
      clienteId: selectedCustomerID?.id,
      productos: cart.map((prod) => ({
        productoId: prod.id,
        cantidad: prod.quantity,
        selectedPriceId: prod.selectedPriceId,
      })),
      metodoPago: paymentMethod || "CONTADO",
      monto: cart.reduce(
        (acc, prod) => acc + prod.selectedPrice * prod.quantity,
        0
      ),
      nombre: nombre.trim(),
      telefono: telefono.trim(),
      direccion: direccion.trim(),
      dpi: dpi.trim(),
      observaciones: observaciones.trim(),
      imei: imei.trim(),
    };

    const isCustomerInfoProvided =
      saleData.nombre && saleData.telefono && saleData.direccion;

    if (
      saleData.monto > 1000 &&
      !saleData.clienteId &&
      !isCustomerInfoProvided
    ) {
      toast.warning(
        "Para ventas mayores a 1000 es necesario ingresar o seleccionar un cliente"
      );
      setIsDisableButton(false); // Rehabilitar el botón
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/venta`, saleData);

      if (response.status === 201 || response.status === 200) {
        toast.success("Venta completada con éxito");
        // Restablecer los estados y cerrar el diálogo
        setIsDialogOpen(false);
        setCart([]);
        getProducts();
        setImei("");
        setventaResponse(response.data);
        setSelectedCustomerID(null);
        setNombre("");
        setTelefono("");
        setDireccion("");
        setDpi("");
        setObservaciones("");
        setTimeout(() => {
          setOpenSection(true);
        }, 1000);
        setTimeout(() => {
          setIsDisableButton(false);
        }, 1000);
      } else {
        toast.error("Error al completar la venta");
      }
    } catch (error) {
      toast.error("Ocurrió un error al completar la venta");
      setIsDisableButton(false); // Rehabilitar el botón
    }
  };

  const getProducts = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/products/sucursal/${sucursalId}`
      );
      if (response.status === 200) {
        setProductos(response.data);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error al obtener productos.");
    }
  };

  const updatePrice = (productId: number, newPrice: number) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId
          ? {
              ...item,
              selectedPrice: newPrice, // Actualizamos el precio seleccionado
              selectedPriceId:
                item.precios.find((price) => price.precio === newPrice)?.id ||
                item.selectedPriceId, // Actualiza el ID del precio seleccionado
            }
          : item
      )
    );
  };

  async function handleMakeRequest() {
    if (precioReques && precioReques <= 0) {
      toast.info("La cantidad a solicitar no debe ser negativa");
      return;
    }

    if (!selectedProductId) {
      toast.info("Debe seleccionar un producto primero");
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/price-request`, {
        productoId: Number(selectedProductId),
        precioSolicitado: precioReques,
        solicitadoPorId: userId,
      });
      if (response.status === 201) {
        toast.success(
          "Solicitud enviada, esperando respuesta del administrador..."
        );
        setPrecioRequest(null);
        setSelectedProductId("");
      }
    } catch (error) {
      console.log(error);
      toast.error("Algo salió mal");
    }
  }
  const handleChange = (selectedOption: CustomerOption | null) => {
    const selectedCustomer = selectedOption
      ? clients.find((customer) => customer.id === selectedOption.value) || null
      : null;
    setSelectedCustomerID(selectedCustomer);
  };

  const filteredProducts = productos.filter(
    (product) =>
      product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.codigoProducto.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const customerOptions = clients.map((customer) => ({
    value: customer.id,
    label: `${customer.nombre} ${
      customer.telefono ? `(${customer.telefono})` : ""
    } ${customer.dpi ? `DPI: ${customer.dpi}` : ""}
    ${customer.iPInternet ? `IP: ${customer.iPInternet}` : ""}
    `,
  }));

  // Función para verificar si hay información de nuevo cliente
  const hasNewCustomerData = () => {
    return (
      nombre.trim() !== "" ||
      telefono.trim() !== "" ||
      dpi.trim() !== "" ||
      direccion.trim() !== "" ||
      observaciones.trim() !== ""
    );
  };

  // Función para verificar si hay cliente seleccionado
  const hasSelectedCustomer = () => {
    return selectedCustomerID !== null;
  };

  // Función para limpiar datos del nuevo cliente
  const clearNewCustomerData = () => {
    setNombre("");
    setTelefono("");
    setDpi("");
    setDireccion("");
    setObservaciones("");
  };

  // Función para limpiar cliente seleccionado
  const clearSelectedCustomer = () => {
    setSelectedCustomerID(null);
  };

  const handleTabChange = (value: string) => {
    if (value === "existing" && hasNewCustomerData()) {
      // Si cambia a "existing" y hay datos de nuevo cliente, limpiar los datos
      clearNewCustomerData();
    } else if (value === "new" && hasSelectedCustomer()) {
      // Si cambia a "new" y hay cliente seleccionado, limpiar la selección
      clearSelectedCustomer();
    }
    setActiveTab(value);
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  return (
    <div className="container  ">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div className="space-y-3">
          {/* Barra de búsqueda */}
          <Card className="shadow-md border-0">
            <CardContent className="pt-4">
              <div className="flex items-center space-x-2">
                <div className="relative flex-1">
                  {/* Ícono de lupa a la izquierda */}
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                  {/* Botón “borrar” a la derecha (solo si hay texto) */}
                  {searchTerm && (
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={clearSearch}
                      className="absolute left-2.5 top-1/2 h-5 w-5 -translate-y-1/2 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}

                  {/* Input */}
                  <Input
                    type="text"
                    placeholder="Buscar por nombre o código…"
                    value={searchTerm}
                    onChange={handleSearch}
                    className="pl-9 pr-9" /* padding extra a la derecha para el botón */
                  />
                </div>
                <Button variant="outline" size="icon" className="shrink-0">
                  <Barcode className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Tabla de productos */}
          <Card className="overflow-hidden shadow-md border-0">
            <CardContent className="p-0">
              <div className="overflow-y-auto max-h-[calc(100vh-220px)]">
                <Table>
                  <TableHeader className="bg-muted/40 sticky top-0">
                    <TableRow>
                      <TableHead className="w-14"></TableHead>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Precio</TableHead>
                      <TableHead className="text-center">Stock</TableHead>
                      <TableHead className="w-16 text-center">Acción</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.map((product) => (
                      <TableRow key={product.id} className="hover:bg-muted/30">
                        {/* Imagen del producto */}
                        <TableCell className="p-2">
                          <div
                            className="w-10 h-10 rounded-md overflow-hidden bg-muted/20 group relative"
                            onClick={() => {
                              setOpenImage(true);
                              setImagesProduct(
                                product.imagenesProducto.map((img) => img.url)
                              );
                            }}
                          >
                            <img
                              src={product.imagenesProducto[0]?.url || sinFoto}
                              width={40}
                              height={40}
                              alt={product.nombre}
                              className="object-cover w-full h-full"
                            />
                            {/* Overlay con icono de ojo */}
                            <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                              <Eye className="w-5 h-5 text-white" />
                            </div>
                          </div>
                        </TableCell>

                        {/* Nombre del producto */}
                        <TableCell className="py-2">
                          <p className="text-sm font-medium line-clamp-2">
                            {product.nombre}
                          </p>
                        </TableCell>

                        {/* Precio del producto */}
                        <TableCell className="py-2">
                          <div className="flex flex-col gap-0.5">
                            {product.precios.map((precio, index) => (
                              <span key={index} className="text-xs">
                                {new Intl.NumberFormat("es-GT", {
                                  style: "currency",
                                  currency: "GTQ",
                                }).format(Number(precio.precio))}
                              </span>
                            ))}
                          </div>
                        </TableCell>

                        {/* Verificación de existencia de stock */}
                        {product.stock && product.stock.length > 0 ? (
                          <>
                            {/* Cantidad total de stock */}
                            <TableCell className="text-center py-2">
                              {product.stock.some(
                                (stock) => stock.cantidad > 0
                              ) ? (
                                <Badge variant="outline" className="font-bold">
                                  {product.stock.reduce(
                                    (total, stocks) => total + stocks.cantidad,
                                    0
                                  )}
                                </Badge>
                              ) : (
                                <Badge
                                  variant="outline"
                                  className="text-muted-foreground"
                                >
                                  Sin stock
                                </Badge>
                              )}
                            </TableCell>

                            {/* Botón para añadir al carrito */}
                            <TableCell className="text-center py-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0 rounded-full"
                                onClick={() =>
                                  addToCart({
                                    ...product,
                                    selectedPriceId:
                                      product.precios[0]?.id || 0, // Añade el ID del precio
                                    selectedPrice:
                                      product.precios[0]?.precio || 0,
                                    quantity: 1,
                                  } as CartItem)
                                }
                                disabled={
                                  product.stock.reduce(
                                    (total, stocks) => total + stocks.cantidad,
                                    0
                                  ) === 0
                                }
                              >
                                <CirclePlus className="h-5 w-5" />
                              </Button>
                            </TableCell>
                          </>
                        ) : (
                          // Caso cuando no hay stock disponible
                          <>
                            <TableCell className="text-center py-2">
                              <Badge
                                variant="outline"
                                className="text-muted-foreground"
                              >
                                Sin stock
                              </Badge>
                            </TableCell>
                            <TableCell className="text-center py-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0 rounded-full"
                                disabled
                              >
                                <CirclePlus className="h-5 w-5" />
                              </Button>
                            </TableCell>
                          </>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-3">
          {/* Carrito */}
          <Card className="border-0 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 bg-background">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                <span className="font-medium">Carrito</span>
                {cart.length > 0 && (
                  <span className="text-xs bg-muted px-1.5 py-0.5 rounded-full">
                    {cart.reduce((acc, item) => acc + item.quantity, 0)} items
                  </span>
                )}
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    className={
                      imei.length >= 15
                        ? "bg-green-600 hover:bg-green-700 text-white"
                        : ""
                    }
                  >
                    {imei.length >= 15 ? "IMEI AÑADIDO" : "AÑADIR IMEI"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-72" align="center">
                  <div className="grid gap-2">
                    <p className="text-xs text-muted-foreground">
                      Puedes ingresar varios IMEIs separados por comas.
                    </p>
                    <div className="grid grid-cols-4 items-center gap-2">
                      <Label
                        htmlFor="imei-input"
                        className="col-span-1 text-xs"
                      >
                        IMEI
                      </Label>
                      <Input
                        id="imei-input"
                        value={imei}
                        onChange={(e) => setImei(e.target.value)}
                        placeholder="Ej. 123456789012345"
                        className="col-span-3 h-8"
                      />
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            <div className="border-t">
              {/* Encabezados de tabla */}
              <div className="grid grid-cols-4 px-4 py-2 text-sm text-muted-foreground border-b">
                <div className="col-span-1">Producto</div>
                <div className="col-span-1 text-center">Cant.</div>
                <div className="col-span-1 text-center">Precio</div>
                <div className="col-span-1 text-center">Total</div>
              </div>

              {/* Productos en el carrito */}
              <div className="overflow-y-auto max-h-[calc(100vh-450px)]">
                {cart.length > 0 ? (
                  <div className="divide-y">
                    {cart.map((item) => (
                      <div
                        key={item.id}
                        className="grid grid-cols-4 px-4 py-2 items-center"
                      >
                        <div className="col-span-1 text-sm pr-2 line-clamp-1">
                          {item.nombre}
                        </div>

                        <div className="col-span-1 flex justify-center">
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => {
                              const val = Number.parseInt(e.target.value);
                              if (!isNaN(val) && val > 0) {
                                updateQuantity(item.id, val);
                              }
                            }}
                            min="1"
                            max={item.stock.reduce(
                              (total, stock) => total + stock.cantidad,
                              0
                            )}
                            className="h-7 w-14 text-center"
                          />
                        </div>

                        <div className="col-span-1 flex justify-center">
                          <Select
                            value={item.selectedPriceId.toString()}
                            onValueChange={(newPriceId) => {
                              const selectedPrice = item.precios.find(
                                (price) =>
                                  price.id === Number.parseInt(newPriceId)
                              );
                              if (selectedPrice) {
                                updatePrice(item.id, selectedPrice.precio);
                              }
                            }}
                          >
                            <SelectTrigger className="h-7 w-28">
                              <SelectValue
                                placeholder={formatCurrency(item.selectedPrice)}
                              />
                            </SelectTrigger>
                            <SelectContent>
                              {item.precios
                                .filter((prec) => prec.precio > 0)
                                .map((precio) => (
                                  <SelectItem
                                    key={precio.id}
                                    value={precio.id.toString()}
                                  >
                                    {formatCurrency(precio.precio)}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="col-span-1 flex items-center justify-between">
                          <span className="text-xs font-medium">
                            {formatCurrency(item.selectedPrice * item.quantity)}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-red-500 hover:text-red-600 hover:bg-red-100/20"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center text-muted-foreground flex flex-col items-center justify-center space-y-2">
                    <span>No hay productos en el carrito</span>
                    <ShoppingBag className="h-6 w-6" />
                  </div>
                )}
              </div>

              {/* Total y botón completar */}
              <div className="px-4 py-2 border-t">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">
                    Total: {formatCurrency(calculateTotal())}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Productos:{" "}
                    {cart.reduce((acc, total) => acc + total.quantity, 0)}
                  </span>
                </div>
                <Button
                  className="w-full h-10 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                  disabled={cart.length <= 0}
                  onClick={() => {
                    setIsDialogOpen(true);
                  }}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Completar venta
                </Button>
              </div>
            </div>
          </Card>

          {/* Método de Pago & Cliente */}
          <Card className="border-0 ">
            <div className="p-4">
              {/* Usando flexbox para dividir en dos columnas */}
              <div className="flex flex-row gap-4">
                {/* Columna izquierda: Método de Pago */}
                <div className="flex-1">
                  <Label className="text-sm font-medium block mb-1.5">
                    Método de Pago
                  </Label>
                  <Select
                    value={paymentMethod}
                    onValueChange={(value) => setPaymentMethod(value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Método de Pago" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CONTADO">Contado</SelectItem>
                      <SelectItem value="TARJETA">Tarjeta</SelectItem>
                      <SelectItem value="TRANSFERENCIA">
                        Transferencia Bancaria
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Columna derecha: Selección de Cliente */}
                <div className="flex-1">
                  <Tabs
                    value={activeTab}
                    onValueChange={handleTabChange}
                    className="w-full"
                  >
                    <TabsList className="grid grid-cols-2 w-full">
                      <TabsTrigger
                        value="existing"
                        disabled={hasNewCustomerData()} // Deshabilitar si hay datos de nuevo cliente
                        className="flex items-center justify-center gap-1 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <User className="h-3.5 w-3.5" />
                        Cliente Existente
                      </TabsTrigger>
                      <TabsTrigger
                        value="new"
                        disabled={hasSelectedCustomer()} // Deshabilitar si hay cliente seleccionado
                        className="flex items-center justify-center gap-1 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <UserPlus className="h-3.5 w-3.5" />
                        Nuevo Cliente
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="existing" className="mt-2">
                      <div className="space-y-2">
                        <div className="space-y-1">
                          <Label className="text-xs">Seleccionar Cliente</Label>
                          <SelectM
                            className="bg-transparent w-full text-xs text-black px-2 py-1"
                            options={customerOptions}
                            onChange={handleChange}
                            placeholder="Buscar cliente..."
                            isClearable
                            value={
                              selectedCustomerID
                                ? {
                                    value: selectedCustomerID.id,
                                    label: selectedCustomerID.nombre,
                                  }
                                : null
                            }
                          />
                        </div>
                        {selectedCustomerID && (
                          <div className="text-xs font-semibold text-green-600 bg-green-50 p-2 rounded">
                            Cliente seleccionado: {selectedCustomerID.nombre}
                          </div>
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent value="new" className="mt-2">
                      <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label htmlFor="nombre" className="text-xs">
                              Nombre
                            </Label>
                            <Input
                              id="nombre"
                              value={nombre}
                              onChange={(e) => setNombre(e.target.value)}
                              placeholder="Nombre completo"
                              className="h-8 text-xs"
                            />
                          </div>
                          <div>
                            <Label htmlFor="telefono" className="text-xs">
                              Teléfono
                            </Label>
                            <Input
                              id="telefono"
                              value={telefono}
                              onChange={(e) => setTelefono(e.target.value)}
                              placeholder="+502 5060 7080"
                              className="h-8 text-xs"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label htmlFor="dpi" className="text-xs">
                              DPI
                            </Label>
                            <Input
                              id="dpi"
                              value={dpi}
                              onChange={(e) => setDpi(e.target.value)}
                              placeholder="Número de DPI (opcional)"
                              className="h-8 text-xs"
                            />
                          </div>
                          <div>
                            <Label htmlFor="direccion" className="text-xs">
                              Dirección
                            </Label>
                            <Input
                              id="direccion"
                              value={direccion}
                              onChange={(e) => setDireccion(e.target.value)}
                              placeholder="Dirección (opcional)"
                              className="h-8 text-xs"
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="observaciones" className="text-xs">
                            Observaciones
                          </Label>
                          <Textarea
                            id="observaciones"
                            value={observaciones}
                            onChange={(e) => setObservaciones(e.target.value)}
                            placeholder="Observaciones (opcional)"
                            className="text-xs h-16"
                          />
                        </div>
                        {hasNewCustomerData() && (
                          <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
                            Creando nuevo cliente...
                          </div>
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
      {/* PETICION DE PRECIO ESPECIAL */}
      <div className="mt-20">
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle>Petición de precio especial</CardTitle>
            <CardDescription>
              Al solicitar un precio especial, esa instancia solo se podrá usar
              en una venta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label>Producto</Label>
                <SelectM
                  placeholder="Seleccionar producto"
                  options={productos.map((product) => ({
                    value: product.id.toString(),
                    label: `${product.nombre} (${product.codigoProducto})`,
                  }))}
                  className="basic-select text-black"
                  classNamePrefix="select"
                  onChange={(selectedOption) => {
                    if (selectedOption) {
                      setSelectedProductId(selectedOption.value); // Almacena solo el ID
                    }
                  }}
                  value={
                    selectedProductId
                      ? {
                          value: selectedProductId,
                          label: `${
                            productos.find(
                              (product) =>
                                product.id.toString() === selectedProductId
                            )?.nombre
                          } (${
                            productos.find(
                              (product) =>
                                product.id.toString() === selectedProductId
                            )?.codigoProducto
                          })`,
                        }
                      : null // Select vacío si no hay selección
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Precio Requerido</Label>
                <Input
                  value={precioReques ?? ""}
                  onChange={(e) =>
                    setPrecioRequest(
                      e.target.value ? Number(e.target.value) : null
                    )
                  }
                  placeholder="100"
                  type="number"
                />
              </div>
            </div>

            <Button
              onClick={() => setOpenRequest(true)}
              className="my-10 w-full"
              variant={"default"}
            >
              Solicitar precio especial
            </Button>

            <Dialog open={openReques} onOpenChange={setOpenRequest}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="text-center">
                    Solicitar precio especial
                  </DialogTitle>
                  <DialogDescription className="text-center">
                    Esta instancia solo se podrá aplicar a una venta
                  </DialogDescription>
                  <DialogDescription className="text-center">
                    ¿Continuar?
                  </DialogDescription>
                </DialogHeader>
                <div className="flex justify-end gap-2">
                  <Button
                    disabled={!precioReques && !selectedProductId}
                    variant={"default"}
                    className="w-full"
                    onClick={() => handleMakeRequest()}
                  >
                    Solicitar
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>
      {/* DIALOG DE IMAGENES */}
      <DialogImages
        images={imagesProduct}
        openImage={openImage}
        setOpenImage={setOpenImage}
      />
      {/* DIALOG DE VENTA EXITOSA */}
      <Dialog open={openSection} onOpenChange={setOpenSection}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-center">
              Venta registrada exitosamente
            </DialogTitle>
            <DialogDescription className="text-center mt-2">
              Ahora puedes generar el comprobante de venta para el cliente.
            </DialogDescription>
          </DialogHeader>

          {ventaResponse && (
            <div className="mt-4 text-center items-center justify-center">
              {/* Detalles de la venta */}
              <p className="text-sm mb-4">
                Número de Venta: <strong>#{ventaResponse?.id}</strong>
              </p>

              <p className=" text-sm mb-4">
                Fecha y Hora de Venta:{" "}
                <strong>{formatearFechaUTC(ventaResponse.fechaVenta)}</strong>
              </p>
              <p className=" text-sm mb-4">
                Monto Total:{" "}
                <strong>
                  {new Intl.NumberFormat("es-GT", {
                    style: "currency",
                    currency: "GTQ",
                  }).format(ventaResponse?.totalVenta)}
                </strong>
              </p>
            </div>
          )}

          <div className="flex justify-center items-center gap-2 mt-4">
            {/* Botón para cancelar */}
            <Button
              variant={"destructive"}
              className="px-4 py-2  rounded hover:bg-secondary-hover focus:outline-none"
              onClick={handleClose}
            >
              Mantenerse
            </Button>

            {/* Botón para recoger comprobante */}
            <Link to={`/venta/generar-factura/${ventaResponse?.id}`}>
              <Button
                className="px-4 py-2  rounded hover:bg-primary-hover focus:outline-none"
                onClick={handleClose}
              >
                Imprimir Comprobante
              </Button>
            </Link>
          </div>
        </DialogContent>
      </Dialog>

      {/* DIALOG DE CONFIRMACION VENTA */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <div className="bg-purple-50  dark:bg-zinc-900 p-6">
            <DialogHeader className="text-center space-y-1">
              <div className="flex justify-center">
                <div className="rounded-full p-3 shadow-sm border-4 border-white dark:border-zinc-900">
                  <div className="bg-gradient-to-br from-purple-500 to-blue-500 p-3 rounded-full animate-pulse">
                    <CheckCircle className="h-8 w-8 text-white" />
                  </div>
                </div>
              </div>

              <DialogTitle className="text-lg font-bold text-gray-800 dark:text-gray-100 text-center">
                Confirmar Venta
              </DialogTitle>
            </DialogHeader>
          </div>

          <div className="p-6 space-y-6 bg-purple-50  dark:bg-zinc-900">
            {/* Resumen de la venta */}
            <div className="              bg-purple-50  dark:bg-zinc-950 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                <Package className="h-4 w-4" />
                Resumen de productos
              </div>

              <div className="space-y-2 overflow-y-auto max-h-28 px-4">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center text-sm"
                  >
                    <span className="text-gray-600 dark:text-gray-400 truncate">
                      {productos.find((prod) => prod.id === item.id)?.nombre} ×{" "}
                      {item.quantity}
                    </span>
                    <span className="font-medium text-gray-600  dark:text-gray-400">
                      {formatearMoneda(item.selectedPrice * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <Separator className="dark:bg-gray-700" />

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Coins className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <span className="font-semibold text-gray-700 dark:text-gray-300">
                    Total
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {formatearMoneda(
                      cart.reduce(
                        (acc, item: CartItem) =>
                          acc + item.selectedPrice * item.quantity,
                        0
                      )
                    )}
                  </div>
                  <Badge
                    variant="secondary"
                    className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                  >
                    {cart.length} {cart.length === 1 ? "artículo" : "artículos"}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex gap-3 pt-2">
              <Button
                onClick={() => setIsDialogOpen(false)}
                variant="destructive"
                size="lg"
                className="flex-1 "
                disabled={isDisableButton}
              >
                Cancelar
              </Button>
              <Button
                disabled={isDisableButton}
                size="lg"
                onClick={handleCompleteSale}
                className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {isDisableButton ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Procesando...
                  </div>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Confirmar Venta
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
