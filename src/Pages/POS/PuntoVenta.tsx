"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle, Coins, Package } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import axios from "axios";
import { toast } from "sonner";
import type { ProductosResponse } from "@/Types/Venta/ProductosResponse";
import { useStore } from "@/components/Context/ContextSucursal";
import SelectM from "react-select";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import "dayjs/locale/es";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatearMoneda } from "@/Crm/CrmServices/crm-service.types";

// Importar los nuevos componentes
import ProductList from "./ProductList";
import CartCheckout from "./CartCheckout";
import DialogImages from "../DialogImages";

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
  rol: RolPrecio;
};

enum RolPrecio {
  PUBLICO = "PUBLICO",
  MAYORISTA = "MAYORISTA",
  ESPECIAL = "ESPECIAL",
  DISTRIBUIDOR = "DISTRIBUIDOR",
  PROMOCION = "PROMOCION",
  CLIENTE_ESPECIAL = "CLIENTE_ESPECIAL",
}

type Producto = {
  id: number;
  nombre: string;
  descripcion: string;
  precioVenta?: number;
  codigoProducto: string;
  creadoEn: string;
  actualizadoEn: string;
  stock: Stock[];
  precios: Precios[];
};

interface CartItem {
  id: number;
  nombre: string;
  quantity: number;
  selectedPriceId: number;
  selectedPrice: number;
  selectedPriceRole: RolPrecio; // Nuevo campo para el rol del precio seleccionado
  precios: Precios[];
  stock: { cantidad: number }[];
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

export default function PuntoVenta() {
  const userId = useStore((state) => state.userId) ?? 0;
  const [cart, setCart] = useState<CartItem[]>([]);
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

  console.log("Los productos son: ", productos);

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

  useEffect(() => {
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
      const initialPriceId = product.precios[0]?.id;
      const initialPrice = product.precios[0]?.precio || 0;
      const newCartItem: CartItem = {
        ...product,
        quantity: 1,
        selectedPriceId: initialPriceId,
        selectedPrice: initialPrice,
        selectedPriceRole: RolPrecio.PUBLICO, // Valor por defecto, ajusta según lógica de negocio
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
      setIsDisableButton(false);
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/venta`, saleData);
      if (response.status === 201 || response.status === 200) {
        toast.success("Venta completada con éxito");
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

        getCustomers();
      } else {
        toast.error("Error al completar la venta");
      }
    } catch (error) {
      toast.error("Ocurrió un error al completar la venta");
      setIsDisableButton(false);
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

  // Función actualizada para manejar cambio de precio y rol
  const updatePrice = (
    productId: number,
    newPrice: number,
    newRole: RolPrecio
  ) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId
          ? {
              ...item,
              selectedPrice: newPrice,
              selectedPriceRole: newRole,
              selectedPriceId:
                item.precios.find(
                  (price) => price.precio === newPrice && price.rol === newRole
                )?.id || item.selectedPriceId,
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

  const customerOptions = clients.map((customer) => ({
    value: customer.id,
    label: `${customer.nombre} ${
      customer.telefono ? `(${customer.telefono})` : ""
    } ${customer.dpi ? `DPI: ${customer.dpi}` : ""}
    ${customer.iPInternet ? `IP: ${customer.iPInternet}` : ""}
    `,
  }));

  const handleImageClick = (images: string[]) => {
    setOpenImage(true);
    setImagesProduct(images);
  };

  return (
    <div className="container  ">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {/* Componente de Lista de Productos */}
        <ProductList
          productos={productos}
          onAddToCart={addToCart}
          onImageClick={handleImageClick}
        />

        {/* Componente de Carrito y Checkout */}
        <CartCheckout
          cart={cart}
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          imei={imei}
          setImei={setImei}
          selectedCustomerID={selectedCustomerID}
          setSelectedCustomerID={setSelectedCustomerID}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          nombre={nombre}
          setNombre={setNombre}
          telefono={telefono}
          setTelefono={setTelefono}
          dpi={dpi}
          setDpi={setDpi}
          direccion={direccion}
          setDireccion={setDireccion}
          observaciones={observaciones}
          setObservaciones={setObservaciones}
          customerOptions={customerOptions}
          onUpdateQuantity={updateQuantity}
          onUpdatePrice={updatePrice}
          onRemoveFromCart={removeFromCart}
          onCompleteSale={() => setIsDialogOpen(true)}
          formatCurrency={formatCurrency}
        />
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
                      setSelectedProductId(selectedOption.value);
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
                      : null
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
            <Button
              variant={"destructive"}
              className="px-4 py-2  rounded hover:bg-secondary-hover focus:outline-none"
              onClick={handleClose}
            >
              Mantenerse
            </Button>
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
