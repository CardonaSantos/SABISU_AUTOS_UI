"use client";

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
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Barcode, CirclePlus, User2Icon, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import axios from "axios";
import { toast } from "sonner";
import { ProductosResponse } from "@/Types/Venta/ProductosResponse";
import React from "react";
import { useStore } from "@/components/Context/ContextSucursal";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
const API_URL = import.meta.env.VITE_API_URL;

// Mock data for products and customers
// Define interfaces for Product, Customer, and CartItem
interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  expiry: string;
  codigo: string;
}

interface Customer {
  id: number;
  name: string;
}

interface CartItem extends Product {
  quantity: number;
}
// Mock data for products and customers

const customers: Customer[] = [
  { id: 1, name: "Julio Alberto" },
  { id: 2, name: "Mari Mileidy" },
  { id: 3, name: "Marcos Castillo" },
];

export default function PuntoVenta() {
  const userId = useStore((state) => state.userId);
  console.log("El id del user en el punto venta es: ", userId);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  console.log(selectedCustomer);
  const sucursalId = useStore((state) => state.sucursalId);

  const [paymentMethod, setPaymentMethod] = useState<string>("CONTADO");

  console.log("El cart a enviar es: ", cart);

  const addToCart = (product: Product) => {
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
      setCart([...cart, { ...product, quantity: 1 }]);
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
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleCompleteSale = async () => {
    let x = {
      clienteId: null, // Removí el signo de interrogación
      productos: cart.map((prod) => ({
        productoId: prod.id,
        cantidad: prod.quantity,
      })),
      metodoPago: paymentMethod || "CONTADO", // Removí el punto y coma
      monto: cart.reduce((acc, prod) => acc + prod.price * prod.quantity, 0), // Removí el punto y coma
    };

    console.log("El cart es: ", x);

    try {
      const response = await axios.post(`${API_URL}/venta`, {
        clienteId: null, // Removí el signo de interrogación
        productos: cart.map((prod) => ({
          productoId: prod.id,
          cantidad: prod.quantity,
        })),
        metodoPago: paymentMethod || "CONTADO",
        monto: cart.reduce((acc, prod) => acc + prod.price * prod.quantity, 0),
        sucursalId: sucursalId,
        nombreClienteFinal: nombreClienteFinal.trim(),
        telefonoClienteFinal: telefonoClienteFinal.trim(),
        direccionClienteFinal: direccionClienteFinal.trim(),
      });

      if (response.status === 201) {
        toast.success("Venta completada con éxito");
        setIsDialogOpen(false);
        // Reiniciar valores después de completar la venta
        setSelectedCustomer(null);
        setPaymentMethod("CONTADO");
        setCart([]);
        getProducts();
      } else {
        toast.error("Error al completar la venta");
      }
    } catch (error) {
      console.log(error);
      toast.error("ERROR");
    }
  };

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // const handleOpenDialogCompletar = () => {
  //   setIsDialogOpen(true);
  // };

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
  const [openSelectCustomer, setOpenSelectCustomer] = useState(false);

  const [nombreClienteFinal, setNombreClienteFinal] = useState<string>("");
  const [telefonoClienteFinal, setTelefonoClienteFinal] = useState<string>("");
  const [direccionClienteFinal, setDireccionClienteFinal] =
    useState<string>("");
  console.log("Los datos de cf final son: ", {
    nombreClienteFinal,
    telefonoClienteFinal,
    direccionClienteFinal,
  });

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
                          {new Intl.NumberFormat("es-GT", {
                            style: "currency",
                            currency: "GTQ",
                          }).format(product.precioVenta)}
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

                          {/* Fecha de vencimiento (mostrar solo la primera fecha o más lógica si se necesita) */}
                          {/* <TableCell>
                            {product.stock[0]?.fechaVencimiento
                              ? new Date(
                                  product.stock[0].fechaVencimiento
                                ).toLocaleDateString("es-GT")
                              : "N/A"}
                          </TableCell> */}

                          {/* Botón para añadir al carrito (solo un botón) */}
                          <TableCell>
                            <Button
                              onClick={() =>
                                addToCart({
                                  category: "categoria",
                                  codigo: product.codigoProducto,
                                  expiry: product.stock[0]?.fechaVencimiento,
                                  name: product.nombre,
                                  price: product.precioVenta,
                                  stock: product.stock.reduce(
                                    (total, stocks) => total + stocks.cantidad,
                                    0
                                  ), // Cantidad total
                                  id: product.id,
                                })
                              }
                              disabled={
                                product.stock.reduce(
                                  (total, stocks) => total + stocks.cantidad,
                                  0
                                ) === 0
                              } // Deshabilitar si no hay stock
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
          <Card className="flex flex-col h-80 shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl">Cart</CardTitle>
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
                      <TableCell>{item.name}</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) =>
                            updateQuantity(item.id, parseInt(e.target.value))
                          }
                          min="1"
                          max={item.stock}
                        />
                      </TableCell>
                      <TableCell>
                        {new Intl.NumberFormat("es-GT", {
                          style: "currency",
                          currency: "GTQ",
                        }).format(item.price)}
                      </TableCell>
                      <TableCell>
                        {new Intl.NumberFormat("es-GT", {
                          style: "currency",
                          currency: "GTQ",
                        }).format(item.price * item.quantity)}
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

              <Collapsible
                open={openCustomerDetails}
                onOpenChange={setOpenCustomerDetails}
              >
                <div className="flex justify-center items-center space-x-4 px-4">
                  <CollapsibleTrigger className="flex gap-1" asChild>
                    <Button
                      className="w-full mb-3"
                      variant="destructive"
                      size="sm"
                    >
                      Añadir información del cliente final
                      <User2Icon className="h-4 w-4" />
                      <span className="sr-only">Toggle</span>
                    </Button>
                  </CollapsibleTrigger>
                </div>

                <CollapsibleContent>
                  <div className="space-y-1 px-4">
                    {/* Selección de cliente */}
                    <div>
                      <Label htmlFor="customer">Nombre</Label>
                      <Input
                        value={nombreClienteFinal}
                        onChange={(e) => setNombreClienteFinal(e.target.value)}
                        placeholder="Referencia"
                      />
                    </div>

                    {/* Selección de método de pago */}
                    <div>
                      <Label htmlFor="payment-method">Telefono</Label>
                      <Input
                        value={telefonoClienteFinal}
                        onChange={(e) =>
                          setTelefonoClienteFinal(e.target.value)
                        }
                        placeholder="+502 5060 7080"
                      />
                    </div>

                    <div>
                      <Label htmlFor="payment-method">Dirección</Label>
                      <Input
                        value={direccionClienteFinal}
                        onChange={(e) =>
                          setDireccionClienteFinal(e.target.value)
                        }
                        placeholder=" C. Central Juan Pablo II, Jacaltenango Canton Pila"
                      />
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* SELECCION DE CLIENTE YA CREADO */}

              <div className="flex gap-1 justify-between mt-4">
                {/* Selección de método de pago */}
                <div>
                  <Label htmlFor="payment-method">Método de Pago</Label>
                  <Select
                    value={paymentMethod}
                    onValueChange={(value) => setPaymentMethod(value)}
                  >
                    <SelectTrigger id="payment-method" className="w-[180px]">
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
                <Collapsible
                  open={openSelectCustomer}
                  onOpenChange={setOpenSelectCustomer}
                >
                  <div className="flex items-center justify-between space-x-4 px-4">
                    <CollapsibleTrigger className="flex gap-1" asChild>
                      <Button variant="default" size="sm">
                        Seleccionar Cliente
                        <User2Icon className="h-4 w-4" />
                        <span className="sr-only">Toggle</span>
                      </Button>
                    </CollapsibleTrigger>
                  </div>

                  <CollapsibleContent>
                    <div className="space-y-4 px-4">
                      {/* Selección de cliente */}
                      <div>
                        <Label htmlFor="customer">Cliente</Label>
                        <Select
                          value={
                            selectedCustomer
                              ? selectedCustomer.id.toString()
                              : "none"
                          }
                          onValueChange={(value) => {
                            const selected = customers.find(
                              (customer) => customer.id === parseInt(value)
                            );
                            setSelectedCustomer(selected || null);
                          }}
                        >
                          <SelectTrigger id="customer" className="w-[180px]">
                            <SelectValue placeholder="Seleccionar cliente" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem key="none" value="none">
                              Ninguno
                            </SelectItem>
                            {customers.map((customer) => (
                              <SelectItem
                                key={customer.id}
                                value={customer.id.toString()}
                              >
                                {customer.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
