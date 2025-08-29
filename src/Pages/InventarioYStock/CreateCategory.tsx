// CreateCategory.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Folder, Pencil, PlusCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Category } from "./interfaces.interface";
import { Label } from "@/components/ui/label";

interface CreateCategoryProps {
  categories: Category[];
  onCreateCategory: (nombre: string) => Promise<void>;
  onUpdateCategory: (
    nombreCategory: string,
    categoryID: number
  ) => Promise<void>;
  onDeleteCategory: (id: number) => Promise<void>;
  loadInventoryData: () => Promise<void>;
  setOpenCategory: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function CreateCategory({
  categories,
  onCreateCategory,
  onUpdateCategory,
  onDeleteCategory,
  loadInventoryData,
}: CreateCategoryProps) {
  const [nombre, setNombre] = useState("");
  const [editCategory, setEditCategory] = useState<Category | null>(null);

  const handleCreate = async () => {
    if (!nombre.trim()) {
      toast.info("Una categoría no puede estar vacía");
      return;
    }
    await onCreateCategory(nombre);
    setNombre("");
    await loadInventoryData();
  };

  const handleUpdate = async () => {
    if (!editCategory?.nombre.trim()) {
      toast.info("El nombre no debe estar vacío");
      return;
    }
    await onUpdateCategory(editCategory.nombre, editCategory.id);
    setEditCategory(null);
    await loadInventoryData();
  };

  const handleDelete = async () => {
    if (!editCategory) return;
    await onDeleteCategory(editCategory.id);
    setEditCategory(null);
    await loadInventoryData();
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl">
      <CardHeader className="bg-primary text-primary-foreground p-6">
        <CardTitle className="text-2xl text-center">
          Gestión de Categorías
        </CardTitle>
        <CardDescription className="text-center">
          Añade, edita o elimina categorías de productos
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Crear nueva */}
        <div className="flex gap-2">
          <Input
            placeholder="Nombre de la nueva categoría"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
          <Button onClick={handleCreate}>
            <PlusCircle className="mr-2 h-4 w-4" /> Crear
          </Button>
        </div>

        {/* Lista */}
        <div className="rounded-lg border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2  text-base">
              <Folder /> Lista de Categorías
            </CardTitle>
          </CardHeader>
          <CardContent>
            {categories.length === 0 ? (
              <p className="text-center text-gray-500">
                No hay categorías aún.
              </p>
            ) : (
              <ScrollArea className="h-[300px]">
                <ul className="space-y-2">
                  {categories.map((cat) => (
                    <li
                      key={cat.id}
                      className="flex justify-between items-center p-2 border-2 rounded"
                    >
                      <span>{cat.nombre}</span>
                      <div className="flex gap-2">
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => setEditCategory(cat)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="destructive"
                          onClick={() => setEditCategory(cat)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            )}
          </CardContent>
        </div>

        {/* Dialog de editar / confirmar */}
        <Dialog
          open={!!editCategory}
          onOpenChange={() => setEditCategory(null)}
        >
          <DialogContent className="w-full max-w-md space-y-4">
            {/* Encabezado del diálogo */}
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold text-center">
                Editar Categoría
              </DialogTitle>
              <DialogDescription className="text-center text-sm text-muted-foreground">
                Cambia el nombre o elimina esta categoría.
              </DialogDescription>
            </DialogHeader>

            {/* Campo de edición */}
            {editCategory && (
              <div className="space-y-2">
                <Label htmlFor="edit-cat-name">Nombre</Label>
                <Input
                  id="edit-cat-name"
                  value={editCategory.nombre}
                  onChange={(e) =>
                    setEditCategory({ ...editCategory, nombre: e.target.value })
                  }
                  placeholder="Nuevo nombre de la categoría"
                />
              </div>
            )}

            {/* Pie de diálogo */}
            <DialogFooter className="flex flex-col gap-2 pt-4">
              <Button onClick={handleUpdate} className="w-full">
                Guardar Cambios
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                className="w-full"
              >
                Eliminar Categoría
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
