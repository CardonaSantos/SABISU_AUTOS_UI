import { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Calendar,
  DollarSign,
  Loader2,
  Percent,
  Plus,
  Save,
  SendHorizonal,
  Trash,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SelectM, { SingleValue } from "react-select"; // Importación correcta de react-select

import { toast } from "sonner";
import { useStore } from "@/components/Context/ContextSucursal";
import "react-datepicker/dist/react-datepicker.css";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditoRegistro } from "./CreditosType";
import { CreditRecordsTable } from "./CreditosRegistros";

interface Testigo {
  nombre: string;
  direccion: string;
  telefono: string;
}

interface Producto {
  productoId: number;
  cantidad: number;
  precioVenta: number;
}

interface FormData {
  clienteId: number;
  usuarioId: string;
  sucursalId: number;
  totalVenta: number;
  cuotaInicial: number;
  cuotasTotales: number;
  fechaInicio: Date;
  estado: string;
  dpi: string;
  testigos: Testigo[];
  fechaContrato: Date;
  montoVenta: number;
  garantiaMeses: string;
  productos: Producto[];
  diasEntrePagos: number;
  interes: number;
}

interface CustomersToCredit {
  id: number;
  nombre: string;
  telefono: string;
  dpi: string;
  creadoEn: string;
}

interface Precio {
  id: number;
  precio: number;
}

interface Stock {
  id: number;
  cantidad: number;
  fechaIngreso: string;
  fechaVencimiento: string | null;
}

interface ProductToCredit {
  id: number;
  nombre: string;
  descripcion: string;
  codigoProducto: string;
  creadoEn: string;
  actualizadoEn: string;
  precioCostoActual: number;
  precios: Precio[];
  stock: Stock[];
}

interface OptionTypeTS {
  label: string;
  value: number;
}

