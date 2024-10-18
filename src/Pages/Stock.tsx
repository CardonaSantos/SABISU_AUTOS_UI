import { useState, useEffect } from "react";
import { Package, Truck, User, Plus, X, Edit, Send } from "lucide-react";
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

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import axios from "axios";
import { ProductsInventary } from "@/Types/Inventary/ProductsInventary";
import { toast } from "sonner";

type Provider = {
  id: number;
  nombre: string;
};

type StockEntry = {
  productoId: number;
  cantidad: number;
  costoTotal: number;
  fechaIngreso: string;
  fechaVencimiento?: string;
  precioCosto: number;
  proveedorId: number;
};

export default function Stock() {
  const [cantidad, setCantidad] = useState<string>("");
  const [precioCosto, setPrecioCosto] = useState<string>("");
  const [costoTotal, setCostoTotal] = useState<number>(0);
  const [fechaIngreso, setFechaIngreso] = useState<Date>(new Date());
  const [fechaVencimiento, setFechaVencimiento] = useState<Date | undefined>();
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [selectedProviderId, setSelectedProviderId] = useState<string>("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [stockEntries, setStockEntries] = useState<StockEntry[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<StockEntry | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const [isDialogInspect, setIsDialogInspect] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

  console.log("Lo que vamos a enviar es: ", stockEntries);

  const calculateTotalCost = (
    cantidad: number,
    precioCosto: number
  ): number => {
    const cantidadNum = parseFloat(cantidad.toString());
    const precioCostoNum = parseFloat(precioCosto.toString());

    if (!isNaN(cantidadNum) && !isNaN(precioCostoNum)) {
      return cantidadNum * precioCostoNum;
    } else {
      return 0;
    }
  };

  useEffect(() => {
    const cantidadNum = parseFloat(cantidad);
    const precioCostoNum = parseFloat(precioCosto);
    console.log("La cantidad num: ", cantidadNum);
    console.log("La preciocostoNum: ", precioCostoNum);

    if (!isNaN(cantidadNum) && !isNaN(precioCostoNum)) {
      setCostoTotal(cantidadNum * precioCostoNum);
    } else {
      setCostoTotal(0);
    }
  }, [cantidad, precioCosto, editingEntry]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!cantidad) newErrors.cantidad = "La cantidad es requerida";
    if (!precioCosto) newErrors.precioCosto = "El precio de costo es requerido";
    if (!fechaIngreso)
      newErrors.fechaIngreso = "La fecha de ingreso es requerida";
    if (!selectedProductId) newErrors.product = "Debe seleccionar un producto";
    if (!selectedProviderId)
      newErrors.provider = "Debe seleccionar un proveedor";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddEntry = () => {
    if (validateForm()) {
      const newEntry: StockEntry = {
        productoId: parseInt(selectedProductId),
        cantidad: parseInt(cantidad),
        costoTotal: calculateTotalCost(
          parseInt(cantidad),
          parseFloat(precioCosto)
        ), // Usa la nueva función
        fechaIngreso: fechaIngreso.toISOString(),
        fechaVencimiento: fechaVencimiento?.toISOString(),
        precioCosto: parseFloat(precioCosto),
        proveedorId: parseInt(selectedProviderId),
      };
      setStockEntries([...stockEntries, newEntry]);
      resetForm();
      toast.success("Producto añadido");
    }
  };

  const resetForm = () => {
    setCantidad("");
    setPrecioCosto("");
    setCostoTotal(0);
    setFechaIngreso(new Date());
    setFechaVencimiento(undefined);
    setSelectedProductId("");
    // setSelectedProviderId("");
    setErrors({});
  };

  const handleSubmit = async () => {
    console.log("LOS DATOS A ENVIAR SON: ", {
      stockEntries,
      proveedorId: Number(selectedProviderId),
    });

    console.log("Enviando entradas de stock:", stockEntries);
    try {
      const response = await axios.post(`${API_URL}/stock`, {
        stockEntries,
        proveedorId: Number(selectedProviderId),
      });
      if (response.status === 201) {
        toast.success("Stocks añadidos exitosamente");
        // resetForm();
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error al registrar los stocks");
    }
    // Aquí iría la lógica para enviar los datos al backend
    // setStockEntries([]);
    setIsDialogOpen(false);
  };

  const removeEntry = (index: number) => {
    setStockEntries(stockEntries.filter((_, i) => i !== index));
  };

  const editEntry = (entry: StockEntry) => {
    setEditingEntry(entry);
    setIsEditDialogOpen(true);
  };

  const updateEntry = () => {
    if (editingEntry) {
      const updatedEntry = {
        ...editingEntry,
        costoTotal: calculateTotalCost(
          editingEntry.cantidad,
          editingEntry.precioCosto
        ), // Usa la nueva función
      };

      const updatedEntries = stockEntries.map((entry) =>
        entry.productoId === updatedEntry.productoId ? updatedEntry : entry
      );
      setStockEntries(updatedEntries);
      setIsEditDialogOpen(false);
      setEditingEntry(null);
      toast.success("Instancia editada");
    }
  };

  const [productsInventary, setProductsInventary] = useState<
    ProductsInventary[]
  >([]);

  const getProducts = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/products/products/for-inventary`
      );
      if (response.status === 200) {
        setProductsInventary(response.data);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error al conseguir los productos");
    }
  };
  const [proveedores, setProveedores] = useState<Provider[]>();
  const getProviders = async () => {
    try {
      const response = await axios.get(`${API_URL}/proveedor/`);
      if (response.status === 200) {
        setProveedores(response.data);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error al conseguir los productos");
    }
  };
  useEffect(() => {
    getProducts();
    getProviders();
  }, []);

  const totalStock = stockEntries.reduce(
    (total, producto) => total + producto.cantidad * producto.precioCosto,
    0
  );

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          Agregar Stock de Producto
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="product">Producto</Label>
              <Select
                onValueChange={setSelectedProductId}
                value={selectedProductId}
              >
                <SelectTrigger id="product">
                  <SelectValue placeholder="Seleccionar producto" />
                </SelectTrigger>
                <SelectContent>
                  {productsInventary &&
                    productsInventary.map((product) => (
                      <SelectItem
                        key={product.id}
                        value={product.id.toString()}
                      >
                        <span className="flex items-center">
                          <Package className="mr-2 h-4 w-4" />
                          {product.nombre} ({product.codigoProducto})
                        </span>
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              {errors.product && (
                <p className="text-sm text-red-500">{errors.product}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="provider">Proveedor</Label>
              <Select
                onValueChange={setSelectedProviderId}
                value={selectedProviderId}
              >
                <SelectTrigger id="provider">
                  <SelectValue placeholder="Seleccionar proveedor" />
                </SelectTrigger>
                <SelectContent>
                  {proveedores &&
                    proveedores.map((provider) => (
                      <SelectItem
                        key={provider.id}
                        value={provider.id.toString()}
                      >
                        <span className="flex items-center">
                          <Truck className="mr-2 h-4 w-4" />
                          {provider.nombre}
                        </span>
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              {errors.provider && (
                <p className="text-sm text-red-500">{errors.provider}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="cantidad">Cantidad</Label>
              <Input
                id="cantidad"
                type="number"
                value={cantidad}
                onChange={(e) => setCantidad(e.target.value)}
                placeholder="Ingrese la cantidad"
              />
              {errors.cantidad && (
                <p className="text-sm text-red-500">{errors.cantidad}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="precioCosto">Precio de costo</Label>
              <Input
                id="precioCosto"
                type="number"
                value={precioCosto}
                onChange={(e) => setPrecioCosto(e.target.value)}
                placeholder="Ingrese el precio de costo"
              />
              {errors.precioCosto && (
                <p className="text-sm text-red-500">{errors.precioCosto}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="costoTotal">Costo total</Label>
              <Input
                id="costoTotal"
                type="number"
                value={costoTotal.toFixed(2)}
                readOnly
                className=""
              />
            </div>
            <div className="space-y-2 block">
              <Label className="block">Fecha de ingreso</Label>{" "}
              {/* Se asegura que Label esté en bloque */}
              <input
                className="block w-full bg-transparent"
                type="date"
                onChange={(e) => setFechaIngreso(new Date(e.target.value))}
              />
              {errors.fechaIngreso && (
                <p className="text-sm text-red-500">{errors.fechaIngreso}</p>
              )}
            </div>
            <div className="space-y-2 block">
              <Label className="block">Fecha de vencimiento (opcional)</Label>
              <input
                value={
                  fechaVencimiento
                    ? fechaVencimiento.toISOString().split("T")[0]
                    : ""
                }
                className="block w-full bg-transparent"
                type="date"
                onChange={(e) => setFechaVencimiento(new Date(e.target.value))}
              />
              {errors.fechaVencimiento && (
                <p className="text-sm text-red-500">
                  {errors.fechaVencimiento}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2 mt-4">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Registrado por: Usuario Actual
            </span>
          </div>
          <Button type="button" onClick={handleAddEntry} className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Agregar a la lista
          </Button>
          {/* BOTON PARA ACCIONAR EL VER LA LISTA DE PRODUCTOS */}

          <Dialog open={isDialogInspect} onOpenChange={setIsDialogInspect}>
            <DialogTrigger asChild>
              <Button variant={"destructive"} className="w-full" type="button">
                Ver Lista
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <h3 className="text-lg font-semibold mb-4 text-center">
                  Productos a añadirles stock
                </h3>
              </DialogHeader>

              {stockEntries.length > 0 ? (
                <>
                  {/* Contenedor scrolleable solo para los productos */}
                  <div className="mt-8 max-h-72 overflow-y-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Producto</TableHead>
                          <TableHead>Cantidad</TableHead>
                          <TableHead>Precio Costo</TableHead>
                          <TableHead>Costo Total</TableHead>
                          <TableHead>Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {stockEntries.map((entry, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              {
                                productsInventary.find(
                                  (p) => p.id === entry.productoId
                                )?.nombre
                              }
                            </TableCell>
                            <TableCell>{entry.cantidad}</TableCell>
                            <TableCell>
                              {new Intl.NumberFormat("es-GT", {
                                style: "currency",
                                currency: "GTQ",
                              }).format(entry.precioCosto)}
                            </TableCell>
                            <TableCell>
                              {new Intl.NumberFormat("es-GT", {
                                style: "currency",
                                currency: "GTQ",
                              }).format(entry.costoTotal)}
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => editEntry(entry)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeEntry(index)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Botones y totales fuera del contenedor scrolleable */}
                  <div className="mt-4">
                    <Button
                      variant={"secondary"}
                      type="button"
                      className="w-full"
                    >
                      {totalStock ? (
                        <>
                          Total:{" "}
                          {new Intl.NumberFormat("es-GT", {
                            style: "currency",
                            currency: "GTQ",
                          }).format(totalStock)}
                        </>
                      ) : (
                        "Seleccione productos"
                      )}
                    </Button>
                    <Button
                      className="w-full mt-4"
                      onClick={() => setIsDialogOpen(true)}
                    >
                      <Send className="mr-2 h-4 w-4" />
                      Confirmar Registro de Stock
                    </Button>
                  </div>
                </>
              ) : (
                <p className="text-center justify-center">
                  Seleccione productos a añadir stock
                </p>
              )}

              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogHeader></DialogHeader>
                <DialogContent>
                  <div className="">
                    <h2 className="text-center text-lg font-semibold">
                      Confirmación
                    </h2>
                    <h3 className="text-center">
                      ¿Estás seguro de registrar la entrega de stock para estos
                      productos con esta información?
                    </h3>
                  </div>
                  <div className="flex gap-2 justify-center items-center ">
                    <Button type="button" onClick={handleSubmit}>
                      Confirmar
                    </Button>
                    <Button
                      variant={"destructive"}
                      type="button"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Cancelar
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <DialogFooter>
                <DialogDescription className="text-center">
                  El usuario responsable de este registro es: usuario
                </DialogDescription>
                <DialogDescription className="text-center">
                  Esta información no se puede editar
                </DialogDescription>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </form>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-center">
                Editar Entrada de Stock
              </DialogTitle>
            </DialogHeader>
            {editingEntry && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-cantidad" className="text-right">
                    Cantidad
                  </Label>
                  <Input
                    id="edit-cantidad"
                    type="number"
                    value={editingEntry.cantidad}
                    onChange={(e) =>
                      setEditingEntry({
                        ...editingEntry,
                        cantidad: parseInt(e.target.value),
                      })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-precioCosto" className="text-right">
                    Precio de Costo
                  </Label>
                  <Input
                    id="edit-precioCosto"
                    type="number"
                    value={editingEntry.precioCosto}
                    onChange={(e) =>
                      setEditingEntry({
                        ...editingEntry,
                        precioCosto: parseFloat(e.target.value),
                      })
                    }
                    className="col-span-3"
                  />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="button" onClick={updateEntry}>
                Guardar Cambios
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
