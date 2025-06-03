import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import axios from "axios";
import { useParams } from "react-router-dom";
import SelectM from "react-select"; // Importar react-select
// import { useStore } from "@/components/Context/ContextSucursal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Trash2, Upload, AlertCircle } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ConfirmDialog } from "../Utils/ConfirmDialog";
import { ImageCropperUploader } from "../Cropper";

const API_URL = import.meta.env.VITE_API_URL;

type Category = {
  id: number;
  nombre: string;
};

type Precios = {
  id: number;
  precio: number;
};
type stockThreshold = {
  id: number;
  stockMinimo: number;
};

type ImagenesProducto = {
  id: number;
  url: string;
  public_id: string;
};

type Product = {
  id: number;
  nombre: string;
  descripcion: string;
  precioVenta: number;
  codigoProducto: string;
  codigoProveedor: string;
  creadoEn: string;
  actualizadoEn: string;
  categorias: Category[]; // Categorías como un array de objetos
  precios: Precios[];
  precioCostoActual: number;
  stockThreshold: stockThreshold;
  imagenesProducto: ImagenesProducto[];
  stockMinimo: number | null;
};

type CroppedImage = {
  fileName: string;
  blob: Blob;
  url: string;
  originalIndex: number;
};

export default function ProductEditForm() {
  const { id } = useParams();
  const [formData, setFormData] = useState<Product | null>(null);
  // const usuarioId = useStore((state) => state.userId);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [publicId, setPublicId] = useState<string | null>(null);
  const [imageId, setImageId] = useState<number | null>(null);
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [croppedImages, setCroppedImages] = useState<CroppedImage[]>([]);
  // Actualizar los campos del formulario
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => (prev ? { ...prev, [name]: value } : prev));
  };

  const handlePriceChange =
    (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseFloat(e.target.value);
      setFormData((prev) => {
        if (!prev) return prev;
        const updatedPrices = [...prev.precios];
        if (updatedPrices[index]) {
          updatedPrices[index].precio = isNaN(value) ? 0 : value;
        } else {
          updatedPrices[index] = { id: 0, precio: isNaN(value) ? 0 : value };
        }
        return { ...prev, precios: updatedPrices };
      });
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData || !formData.nombre.trim()) {
      return toast.info("Nombre y al menos una categoría son obligatorios");
    }

    const fd = new FormData();
    fd.append("nombre", formData.nombre);
    fd.append("descripcion", formData.descripcion || "");
    fd.append("codigoProducto", formData.codigoProducto);
    fd.append("codigoProveedor", formData.codigoProveedor || "");
    fd.append("stockMinimo", formData.stockThreshold.stockMinimo.toString());
    fd.append("precioCostoActual", formData.precioCostoActual.toString());

    // 1) Categorías como JSON
    const catIds = formData.categorias.map((c) => c.id);
    fd.append("categorias", JSON.stringify(catIds));

    // 2) Precios (id + precio) como JSON
    fd.append("precios", JSON.stringify(formData.precios));

    // 4) Imágenes nuevas (File) bajo key "images"
    croppedImages.forEach((img) => {
      const file = new File([img.blob], img.fileName, { type: img.blob.type });
      fd.append("images", file);
    });

    try {
      const res = await axios.patch(
        `${API_URL}/products/actualizar/producto/${formData.id}`,
        fd,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      if (res.status === 200) {
        toast.success("Producto actualizado exitosamente");
        getProducto();
      }
    } catch (err) {
      console.error(err);
      toast.error("Error al actualizar el producto.");
    }
  };

  const getProducto = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/products/product/get-one-product/${id}`
      );
      if (response.status === 200) {
        console.log("data: ", response.data);

        setFormData(response.data);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error al cargar el producto.");
    }
  };

  useEffect(() => {
    getProducto();
  }, []);

  const getCategorias = async () => {
    try {
      const response = await axios.get(`${API_URL}/categoria`);
      if (response.status === 200) {
        setCategories(response.data);
      }
    } catch (error) {}
  };
  useEffect(() => {
    getCategorias();
  }, []);

  const handleStockMinimoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nuevoValor = parseInt(e.target.value, 10) || 0;
    setFormData((prev) => {
      if (!prev) return prev; // si aún no hay datos, no hagas nada
      return {
        ...prev,
        stockThreshold: {
          ...prev.stockThreshold,
          stockMinimo: nuevoValor, // aquí ya es number
        },
      };
    });
  };

  const handleDeleteImage = async () => {
    if (!publicId) return;

    const encodedPublicId = encodeURIComponent(publicId); // <-- Muy importante

    setIsSubmitting(true);
    try {
      const response = await axios.delete(
        `${API_URL}/products/delete-image-from-product/${encodedPublicId}/${imageId}`
      );
      if (response.status === 200) {
        toast.success("Imagen eliminada correctamente.");
        setIsSubmitting(false);
        getProducto();
        setOpenConfirmDelete(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error al eliminar la imagen.");
      setIsSubmitting(false);
    }
  };

  return formData ? (
    <div className="max-w-4xl mx-auto p-6">
      <Tabs defaultValue="account" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8 h-12">
          <TabsTrigger value="account" className="text-base font-medium">
            Producto
          </TabsTrigger>
          <TabsTrigger value="password" className="text-base font-medium">
            Imágenes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="account" className="mt-0">
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="text-center text-2xl">
                Edición de Producto
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="nombre">Nombre del Producto</Label>
                  <Input
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="descripcion">Descripción</Label>
                  <Textarea
                    id="descripcion"
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleInputChange}
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="precioCostoActual">Precio Costo</Label>
                  <Input
                    type="number"
                    id="precioCostoActual"
                    name="precioCostoActual"
                    value={formData.precioCostoActual}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <Label className="block text-center mb-4 text-lg font-semibold">
                    Precios
                  </Label>
                  <div className="space-y-3">
                    {[0, 1, 2].map((index) => {
                      const precio = formData.precios[index] || { precio: "" };
                      return (
                        <div
                          key={index}
                          className="flex items-center space-x-4"
                        >
                          <Label className="w-1/4 text-right font-semibold">
                            Precio #{index + 1}:
                          </Label>
                          <Input
                            type="number"
                            value={precio.precio || ""}
                            onChange={handlePriceChange(index)}
                            step="0.01"
                            min="0"
                            className="w-3/4"
                            placeholder="0.00"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <Label htmlFor="codigoProducto">Código del Producto</Label>
                  <Input
                    id="codigoProducto"
                    name="codigoProducto"
                    value={formData.codigoProducto}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="codigoProveedor">Código del Proveedor</Label>
                  <Input
                    id="codigoProveedor"
                    name="codigoProveedor"
                    value={formData.codigoProveedor}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="stockThreshold">Stock mínimo</Label>
                  <Input
                    id="stockThreshold"
                    name="stockMinimo"
                    type="number"
                    value={formData?.stockThreshold?.stockMinimo ?? 0}
                    onChange={handleStockMinimoChange}
                    required
                  />
                </div>

                <div>
                  <Label>Categorías</Label>
                  <SelectM
                    placeholder="Seleccionar..."
                    isMulti
                    name="categorias"
                    options={categories.map((categoria) => ({
                      value: categoria.id,
                      label: categoria.nombre,
                    }))} // Mostramos todas las categorías disponibles
                    className="basic-multi-select text-black"
                    classNamePrefix="select"
                    onChange={(selectedOptions) => {
                      // Manejamos la selección de categorías actualizando el formData
                      setFormData((prev) => {
                        if (!prev) return prev; // Si prev es null, no hacer nada
                        return {
                          ...prev,
                          categorias: selectedOptions.map((option) => ({
                            id: option.value,
                            nombre: option.label,
                          })),
                        };
                      });
                    }}
                    value={formData.categorias.map((cat) => ({
                      value: cat.id,
                      label:
                        categories.find((c) => c.id === cat.id)?.nombre || "",
                    }))} // Mapeamos las categorías seleccionadas
                  />
                </div>

                <Button type="submit" className="w-full h-12 text-lg">
                  Actualizar Producto
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="password" className="mt-0">
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl">Imágenes del Producto</CardTitle>
              <CardDescription className="text-base">
                Aquí puedes gestionar las imágenes del producto.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                {formData.imagenesProducto.length > 0 ? (
                  formData.imagenesProducto.map((img) => (
                    <Card
                      key={img.id}
                      className="overflow-hidden group hover:shadow-lg transition-shadow"
                    >
                      <div className="relative">
                        <img
                          src={img.url || "/placeholder.svg"}
                          alt={`Imagen del producto ${formData.nombre}`}
                          className="w-full h-48 object-cover"
                        />
                        <Button
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => {
                            setPublicId(img.public_id);
                            setImageId(img.id);
                            setOpenConfirmDelete(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <CardContent className="p-3">
                        <Badge variant="secondary" className="mt-1 text-xs">
                          ID: {img.id}
                        </Badge>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-lg text-muted-foreground">
                      No hay imágenes disponibles para este producto.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Dialog
                open={isImageDialogOpen}
                onOpenChange={setIsImageDialogOpen}
              >
                <DialogTrigger className="text-blue-500 hover:underline">
                  Gestionar Imágenes
                </DialogTrigger>
                <DialogContent className="max-w-5xl max-h-[95vh] overflow-hidden">
                  <DialogHeader>
                    <DialogTitle className="text-center">
                      Cargar más imagenes del producto
                    </DialogTitle>
                  </DialogHeader>
                  <div className="overflow-y-auto max-h-[calc(90vh-120px)] pr-2">
                    <ImageCropperUploader
                      croppedImages={croppedImages}
                      setCroppedImages={setCroppedImages}
                    />
                  </div>
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      <ConfirmDialog
        open={openConfirmDelete}
        onOpenChange={setOpenConfirmDelete}
        title="¿Eliminar imagen?"
        description="La imagen será eliminada permanentemente del producto y de la base de datos."
        onConfirm={handleDeleteImage}
        isLoading={isSubmitting}
        confirmLabel="Eliminar imagen"
        cancelLabel="Cancelar"
        icon={<AlertCircle className="h-8 w-8 text-amber-600" />}
      />
    </div>
  ) : (
    <div className="flex items-center justify-center min-h-[400px]">
      <p className="text-lg">Cargando producto...</p>
    </div>
  );
}