const API_URL = import.meta.env.VITE_API_URL;
//VERIFICAR PORQUE LA FUNCION NO MUESTRA EL PRODUCTO EN EL PDF
export default function CreateVentaCuotaForm() {
  const sucursalId = useStore((state) => state.sucursalId) ?? 0;
  const userId = useStore((state) => state.userId) ?? 0;
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    clienteId: 0,
    usuarioId: "",
    sucursalId: sucursalId,
    totalVenta: 0,
    cuotaInicial: 0,
    cuotasTotales: 0,
    fechaInicio: new Date(),
    estado: "ACTIVA",
    dpi: "",
    testigos: [],
    fechaContrato: new Date(),
    montoVenta: 0,
    garantiaMeses: "",
    productos: [],
    diasEntrePagos: 0,
    interes: 0,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTestigoChange = (
    index: number,
    field: keyof Testigo,
    value: string
  ) => {
    const newTestigos = [...formData.testigos];
    newTestigos[index] = { ...newTestigos[index], [field]: value };
    setFormData((prev) => ({ ...prev, testigos: newTestigos }));
  };

  const addTestigo = () => {
    setFormData((prev) => ({
      ...prev,
      testigos: [...prev.testigos, { nombre: "", direccion: "", telefono: "" }],
    }));
  };

  const removeTestigo = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      testigos: prev.testigos.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validaciones antes de enviar la data
    if (!formData.clienteId || Number(formData.clienteId) <= 0) {
      toast.info("Debe seleccionar un cliente.");
      setIsLoading(false);
      return;
    }

    if (!formData.cuotaInicial || Number(formData.cuotaInicial) <= 0) {
      toast.info("La cuota inicial debe ser mayor a 0.");
      setIsLoading(false);
      return;
    }

    if (!formData.cuotasTotales || Number(formData.cuotasTotales) <= 0) {
      toast.info("Debe especificar la cantidad de cuotas totales.");
      setIsLoading(false);
      return;
    }

    if (!formData.diasEntrePagos || Number(formData.diasEntrePagos) <= 0) {
      toast.info("Debe especificar los días entre pagos.");
      setIsLoading(false);
      return;
    }

    if (!formData.interes) {
      toast.info("Debe especificar el interés del credito.");
      setIsLoading(false);
      return;
    }

    if (!totalVentaCrédito || Number(totalVentaCrédito) <= 0) {
      toast.info("El monto total de la venta debe ser mayor a 0.");
      setIsLoading(false);
      return;
    }

    if (!formData.productos || formData.productos.length === 0) {
      toast.info("Debe agregar al menos un producto a la venta.");
      setIsLoading(false);
      return;
    }

    console.log("LOS DATOS A ENVIAR:", {
      ...formData,
      clienteId: Number(formData.clienteId),
      usuarioId: Number(formData.usuarioId),
      sucursalId: Number(formData.sucursalId),
      totalVenta: Number(formData.cuotaInicial), // INTENTANDO QUE LA VENTA SEA EL TOTAL DE LA CUOTA INICIAL
      cuotaInicial: Number(formData.cuotaInicial),
      cuotasTotales: Number(formData.cuotasTotales),
      montoVenta: Number(totalVentaCrédito),
      garantiaMeses: Number(formData.garantiaMeses),
      fechaInicio: formData.fechaInicio.toISOString(),
      fechaContrato: formData.fechaContrato.toISOString(),
    });

    try {
      const response = await axios.post(`${API_URL}/cuotas`, {
        ...formData,
        clienteId: Number(formData.clienteId),
        usuarioId: Number(userId),
        sucursalId: Number(sucursalId),
        totalVenta: Number(formData.cuotaInicial),
        montoTotalConInteres: montoTotalConInteres,
        cuotaInicial: Number(formData.cuotaInicial),
        cuotasTotales: Number(formData.cuotasTotales),
        montoVenta: Number(totalVentaCrédito),
        garantiaMeses: Number(formData.garantiaMeses),
      });

      if (response.status === 201) {
        toast.success("Se ha registrado correctamente el crédito.");

        // Reset form
        setFormData({
          clienteId: 0,
          usuarioId: "",
          sucursalId: sucursalId,
          totalVenta: 0,
          cuotaInicial: 0,
          cuotasTotales: 0,
          fechaInicio: new Date(),
          estado: "ACTIVA",
          dpi: "",
          testigos: [],
          fechaContrato: new Date(),
          montoVenta: 0,
          garantiaMeses: "",
          productos: [],
          diasEntrePagos: 0,
          interes: 0,
        });

        setCustomerSelected(null);
        setOpenCreate(false);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (error) {
      console.error("Error al crear la venta a cuota:", error);
      toast.info(
        "No se pudo registrar el crédito. Verifique la disponibilidad de los productos, los datos ingresados y vuelva a intentarlo."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const [customers, setCustomers] = useState<CustomersToCredit[]>([]);
  const [products, setProducts] = useState<ProductToCredit[]>([]);

  const getClientes = async () => {
    try {
      const respose = await axios.get(`${API_URL}/client/get-clients`);
      if (respose.status === 200) {
        setCustomers(respose.data);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error al conseguir datos de clientes");
    }
  };

  const getProductos = async () => {
    try {
      const respose = await axios.get(
        `${API_URL}/products/sucursal/${sucursalId}`
      );
      if (respose.status === 200) {
        setProducts(respose.data);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error al conseguir datos de clientes");
    }
  };

  useEffect(() => {
    getClientes();
    getProductos();
  }, []);

  const [productSelected, setProductSelected] =
    useState<ProductToCredit | null>(null);

  const [customerSelected, setCustomerSelected] =
    useState<SingleValue<OptionTypeTS> | null>(null);

  const handleChangeSelectCustomer = (option: SingleValue<OptionTypeTS>) => {
    setCustomerSelected(option);

    if (option) {
      //VERIFICAR QUE SÍ ESTE DISPONIBLE EL VALOR
      setFormData((previaData) => ({
        ...previaData,
        clienteId: option?.value,
      }));
    }
  };
  //EL VALOR DE LA SELECCIÓN, SERÁ EL QUE LE PASEMOS POR EL VALUE
  const optionsProductsFormat = products.map((prod) => ({
    value: prod.id,
    label: `${prod.nombre} (${prod.codigoProducto})`,
  }));

  const optionsCustomersFormat = customers.map((cust) => ({
    value: cust.id,
    label: `${cust.nombre} - ${cust.telefono} (${cust.dpi})`,
  }));

  //==============================================================>
  const [selectedPrice, setSelectedPrice] = useState<Precio | null>(null);
  const [quantity, setQuantity] = useState<number>(1);

  const handleChangeSelectProduct = (option: OptionTypeTS) => {
    const product = products.find((prod) => prod.id === option.value);
    setProductSelected(product || null);
    setSelectedPrice(product?.precios[0] || null); // Selecciona el primer precio por defecto
    setQuantity(1); // Reinicia la cantidad
  };

  const handleChangeSelectPrice = (option: OptionTypeTS) => {
    const price = productSelected?.precios.find(
      (precio) => precio.id === option.value
    );
    setSelectedPrice(price || null);
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuantity(Number(e.target.value));
  };

  // Formatear precios para el select de precios
  const optionsPricesFormat =
    productSelected?.precios.map((price) => ({
      value: price.id,
      label: `${price.precio}`,
    })) || [];

  console.log("El producto seleccionado es: ", productSelected);

  const handleAddProduct = () => {
    if (productSelected && selectedPrice) {
      if (productSelected.id <= 0 || selectedPrice.precio <= 0) {
        toast.info("Faltan datos");
        return;
      }

      if (
        formData.productos.find(
          (prod) => prod.productoId === productSelected.id
        )
      ) {
        toast.info("Producto ya está en la lista");
        return;
      }

      // Crea un nuevo objeto de producto con los datos seleccionados
      const newProduct: Producto = {
        productoId: productSelected.id,
        cantidad: quantity,
        precioVenta: selectedPrice.precio,
      };

      // Calcula el nuevo montoVenta y totalVenta agregando el precio del producto seleccionado
      const newMontoVenta =
        formData.montoVenta + newProduct.precioVenta * quantity;
      const newTotalVenta =
        formData.totalVenta + newProduct.precioVenta * quantity;

      // Agrega el nuevo producto al array de productos en formData
      setFormData((prev) => ({
        ...prev,
        productos: [...prev.productos, newProduct],
        montoVenta: newMontoVenta,
        totalVenta: newTotalVenta,
      }));

      toast.success("Producto añadido");

      // Opcional: Limpiar el estado de la selección de producto, precio y cantidad
      setProductSelected(null);
      setSelectedPrice(null);
      setQuantity(1); // Resetea la cantidad a 1 si es necesario
    }
  };

  const handleDeleteFromData = async (id: number) => {
    // Elimina el producto de la lista de productos
    const updatedProductos = formData.productos.filter(
      (product) => product.productoId !== id
    );

    // Actualiza el estado con la nueva lista de productos
    setFormData((prev) => ({
      ...prev,
      productos: updatedProductos,
    }));

    // Recalcular el montoVenta y totalVenta después de eliminar el producto
    const newMontoVenta = updatedProductos.reduce(
      (total, product) => total + product.precioVenta * product.cantidad,
      0
    );
    const newTotalVenta = newMontoVenta; // Si quieres que totalVenta sea igual a montoVenta

    // Actualizar los valores de montoVenta y totalVenta en el estado
    setFormData((prevData) => ({
      ...prevData,
      montoVenta: newMontoVenta,
      totalVenta: newTotalVenta,
    }));

    toast.success("Producto eliminado de la lista");
  };

  console.log("El FORMDATA: ", formData);

  const totalVentaCrédito = formData.productos.reduce(
    (total, prod) => total + prod.precioVenta * prod.cantidad,
    0
  );

  const [openCreate, setOpenCreate] = useState(false);
  const [creditos, setCreditos] = useState<CreditoRegistro[]>([]);

  // const getRegistCredits = async () => {
  //   try {
  //     const response = await axios.get(`${API_URL}/cuotas/get/credits`);
  //     if (response.status === 200) {
  //       setCreditos(response.data);
  //     }
  //     console.log("Actualizando la lista de creditos");
  //   } catch (error) {
  //     console.log(error);
  //     toast.info("Error al conseguir los registros");
  //   }
  // };

  // Simplifica la función sin useCallback
  const getRegistCredits = async () => {
    try {
      const response = await axios.get(`${API_URL}/cuotas/get/credits`);
      setCreditos(response.data);
      console.log("Lista de créditos actualizada");
    } catch (error) {
      console.error(error);
      toast.error("Error al obtener registros");
    }
  };

  // Ejecutar solo al montar el componente
  useEffect(() => {
    getRegistCredits();
  }, []); // <-- Array de dependencias vacío

  const calcularCuotas = () => {
    if (
      formData.totalVenta &&
      formData.cuotaInicial &&
      formData.interes &&
      formData.cuotasTotales
    ) {
      // Monto de interés sobre el total de la venta
      const montoInteres = formData.totalVenta * (formData.interes / 100);

      // Monto total con interés (precio original + interés)
      const montoTotalConInteres = formData.totalVenta + montoInteres;

      // Saldo restante después del enganche (basado en el monto total con interés)
      const saldoRestante = montoTotalConInteres - formData.cuotaInicial;

      // Pago por cuota (saldo restante dividido entre el número de cuotas)
      const pagoPorCuota = saldoRestante / formData.cuotasTotales;

      return {
        saldoRestante,
        montoInteres,
        montoTotalConInteres,
        pagoPorCuota,
      };
    }

    return {
      saldoRestante: 0,
      montoInteres: 0,
      montoTotalConInteres: 0,
      pagoPorCuota: 0,
    };
  };

  // Llamamos a la función para obtener los valores correctos
  const { saldoRestante, montoInteres, montoTotalConInteres, pagoPorCuota } =
    calcularCuotas();

  //DIFERENCIA ENTRE LA GANANCIA Y EL PRECIO DEL PRODUCTO PARA SACAR LOS PAGOS DE LAS CUOTAS

  const formatearMoneda = (cantidad: number) => {
    return new Intl.NumberFormat("es-GT", {
      style: "currency",
      currency: "GTQ",
    }).format(cantidad);
  };
  console.log("Los creditos son: ", creditos);

  return (
    <Tabs defaultValue="account" className="w-full">
      <div className="flex flex-col items-center w-full">
        <TabsList className="flex w-full max-w-5xl justify-center">
          <TabsTrigger value="account" className="flex-1 text-center">
            Registros de Créditos
          </TabsTrigger>
          <TabsTrigger value="password" className="flex-1 text-center">
            Registrar Nuevo Crédito
          </TabsTrigger>
        </TabsList>
      </div>
      {/* MOSTRAR LOS DATOS DE LOS REGISTROS DE CREDITOS */}
      <TabsContent value="account">
        <CreditRecordsTable
          userId={userId}
          sucursalId={sucursalId}
          getCredits={getRegistCredits}
          records={creditos}
        />
      </TabsContent>
      {/* MOSTRAR LOS DATOS DE LOS REGISTROS DE CREDITOS */}

      <TabsContent value="password">
        <Card className="w-full max-w-5xl mx-auto shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Crear Nuevo Crédito
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Selección de productos */}
              <div className="col-span-2">
                <h3 className="text-center text-md font-semibold">
                  Selección de productos
                </h3>
                <Separator className="my-2 border-t border-gray-300" />
              </div>

              <div className="col-span-2">
                <Label>Producto</Label>
                <SelectM
                  className="text-black"
                  placeholder="Seleccione un producto"
                  isClearable={true}
                  value={
                    productSelected
                      ? {
                          value: productSelected.id,
                          label: productSelected.nombre,
                        }
                      : null
                  }
                  onChange={(option) =>
                    handleChangeSelectProduct(option as OptionTypeTS)
                  }
                  options={optionsProductsFormat}
                />
              </div>

              {/* Selección de precio */}
              {productSelected && (
                <div className="col-span-2">
                  <Label>Precio</Label>
                  <SelectM
                    isClearable={true}
                    placeholder="Seleccione un precio"
                    className="text-black"
                    value={
                      selectedPrice
                        ? {
                            value: selectedPrice.id,
                            label: `${selectedPrice.precio}`,
                          }
                        : null
                    }
                    onChange={(option) =>
                      handleChangeSelectPrice(option as OptionTypeTS)
                    }
                    options={optionsPricesFormat}
                  />
                </div>
              )}

              {/* Input para la cantidad */}
              <div className="col-span-2">
                <Label>Cantidad</Label>
                <Input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={handleQuantityChange}
                />
              </div>

              {/* Productos seleccionados */}
              {formData.productos?.map((productForm) => {
                const productoFind = products.find(
                  (prod) => prod.id === productForm.productoId
                );
                if (!productoFind) return null;

                return (
                  <div key={productForm.productoId} className="col-span-2 mb-2">
                    <Card className="p-2 bg-white shadow-sm rounded-md dark:bg-transparent">
                      <CardContent className="p-1">
                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-400">
                          {productoFind.nombre}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Cantidad: {productForm.cantidad}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Precio: {productForm.precioVenta}
                        </p>
                      </CardContent>
                      <Button
                        onClick={() =>
                          handleDeleteFromData(productForm.productoId)
                        }
                        type="button"
                        variant="destructive"
                        className="w-full max-w-52 mt-1 text-xs py-1 bg-red-500 text-white hover:bg-red-600"
                      >
                        Eliminar
                      </Button>
                    </Card>
                  </div>
                );
              })}

              {/* Botón para agregar el producto */}
              <div className="col-span-2">
                <Button
                  className="w-full max-w-64"
                  variant={"destructive"}
                  type="button"
                  onClick={handleAddProduct}
                >
                  Agregar Producto
                </Button>
              </div>

              {/* Datos del cliente */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="clienteId">Cliente</Label>
                  <SelectM
                    placeholder="Seleccione un cliente"
                    value={
                      customerSelected
                        ? {
                            value: customerSelected.value,
                            label: customerSelected.label,
                          }
                        : null
                    }
                    options={optionsCustomersFormat}
                    onChange={handleChangeSelectCustomer}
                    isClearable={true}
                    className="text-black"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cuotaInicial">
                    Pago de Cuota Inicial (enganche){" "}
                  </Label>
                  <Input
                    id="cuotaInicial"
                    name="cuotaInicial"
                    type="number"
                    step="1"
                    required
                    value={formData.cuotaInicial}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cuotasTotales">
                    Número de Cuotas Totales
                  </Label>
                  <Input
                    id="cuotasTotales"
                    name="cuotasTotales"
                    type="number"
                    step="1"
                    required
                    value={formData.cuotasTotales}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="garantiaMeses">Garantía (meses)</Label>
                  <Input
                    id="garantiaMeses"
                    name="garantiaMeses"
                    type="number"
                    required
                    step="1"
                    value={formData.garantiaMeses}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="garantiaMeses">
                    Días entre pagos (intervalo)
                  </Label>
                  <Input
                    id="diasEntrePagos"
                    name="diasEntrePagos"
                    type="number"
                    required
                    step="1"
                    value={formData.diasEntrePagos}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="interes">Porcentaje de interés</Label>
                  <div className="flex gap-2 justify-center items-center">
                    <Input
                      id="interes"
                      name="interes"
                      type="number"
                      required
                      step="1"
                      value={formData.interes}
                      onChange={handleInputChange}
                    />
                    %
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="totalVenta">Total de la Venta</Label>
                  <Input
                    id="totalVenta"
                    name="totalVenta"
                    type="number"
                    step="1"
                    required
                    value={totalVentaCrédito}
                    readOnly
                  />
                </div>
              </div>

              {/* Resumen */}
              <div className="">
                <Card>
                  <CardContent className="p-5 bg-gray-50 font-extralight dark:bg-transparent">
                    <h3 className="mb-1 text-xl font-medium">Resumen</h3>

                    <div className="flex items-center gap-2">
                      <DollarSign className="text-green-500" />
                      <div>
                        <label className="font-semibold">
                          Saldo Restante a Pagar:
                        </label>
                        <p className="text-gray-700">
                          {formatearMoneda(saldoRestante)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                      <Percent className="text-blue-500" />
                      <div>
                        <label className="font-semibold">
                          Monto de Interés:
                        </label>
                        <p className="text-gray-700">
                          {formatearMoneda(montoInteres)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                      <BarChart className="text-orange-500" />
                      <div>
                        <label className="font-semibold">
                          Monto Total con Interés:
                        </label>
                        <p className="text-gray-700">
                          {formatearMoneda(montoTotalConInteres)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                      <Calendar className="text-purple-500" />
                      <div>
                        <label className="font-semibold">
                          Pago por cada Cuota:
                        </label>
                        <p className="text-gray-700">
                          {typeof pagoPorCuota === "number" &&
                          !isNaN(pagoPorCuota) &&
                          isFinite(pagoPorCuota)
                            ? formatearMoneda(pagoPorCuota)
                            : "Calculando..."}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Testigos */}
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>
                    Añadir Testigos ({formData.testigos.length})
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 m-2">
                      <Label className="mr-5">Testigos</Label>
                      {formData.testigos.map((testigo, index) => (
                        <div key={index} className="flex space-x-3">
                          <Input
                            placeholder="Nombre"
                            value={testigo.nombre}
                            onChange={(e) =>
                              handleTestigoChange(
                                index,
                                "nombre",
                                e.target.value
                              )
                            }
                          />
                          <Input
                            placeholder="Dirección"
                            value={testigo.direccion}
                            onChange={(e) =>
                              handleTestigoChange(
                                index,
                                "direccion",
                                e.target.value
                              )
                            }
                          />
                          <Input
                            placeholder="Teléfono"
                            value={testigo.telefono}
                            onChange={(e) =>
                              handleTestigoChange(
                                index,
                                "telefono",
                                e.target.value
                              )
                            }
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            onClick={() => removeTestigo(index)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button type="button" onClick={addTestigo}>
                        <Plus className="h-4 w-4 mr-2" /> Agregar Testigo
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              {/* Confirmación del registro */}
              <Dialog onOpenChange={setOpenCreate} open={openCreate}>
                <Button onClick={() => setOpenCreate(true)} type="button">
                  <Save className="h-4 w-4 m-2" />
                  Iniciar Registro
                </Button>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="text-center">
                      Confirmación de Registro
                    </DialogTitle>
                    <DialogDescription className="text-center">
                      ¿Estás seguro de que deseas proceder con la creación de
                      este registro de crédito con los datos actuales?
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex gap-2">
                    <Button
                      variant={"destructive"}
                      onClick={() => setOpenCreate(false)}
                      className="w-full"
                    >
                      Cancelar
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      type="submit"
                      className="w-full"
                      disabled={isLoading}
                    >
                      <SendHorizonal className="w-4 h-4 m-2" />
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Procesando...
                        </>
                      ) : (
                        "Confirmar y Crear Registro"
                      )}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </form>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
