import { useState, useEffect } from "react";
import {
  Truck,
  User,
  Plus,
  X,
  Edit,
  SendIcon,
  PackagePlus,
} from "lucide-react";
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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

import { ProductsInventary } from "@/Types/Inventary/ProductsInventary";
import { toast } from "sonner";
import { useStore } from "@/components/Context/ContextSucursal";
import SelectM from "react-select"; // Importación correcta de react-select
import {
  GroupedStock,
  ProductoSelect,
  Provider,
  StockEntry,
} from "./interfaces.interface";

export interface StockProps {
  products: ProductsInventary[];
  providers: Provider[];
  stockEntries: StockEntry[];
  onAddEntry: (e: StockEntry) => void;
  onRemoveEntry: (idx: number) => void;
  onUpdateEntry: (e: StockEntry) => void;
  onSubmit: () => void;
  selectedProviderId: string;
  setSelectedProviderId: React.Dispatch<React.SetStateAction<string>>;
  isSubmitting: boolean;
  setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
  isDialogInspect: boolean;
  setIsDialogInspect: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Stock({
  products,
  providers,
  stockEntries,
  onAddEntry,
  onRemoveEntry,
  onUpdateEntry,
  onSubmit,
  selectedProviderId,
  setSelectedProviderId,
  isSubmitting,
  isDialogInspect,
  setIsDialogInspect,
}: StockProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const totalStock = stockEntries.reduce(
    (total, producto) => total + producto.cantidad * producto.precioCosto,
    0
  );
  const [productToShow, setProductToShow] = useState<ProductoSelect | null>(
    null
  );

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

  const removeEntry = (index: number) => {
    onRemoveEntry(index);
  };

  const editEntry = (entry: StockEntry) => {
    setEditingEntry(entry);
    setIsEditDialogOpen(true);
  };

  const updateEntry = () => {
    if (!editingEntry) return;

    const updatedEntry: StockEntry = {
      ...editingEntry,
      costoTotal: calculateTotalCost(
        editingEntry.cantidad,
        editingEntry.precioCosto
      ),
    };
    onUpdateEntry(updatedEntry);

    setIsEditDialogOpen(false);
    setEditingEntry(null);
    toast.success("Instancia editada");
  };

  //=======================================>
  const usuarioNombre = useStore((s) => s.userNombre);
  const [cantidad, setCantidad] = useState<string>("");
  const [precioCosto, setPrecioCosto] = useState<number>(0);
  const [costoTotal, setCostoTotal] = useState<number>(0);
  const [fechaIngreso, setFechaIngreso] = useState<Date>(new Date());
  const [fechaVencimiento, setFechaVencimiento] = useState<Date | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [editingEntry, setEditingEntry] = useState<StockEntry | null>(null);

  useEffect(() => {
    const q = parseFloat(cantidad) || 0;
    setCostoTotal(q * precioCosto);
  }, [cantidad, precioCosto]);

  const validateForm = () => {
    const errs: Record<string, string> = {};
    if (!cantidad) errs.cantidad = "La cantidad es requerida";
    if (!selectedProductId) errs.product = "Seleccione producto";
    if (!selectedProviderId) errs.provider = "Seleccione proveedor";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleAddEntry = () => {
    if (!validateForm()) return;
    const newEntry: StockEntry = {
      productoId: Number(selectedProductId),
      cantidad: Number(cantidad),
      costoTotal: costoTotal,
      fechaIngreso: fechaIngreso.toISOString(),
      fechaVencimiento: fechaVencimiento?.toISOString(),
      precioCosto,
      proveedorId: Number(selectedProviderId),
    };
    onAddEntry(newEntry);
    resetForm();
    toast.success("Producto añadido");
  };

  const resetForm = () => {
    setCantidad("");
    setPrecioCosto(0);
    setFechaIngreso(new Date());
    setFechaVencimiento(null);
    setSelectedProductId("");
    setErrors({});
  };

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-xl">
      <CardContent>
        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="space-y-2">
                <Label htmlFor="product">Producto</Label>
                <SelectM
                  placeholder="Seleccionar producto"
                  options={products.map((product) => ({
                    value: product.id.toString(),
                    label: `${product.nombre} (${product.codigoProducto})`,
                  }))}
                  className="basic-select text-black"
                  classNamePrefix="select"
                  onChange={(selectedOption) => {
                    if (selectedOption) {
                      setSelectedProductId(selectedOption.value.toString());
                      const selectedProduct = products.find(
                        (product) =>
                          product.id.toString() ===
                          selectedOption.value.toString()
                      );

                      if (selectedProduct) {
                        setProductToShow({
                          id: selectedProduct.id,
                          nombreProducto: selectedProduct.nombre,
                          precioCostoActual: selectedProduct.precioCostoActual,
                          stock: selectedProduct.stock.map((s) => ({
                            cantidad: s.cantidad,
                            id: s.id,
                            sucursal: {
                              id: s.sucursal.id,
                              nombre: s.sucursal.nombre,
                            },
                          })),
                        });
                        setPrecioCosto(selectedProduct.precioCostoActual);
                      }
                    } else {
                      setSelectedProductId("");
                      setProductToShow(null); // Resetea el valor si no hay selección
                    }
                  }}
                  value={
                    selectedProductId
                      ? products
                          .filter(
                            (product) =>
                              product.id.toString() === selectedProductId
                          )
                          .map((product) => ({
                            value: product.id.toString(),
                            label: `${product.nombre} (${product.codigoProducto})`,
                          }))[0]
                      : null
                  }
                />
                {errors.product && (
                  <p className="text-sm text-red-500">{errors.product}</p>
                )}
              </div>
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
                  {providers &&
                    providers.map((provider) => (
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
              <Label htmlFor="precioCosto">Precio de costo producto</Label>
              <Input
                id="precioCosto"
                type="number"
                readOnly
                value={precioCosto || ""} // Asegura que sea un string si está vacío
                onChange={(e) => setPrecioCosto(Number(e.target.value))}
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
            <div className="space-y-2 block">
              {productToShow && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-md">
                      Stocks disponibles
                    </CardTitle>
                    <CardDescription>Existencias disponibles</CardDescription>
                    <CardContent>
                      <div className="mt-4">
                        {Object.entries(
                          productToShow.stock.reduce<
                            Record<string, GroupedStock>
                          >((acc, stock) => {
                            // Group by sucursal name and sum quantities
                            const sucursalName = stock.sucursal.nombre;
                            if (!acc[sucursalName]) {
                              acc[sucursalName] = {
                                nombre: sucursalName,
                                cantidad: 0,
                              };
                            }
                            acc[sucursalName].cantidad += stock.cantidad;
                            return acc;
                          }, {})
                        ).map(([sucursalName, { cantidad }]) => (
                          <div
                            key={sucursalName}
                            className="flex justify-between"
                          >
                            <span className="text-sm">{sucursalName}</span>
                            <span className="text-sm">{cantidad} uds</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </CardHeader>
                </Card>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2 mt-4">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Registrado por: {usuarioNombre}
            </span>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <Button type="button" onClick={handleAddEntry} className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Agregar a la lista
            </Button>
            {/* BOTON PARA ACCIONAR EL VER LA LISTA DE PRODUCTOS */}

            <Dialog open={isDialogInspect} onOpenChange={setIsDialogInspect}>
              <DialogTrigger asChild>
                <Button
                  variant={"destructive"}
                  className="w-full"
                  type="button"
                >
                  <SendIcon className="mr-2 h-4 w-4" />
                  Añadir lista
                </Button>
              </DialogTrigger>
              <DialogContent className="w-full max-w-[800px]">
                <DialogHeader>
                  <h3 className="text-lg font-semibold mb-4 text-center">
                    Productos a añadirles stock
                  </h3>
                </DialogHeader>

                {stockEntries.length > 0 ? (
                  <>
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
                                  products.find(
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
                        disabled={isSubmitting}
                        className="w-full mt-4"
                        onClick={() => {
                          onSubmit();
                        }}
                      >
                        <PackagePlus className="mr-2 h-4 w-4" />
                        Confirmar registro
                      </Button>
                    </div>
                  </>
                ) : (
                  <p className="text-center justify-center">
                    Seleccione productos a añadir stock
                  </p>
                )}

                <DialogFooter className="flex text-center items-center justify-center">
                  <DialogDescription className="text-center"></DialogDescription>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </form>

        <div className="w-full  border p-4 rounded-md mt-2">
          <div>
            <h3 className="text-md font-semibold mb-4 text-center">Lista</h3>
          </div>

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
                            products.find((p) => p.id === entry.productoId)
                              ?.nombre
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
                <Button variant={"secondary"} type="button" className="w-full">
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
              </div>
            </>
          ) : (
            <p className="text-center justify-center">
              Seleccione productos a añadir stock
            </p>
          )}
        </div>

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
