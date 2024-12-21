import { Button } from "@/components/ui/button";
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import axios from "axios";
import { Folder, Pencil, PlusCircle, Trash2 } from "lucide-react";
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
    if (!nombre || nombre.trim().length <= 0) {
      toast.info("Una categoría no puede estar vacía");
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/categoria`, {
        nombre,
      });

      if (response.status === 201) {
        toast.success("Categoría creada");
        setNombre("");
        getCategorias();
      }
    } catch (error) {
      console.log(error);
      toast.error("Error al crear categoría");
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
      if (!editCategory.nombre) {
        toast.info("El nombre no debe estár vacío");
        return;
      }

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
    <div className="min-h-screen bg-gray-100 dark:bg-transparent flex flex-col items-center justify-center p-6">
      <Card className="w-full max-w-5xl mx-auto shadow-xl rounded-lg overflow-hidden">
        <CardHeader className="bg-primary text-primary-foreground p-6">
          <CardTitle className="text-2xl font-bold text-center">
            Gestión de Categorías
          </CardTitle>
          <CardDescription className="text-center text-primary-foreground/80">
            Añade, edita o elimina categorías de productos
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <Input
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Nombre de la nueva categoría"
                className="flex-grow"
              />
              <Button onClick={submitCat} className="flex items-center">
                <PlusCircle className="mr-2 h-4 w-4" />
                Crear
              </Button>
            </div>

            <div className="bg-white dark:bg-transparent rounded-lg shadow">
              <CardHeader>
                <CardTitle className="text-xl font-bold flex items-center">
                  <Folder className="mr-2 h-5 w-5" />
                  Lista de Categorías
                </CardTitle>
              </CardHeader>
              <CardContent>
                {categories.length === 0 ? (
                  <p className="text-center text-gray-500 py-4">
                    No hay categorías aún.
                  </p>
                ) : (
                  <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                    <ul className="space-y-2">
                      {categories.map((category) => (
                        <li
                          key={category.id}
                          className="flex items-center justify-between p-2 bg-gray-50 dark:bg-transparent border-2 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <span className="font-medium">{category.nombre}</span>
                          <div className="flex space-x-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  onClick={() => setEditCategory(category)}
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8"
                                  aria-label={`Editar categoría ${category.nombre}`}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle className="text-center">
                                    Editar Categoría
                                  </DialogTitle>
                                  <DialogDescription className="text-center">
                                    Esto afectará todos los productos donde fue
                                    referenciado
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                  <Input
                                    value={editCategory.nombre}
                                    onChange={(e) =>
                                      setEditCategory({
                                        ...editCategory,
                                        nombre: e.target.value,
                                      })
                                    }
                                    placeholder="Nuevo nombre de la categoría"
                                  />
                                  <Button
                                    onClick={updateCategory}
                                    className="w-full"
                                  >
                                    Actualizar Categoría
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  onClick={() => setEditCategory(category)}
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8"
                                  aria-label={`Eliminar categoría ${category.nombre}`}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle className="text-center">
                                    Eliminar Categoría
                                  </DialogTitle>
                                  <DialogDescription className="text-center">
                                    Al eliminar esta categoría, desaparecerá de
                                    todas las referencias a productos donde fue
                                    referenciada.
                                  </DialogDescription>
                                  <DialogDescription className="text-center">
                                    ¿Estás seguro?
                                  </DialogDescription>{" "}
                                </DialogHeader>
                                <div className="flex space-x-2 py-4">
                                  <Button
                                    className="w-full"
                                    variant="outline"
                                    onClick={() => {}}
                                  >
                                    Cancelar
                                  </Button>
                                  <Button
                                    className="w-full"
                                    onClick={handleDeleteCategory}
                                    variant="destructive"
                                  >
                                    Sí, eliminar
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </ScrollArea>
                )}
              </CardContent>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default CreateCategory;
