"use client";
import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { useStore } from "@/components/Context/ContextSucursal"; // Asumiendo que esta ruta es correcta
import { motion } from "framer-motion";
import {
  fetchAllGarantias,
  fetchProvidersToWarranty,
  fetchVentas,
  submitWarrantyRegistration,
} from "./api"; // Nuevas funciones de API
import type {
  GarantiaFormData,
  ProveedoresResponse,
} from "./interfaces.interfaces"; // Nuevo archivo de tipos
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ProductoVenta,
  ProductoVentaToTable,
  VentaHistorialItem,
  VentasHistorial,
} from "./interfaces2.interfaces";
import CardGarantiaCreate from "./CardGarantiaCreate";
import DesvanecerHaciaArriba from "@/Crm/Motion/DashboardAnimations";
import { WarrantyList } from "./garantiasMap/warranty-list";
import { GarantiaDto } from "./interfacesTable";
// Sub-componentes para la sección de detalles

export default function ReceiveWarrantyPage() {
  const userID = useStore((state) => state.userId) ?? 0;
  const sucursalID = useStore((state) => state.sucursalId) ?? 0;

  const [providers, setProviders] = useState<ProveedoresResponse[]>([]);
  const [ventas, setVentas] = useState<VentasHistorial>([]);
  const [ventaSelected, setVentaSelected] = useState<VentaHistorialItem | null>(
    null
  );
  const [productoSelected, setProductoSelected] =
    useState<ProductoVenta | null>(null);
  const [productSelected, setProductSelected] = useState<ProductoVenta | null>(
    null
  );
  const [openSelectedProduct, setOpenSelectedProduct] =
    useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] =
    useState<ProductoVentaToTable | null>(null);
  const [openProductDialog, setOpenProductDialog] = useState(false);
  const [formData, setFormData] = useState<GarantiaFormData>({
    clienteId: 0,
    productoId: 0,
    comentario: "",
    proveedorId: 0,
    descripcionProblema: "",
    usuarioIdRecibe: userID,
    sucursalId: sucursalID,
    estado: "",
    ventaId: 1,
    cantidad: 1,
    ventaProductoID: 1,
  });

  const [selecProviderID, setSelecProviderID] = useState<OptionType | null>(
    null
  );

  const [garantias, setGarantias] = useState<GarantiaDto[]>([]);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [providersData, ventasResponse, garantias] = await Promise.all([
          fetchProvidersToWarranty(),
          fetchVentas(),
          fetchAllGarantias(),
        ]);
        setProviders(providersData);
        setVentas(ventasResponse);
        setGarantias(garantias);
      } catch (error) {
        console.error("Error loading initial data:", error);
        toast.error("Error al cargar datos iniciales");
      }
    };
    loadInitialData();
  }, []);

  useEffect(() => {
    setFormData((prev) => ({ ...prev, usuarioIdRecibe: userID }));
  }, [userID]);

  type OptionType = { value: number; label: string };

  const providerOptionSelect: OptionType[] = providers.map((prov) => ({
    label: prov.nombre,
    value: prov.id, // ← NUMBER
  }));

  const optionsVenta = ventas.map((v) => ({
    label: `Venta No. #${v.id} | Cliente: ${v.cliente.nombre} | Productos: ${v.productos.length}`,
    value: v.id,
  }));

  const handleChangeSelectVenta = (opt: OptionType | null) => {
    if (!opt) {
      setVentaSelected(null);
      return;
    }
    const venta = ventas.find((v) => v.id === opt.value) ?? null;
    setVentaSelected(venta);
  };

  const handleChangeProvider = useCallback(
    (selectedOption: OptionType | null) => {
      setSelecProviderID(selectedOption);
      setFormData((prevFormData) => ({
        ...prevFormData,
        proveedorId: selectedOption ? selectedOption.value : 0,
      }));
    },
    []
  );

  console.log("El formData", formData);

  // await submitWarrantyRegistration(formData)
  const [isSubmittingGarantia, setIsSubmittingGarantia] =
    useState<boolean>(false);
  const handleSubmitRegistGarantia = async () => {
    if (isSubmittingGarantia) return;
    setIsSubmittingGarantia(true);

    toast.promise(
      submitWarrantyRegistration({
        ...formData,
        cantidadDevuelta: formData.cantidad,
      }),
      {
        loading: "Registrando garantía...",
        success: "Registro insertado correctamente",
        error: "Error al registrar garantía",
      }
    );
    setIsSubmittingGarantia(false);
    setFormData({
      clienteId: 0,
      productoId: 0,
      comentario: "",
      proveedorId: 0,
      descripcionProblema: "",
      usuarioIdRecibe: userID,
      sucursalId: sucursalID,
      estado: "",
      ventaId: 1,
      cantidad: 1,
      ventaProductoID: 1,
    });
    setSelectedProduct(null);
  };

  return (
    <motion.div {...DesvanecerHaciaArriba} className="w-full">
      <Tabs defaultValue="regist" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="regist" className="w-full">
            Registrar Garantía
          </TabsTrigger>
          <TabsTrigger value="warranties" className="w-full">
            Registros
          </TabsTrigger>
        </TabsList>

        <TabsContent value="regist" className="w-full">
          <CardGarantiaCreate
            optionsVenta={optionsVenta}
            ventaSelected={ventaSelected}
            setVentaSelected={setVentaSelected}
            selecProviderID={selecProviderID}
            setSelecProviderID={setSelecProviderID}
            productoSelected={productoSelected}
            setProductoSelected={setProductoSelected}
            ventas={ventas}
            handleChangeSelectVenta={handleChangeSelectVenta}
            providerOptionSelect={providerOptionSelect}
            handleChangeProvider={handleChangeProvider}
            productSelected={productSelected}
            setProductSelected={setProductSelected}
            //open dialog selected productg
            openSelectedProduct={openSelectedProduct}
            setOpenSelectedProduct={setOpenSelectedProduct}
            //nuevos
            selectedProduct={selectedProduct}
            setSelectedProduct={setSelectedProduct}
            openProductDialog={openProductDialog}
            setOpenProductDialog={setOpenProductDialog}
            //FORMDATA
            setFormData={setFormData}
            formData={formData}
            //proveedores
            providers={providers}
            handleSubmitRegistGarantia={handleSubmitRegistGarantia}
            //truncador de boton
            isSubmittingGarantia={isSubmittingGarantia}
            setIsSubmittingGarantia={setIsSubmittingGarantia}
          />
        </TabsContent>
        <TabsContent value="warranties" className="w-full">
          <WarrantyList garantias={garantias} />
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
