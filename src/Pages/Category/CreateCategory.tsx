import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { Pencil, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
const API_URL = import.meta.env.VITE_API_URL;

interface Category {
  id: number;
  nombre: string;
}

function CreateCategory() {
  const [nombre, setNombre] = useState<string>("");
  const [categories, setCategories] = useState<Category[]>([]);

  const submitCat = async () => {
    try {
      const response = await axios.post(`${API_URL}/categoria`, {
        nombre,
      });
      if (response.status === 201) {
        toast.success("Categoria creada");
        setNombre("");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error al crear categoria");
    }
  };

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

  const [editCategory, setEditCategory] = useState({
    id: 0,
    nombre: "",
  });

  const handleDeleteCategory = async () => {
    try {
      const response = await axios.delete(
        `${API_URL}/categoria/${editCategory.id}`
      );
      if (response.status === 200 || response.status === 201) {
        toast.success("Categoria eliminada");
        getCategorias();
      }
    } catch (error) {
      console.log(error);
      toast.error("Error al eliminar la categoria");
    }
  };

  const updateCategory = async () => {
    try {
      const response = await axios.patch(
        `${API_URL}/categoria/edit-category/${editCategory.id}`,
        editCategory
      );
      if (response.status === 200 || response.status === 201) {
        toast.success("Categoria actualizada");
        getCategorias();
      }
    } catch (error) {
      console.log(error);
      toast.error("Error al eliminar la categoria");
    }
  };

  console.log("El producto a editar es: ", editCategory);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <Card className="w-full max-w-md mx-auto shadow-xl rounded-md mb-6">
        <CardHeader className="mb-4">
          <CardTitle className="text-2xl font-bold text-center">
            Añadir nueva categoría
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Nombre de la categoría"
              className="w-full border rounded-md px-3 py-2"
            />
            <Button
              onClick={submitCat}
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200"
            >
              Crear
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="w-full max-w-md mx-auto shadow-xl rounded-md">
        <CardHeader>
          <CardTitle className="text-xl font-bold">
            Lista de Categorías
          </CardTitle>
        </CardHeader>
        <CardContent>
          {categories.length === 0 ? (
            <p className="text-center text-gray-500">No hay categorías aún.</p>
          ) : (
            <ul className="space-y-2">
              {categories.map((category) => (
                <li
                  key={category.id}
                  className="flex items-center justify-between p-2  rounded"
                >
                  <span>{category.nombre}</span>
                  <div>
                    <Dialog>
                      <DialogTrigger>
                        <Button
                          onClick={() => {
                            // startEdit(category);
                            setEditCategory(category);
                          }}
                          className="mr-2 p-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                        >
                          <Pencil size={16} />
                        </Button>
                      </DialogTrigger>

                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle className="text-center">
                            Edición de Categoria
                          </DialogTitle>
                        </DialogHeader>
                        <DialogDescription className="text-center">
                          Esto afectará todos los productos donde fue
                          referenciado
                        </DialogDescription>
                        <Input
                          value={editCategory.nombre}
                          onChange={(e) =>
                            setEditCategory({
                              ...editCategory,
                              nombre: e.target.value,
                            })
                          }
                        />
                        <Button onClick={updateCategory}>
                          Continuar y actualizar
                        </Button>
                      </DialogContent>
                    </Dialog>
                    <Dialog>
                      <DialogTrigger>
                        <Button
                          onClick={() => {
                            // startEdit(category);
                            setEditCategory(category);
                          }}
                          className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle className="text-center">
                            Eliminación de categoria
                          </DialogTitle>
                        </DialogHeader>
                        <DialogDescription className="text-center">
                          Al eliminar esta categoría, desaparecerá de todas las
                          referencias a productos donde fue referenciada
                        </DialogDescription>
                        <DialogDescription className="text-center">
                          ¿Continuar?
                        </DialogDescription>
                        <Button
                          onClick={handleDeleteCategory}
                          variant={"destructive"}
                        >
                          Si, continuar y eliminar
                        </Button>
                      </DialogContent>
                    </Dialog>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default CreateCategory;
