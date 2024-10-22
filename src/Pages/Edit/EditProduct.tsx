import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import axios from "axios";
import { useParams } from "react-router-dom";
import SelectM from "react-select"; // Importar react-select
const API_URL = import.meta.env.VITE_API_URL;

type Category = {
  id: number;
  nombre: string;
};

type Product = {
  id: number;
  nombre: string;
  descripcion: string;
  precioVenta: number;
  codigoProducto: string;
  creadoEn: string;
  actualizadoEn: string;
  categorias: Category[]; // Categorías como un array de objetos
};

export default function ProductEditForm() {
  const { id } = useParams();
  const [formData, setFormData] = useState<Product | null>(null);

  // Actualizar los campos del formulario
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => (prev ? { ...prev, [name]: value } : prev));
  };

  // Manejar el cambio de precio
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setFormData((prev) =>
      prev ? { ...prev, precioVenta: isNaN(value) ? 0 : value } : prev
    );
  };

  // Enviar el formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.patch(
        `${API_URL}/products/actualizar/producto/${id}`,
        {
          ...formData, // Aquí estás incluyendo todos los campos del formData
          categorias: formData?.categorias.map((cat) => cat.id), // Mapeo de categorías a solo sus IDs
        }
      );
      if (response.status === 200) {
        toast.success("Producto actualizado exitosamente.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error al actualizar el producto.");
    }
  };

  // Obtener el producto existente para editar
  const getProducto = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/products/product/get-one-product/${id}`
      );
      if (response.status === 200) {
        setFormData(response.data);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error al cargar el producto.");
    }
  };

  // Cargar el producto cuando se monta el componente
  useEffect(() => {
    getProducto();
  }, []);

  const [categories, setCategories] = useState<Category[]>([]);
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

  return formData ? (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 max-w-2xl mx-auto p-6 bg-card rounded-lg shadow"
    >
      <h2 className="text-center font-bold text-xl">Edición de Producto</h2>
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
        <Label htmlFor="precioVenta">Precio de Venta</Label>
        <Input
          id="precioVenta"
          name="precioVenta"
          type="number"
          value={formData.precioVenta}
          onChange={handlePriceChange}
          step="0.01"
          min="0"
          required
        />
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
            label: categories.find((c) => c.id === cat.id)?.nombre || "",
          }))} // Mapeamos las categorías seleccionadas
        />
      </div>

      <Button type="submit" className="w-full">
        Actualizar Producto
      </Button>
    </form>
  ) : (
    <p>Cargando producto...</p>
  );
}
