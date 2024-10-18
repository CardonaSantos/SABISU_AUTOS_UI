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
import { Barcode, CirclePlus, X } from "lucide-react";
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
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  console.log(selectedCustomer);

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
      });

      if (response.status === 201) {
        toast.success("Venta completada con éxito");
        setIsDialogOpen(false);
        // Reiniciar valores después de completar la venta
        setSelectedCustomer(null);
        setPaymentMethod("CONTADO");
        setCart([]);
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
      const response = await axios.get(`${API_URL}/products`);
      if (response.status === 200) {
        setProductos(response.data);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error");
    }
  };

  useEffect(() => {
    getProducts();
  }, []);
  console.log("Los productos son: ", productos);

  const filteredProducts = productos.filter(
    (product) =>
      product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.codigoProducto.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <div className="container  ">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div className="space-y-2">
          <Card>
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
          <Card className="overflow-y-auto max-h-96">
            <CardHeader>{/* <CardTitle>Productos</CardTitle> */}</CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Precio</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Expira</TableHead>
                    <TableHead>Acción</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      {/* Nombre del producto */}
                      <TableCell>{product.nombre}</TableCell>

                      {/* Precio del producto */}
                      <TableCell>
                        {new Intl.NumberFormat("es-GT", {
                          style: "currency",
                          currency: "GTQ",
                        }).format(product.precioVenta)}
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
                          <TableCell>
                            {product.stock[0]?.fechaVencimiento
                              ? new Date(
                                  product.stock[0].fechaVencimiento
                                ).toLocaleDateString("es-GT")
                              : "N/A"}
                          </TableCell>

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
        <div className="space-y-2">
          <Card className="flex flex-col h-80">
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
                  <Button>Completar</Button>
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

          <Card>
            <CardContent>
              <div className="flex justify-center p-2 items-center">
                <h2 className="font-bold text-xl">Metodo pago & cliente</h2>
              </div>
              <div className="space-y-2">
                <div>
                  <Label htmlFor="customer">Cliente</Label>
                  <Select
                    onValueChange={(value) => {
                      // Busca el cliente por el ID seleccionado y lo asigna a selectedCustomer
                      const selected = customers.find(
                        (customer) => customer.id === parseInt(value)
                      );
                      setSelectedCustomer(selected || null);
                    }}
                  >
                    <SelectTrigger id="customer">
                      <SelectValue placeholder="Seleccionar cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem key="none" value="none">
                        Ninguno
                      </SelectItem>{" "}
                      {/* Asegúrate de tener un valor único y comprensible */}
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
                <div>
                  <Select
                    value={paymentMethod}
                    onValueChange={(value) => setPaymentMethod(value)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="METODO PAGO" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CONTADO">CONTADO</SelectItem>
                      <SelectItem value="TARJETA">TARJETA</SelectItem>
                      <SelectItem value="TRANSFERENCIA">
                        TRANSFERENCIA BANCARIA
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
