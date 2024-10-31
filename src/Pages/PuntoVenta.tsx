import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
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
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Barcode, CirclePlus, User2Icon, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import axios from "axios";
import { toast } from "sonner";
import { ProductosResponse } from "@/Types/Venta/ProductosResponse";
import React from "react";
import { useStore } from "@/components/Context/ContextSucursal";

import SelectM from "react-select"; // Importación correcta de react-select
import { useNavigate } from "react-router-dom";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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

// Mock data for products and customers

export default function PuntoVenta() {
  const navigate = useNavigate();

  const userId = useStore((state) => state.userId);
  console.log("El id del user en el punto venta es: ", userId);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const sucursalId = useStore((state) => state.sucursalId);

  const [paymentMethod, setPaymentMethod] = useState<string>("CONTADO");

  console.log("El cart a enviar es: ", cart);

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

  const handleCompleteSale = async () => {
    const saleData = {
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
      imei: imei.trim(),
    };

    // Validación para ventas mayores a 1000 con cliente obligatorio
    const isCustomerInfoProvided =
      saleData.nombre &&
      saleData.telefono &&
      saleData.direccion &&
      saleData.dpi;

    if (
      saleData.monto > 1000 &&
      !saleData.clienteId &&
      !isCustomerInfoProvided
    ) {
      toast.warning(
        "Para ventas mayores a 1000 es necesario ingresar o seleccionar un cliente"
      );
      return;
    }

    console.log("El cart es: ", saleData);

    try {
      const response = await axios.post(`${API_URL}/venta`, saleData);

      if (response.status === 201) {
        toast.success("Venta completada con éxito");
        setIsDialogOpen(false);
        setCart([]); // Reiniciar el carrito
        getProducts(); // Obtener productos actualizados
        setTimeout(() => {
          navigate("/historial/ventas");
        }, 1000);
      } else {
        toast.error("Error al completar la venta");
      }
    } catch (error) {
      console.log(error);
      toast.error("ERROR");
    }
  };

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [productos, setProductos] = useState<ProductosResponse[]>([]);

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

  useEffect(() => {
    if (sucursalId) {
      // Verificar que sucursalId está disponible
      getProducts();
    }
  }, [sucursalId]);
  console.log("Los productos son: ", productos);

  const filteredProducts = productos.filter(
    (product) =>
      product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.codigoProducto.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const [openCustomerDetails, setOpenCustomerDetails] = useState(false);

  const [nombre, setNombre] = useState<string>("");
  const [dpi, setDpi] = useState<string>("");
  const [imei, setImei] = useState<string>("");

  const [telefono, setTelefono] = useState<string>("");
  const [direccion, setDireccion] = useState<string>("");
  console.log("Los datos de cf final son: ", {
    nombre,
    telefono,
    direccion,
  });

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

  console.log("El cart a enviar es: ", cart);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null
  );
  const [precioReques, setPrecioRequest] = useState<number | null>(null);
  const [openReques, setOpenRequest] = useState(false);

  //==================================>
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

  console.log("El cart a enviar es: ", cart);

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

  const customers: Customer[] = [
    { id: 1, nombre: "Juan Pérez", telefono: "12345678", dpi: "1234567890123" },
    {
      id: 2,
      nombre: "María López",
      telefono: "87654321",
      dpi: "9876543210987",
    },
    {
      id: 3,
      nombre: "Julio Alberto Santana Camposeco",
      telefono: "23453456",
      dpi: "9876543211234",
    },
    {
      id: 4,
      nombre: "Mari Mileidy Camposeco Silvestre",
      telefono: "345676534",
      dpi: "98765432765443",
    },
    {
      id: 5,
      nombre: "Mari Mileidy Camposeco Silvestre 2",
      telefono: "345676534",
      dpi: "98765432765443",
    },
    {
      id: 6,
      nombre: "Mari Mileidy Camposeco Silvestre 2",
      telefono: "345676534",
      dpi: "98765432765443",
    },
    {
      id: 7,
      nombre: "Mari Mileidy Camposeco Silvestre 2",
      telefono: "345676534",
      dpi: "98765432765443",
    },
    // Agrega más clientes aquí
  ];

  // Cambiar el tipo a Customer | null
  const [selectedCustomerID, setSelectedCustomerID] = useState<Customer | null>(
    null
  );

  // Actualizar el manejador de cambio
  const handleChange = (selectedOption: CustomerOption | null) => {
    // Encuentra el cliente correspondiente
    const selectedCustomer = selectedOption
      ? customers.find((customer) => customer.id === selectedOption.value) ||
        null
      : null;
    setSelectedCustomerID(selectedCustomer);
  };

  console.log("EL id del cliente seleccionado es: ", selectedCustomerID?.id);

  type Client = {
    id: number;
    nombre: string;
    telefono: string;
    dpi: string;
    direccion: string;
    actualizadoEn: Date;
  };

  const [clients, setClients] = useState<Client[]>([]);
  // Mapeo de clientes a un formato compatible con react-select
  const customerOptions = clients.map((customer) => ({
    value: customer.id, // Este será el ID del cliente
    label: `${customer.nombre} ${
      customer.telefono ? `(${customer.telefono})` : ""
    } ${customer.dpi ? `DPI: ${customer.dpi}` : ""}`, // Formato de presentación
  }));

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

  return (
    <div className="container  ">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div className="space-y-2">
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle>Buscar productos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2">
                <Input
                  type="text"
                  placeholder="Buscar por nombre o código..."
                  value={searchTerm}
                  onChange={handleSearch}
                />
                <Button variant="outline" size="icon">
                  <Barcode className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
          <Card className="overflow-y-auto max-h-96 shadow-xl">
            <CardHeader>{/* <CardTitle>Productos</CardTitle> */}</CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Precio</TableHead>
                    <TableHead>Stock</TableHead>
                    {/* <TableHead>Expira</TableHead> */}
                    <TableHead>Acción</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      {/* Nombre del producto */}
                      <TableCell>
                        <p style={{ fontSize: "12px" }}>{product.nombre}</p>
                      </TableCell>

                      {/* Precio del producto */}
                      <TableCell>
                        <p style={{ fontSize: "13px" }}>
                          {product.precios
                            .map((precio) =>
                              new Intl.NumberFormat("es-GT", {
                                style: "currency",
                                currency: "GTQ",
                              }).format(Number(precio.precio))
                            )
                            .join(", ")}
                        </p>
                      </TableCell>

                      {/* Verificación de existencia de stock */}
                      {product.stock && product.stock.length > 0 ? (
                        <>
                          {/* Cantidad total de stock */}
                          <TableCell>
                            {product.stock.some(
                              (stock) => stock.cantidad > 0
                            ) ? (
                              <p className="font-bold">
                                {product.stock.reduce(
                                  (total, stocks) => total + stocks.cantidad,
                                  0
                                )}
                              </p>
                            ) : (
                              "Sin stock"
                            )}
                          </TableCell>

                          {/* Botón para añadir al carrito (solo un botón) */}
                          <TableCell>
                            <Button
                              onClick={
                                () =>
                                  addToCart({
                                    ...product, // Incluye todas las propiedades del producto
                                    selectedPrice:
                                      product.precios[0]?.precio || 0, // Asigna el primer precio de la lista como el precio seleccionado inicialmente
                                    quantity: 1, // Añade el producto con cantidad inicial de 1
                                  } as CartItem) // Castea explícitamente como CartItem
                              }
                              disabled={
                                product.stock.reduce(
                                  (total, stocks) => total + stocks.cantidad,
                                  0
                                ) === 0
                              } // Deshabilita si no hay stock disponible
                            >
                              <CirclePlus />
                            </Button>
                          </TableCell>
                        </>
                      ) : (
                        // Caso cuando no hay stock disponible
                        <TableCell colSpan={3} className="text-center">
                          Sin stock disponible
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-2 ">
          <Card className="flex flex-col h-2/4 shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl">Cart</CardTitle>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    size="sm"
                    variant="secondary"
                    style={{
                      backgroundColor: imei ? "#06d12b" : "gray",
                      color: "white",
                    }}
                  >
                    {imei ? "IMEI AÑADIDO" : "AÑADIR IMEI"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Un IMEI para el producto en esta venta
                      </p>
                    </div>
                    <div className="grid gap-2">
                      <div className="grid grid-cols-3 items-center gap-4">
                        <Label htmlFor="width">IMEI</Label>
                        <Input
                          value={imei}
                          onChange={(e) => setImei(e.target.value)}
                          id="width"
                          defaultValue="100%"
                          className="col-span-2 h-8"
                        />
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </CardHeader>

            <CardContent className="flex-1 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Producto</TableHead>
                    <TableHead>Cantidad</TableHead>
                    <TableHead>Precio</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Accion</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cart.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.nombre}</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) =>
                            updateQuantity(item.id, parseInt(e.target.value))
                          }
                          min="1"
                          max={item.stock.reduce(
                            (total, stock) => total + stock.cantidad,
                            0
                          )}
                        />
                      </TableCell>
                      <TableCell>
                        <Select
                          value={item.selectedPriceId.toString()} // Mostrar el ID del precio seleccionado
                          onValueChange={(newPriceId) => {
                            const selectedPrice = item.precios.find(
                              (price) => price.id === parseInt(newPriceId)
                            );
                            if (selectedPrice) {
                              updatePrice(item.id, selectedPrice.precio); // Llama a la función para actualizar con el nuevo precio
                            }
                          }} // Actualizar cuando se selecciona un nuevo precio
                        >
                          <SelectTrigger>
                            <SelectValue
                              placeholder={`GTQ ${item.selectedPrice}`}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Precios disponibles</SelectLabel>
                              {item.precios
                                .filter((prec) => prec.precio > 0)
                                .map((precio) => (
                                  <SelectItem
                                    key={precio.id}
                                    value={precio.id.toString()} // Ahora el ID como valor
                                  >
                                    {new Intl.NumberFormat("es-GT", {
                                      style: "currency",
                                      currency: "GTQ",
                                    }).format(precio.precio)}
                                  </SelectItem>
                                ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </TableCell>

                      <TableCell>
                        <p className="font-semibold">
                          {new Intl.NumberFormat("es-GT", {
                            style: "currency",
                            currency: "GTQ",
                          }).format(item.selectedPrice * item.quantity)}
                        </p>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="destructive"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <X />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>

            <CardFooter className="flex justify-between items-center mt-2">
              <span className="text-lg font-bold">
                Total:{" "}
                {new Intl.NumberFormat("es-GT", {
                  style: "currency",
                  currency: "GTQ",
                }).format(calculateTotal())}
              </span>
              <span className="text-lg font-bold">
                Productos:{" "}
                {cart.reduce((acc, total) => acc + total.quantity, 0)}
              </span>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button disabled={cart.length <= 0}>Completar</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="text-center">
                      Confirmación de Venta
                    </DialogTitle>
                  </DialogHeader>
                  <p className="text-center">
                    ¿Estás seguro de que deseas completar la venta con estos
                    datos?
                  </p>
                  <div className="flex gap-2 mt-4 items-center justify-center">
                    <Button
                      onClick={() => setIsDialogOpen(false)}
                      variant="outline"
                      className="text-white bg-red-500 border-none hover:bg-red-600 hover:text-white"
                    >
                      Cancelar
                    </Button>
                    <Button
                      onClick={handleCompleteSale}
                      className="text-white bg-green-500 border-none hover:bg-green-600"
                    >
                      Confirmar
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>
          <Card className="shadow-xl">
            <CardContent>
              <div className="flex justify-center p-2 items-center">
                <h2 className="font-bold text-xl">Método de Pago & Cliente</h2>
              </div>

              <div className="mb-4 w-full">
                <Label htmlFor="payment-method">Método de Pago</Label>
                <Select
                  value={paymentMethod}
                  onValueChange={(value) => setPaymentMethod(value)}
                >
                  <SelectTrigger id="payment-method" className="w-full">
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

              <Popover
                open={openCustomerDetails}
                onOpenChange={setOpenCustomerDetails}
              >
                <PopoverTrigger asChild>
                  <Button
                    className="w-full my-2"
                    variant="destructive"
                    size="sm"
                    disabled={!!selectedCustomerID}
                  >
                    Añadir Cliente
                    <User2Icon className="h-4 w-4 ml-2" />
                    <span className="sr-only">Toggle</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-96 p-4 shadow-lg rounded-lg">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="customer">Nombre</Label>
                      <Input
                        disabled={!!selectedCustomerID}
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        placeholder="Referencia"
                        className="mt-1 w-full"
                      />
                    </div>
                    <div>
                      <Label htmlFor="payment-method">Teléfono</Label>
                      <Input
                        disabled={!!selectedCustomerID}
                        value={telefono}
                        onChange={(e) => setTelefono(e.target.value)}
                        placeholder="+502 5060 7080"
                        className="mt-1 w-full"
                      />
                    </div>
                    <div>
                      <Label>DPI</Label>
                      <Input
                        disabled={!!selectedCustomerID}
                        value={dpi}
                        onChange={(e) => setDpi(e.target.value)}
                        placeholder="Número de DPI"
                        className="mt-1 w-full"
                      />
                    </div>
                    <div>
                      <Label>Dirección</Label>
                      <Input
                        disabled={!!selectedCustomerID}
                        value={direccion}
                        onChange={(e) => setDireccion(e.target.value)}
                        placeholder="C. Central Juan Pablo II, Jacaltenango Canton Pila"
                        className="mt-1 w-full"
                      />
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              {/* SELECCION DE CLIENTE YA CREADO */}

              <div className="flex mt-4">
                <div className="space-y-4 px-4 w-full">
                  {/* Selección de cliente */}
                  <Label>Seleccionar Cliente</Label>
                  <SelectM
                    className="bg-transparent text-black w-full"
                    options={customerOptions}
                    onChange={handleChange}
                    placeholder="Seleccionar cliente"
                    isClearable
                    isDisabled={!!(nombre || direccion || telefono || dpi)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      {/* seleccionar precio especial::::::::::::::::::::::*/}
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
    </div>
  );
}
